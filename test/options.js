var proxyquire      = require('proxyquire')
var test            = require('tape')
var sinon           = require('sinon')
var exec            = sinon.stub().callsArgWith(2, null, '', '')
var writeFile       = sinon.stub().callsArgWith(2, null)
var mkdirp          = sinon.stub().callsArgWith(1, null)
var child_process   = { exec }
var fs              = { writeFile }
var register        = proxyquire('..', { child_process, fs, mkdirp })

test('missing devices option throws error', (t) => {
    t.plan(1)
    exec.reset()
    writeFile.reset()
    mkdirp.reset()

    t.throws(() => {
        register({})
    }, 'missing devices option throws error')
})

test('accepts callback', (t) => {
    t.plan(1)
    exec.reset()
    writeFile.reset()
    mkdirp.reset()

    register({devices: {}}, () => {
        t.pass('function called')
    })
})

test('accepts no callback', (t) => {
    t.plan(1)
    exec.reset()
    writeFile.reset()
    mkdirp.reset()

    t.doesNotThrow(() => {
        register({devices: {}})
    })
})

test('accepts a runtime option of timeout', (t) => {
    t.plan(1)
    exec.reset()
    writeFile.reset()
    mkdirp.reset()

    register({ devices: {}, timeout: 1 }, () => {
        t.ok(exec.calledWithMatch('fastlane register', { timeout: 1 }), 'called with timeout runtime option')
    })
})

test('accepts a runtime option of password', (t) => {
    t.plan(1)
    exec.reset()
    writeFile.reset()
    mkdirp.reset()

    register({ devices: {}, password: 'password' }, () => {
        t.ok(exec.calledWithMatch('fastlane register', { env: { FASTLANE_PASSWORD: 'password' } }), 'called with password runtime option')
    })
})

test('creates a Fastfile and calls fastlane register', (t) => {
    t.plan(7)
    exec.reset()
    writeFile.reset()
    mkdirp.reset()

    register({
        devices: {
            'test1': '123456789',
            'test2': '987654321'
        },
        user  : 'gege',
        teamId: 'teamA'
    }, (_, stdout, stderr) => {
        var writeFileArgs = writeFile.getCall(0).args
        var fastfilePath = writeFileArgs[0]
        var fastfileContent = writeFileArgs[1]

        t.ok(fastfilePath.match(/\/fastlane\/Fastfile$/.match), 'writes to Fastfile')
        t.ok(fastfileContent.match(/lane :register/), 'register lane exists')
        t.ok(fastfileContent.match(/"test1" => "123456789"/), 'device1 included')
        t.ok(fastfileContent.match(/"test2" => "987654321"/), 'device2 included')
        t.ok(fastfileContent.match(/username: "gege"/), 'username included')
        t.ok(fastfileContent.match(/team_id: "teamA"/), 'team included')
        t.ok(exec.calledWith('fastlane register'), 'fastlane register executed')
    })
})

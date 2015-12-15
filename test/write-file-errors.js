var proxyquire      = require('proxyquire')
var test            = require('tape')
var sinon           = require('sinon')
var error           = new Error('boom')
var mkdirp          = sinon.stub().callsArgWith(1, null)
var writeFile       = sinon.stub().callsArgWith(2, error)
var fs              = { writeFile }
var exec            = sinon.stub().callsArgWith(2, null, '', '')
var child_process   = { exec }
var register        = proxyquire('..', { child_process, fs, mkdirp })

test('register callback receives write file errors', (t) => {
    t.plan(1)
    exec.reset()
    writeFile.reset()
    mkdirp.reset()
    register({ devices: {} }, (err) => {
        t.equal(err, error, 'got error')
    })
})

var exec    = require('child_process').exec
var path    = require('path')
var os      = require('os')
var uuid    = require('uuid').v4
var remove  = require('remove')
var fs      = require('fs')
var mkdirp  = require('mkdirp')

module.exports = registerDevices

function registerDevices (options, cb) {
    if (!options || typeof options === 'function' || !options.devices) throw new Error('device object hash required')
    cb = cb || function () {}

    var devices = Object.keys(options.devices).map((key) => {
        return `"${key}" => "${options.devices[key]}"`
    }).join(',\n')

    var registerDevicesOptions = []
    registerDevicesOptions.push(`devices:{ ${devices} }`)
    if (options.user) registerDevicesOptions.push(`username: "${options.user}"`)
    if (options.teamId) registerDevicesOptions.push(`team_id: "${options.teamId}"`)
    registerDevicesOptions = registerDevicesOptions.join(',\n')

    var fastfile = `
    lane :register do
     register_devices(
     ${registerDevicesOptions}
    )
    end
    `
    var runtimeOptions = { env: Object.assign({}, process.env) }
    options.timeout = options.timeout !== undefined ? options.timeout : 0
    if (options.timeout) runtimeOptions.timeout = options.timeout
    if (options.password) runtimeOptions.env.FASTLANE_PASSWORD = options.password
    runtimeOptions.cwd = workingDirectory

    var workingDirectory = path.join(os.tmpdir(), 'register-devices-' + uuid())
    mkdirp(workingDirectory + '/fastlane', (err) => {
        if (err) return cb(err)
        fs.writeFile(workingDirectory + '/fastlane/Fastfile', fastfile, (err) => {
            if (err) return cb(err)
            exec('fastlane register', runtimeOptions, (err, stdout, stderr) => {
                cb(err, { stdout, stderr })
                if (err) return
                remove(workingDirectory, function () {})
            })
        })
    })
}

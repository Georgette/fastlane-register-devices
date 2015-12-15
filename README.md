# fastlane-register-devices

[![NPM version](https://badge.fury.io/js/fastlane-register-devices.png)](http://badge.fury.io/js/fastlane-register-devices)
[![Build Status](https://travis-ci.org/Georgette/fastlane-register-devices.svg?branch=master)](https://travis-ci.org/Georgette/fastlane-register-devices)
[![Coverage Status](https://coveralls.io/repos/Georgette/fastlane-register-devices/badge.png?branch=master)](https://coveralls.io/r/Georgette/fastlane-register-devices?branch=master)

Node Wrapper for [Ruby Fastlane Register Devices](https://github.com/fastlane/fastlane/blob/master/docs/Actions.md#register_devices) Action

Per the Fastlane Docs:

>This will register iOS devices with the Developer Portal so that you can include them in your provisioning profiles.

>This is an optimistic action, in that it will only ever add new devices to the member center, and never remove devices. If a device which has already been registered within the member center is not passed to this action, it will be left alone in the member center and continue to work.

>The action will connect to the Apple Developer Portal using the username you specified in your Appfile with apple_id, but you can override it using the username option, or by setting the env variable ENV['DELIVER_USER'].

## example
```javascript
register({            
        devices:{
            myDevice:"UDIDIDIDIDDID", myOtherDevice:"UDiiiidDDIIId"
        },
        user:"gege",
        teamId:"winning"
}, function(){
    //do something
})
```
Note: This module creates a temporary fastfile in the tmp directory prior to calling fastlane register_devices. The fastfile is deleted upon execution


## api

# registerDevices(options,[cb])

Accepts options as object, **with the devices hash being a required option**. Optional Callback function.

Register Option | Example | Description
----------------|---------|------------
Devices(object hash)| devices: { myDevice:"UDIDIDIDIDDID",  myOtherDevice:"UDiiiidDDIIId" } | List of UDIDs of devices to be registered. Keys are read as device name.
user(string) | user: "gege" | username for the appstore account
teamId(string) | teamId: "winning" | teamId for when user is part of multiple teams

|Runtime Options |Example|Description|
|----------------|-------|-----------|
|timeout (number)| { timeout:0 } | specify when to exit execution in case of error |
|password (string)| {password:''} | app store password |

## install

With [npm](https://npmjs.org) do:

```
npm install --save fastlane-register-devices
```

## testing

`npm test`

### coverage

`npm run view-cover`

This will output a textual coverage report.

`npm run open-cover`

This will open an HTML coverage report in the default browser.

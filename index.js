#! /usr/bin/env node

var watch = require('watch')
var applescript = require('applescript')
var path = require('path')

var script = function (keyword) {
    return ['tell application "Google Chrome"',
            'set windowList to every window',
            'repeat with aWindow in windowList',
            'set tabList to every tab of aWindow',
            'repeat with atab in tabList',
            'if (URL of atab contains "' + keyword + '") then',
            'tell atab to reload',
            'end if',
            'end repeat',
            'end repeat',
            'end tell'
           ].join('\n')
}

var watch_folder = process.argv[2] || './'
var root_path = path.resolve(watch_folder)
var global_keyword = process.argv[3]
var root_keyword = 'file://' + root_path + '/'

var filter = function (file_name) { return ( file_name.match('.md') ? true : false ) }


watch.createMonitor(watch_folder, function (monitor) {
//    monitor.files['./.zshrc'] // Stat object for my zshrc.
    monitor.on('changed', function (f, curr, prev) {
        var keyword = global_keyword || root_keyword + f
        applescript.execString(script(keyword), function (err, response) {
            if (err) {throw err}
            console.log('Detected change in ' + watch_folder + ', refreshing Chrome at ' + keyword)
        })
    })
})

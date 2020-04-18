const svgFixer = require('..')
const fs = require('fs-extra')
const path = require('path')

var dest = `${__dirname}/dest`
var source = `${__dirname}/icons`

fs.emptyDirSync(dest)

run()

async function run() {
    try {
        var folders = fs.readdirSync(source)
        for(folder in folders) {
            var iconPath = `${source}/${folders[folder]}`
            var destPath = `${dest}/${folders[folder]}`
            // console.log('iconPath', iconPath)
            await svgFixer(iconPath, destPath)
        }
        console.log('done')
    } catch(err) {
        console.log('error:', err)
    }
}

console.log('debug complete')

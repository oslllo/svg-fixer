const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const potrace = require('potrace')
const jsdom = require('jsdom')
const fg = require('fast-glob')

const { JSDOM } = jsdom
const appDir = path.resolve(`${__dirname}/../`)
const tempDir = `${appDir}/temp`

/**
 * 
 * @param {string} source - Directory containing svg icons to fix
 * @param {string} dest - Destination directory to store fixed icons
 * @returns {Promise}
 */
function svgFixer(source, dest) {
    return new Promise(async (resolve, reject) => {
        await init([ source, dest ])
        const entries = await fg(path.join(source, '/*.svg'))
        for(var i = 0; i < entries.length; i++) {
            entry = entries[i]
            var fixed = await fix(entry)
            fs.writeFileSync(`${dest}/${path.basename(entry)}`, fixed)
        }
        resolve()
    })
}

async function init(folders) {
    return new Promise((resolve, reject) => {
        folders.push(tempDir)
        for(var i = 0; i < folders.length; i++) {
            if(! fs.existsSync(folders[i])) {
                fs.mkdirSync(folders[i])
            }
        }
        resolve()
    })
}

async function fix(svg) {
    var svgData = fs.readFileSync(svg)
    var dom = new JSDOM(svgData)
    var node = dom.window.document.getElementsByTagName('svg')[0]
    var original = {}
    var attributes = ['width', 'height']

    attributes.forEach(attribute => {
        original[attribute] = node.getAttribute(attribute)
        node.setAttribute(attribute, 500)
    })

    var raw = node.outerHTML
    var buffer = Buffer.from(raw)
    var bufferPath = `${appDir}/temp/buffer.png`

    await sharp(buffer).toFile(bufferPath)

    var traced = await tracer('trace', bufferPath, { optCurve: true })

    if(traced.err) {
        console.log('err:', traced.err)
    }

    dom = new JSDOM(traced.svg)
    node = dom.window.document.getElementsByTagName('svg')[0]

    attributes.forEach(attribute => {
        node.setAttribute(attribute, original[attribute])
    })

    raw = node.outerHTML

    return Buffer.from(raw)
}

// https://www.npmjs.com/package/potrace
function tracer(func, path, params = null) {
    return new Promise((resolve, reject) => {
        potrace[func](path, params, function (err, svg) {
            if (err) {
                reject({ err })
            } else {
                resolve({ svg })
            }
        })
    })
}

module.exports = svgFixer

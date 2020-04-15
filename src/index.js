const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const potrace = require('potrace')
const jsdom = require('jsdom')
const fg = require('fast-glob')

const { JSDOM } = jsdom
const appDir = path.resolve(`${__dirname}/../`)
const tempDir = `${appDir}/temp`

function SvgFixer(source, dest, options = {}) {
    return new Promise(async (resolve, reject) => {
        await init()
        const entries = await fg(source)
        console.log(entries)
        for(var i = 0; i < entries.length; i++) {
            entry = entries[i]
            var fixed = await fix(entry)
            fs.writeFileSync(`${dest}/${path.basename(entry)}`, fixed)
            console.log(i)
        }
        resolve()
    })
}

async function init() {
    return new Promise((resolve, reject) => {
        if(! fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir)
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

module.exports = SvgFixer

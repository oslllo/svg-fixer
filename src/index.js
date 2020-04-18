const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
// const _potrace = require('potrace')
// const { trace, Potrace } = _potrace
const { Potrace } = require('./potrace')
const jsdom = require('jsdom')
const fg = require('fast-glob')
const cliProgress = require('cli-progress')
var colors = require('colors')
const imageDataURI = require('image-data-uri')

const { JSDOM } = jsdom
const appDir = path.join(__dirname, '/../')
const tempDir = path.join(appDir, '/temp')

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
        const fixerBar = new cliProgress.SingleBar({
            format: `${colors.blue('Progress')} |` + colors.blue('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}'
        }, cliProgress.Presets.shades_classic)
        console.log('\n')
        console.log(colors.green('Fixing: '), source)
        fixerBar.start(entries.length, 0, {
            speed: "N/A"
        })
        for(var i = 0; i < entries.length; i++) {
            entry = entries[i]
            var fixed = await fix(entry)
            fs.writeFileSync(`${dest}/${path.basename(entry)}`, fixed)
            fixerBar.update(i)
        }
        fixerBar.update(entries.length)
        fixerBar.stop()
        console.log(colors.green('Success!'), '\n')
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

    await sharp(buffer).flatten( { background: '#fff' } ).toFile(bufferPath)

    var traced = await tracer('trace', bufferPath)

    if(traced.err) {
        console.log('err:', traced.err)
    }

    dom = new JSDOM(traced.svg)
    node = dom.window.document.getElementsByTagName('svg')[0]

    attributes.forEach(attribute => {
        node.setAttribute(attribute, original[attribute])
    })

    // raw = node.outerHTML
    raw = traced.svg

    return Buffer.from(raw)
}

// https://www.npmjs.com/package/potrace
function tracer(func, path) 
{
    return new Promise(async (resolve, reject) => {
        // var testDom = new JSDOM()
        // Potrace.setDocument(testDom.window.document)
        var res = await imageDataURI.encodeFromFile(path)
        // console.log(`RES: ${res}`)
        Potrace.loadImageFromUrl(res)
        Potrace.process(function () {
            var svg = Potrace.getSVG(1)
            resolve({ svg })
        })
    })
}

function base64(path) {
    return new Promise((resolve, reject) => {
        imageDataURI.encodeFromFile(path)
        .then((res) => {
            resolve(res)
        })
    })
}

// // https://www.npmjs.com/package/potrace
// function tracer(func, path, params = {
//     turnPolicy: Potrace.TURNPOLICY_MINORITY,
//     turdSize: 2,
//     alphaMax: 1,
//     optCurve: true,
//     optTolerance: 0.2,
//     threshold: 0,
//     blackOnWhite: true,
//     color: Potrace.COLOR_AUTO,
//     background: Potrace.COLOR_TRANSPARENT,
//     width: null,
//     height: null
//     }) 
// {
//     return new Promise((resolve, reject) => {
//         console.log('PARAMS:', params)
//         _potrace[func](path, params, function (err, svg) {
//             if (err) {
//                 reject({ err })
//             } else {
//                 resolve({ svg })
//             }
//         })
//     })
// }

module.exports = svgFixer

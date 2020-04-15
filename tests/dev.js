var SvgFixer = require('..')

// console.log(__dirname)

SvgFixer(`${__dirname}/icons/*.svg`, `${__dirname}/dest`)
.then(() => {
    console.log('Done')
})
.catch(() => {
    console.log('error')
})

console.log('Dev test')
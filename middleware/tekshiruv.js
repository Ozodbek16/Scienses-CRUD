module.exports = ((req, res, next) => {
    const tek = true
    if (tek) {
        console.log('')
        next()
    } else {
        res.send('Tekshiruv muvaffaqiyatsiz boldi')
    }
})
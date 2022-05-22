const express = require('express')
const res = require('express/lib/response')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const Joi = require('joi')
const tekshiruv = require('./middleware/tekshiruv')
const app = express()


app.use(express.json())
app.use(helmet())
app.use(tekshiruv())

// app.use('./middleware/tekshiruv.js')
if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
}


const scienses = [
    { name: 'Mathematics', time: '08:00', id: 1 },
    { name: 'Mother tongue', time: '09:00', id: 2 },
    { name: 'Literature', time: '10:00', id: 3 },
    { name: 'Chemistry', time: '11:00', id: 4 }
]

app.get('/api', tekshiruv, (req, res) => {
    res.send(scienses)
})

app.get('/api/search/:id', (req, res) => {
    let search = scienses.filter((sciense) => sciense.id == req.params.id)
    if (search) {
        res.send(search)
    } else {
        res.status(400).send('Bu parametrli kitob topilmadi.')
    }
})

app.get('/api/search', (req, res) => {
    const name = req.query.name
    let find = scienses.filter((sciense) => sciense.name.toLowerCase() == name.toLowerCase())
    res.send(find)
})

app.post('/api/create', (req, res) => {
    const newScienses = scienses
    const scheme = Joi.object({
        name: Joi.string().min(3).max(40).required(),
        time: Joi.string().min(4).max(6).required()
    })

    const result = scheme.validate(req.body)
    if (result.error) {
        res.send('Error').status(400)
        return
    }

    let newSciense = {
        name: req.body.name,
        time: req.body.time,
        id: newScienses.length + 1,
    }

    scienses.push(newSciense)

    res.status(201).send(scienses)
    res.end()
})

app.put('/api/edit/:id', (req, res) => {
    const all = scienses
    const idx = scienses.findIndex(book => book.id == +req.params.id)

    const scheme = Joi.object({
        name: Joi.string().required(),
        time: Joi.string().required()
    })

    const result = scheme.validate(req.body)

    if (result.error) {
        res.send(error).status(400)
        return
    }

    let update = {
        name: req.body.name,
        time: req.body.time,
        id: req.params.id,
    }

    all[idx] = update

    res.status(200).send(update)
})

app.delete('/api/delete/:id', (req, res) => {
    const idx = scienses.findIndex(book => book.id == +req.params.id)
    scienses.splice(idx, 1)
    res.status(200).send(scienses)
})



try {
    const port = process.env.port || 3000
    app.listen(port, () => {
        console.log('server working with port ' + port + '...')
    })
} catch (error) {
    console.log(error())
}
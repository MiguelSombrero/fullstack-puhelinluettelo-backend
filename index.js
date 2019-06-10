const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

morgan.token('data', function (req, res) {
    return JSON.stringify(req.body)
})

let persons = [
    {
      "name": "Lassi Hirvari",
      "number": "12121212-",
      "id": 1
    },
    {
      "name": "Riitta",
      "number": "232323",
      "id": 2
    },
    {
      "name": "Raimo Ilotalo",
      "number": "12-1212121212345",
      "id": 3
    },
    {
      "name": "Hiiva Tin Kari!",
      "number": "1212-878",
      "id": 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/api/info', (req, res) => {
    res.send(
        `Phonebook has info for ${persons.length} people` +
        `<p> ${new Date()} </>`
    )
})

app.post('/api/persons', (req, res) => {
    const person = req.body

    if (!person.name || !person.number) {
        return res.status(400).json ({
            error: 'give both name and number please'
        })
    }

    if (persons.filter(p => p.name === person.name).length > 0) {
        return res.status(400).json ({
            error: 'name must be unique'
        })
    }

    person.id = Math.floor( Math.random()*100000000 )
    persons = persons.concat(person)
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
const mongoose =require('mongoose')

const Course = require('../models/course.js')


mongoose.connect('mongodb://localhost:27017/Freecodecamp')
    .then(data => console.log('Database connected'))
    .catch(err => console.log('Database connection failed'))

    titles = [
        'Blockchain Development',
        'Artificial Intelligence',
        'Human-Computer Interaction (HCI)',
        'Machine Learning',
        'Deep Learning',
        'Distributed Systems',
        'Cryptography',
        'Quantum Computin',
        'Web Development',
        'AR/VR',
    ]

const seedDB = async () => {
    await Course.deleteMany({})

    titles.forEach(async (title) => {
        let course = new Course({
            title,
            duration: Math.floor(Math.random() * 30) + 1
        })
        await course.save()
    })

    console.log('Done seeding')
}

seedDB()
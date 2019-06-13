const express = require('express')
const session = require('express-session')
const massive = require('massive')
require('dotenv/config')

const treasureCtrl = require('./controllers/treasureController')
const authCtrl = require('./controllers/authController')
const auth = require('./middleware/authMiddleware')

const app = express()

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env


massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db is on')
    app.listen(SERVER_PORT, ()=> console.log('listening', SERVER_PORT))
})

app.use(express.json())
app.use(session({
    resave:true,
    saveUninitialize: false,
    secret: SESSION_SECRET
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)
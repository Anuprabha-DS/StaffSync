const express = require('express')
const userRoute = require('./src/routes/userRoute')
const cookieParser = require('cookie-parser');
const cors = require('cors')
require('dotenv').config();

const { sequelize, Admin, Department, Staff, syncDB } = require('./src/model');
const app = express()


// Initialize database
syncDB().then(() => {
    console.log('✅ Application ready to start');
}).catch(error => {
    console.error('❌ Application failed to start:', error);
});

app.use(cors({
    origin: "*", // Allow all domains (for testing only)
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization"
}));

// app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/',userRoute)
const PORT = process.env.PORT  || 4000
app.listen(PORT,()=>console.log(`Listening at ${PORT}`))
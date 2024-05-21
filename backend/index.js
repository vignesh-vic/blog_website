const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser')
// const path = require('path')
const dotenv = require('dotenv')
const app = express()
app.use(cookieParser())


const cors = require('cors');
dotenv.config();
const corsOptions = {
    origin: 'http://localhost:3000', // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json())

const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')
const postRoute = require('./routes/postRoute')
const commentRoute = require('./routes/commentRoute')



app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)
app.use('/api/comment', commentRoute)

// Serve static files
// const __dirname = path.resolve(); // Ensure this line is not duplicated
// app.use(express.static(path.join(__dirname, '../frontend/build')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.listen(5000, () => {
    console.log("server running 5000 port");
})


connectDB();
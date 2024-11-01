const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session'); 
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to database ' + config.database))
.catch(err => console.log('Database connection error: ' + err));

const app = express();

// CORS Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Adjust if your frontend is hosted elsewhere
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Express Session Middleware (optional, since using JWT)
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Routes
const users = require('./routes/users');
const todos = require('./routes/todos');

app.use('/users', users);
app.use('/todos', todos);

// Index Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const port = 3000;
app.listen(port, () => {
    console.log('Server started on port ' + port);
});

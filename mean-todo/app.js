const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session'); 
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.Promise = global.Promise; //this was added based off a comment on the video
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {

    console.log('conntected to database' + config.database);
})

mongoose.connection.on('error', (err) => {

    console.log('databse error' + err);
})

const app = express();
//cors middleware
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
//body parser middleware
app.use(bodyParser.json());
 
const users = require('./routes/users');

//port num
const port = 3000

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


app.use('/users', users);



//index route
app.get('/', (req, res) => {
    res.send('invalid endpoint');
})

//start server
app.listen(port, () => {
    console.log('Server started on port ' + port);

})

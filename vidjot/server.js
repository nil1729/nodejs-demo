const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');


// Database Setup
const connectDB = require('./config/db');
connectDB();

// passport Initialize
require('./config/passport')(passport);

// Session Setup
app.use(session({
    secret: 'Secret',
    resave: true,
    saveUninitialized: true
}));

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());


// View engine Setup
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Body Parser
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


// Flash Setup
app.use(flash());

app.use((req, res, next) => {
    res.locals.s_m = req.flash('success');
    res.locals.e_m = req.flash('error');
    next();
});


// Routes Setup
app.get('/', (req, res) => {
    res.render('index', {user: req.user});
});
app.get('/about', (req, res) => {
    res.render('about', {user: req.user});
});
app.use('/users', require('./routes/users'));
app.use('/videos', require('./routes/videos'));

app.get('*', (req, res)=> {

});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
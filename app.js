const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(
    session({
        secret: 'secret',
        store: new FileStore,
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        },
        resave: false,
        saveUninitialized: false
    })
)

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/login', (req, res, next) => {
    console.log('in post login');
    passport.authenticate('local', function(err, user, info) {
        console.log('in passport authnticate');
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.send('Укажите правильный емаил или пароль'); 
        }
        req.logIn(user, function(err) {
            console.log('in passport authnticate logIn');
            if (err) { 
                return next(err); 
            }
            return res.redirect('/admin');
        });
    })(req, res, next);
});

app.post('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/');
    }
}
app.get('/admin', auth, (req, res) => {
    res.send('Admin page');
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

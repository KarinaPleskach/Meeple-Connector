const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const fakeUser = {
    id: 1,
    email: 'fakeuser@mail.ru',
    password: '1111'
};

passport.serializeUser(function(user, done) {
    console.log('Сериализация: ', user);
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    console.log('десериализация: ', id);
    const user = (fakeUser.id === id) ? fakeUser : false;
    done(null, user);
});

passport.use(
    new LocalStrategy({usernameField: 'email'}, function(email, password, done) {
        console.log('In local strategy');
        if (email === fakeUser.email && password === fakeUser.password) {
            return done(null, fakeUser);
        } else {
            return done(null, false, {message: 'Incorrent mail or password'});
        }
    })
);

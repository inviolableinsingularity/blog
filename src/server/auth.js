import passport from 'passport';
import LocalStrategy from 'passport-local';

import bodyParser from 'body-parser';

// Using the lightweight Passport library for user auth
// Implementing a very basic username/password check; in a production environment
// there would be some kind of data store for user information as well as additional strategies
// for OAuth integration.

const SAMPLE_USER_OBJECT = {
  id: 1,
  name: "Brad Blogger",
  isAdmin: true
};

const urlencodedParser = bodyParser.urlencoded({extended: false});

passport.use(new LocalStrategy(
  function (username, password, callback) {
    if (username && password) {
      // This is hardcoded for the purposes of this test
      // In a real application we'd be using crypto and a separate user library
      if (username === 'admin' && password === 'password') {
        // Hardcoded user object
        return callback(null, {...SAMPLE_USER_OBJECT});
      }
    }
    return callback(null, false);
  }
));

passport.serializeUser((user, callback) => {
  callback(null, user.id);
});
passport.deserializeUser((id, callback) => {
  if (id === 1) {
    return callback(null, {...SAMPLE_USER_OBJECT});
  } else {
    return callback("Error: Invalid User");
  }
});

// Really basic auth. Would need to be prettied up for production use
export const applyAuth = (app) => {
  app.use(passport.initialize({}));
  app.use(passport.session({}));

  app.post(
    '/login',
    urlencodedParser,
    (req, res, next) => {
      passport.authenticate('local', (err, user, info) => {
        // Only dumping error messages to console for now,
        // would obviously want graceful failures and user feedback in
        // production-ready code
        if (err) {
          console.log(err);
          return next(err);
        }
        if (!user) {
          console.log('Invalid user');
          return res.redirect('/');
        }
        req.login(user, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully logged in as " + user.name);
          }
        });
        return res.redirect('/');
      })(req, res, next);
    }
  );

  app.get(
    '/logout',
    (req, res) => {
      req.logout();
      res.redirect('/');
    }
  );
  app.post(
    '/logout',
    (req, res) => {
      req.logout();
      res.json({
        isAuthenticated: false,
      });
    }
  );

};

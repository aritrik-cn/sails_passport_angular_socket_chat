/**
 *  Author :   Aritrik Das <aritrik.cn@gmail.com>
 *  since Sails version 0.2.0
 *  Data : 16-04-2014
 *  The security layer is required to for User Authentication Using Passport
**/

var passport 			= require('passport'),
    LocalStrategy       = require('passport-local').Strategy,
    GitHubStrategy 		= require('passport-github').Strategy,
    FacebookStrategy 	= require('passport-facebook').Strategy,
    GoogleStrategy 		= require('passport-google-oauth').OAuth2Strategy,
    TwitterStrategy     = require('passport-twitter').Strategy,
    LinkedInStrategy    = require('passport-linkedin').Strategy;

// Verify the user details

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (uid, done) {
    User.findOne({uid: uid}).done(function (err, user) {
        done(err, user)
    });
});

/** Set App Authentication Varriable with Application Env accordingly, follow the links below to create a native app.
 * Google : https://cloud.google.com/console#/project
 * Facebook : https://developers.facebook.com/apps
 * Github : https://github.com/settings/applications/new
**/
var setMiddleware = {
    "development" : {
        "facebook" : {
            "clientID": "595411370512409",
            "clientSecret": "d2246c216324e40b2abe4575ba7d1da8",
            "callbackURL": "http://localhost:1337/auth/facebook/callback"
        },
        "google" : {
            "clientID": "93230042571.apps.googleusercontent.com",
            "clientSecret": "GgGVHBVHM4hVLfaIhFdE-8tb",
            "callbackURL": "http://localhost:1337/auth/google/callback"
        },
        "git" : {
            "clientID": "3d3fb2428e019345b278",
            "clientSecret": "a09bb10b418bd3ce901d91b0980fee4fccaf324e",
            "callbackURL": "http://localhost:1337/auth/github/callback"
        },
        "twitter" : {
            "clientID": "3d3fb2428e019345b278",
            "clientSecret": "a09bb10b418bd3ce901d91b0980fee4fccaf324e",
            "callbackURL": "http://localhost:1337/auth/twitter/callback"
        },        
        "linkedin" : {
            "clientID": "3d3fb2428e019345b278",
            "clientSecret": "a09bb10b418bd3ce901d91b0980fee4fccaf324e",
            "callbackURL": "http://localhost:1337/auth/linkedin/callback"
        }
    }
}

var verifyHandler = function (token, tokenSecret, profile, done) {  

    User.findOne({
            or: [{uid: parseInt(profile.id)},
                {uid: profile.id}
            ]
    }).done(function (err, user) {
        if (user) {
            return done(null, user);
        } else {

            var data = {
                provider: profile.provider,
                uid: profile.id,
                name: profile.displayName
            };

            if(profile.emails && profile.emails[0] && profile.emails[0].value) {
                data.email = profile.emails[0].value;
            }
            if(profile.name && profile.name.givenName) {
                data.fistname = profile.name.givenName;
            }
            if(profile.name && profile.name.familyName) {
                data.lastname = profile.name.familyName;
            }

            User.create(data).done(function (err, user) {
                return done(err, user);
            });
        }
    });
};

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findByUsername(username).done(function(err, user) {
            if (err) { return done(null, err); }
            if (!user || user.length < 1) { return done(null, false, { message: 'Incorrect User'}); }
            bcrypt.compare(password, user[0].password, function(err, res) {
                if (!res) return done(null, false, { message: 'Invalid Password'});
                return done(null, user);
            });
        });
    })
);
// Facebook Authentication
passport.use(new FacebookStrategy (setMiddleware.development.facebook, verifyHandler));
// Google Authentication
passport.use(new GoogleStrategy(setMiddleware.development.google, verifyHandler));
// Github Authentication
passport.use(new GitHubStrategy(setMiddleware.development.git, verifyHandler));
// Twitter Authentication
//passport.use(new TwitterStrategy(setMiddleware.development.twitter, verifyHandler));
// Linkedin Authentication
//passport.use(new LinkedInStrategy(setMiddleware.development.linkedin, verifyHandler));

module.exports = {
    // Init custom express middleware
    express: {
        customMiddleware: function (app) {
            app.use(passport.initialize());
            app.use(passport.session());
        }
    }
};
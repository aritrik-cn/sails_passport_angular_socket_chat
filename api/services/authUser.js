var passport = require('passport');

exports.authenticate = function (req, res) {
	passport.authenticate(req.params.provider, {failureRedirect: '/login', scope:[setScope(req.params.provider)]}) (req, res);
};

exports.authenticationCallback = function (req, res) {
	passport.authenticate(req.params.provider,
	    function (err, user) {
	    	console.log("******* user ****** " + user);
	    	if (user) {
		        req.logIn(user, function (err) {
		            if (err) {
		                console.log(" **** err **** " + err);
		                res.view('500');
		                return;
		            }

		            res.redirect('/');
		            return;
		        });
		    } else {
		    	res.redirect('/login');
		    }
	    }
	) (req, res);
};

// Set Scope
var setScope = function (provider) {
	var scope;
	switch (provider) {
		case 'facebook':
			scope = 'email';
			break;
		case 'google':
			scope = 'https://www.googleapis.com/auth/plus.login',
					'https://www.googleapis.com/auth/userinfo.profile',
					'https://www.googleapis.com/auth/userinfo.email';
			break;
		case 'twitter':
			scope = 'email';
			break;
		default :
			scope = null;
	}
	return scope;
}
var bodyParser          = require('body-parser');

var roastController     = require('../../server/controllers/roastController'),
    debateController    = require('../../server/controllers/debateController'),
    trendingController  = require('../../server/controllers/trendingController'),
    memberController  	= require('../../server/controllers/memberController');

module.exports = function( app, passport, express ) {

     // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        req.user = null;
        return next();
    }	

    app.get('/userInfo', function( req, res ) {
        res.sendFile( __dirname + '/client/index.html' );
    });

	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
           passport.authenticate('google', {
                successRedirect : '/#userInfo',
	            failureRedirect : '/'
    }));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', 'public_profile'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/#userInfo',
            failureRedirect : '/'
    }));

	app.use(bodyParser());

    app.get('/user/me', isLoggedIn, function( req, res, next ) {
        res.status( 200 ).json( req.user );
    });

    app.post('/logout', function (req, res, next ) {
        req.logout();
        res.redirect('/');
    });

	//this is for posting data
	app.post('/createRoast', roastController.createRoast);

	app.post('/createDebate', debateController.createDebate);

	app.get('/trendingDebates', trendingController.getDebates);

	app.get('/trendingRoasts', trendingController.getRoasts);

	app.get('/debateTitle/:id', debateController.getDebate);

	app.get('/roastTitle/:id', roastController.getRoast);

	app.post('/debateComment', debateController.debateComment);

	app.post('/roastComment', isLoggedIn, roastController.roastComment);

	app.get('/roastComments/:id', roastController.roastComments);

	app.get('/debateComments/:id', debateController.debateComments);

	app.post('/vote', debateController.vote);

	app.get('/allDebates', debateController.getDebates);
	
	app.post('/delQuestion', debateController.delQuestion);

	app.get('/allRoasts', roastController.getRoasts);

	app.get('/debateReplies/:id', debateController.getReplies);

	app.get('/memberData', memberController.getMemberData);

	app.get('/allMemData', memberController.allMemData);

	app.post('/getNotif', memberController.getNotif);

	app.post('/createMember', memberController.createMember);

	app.get('/memberInit', memberController.memberInit);

	app.get('/roastReplies/:id', roastController.getReplies);

	app.post('/newRcomments', roastController.getNewRcomments);

	app.post('/newQcomments', debateController.getNewQcomments);

	app.post('/editQcomment/:debateID', debateController.editQcomment);

	app.post('/editRcomment/:debateID', roastController.editRcomment);

	app.post('/editQuestion/:debateID', debateController.editQuestion);

	app.post('/debateReply/:debateID', debateController.debateReply);

	app.post('/roastReply/:debateID', roastController.roastReply);

	app.post('/notifRead', memberController.notifRead);

	app.post('/upload', function(req, res) {
	    var image =  req.files.image;
	    var newImageLocation = path.join(__dirname, 'public/images', image.name);
	    
	    fs.readFile(image.path, function(err, data) {
	        fs.writeFile(newImageLocation, data, function(err) {
	            res.json(200, { 
	                src: 'images/' + image.name,
	                size: image.size
	            });
	        });
	    });
	});
};

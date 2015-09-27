var memberList 		= require('../models/memberModel');

var http 	 		= require('http');
var Mailgun = require('mailgun-js');

var sendMail = function (to, subject, content) {
    var mailGun = new Mailgun({
        apiKey: 'Will-Be-Mailed',
        domain: 'IndiaRoasts.com'
    });

    var mailObj = {
        from : 'Roaster <Roast@indiaroasts.com>',
        to : to,
        subject : subject,
        html: content
    };

    mailGun.messages().send(mailObj, function (err, body) {
        console.log( err );
        console.log( body );
    });
};

var sendRegistrationMail = function( userInfo ) {
	console.log('Sending Registration Mail' );
	var template = '<p>Hey {{userName}} !</p>' + 
					'<p>' + 'You are successfully registered to roast the hell out. Comment, debate, vote and roast about whatever you want to on the slow heat of sarcasms.' + '</p>' +
					'<p>' + 'We are providing you with the first platform of its kind. You get to speak out the confined thoughts you\'ve always had and get to know what others think about it. ' + '</p>' + 
					'<p>' + 'So set the trend! As we give you this new adda to speak on any thing, anyway, about anyone.' + '</p>' +
					'<p>' + 'Don\'t keep in anymore..take it out!! Roast it..' + '</p>' + 					
					'<p>' + 'PS: You can post comments anonymously without even logging in.' + '</p>' +					
					'<p>' + 'Respect,' + 
					'<p>' + 'Team Roasters' + '</p>';
	var htmlContent = template.replace(new RegExp('{{' + 'userName' + '}}', 'i'), userInfo.name );
	var subject = 'Ready to roast!!';

	sendMail( userInfo.email, subject, htmlContent );
};


module.exports.createMember = function(req, res){

	var query = req.user;
	console.log( 'In create Member' );

	if ( typeof query !== 'undefined' && query ) {

			var googleUser = req.user.google.id;

			var facebookUser = req.user.facebook.id;

			var member = memberList.getMemberModel();

			if( typeof googleUser !== 'undefined' && googleUser ){
				var memberInfo = {
							name			: req.user.google.name,
							email 			: req.user.google.email,
							id				: req.user.google.id,
							imgUrlLg		: req.body.imgUrlBig,
							imgUrlXs		: req.body.imgUrlSm
						}

				var newMember = new member(memberInfo);
					        
				newMember.save(function(err, result){						
						res.json('success');								
						sendRegistrationMail( memberInfo );				
				});
			}else if (typeof facebookUser !== 'undefined' && facebookUser) {
				var memberInfo = {
							name			: req.user.facebook.name,
							email 			: req.user.facebook.email,
							id				: req.user.facebook.id,
							imgUrlLg		: req.body.imgUrlBig,
							imgUrlXs		: req.body.imgUrlSm
						}

				var newMember = new member(memberInfo);
					        
				newMember.save(function(err, result){						
						res.json('success');		
						sendRegistrationMail( memberInfo );				
				});
			};

	}else{
		res.json('NotLoggedIn');
	}

};

module.exports.getMemberData = function(req, res){

	var query = req.user;

	if ( typeof query !== 'undefined' && query ) {

			var googleUser = req.user.google.id;

			var facebookUser = req.user.facebook.id;

			var member = memberList.getMemberModel();

			if( typeof googleUser !== 'undefined' && googleUser ){
				member.find({'email': req.user.google.email}, function (err, result) {
						res.json(result);
				});
			}else if (typeof facebookUser !== 'undefined' && facebookUser) {
				member.find({'email': req.user.facebook.email}, function (err, result) {
						res.json(result);
				});
			};

	}else{
		res.json('NotLoggedIn');
	}

}

module.exports.memberInit = function(req, res){
	res.json(req.user);
}

module.exports.notifRead = function(req, res){

	var query = req.user;

	if ( typeof query !== 'undefined' && query ) {

			var member = memberList.getMemberModel();

			member.update({'notifications._id': req.body._id},{'$set': {'notifications.$.read': 'true'}}, function (err, result) {
					res.json(result);
			});

	}else{
		res.json('NotLoggedIn');
	}

};


module.exports.allMemData = function(req, res){

	var member = memberList.getMemberModel();

	member.find({}, function(err, result){
		res.json(result);
	})

}


module.exports.getNotif = function(req, res){

	var member = memberList.getMemberModel();

	member.find({'email': req.body.email},{'notifications': true}, function(err, result){
		res.json(result);
	})

}
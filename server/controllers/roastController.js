var roastHandler = require('../models/roastModel');

module.exports.createRoast = function(req, res){

	var Roast = roastHandler.getRoastModel();

	var slugReal = req.body.name.replace(/[ +,.<>'!@#$]/g, '_').toLowerCase();

	Roast.find({'slug' : slugReal}, function (err, doc) {
		var docLength = doc.length;
        if (doc.length !== 0) {
        	//console.log('its two');
        	var roastInfoDuplicate = {
						name		: req.body.name,
						quote 		: req.body.quote,
						slug		: slugReal + docLength,
						views		: 1,
						imgUrl		: req.body.imgUrl,
						bannerUrl	: req.body.bannerUrl,
						type		: req.body.type,
						content		: req.body.content,
						title		: req.body.title,
						position	: req.body.position,
						batchDate	: req.body.batchDate,
						createdBy	: req.body.createdBy,
						createdOn	: new Date()
					}
			var newRoast = new Roast(roastInfoDuplicate);
			newRoast.save(function(err, result){
				if (!err) {
					res.json(result);
				};
			});
        }else{
        	var roastInfo = {
						name		: req.body.name,
						quote 		: req.body.quote,
						slug		: slugReal + docLength,
						views		: 1,
						imgUrl		: req.body.imgUrl,
						bannerUrl	: req.body.bannerUrl,
						type		: req.body.type,
						content		: req.body.content,
						title		: req.body.title,
						position	: req.body.position,
						batchDate	: req.body.batchDate,
						createdBy	: req.body.createdBy,
						createdOn	: new Date()
			}

        	var newRoast = new Roast(roastInfo);
        	//console.log(roastInfo);

			newRoast.save(function(err, result){
				if (!err) {
					res.json(result);
				};
			});
        };
	});
	
};


module.exports.getRoast = function(req, res){
	
	var roast = roastHandler.getRoastModel(req.params);

	var id = req.params.id;

	roast.update(
					   { "slug": id },
					   { "$inc": { "views": 1 } },
					   function(err, result) {
						   
					   }
				);
	
	roast.find({'slug' : id}, function (err, doc) {
        res.json(doc);
        //console.log(doc);
	});
};

module.exports.getRoasts = function(req, res){
	
	var roasts = roastHandler.getRoastModel();
	
	roasts.find({},{'content': false},{ sort: {'createdOn': -1}}, function (err, doc) {
        res.json(doc);
	});
};


module.exports.roastComment = function(req, res){

	var collectionName = req.body.id;

	var roast = roastHandler.getRoastModel();

	console.log('user details');

	console.log(req.user);
	
	//if(collectionName.length === 24){
		roast.find({'slug' : collectionName}, function (err, doc) {
			console.log(doc);
	        
	        if(doc[0].slug === collectionName ){

				var comment = roastHandler.getCommentModel(collectionName);

				if (req.body.anonymous === "Y"){
					var commentInfo = {
						name		: 'Anonymous',
						comment		: req.body.comment,
						imgUrl		: '../images/user.png',
						email		: null,
						createdOn	: new Date()
					}
				}else{
					var commentInfo = {
						name		: req.body.name,
						comment		: req.body.comment,
						imgUrl		: req.body.imgUrl,
						email		: req.body.email,
						createdOn	: new Date()
					}
				}

				var newComment = new comment(commentInfo);

				newComment.save( commentInfo, function(err, result){
					if (!err) {
						res.json(result);
					}
				});
			}else{
				res.json('failure');
			}
		});

};


module.exports.roastComments = function(req, res){


	var roast = roastHandler.getRoastModel(req.params);

	var collectionName = req.params.id;


	//if(collectionName.length === 24){
		roast.find({'slug' : collectionName}, function (err, doc) {
			//console.log(doc);
	        
	        if(doc.length !== 0 ){

				var comments = roastHandler.getCommentModel(collectionName);

				comments.find({},{},{ sort: {'createdOn': -1}}, function (err, result) {

			        if (result.length === 0) {
				        var firstComment = {
							name		: 'IndiaRoasts@offcial',
							comment 	: 'We recommend a clean Roast. Naah Fuck it, make it dirty.',
							imgUrl		: '../images/logo.jpg',
							email		: 'roast@indiaroasts.com',
							createdOn	: new Date()
						}

						var firstCommentCreate = roastHandler.getCommentModel(collectionName);

						var first = new firstCommentCreate(firstComment);

						first.save(function(err, value){

							var arrOfObjs = value;
							var arrOfVals = [];
							
							    arrOfVals.push( arrOfObjs );
							
							res.json(arrOfVals);

						})
					};
					if (result.length !== 0) {
						res.json(result);
					};
				});
			}else{
				res.json('failure');
				//console.log(doc);
			}
		});
	/*}else{
		res.json('failure');
	}*/

};


module.exports.getNewRcomments = function(req, res){

	var collectionName = req.body.id;

	var newComments = roastHandler.getCommentModel(collectionName);

	newComments.find({createdOn: { $gt: req.body.oldDate }},{},{ sort: {'createdOn': 1}}, function (err, result){
		res.json(result);
	});
}


module.exports.editRcomment = function(req, res){

	var collectionName = req.params.debateID;

	var commentName = req.body.id;

	var debate = roastHandler.getCommentModel(collectionName);

	debate.update({'_id': commentName},{'comment':req.body.comment}, function(err, result){
						
						res.json(result);
					});
};


module.exports.updateRoast = function(req, res){

	var roastID = req.body.id;

	var roastTitle = roastHandler.getRoastModel();

	console.log(req.body);

	roastTitle.update({'_id':roastID},{ 'name'			: req.body.name,
										'quote' 		: req.body.quote,
										'views'			: 1,
										'imgUrl'		: req.body.imgUrl,
										'bannerUrl'		: req.body.bannerUrl,
										'type'			: req.body.type,
										'content'		: req.body.content,
										'title'			: req.body.title,
										'position'		: req.body.position,
										'batchDate'		: req.body.batchDate,
										'createdBy'		: req.body.createdBy,
										'createdOn'		: new Date()}, function(err, result){
					res.json(result);
					//console.log(result);
	})
}



module.exports.roastReply = function(req, res){

	var combinedID = req.params.debateID;

	console.log(collectionName);

	if (req.body.id === 'replyPage'){

		var commentID = combinedID.substr(combinedID.length - 24);

		var collectionLength 	= combinedID.length - commentID.length;

		var collectionName 		= combinedID.substring(0,collectionLength);

		var roast = roastHandler.getCommentModel(collectionName);

		if(req.body.anonymous === 'Y'){
			roast.update(
							{"_id"		: commentID},
							{ "$push":	{"replies": {	
												name 		: 'Anonymous',
												comment 	: req.body.comment,
												imgUrl		: '../images/user.png',
												email		: null,
												createdOn	: new Date()
											}
										}
							},
							function(err, result) {
								res.json(result);
								console.log(result);
						   }
			);
		}else{
			roast.update(
							{"_id"		: commentID},
							{ "$push":	{"replies": {	
												name 		: req.body.name,
												comment 	: req.body.comment,
												imgUrl		: req.body.imgUrl,
												email		: req.body.email,
												createdOn	: new Date()
											}
										}
							},
							function(err, result) {
								res.json(result);
								console.log(result);
						   }
			);
		}
	}else{

		var roast = roastHandler.getCommentModel(combinedID);

		var commentName = req.body.id;

		console.log('collectionName$$$$$$$$$'+combinedID);

		if(req.body.anonymous === 'Y'){
			roast.update(
							{"_id"		: commentName},
							{ "$push":	{"replies": {	
												name 		: 'Anonymous',
												comment 	: req.body.comment,
												imgUrl		: '../images/user.png',
												email		: null,
												createdOn	: new Date()
											}
										}
							},
							function(err, result) {
								res.json(result);
								console.log(result);
						   }
			);
		}else{
			roast.update(
							{"_id"		: commentName},
							{ "$push":	{"replies": {	
												name 		: req.body.name,
												comment 	: req.body.comment,
												imgUrl		: req.body.imgUrl,
												email		: req.body.email,
												createdOn	: new Date()
											}
										}
							},
							function(err, result) {
								res.json(result);
								console.log(result);
						   }
			);
		}
		
	}
};



module.exports.getReplies = function(req, res){

	var combinedID 			= req.params.id;

	var commentID 			= combinedID.substr(combinedID.length - 24);

	var collectionLength 	= combinedID.length - commentID.length;

	if (collectionLength >= 112) {
		var collectionName 		= combinedID.substring(0,112);
	}else{
		var collectionName 		= combinedID.substring(0,collectionLength);
	}
	
	var replies = roastHandler.getCommentModel(collectionName);
	
	replies.find({'_id':commentID}, function (err, result) {
        res.json(result);
        //console.log(result);
	});
};

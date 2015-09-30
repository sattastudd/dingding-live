var debateHandler = require('../models/debateModel');

var memberHandler = require('../models/memberModel');

var mongoose = require( 'mongoose' );


module.exports.createDebate = function(req, res){
	
	var debateCreate = debateHandler.getDebateModel();

	var member = memberHandler.getMemberModel();

	var slugReal = null;

	if(req.body.debate === "Y"){
			var slugValue 	=  (req.body.question + '-options-' + req.body.yBtnValue + '-' + req.body.nBtnValue).toLowerCase();
				slugReal 	=  slugValue.replace(/[\s+,.<>'!@#$]/g, '-');
	}else{
		slugReal = req.body.question.replace(/[\s+,.<>'!@#$]/g, '-').toLowerCase();
	}

	//var collectionIDSorted = req.body.question.replace(/[\s+,.<>'!@#$]/g, '-').toLowerCase();

	var collectionID = slugReal.substring(0,112);

	debateCreate.find({'collectionID' : collectionID}, function (err, doc) {
		var query = req.user;

		if ( typeof query !== 'undefined' && query ) {

	        if (doc.length !== 0) {
	        	res.json(doc);

	        }else{
	        	var debateInfo = {
					question	: req.body.question,
					yes			: req.body.yes,
					no			: req.body.no,
					yBtnValue	: req.body.yBtnValue,
					nBtnValue	: req.body.nBtnValue,
					debate 		: req.body.debate,	
					qImgUrl		: req.body.qImgUrl,
					slug		: slugReal,
					description	: req.body.description,
					collectionID : collectionID,
					email		: req.body.email,
					createdBy	: req.body.name,
					createdOn	: new Date()
				}

				member.update({"email"		: req.body.email},
							  { "$push":	{"comments": {	
															question 		: req.body.question,
															comment 		: 'The above question is created by you',
															collectionID 	: slugReal,
															commentID		: null,
															createdOn		: new Date()
														}
													}
										},
						function(err, result) {
								console.log(result);
								//console.log(result);
					   });

				var newDebate = new debateCreate(debateInfo);
		
				newDebate.save(function(err, result){
					if (!err) {
						res.json(result);
					};
				});
	        };
	    };
	});
	
};


module.exports.getDebate = function(req, res){
	
	var debate = debateHandler.getDebateModel();

	var id = req.params.id;

	debate.update(
					   { "slug": id },
					   { "$inc": { "views": 1 } },
					   function(err, result) {
						   
					   }
				);

	var collectionName = id.substring(0, 112);
	
	debate.find({'collectionID' : collectionName}, function (err, doc) {
        res.json(doc);
    });
};



module.exports.debateComment = function(req, res){

	var collectionLength = req.body.id;

	var collectionName = collectionLength.substring(0, 112);

	var debate = debateHandler.getDebateModel();

	var member = memberHandler.getMemberModel();

	//if(collectionName.length === 24){
		debate.find({'collectionID' : collectionName}, function (err, doc) {

	        if(doc.length !== 0){
	        	var comment = debateHandler.getCommentModel(collectionName);

	        	var sortedComment = req.body.comment.replace(/\r?\n/g, '<br/>');
	        	//console.log(sortedComment);
	        	if (req.body.anonymous === "Y"){
					var commentInfo = {
						name		: 'Anonymous',
						comment 	: req.body.comment,
						imgUrl		: '../images/user.png',
						email		: null,
						createdOn	: new Date()
					}

					var newComment = new comment(commentInfo);

					newComment.save(function(err, result){
						if (!err) {
							var goToLocation 	= '/QandA/' + collectionLength;
							var message 		= 'Anonymous' + ' has answered to your question - ' + '"' + req.body.question.substring(0,50) + '"';

							member.update(
										{"email"		: req.body.qCreator},
										{ "$push"		: {"notifications": {
													  		location	: goToLocation,
															msg			: message,
															read		: 'false',
															imgUrl		: '../images/user.png',
															time 		: new Date()
														}
													  }
										}, function(err, result){

										});
								}

							res.json(result);
						});


				}else {
					var commentInfo = {
						name		: req.body.name,
						comment 	: req.body.comment,
						imgUrl		: req.body.imgUrl,
						email		: req.body.email,
						createdOn	: new Date()
					}

					var newComment = new comment(commentInfo);

					newComment.save(function(err, result){
						if (!err) {
							
							var commentID = result._id;

							var goToLocation 	= '/QandA/' + collectionLength;
							var message 		= req.body.name + ' has answered to your question - ' + '"' + req.body.question.substring(0,50) + '..."';

							member.update(
										{"email"		: req.body.email},
										{ "$push":	{"comments": {	
															question 		: req.body.question,
															comment 		: req.body.comment.substring(0,120),
															collectionID 	: collectionName,
															commentID		: commentID,
															createdOn		: new Date()
														}
													}
										},
										function(err, result) {
											console.log(result);
											//console.log(result);
									   });

							if (req.body.email !== req.body.qCreator){
								member.update(
											{"email"		: req.body.qCreator},
											{ "$push"		: {"notifications": {
														  		location	: goToLocation,
																msg			: message,
																read		: 'false',
																imgUrl		: req.body.imgUrl,
																time 		: new Date()
															}
														  }
											}, function(err, result){

											});
							}
						}

						res.json(result);
					});
							  
				}

			}else{
				res.json('failure');
			}
		});

};


module.exports.debateComments = function(req, res){

	var collectionLength = req.params.id;

	var collectionName = collectionLength.substring(0, 112);

	var debate = debateHandler.getDebateModel();

		debate.find({'collectionID' : collectionName},{"replies": false}, function (err, doc) {

			if(doc.length !== 0){

				var comments = debateHandler.getCommentModel(collectionName);

				comments.find({},{'replies': false},{ sort: {'createdOn': -1}}, function (err, result) {

					//console.log(result); 
					//console.log('collectionName>>>>'+collectionName);

					if (result.length !== 0) {
						res.json(result);

					}else {
				        var firstComment = {
							name		: 'IndiaRoasts@offcial',
							comment 	: 'Share with your friends to get more and more answers',
							imgUrl		: '../images/logo.jpg',
							email		: 'roast@indiaroasts.com',
							createdOn	: new Date()
						}

						var firstCommentCreate = debateHandler.getCommentModel(collectionName);

						var first = new firstCommentCreate(firstComment);

						first.save(function(err, value){
							var arrOfObjs = value;
							var arrOfVals = [];
							
							    arrOfVals.push( arrOfObjs );
							
							res.json(arrOfVals);
							//console.log(arrOfVals);
						})
					};
				});
			}else{
				res.json('failure');
			}

		});

};


module.exports.getNewQcomments = function (req, res){

	var collectionLength = req.body.id;

	var collectionName = collectionLength.substring(0, 112);

	var newComments = debateHandler.getCommentModel(collectionName);

	newComments.find({createdOn: { $gt: req.body.oldDate }},{'replies': false},{ sort: {'createdOn': -1}}, function (err, result){
		res.json(result);
	});
}



module.exports.getDebates = function(req, res){
	
	var debates = debateHandler.getDebateModel();
	
	debates.find({},{},{ sort: {'views': 1}}, function (err, result) {
        	res.json(result);
		});
};


module.exports.vote = function(req, res){

	var id = req.body.id;

	var vote = debateHandler.getDebateModel();

	var member = memberHandler.getMemberModel();

	member.update({"email"		: req.body.email},
							  { "$push":	{"comments": {	
															question 		: req.body.question,
															comment 		: 'You have voted to the above qustion',
															collectionID 	: id,
															commentID		: null,
															createdOn		: new Date()
														}
													}
										},
						function(err, result) {
								console.log(result);
					   });

	vote.find({'slug': id}, function(err, result){
		var total = result[0].yes + result[0].no;
		if (total === 10) {
			var goToLocation = '/QandA/' + id;
			var message = 'People have voted to your question - ' + req.body.question.substring(0,40) + '...' 
			member.update(
											{"email"		: req.body.qCreator},
											{ "$push"		: {"notifications": {
														  		location	: goToLocation,
																msg			: message,
																read		: 'false',
																imgUrl		: '../images/user.png',
																time 		: new Date()
															}
														  }
											}, function(err, result){
												console.log('result');
											});
		};
	})

	if(req.body.value === 'Y'){
		vote.update(
				   { "slug": id },
				   { "$inc": { "yes": 1 } },
				   function(err, result) {
					   res.json(result);
				   }
				);
	};
	
	if(req.body.value === 'N'){
		vote.update(
				   { "slug": id },
				   { "$inc": { "no": 1 } },
				   function(err, result) {
						res.json(result);
				   }
				);
	};
};


module.exports.editQcomment = function(req, res){

	var combinedID = req.params.debateID;

	if(req.body.replyPage === "Y"){
		var commentID = combinedID.substr(combinedID.length - 24);

		var collectionLength 	= combinedID.length - commentID.length;

		if (collectionLength >= 112) {
			var collectionName 		= combinedID.substring(0,112);
		}else{
			var collectionName 		= combinedID.substring(0,collectionLength);
		}
	}else{
		var collectionName = combinedID.substring(0, 112);
	}

	var commentName = req.body.id;

	var debate = debateHandler.getCommentModel(collectionName);

	if (req.body.replyCom === 'Y') {

		debate.update({'replies._id': req.body.id},{'$set': {'replies.$.comment': req.body.comment}}, function (err, result) {
					res.json(result);
			});
	}else{
		debate.update({'_id': commentName},{'comment':req.body.comment}, function(err, result){
						
						res.json(result);
					});
	}
};



module.exports.editQuestion = function(req, res){

	var debateName = req.body.id;

	var debateTitle = debateHandler.getDebateModel();

	//console.log(req.body.question);

	debateTitle.update({'_id':debateName},{'question':req.body.question,
											'qImgUrl':req.body.qImgUrl,
										   'yBtnValue':req.body.yBtnValue,
										   'nBtnValue':req.body.nBtnValue}, function(err, result){
		res.json(result);
		//console.log(result);
	})
};



module.exports.debateReply = function(req, res){

	var combinedID = req.params.debateID;

	var member = memberHandler.getMemberModel();

	if (req.body.id === 'replyPage'){

		var commentID = combinedID.substr(combinedID.length - 24);

		var collectionLength 	= combinedID.length - commentID.length;

		if (collectionLength >= 112) {
			var collectionName 		= combinedID.substring(0,112);
		}else{
			var collectionName 		= combinedID.substring(0,collectionLength);
		}

		var debate = debateHandler.getCommentModel(collectionName);

		if(req.body.anonymous === 'Y'){

			debate.update(
							{"_id"		: commentID},
							{ "$push":	{"replies": {	
												name 		: 'Anonymous',
												comment 	: req.body.comment,
												email		: null,
												imgUrl		: '../images/user.png',
												createdOn	: new Date()
											}
										},
							"$inc": 	{"replyCount": 1}
							},
							function(err, result) {
								res.json(result);
								//console.log(result);
						   }
			);
		}else{

			debate.update(
							{"_id"		: commentID},
							{ "$push":	{"replies": {	
												name 		: req.body.name,
												comment 	: req.body.comment,
												email		: req.body.email,
												imgUrl		: req.body.imgUrl,
												createdOn	: new Date()
											}
										},
							 "$inc": 	{"replyCount": 1}
							},
							function(err, result) {
								res.json(result);
								//console.log(result);
						   }
						);

			member.update(
							{"email"		: req.body.email},
							{ "$push":	{"comments": {	
													parentCom 		: req.body.comContent.substring(0,40) + '...',
													comment 		: req.body.comment.substring(0,120) + '...',
													collectionID 	: collectionName,
													commentID		: commentID,
													createdOn		: new Date()
												}
											}
							},
							function(err, result) {
								console.log(result);
								//console.log(result);
						   });
			}
	}else{

		var collectionName = combinedID.substring(0, 112);

		var debatePage = debateHandler.getCommentModel(collectionName);

		var commentName = req.body.id;

		if(req.body.anonymous === 'Y'){

			debatePage.update(
							{"_id"		: commentName},
							{ "$push":	{"replies": {	
												name 		: 'Anonymous',
												comment 	: req.body.comment,
												email		: null,
												imgUrl		: '../images/user.png',
												createdOn	: new Date()
											}
										},
							"$inc": 	{"replyCount": 1}
							},
							function(err, result) {
								res.json(result);
								//console.log(result);
						   }
			);
		}else{

			debatePage.update(
							{"_id"		: commentName},
							{ "$push":	{"replies": {	
												name 		: req.body.name,
												comment 	: req.body.comment,
												email		: req.body.email,
												imgUrl		: req.body.imgUrl,
												createdOn	: new Date()
											}
										},
							"$inc": 	{"replyCount": 1}
							},
							function(err, result) {
								res.json(result);
								//console.log(result);
						   }
			);

			member.update(
							{"email"		: req.body.email},
							{ "$push":	{"comments": {	
													parentCom 		: req.body.comContent.substring(0,40) + '...',
													comment 		: req.body.comment.substring(0,120) + '...',
													collectionID 	: collectionName,
													commentID		: commentName,
													createdOn		: new Date()
												}
											}
							},
							function(err, result) {
								console.log(result);
								//console.log(result);
						   });
		}
		
	}

	if (req.body.id === 'replyPage'){
		var goToLocation 	= '/replies/' + combinedID;
	}else{
		var goToLocation 	= '/replies/' + combinedID + req.body.id;
	}

	if(req.body.anonymous === "Y"){

		var message 		= 'Anonymous' + ' has replied to your comment - ' + '"' + req.body.comContent.substring(0,20) + '..."';

					if(req.body.comOwner !== null){
						member.update(
									{"email"		: req.body.comOwner},
									{ "$push"		: {"notifications": {
												  		location	: goToLocation,
														msg			: message,
														read		: 'false',
														imgUrl		: '../images/user.png',
														time 		: new Date()
													}
												  }
									}, function(err, result){

									});
					}

	}else if(req.body.email !== req.body.comOwner){

		var message 		= req.body.name + ' has replied to your comment - ' + '"' + req.body.comContent.substring(0,20) + '..."';

					if(req.body.comOwner !== null){
						member.update(
									{"email"		: req.body.comOwner},
									{ "$push"		: {"notifications": {
												  		location	: goToLocation,
														msg			: message,
														read		: 'false',
														imgUrl		: req.body.imgUrl,
														time 		: new Date()
													}
												  }
									}, function(err, result){

									});
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
	
	var replies = debateHandler.getCommentModel(collectionName);
	
	replies.find({'_id':commentID}, function (err, result) {
        console.log(result);
       /* if (result[0].replies.length === 0) {

						replies.update(
							{"_id"		: commentID},
							{ "$push":	{"replies": {	
												name		: 'IndiaRoasts@offcial',
												comment 	: 'Share with your friends to get more and more Replies',
												imgUrl		: '../images/logo.jpg',
												email		: 'roast@indiaroasts.com',
												createdOn	: new Date()
											}
										}
							},
							function(err, reply) {

						   }
						);*/
					
							res.json(result);

        /*}else{
        	res.json(result);
        }*/
	});
};

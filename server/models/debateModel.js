var mongoose 		= require('mongoose');


var debateSchema = new mongoose.Schema({
	question	: String,
	yes			: Number,
	no			: Number,
	yBtnValue	: String,
	nBtnValue	: String,
	createdBy	: String,
	debate 		: String,
	slug		: String,
	description	: String,
	collectionID : String,
	email		: String,
	views		: Number,
	createdOn	: Date
});

var debateModel = mongoose.model('debates', debateSchema);

var getDebateModel = function(){
	return debateModel;
};

exports.getDebateModel 	= getDebateModel;



// for comment in denbates

var replySchema = new mongoose.Schema({
	name 		: String,
	comment 	: String,
	imgUrl 		: String,
	email		: String,
	createdOn 	: Date
});

var commentSchema = new mongoose.Schema({
	name		: String,
	comment 	: String,
	imgUrl		: String,
	createdOn	: Date,
	email		: String,
	replyCount 	: Number,
	replies		: [replySchema]
});

var getCommentModel = function(collectionName){

	var commentModel = mongoose.model(collectionName, commentSchema, collectionName);
	return commentModel; 
}

exports.getCommentModel = getCommentModel;








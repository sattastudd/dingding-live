var mongoose 		= require('mongoose');


//creating roast

var roastSchema = new mongoose.Schema({
	name		: String,
	quote 		: String,
	imgUrl		: String,
	bannerUrl	: String,
	createdOn	: Date,
	type		: String,
	slug		: String,
	views		: Number,
	title		: String,
	position	: String,
	batchDate	: String,
	content		: String,
	createdBy	: String
});

var roastModel = mongoose.model('roasts', roastSchema);


var  getRoastModel = function(){
	return roastModel;
}

exports.getRoastModel = getRoastModel;


// comments for roast

var replySchema = new mongoose.Schema({
	name : String,
	comment : String,
	imgUrl : String,
	createdOn : Date
});

var commentSchema = new mongoose.Schema({
	name		: String,
	comment 	: String,
	imgUrl		: String,
	createdOn	: Date,
	email		: String,
	replies		: [replySchema]
});

var getCommentModel = function(collectionName){

	var commentModel = mongoose.model(collectionName, commentSchema, collectionName);
	return commentModel; 
}

exports.getCommentModel = getCommentModel;
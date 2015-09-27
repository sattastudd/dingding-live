var mongoose 		= require('mongoose');



var commentSchema = new mongoose.Schema({
	question 		: String,
	comment 		: String,
	parentCom		: String,
	collectionID 	: String,
	commentID		: String,
	createdOn		: Date
});

var notificationSchema = new mongoose.Schema({
	location	: String,
	msg			: String,
	read		: String,
	imgUrl 		: String,
	time 		: Date
})

var memberSchema = new mongoose.Schema({
	name			: String,
	email 			: String,
	id				: String,
	imgUrlLg		: String,
	imgUrlXs		: String,
	notifications	: [notificationSchema],
	comments 		: [commentSchema]
});

var memberModel = mongoose.model('members', memberSchema);


var  getMemberModel = function(){
	return memberModel;
}

exports.getMemberModel = getMemberModel;
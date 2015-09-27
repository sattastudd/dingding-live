var mongoose 		= require('mongoose');


//creating roast

var userSchema = new mongoose.Schema({
	google:{
		id	  : String,
		token : String,
		email : String,
		name  : String
	},
	facebook: {
		id	  : String,
		token : String,
		email : String,
		name  : String	
	}
});

var userModel = mongoose.model('users', userSchema, 'users');


var  getUserModel = function(){
	return userModel;
}

exports.getUserModel = getUserModel;
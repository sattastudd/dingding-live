var mongoose 		= require('mongoose');

console.log('look down');
//console.log(getTheName);

var trendingModel = mongoose.model('debateList',{
	name: String, yes: String, no: String
}) ;




var  getTrendingModel = function(){
	return trendingModel;
}

exports.getTrendingModel 		= getTrendingModel;
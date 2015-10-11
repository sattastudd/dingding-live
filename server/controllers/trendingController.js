var trending 		= require('../models/debateModel');

var trendingRoast 	= require('../models/roastModel');

var http 	 		= require('http');


module.exports.getDebates = function(req, res){
	
	var trends = trending.getDebateModel();
	
	trends.find({},{},{ limit: 6, sort:{'views': -1}}, function (err, result) {
        res.json(result);
        //console.log(result);
	});
};

module.exports.getRoasts = function(req, res){
	
	var trends = trendingRoast.getRoastModel();
	
	trends.find({},{},{ limit: 3, sort:{'views': -1}}, function (err, result) {
        res.json(result);
        //console.log(result);
	});
};
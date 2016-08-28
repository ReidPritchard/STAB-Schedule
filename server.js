var engines = require('consolidate');
var express = require('express');
var app = express();
// var nodemailer = require('nodemailer'); Future use??
var http = require("http");
var moment = require('moment');
var ical = require('ical'), months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var mustache = require('mustache');



app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

var currDate = moment().format("MM/DD/YYYY");
var oldDate; // Added to only run newLetter() when needed as it's slow to call
var letter;



function newLetter(){ // Takes sometime to run this function.



	var webDate = moment("08/29/2016").format("MM/DD/YYYY");
	ical.fromURL('http://api.veracross.com/stab/subscribe/14F14099-B662-439F-BBCE-9CF991E8DA96.ics?uid=A0463F4C-EC92-4924-9723-2A591A04FECD', {}, function(err, data) {
		
		var keys = Object.keys(data);

		for (var i = 0; i < keys.length; i++){
			var rawDate = data[keys[i]]["start"]
			// console.log(rawDate);
			var date = moment(rawDate, "ddd, DD MMM YYYY hh:mm:ss                  ").format("MM/DD/YYYY");
			// console.log(date);
			if(date == webDate){
				if(data[keys[i]]["summary"].indexOf("Day ") > -1) {
					if(data[keys[i]]["summary"].indexOf("(US)") > -1) {
						// console.log('here');
						// console.log(data[keys[i]]["summary"]);
						var letter = data[keys[i]]["summary"];
						return(letter);
					}
				}
			}
		}
		
	});
}

app.get('/', function(req, res){
	// var webDate = moment().format("MM/DD/YYYY");
	var currHtml;

	if(oldDate != currDate){


		letter = newLetter(); // returning undefined :(
			//due to async 
			// Need to write callback func

		console.log(letter);

		oldDate = currDate;

		var vars = {
			date: currDate,
			letter: letter
		};

		var html = mustache.to_html('', vars);

		res.send(html);

	}else{
		// Render already stored vars
	}


});



app.listen(8080);
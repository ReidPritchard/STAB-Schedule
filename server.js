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

var oldDate;
// var oldDate = moment().format("MM/DD/YYYY"); // Set it to this when actually running  
var letter;
var currHtml;

console.log('Setup Finished');

function newLetter(callback){ // Takes sometime to run this function.
	// var currDate = moment().format("MM/DD/YYYY")
	var currDate = moment("08/29/2016", "MM/DD/YYYY").format("MM/DD/YYYY");
	ical.fromURL('http://api.veracross.com/stab/subscribe/14F14099-B662-439F-BBCE-9CF991E8DA96.ics?uid=A0463F4C-EC92-4924-9723-2A591A04FECD', {}, function(err, data) {
		// Thanks iCal for this super nice reading of ics files!!


		var keys = Object.keys(data); // Gets all keys in dictionary

		for (var i = 0; i < keys.length; i++){ // Uses the keys found to cycle through data

			var rawDate = data[keys[i]]["start"] // Gets the raw start date of each event
			// console.log(rawDate);
			var date = moment(rawDate, "ddd, DD MMM YYYY hh:mm:ss                  ").format("MM/DD/YYYY"); // Parses this to then be compared
			// console.log(date);
			if(date == currDate){ // Compares if the dates match or not
				// Usually only 3-4 events make it here

				if(data[keys[i]]["summary"].indexOf("Day ") > -1) { // If the dates do match, the summaries are then searched for words 'Day '
					if(data[keys[i]]["summary"].indexOf("(US)") > -1) { // and '(US)'. To find 'Day x (US)'
						// console.log(data[keys[i]]["summary"]);

						var letter = data[keys[i]]["summary"]; // if strings are found full letter day is stored
						console.log('letter in newLetter')
						console.log(letter);
						callback(letter); // Letter is then returned without any minipulation
					}
				}
			}
		}
		
	});
}

function logic(date, letter){  // Only run when new letter is found
	// Used to pick which photo will be displayed 
	//Returns rendered html
	console.log('logic');


	// Probably a huge if statement
	// We will see




	var vars = {
		date: date,
		letter: letter
		// Etc.
	};

	var html = mustache.to_html("Today's Date is: {{date}}. Letter is: {{letter}}", vars); // Test html

	return(html);

}

app.get('/', function(req, res){
	console.log('Get /')
	var currDate = moment("08/29/2016", "MM/DD/YYYY").format("MM/DD/YYYY"); // TEST DATE
	// var currDate = moment().format("MM/DD/YYYY"); // Set it to this when actually running  
	// Gets current date everytime get/ to check to see if newLetter needs to be run

	if(oldDate != currDate){ // If the date that was init. does NOT match the acutal current date

		newLetter(function(newLetter){
			oldDate = currDate; // Sets old date to the new date
			// Getting stuck here right now... 
			// Not sure why newLetter is returning undefined but isn't when printed in func
			newLetter = newLetter.substring(4, 5);
			console.log(letter);
			if(letter != newLetter){
				letter = newLetter;
				console.log('get/')
				console.log(letter);

				currHtml = logic(oldDate, letter); // Sets current Html to new html based off letter and date
				res.send(currHtml); // Sends mustache rendered html
			}

		});

	}else{
		// If the dates are the same send the pre-rendered html
		res.send(currHtml);
	}

});



app.listen(8080);
var engines = require('consolidate');
var express = require('express');
var app = express();
// var nodemailer = require('nodemailer'); Future use??
var http = require("http");
var moment = require('moment');
var ical = require('ical'), months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var mustache = require('mustache');
var fs = require('fs');



app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

var oldDate;
var letter; // Storing letters and html should speed the program by ten fold
var currHtml;


function newLetter(currDate, callback){

	// Takes sometime to run this function. Thus we will try to run as little as possible 

	ical.fromURL('http://api.veracross.com/stab/subscribe/14F14099-B662-439F-BBCE-9CF991E8DA96.ics?uid=A0463F4C-EC92-4924-9723-2A591A04FECD', {}, function(err, data) {
		// Thanks iCal for this super nice reading of ics files!!

		if(data.length != 0){

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

							// console.log(letter);

							letter = letter.substring(4, 5);
							callback(letter); // Letter is then returned without any minipulation

							// console.log('letter in newLetter')
							// console.log(letter);
						}
					}
				}
				if(i == keys.length-1){
					callback('no school');
				}
			}

			// if for loop ends without getting a letter 
			// it will callback a "letter" that will signal
			// that there isn't a letter day today

			// callback("no-school");

		}else{
			callback('no school');
		}
		
	});
}



function logic(date, letter, callback){  // Only run when new letter is found
	// Used to pick which photos will be displayed 
	// Returns rendered html

	day = moment(date, "MM/DD/YYYY").format("dddd");

	// Probably a huge if statement
	if(letter == "A"){
		if(day == "Monday"){
			var oneDay = "'http://i.imgur.com/Jlahli7.png'); width: 250px; height: 1600px; background-position: -145px 0px;"
			// var twoDay = "'./images/tuesdayB.jpg'); width: 250px; height: 1600px;"
			// var threeDay = "'./images/wednesdayC.jpg'); width: 250px; height: 1600px;"
			// var fourDay = "'./images/thursdayD.jpg'); width: 250px; height: 1600px;"
			// var fiveDay = "'./images/fridayE.jpg'); width: 250px; height: 1600px;"
		}
		if(day == "Tuesday"){
			var oneDay = "'http://i.imgur.com/jFJhXvL.png'); width: 250px; height: 1600px;"
		}else if(day == "Wednesday"){
			var oneDay = "'./images/wednesdayA.jpg'); width: 250px; height: 1600px;"
		}else if(day == "Thursday"){
			var oneDay = "'http://i.imgur.com/Y62VQLU.png'); width: 250px; height: 1600px;"
		}else if(day == "Friday"){
			var oneDay = "'./images/fridayA.jpg'); width: 250px; height: 1600px;"
		}else{
		}
	}else if(letter == "B"){
		if(day == "Monday"){
			var oneDay = "'http://i.imgur.com/xnRG6Yk.png'); width: 250px; height: 1600px; background-position: -146px 0px;"
			// var twoDay = "'./images/tuesdayC.jpg'); width: 250px; height: 1600px;"
			// var threeDay = "'./images/wednesdayD.jpg'); width: 250px; height: 1600px;"
			// var fourDay = "'./images/thursdayE.jpg'); width: 250px; height: 1600px;"
			// var fiveDay = "'./images/fridayF.jpg'); width: 250px; height: 1600px;"
		}
		if(day == "Tuesday"){
			var oneDay = "'http://i.imgur.com/Jlahli7.png'); width: 250px; height: 1600px;"
		}else if(day == "Wednesday"){
			var oneDay = "'http://i.imgur.com/jFJhXvL.png'); width: 250px; height: 1600px;"
		}else if(day == "Thursday"){
			var oneDay = "'./images/thursdayB.jpg'); width: 250px; height: 1600px;"
		}else if(day == "Friday"){
			var oneDay = "'http://i.imgur.com/Y62VQLU.png'); width: 250px; height: 1600px;"
		}else{
			var oneDay = "'./images/weekend/jpg"
		}
	}else if(letter == "C"){
		if(day == "Monday"){
			var oneDay = "'./images/mondayC.jpg'); width: 250px; height: 1600px; background-position: -146px 0px;"
			// var twoDay = "'./images/tuesdayD.jpg'); width: 250px; height: 1600px;"
			// var threeDay = "'./images/wednesdayE.jpg'); width: 250px; height: 1600px;"
			// var fourDay = "'./images/thursdayF.jpg'); width: 250px; height: 1600px;"
			// var fiveDay = "'./images/fridayA.jpg'); width: 250px; height: 1600px;"
		}
		if(day == "Tuesday"){
			var oneDay = "'.http://i.imgur.com/xnRG6Yk.png'); width: 250px; height: 1600px;"
		}else if(day == "Wednesday"){
			var oneDay = "'http://i.imgur.com/Jlahli7.png'); width: 250px; height: 1600px;"
		}else if(day == "Thursday"){
			var oneDay = "'http://i.imgur.com/jFJhXvL.png'); width: 250px; height: 1600px;"
		}else if(day == "Friday"){
			var oneDay = "'./images/fridayC.jpg'); width: 250px; height: 1600px;"
		}else{
		}
	}else if(letter == "D"){
		if(day == "Monday"){
			var oneDay = "'http://i.imgur.com/Y62VQLU.png'); width: 250px; height: 1600px; background-position: -146px 0px;"
			// var twoDay = "'./images/tuesdayE.jpg'); width: 250px; height: 1600px;"
			// var threeDay = "'./images/wednesdayF.jpg'); width: 250px; height: 1600px;"
			// var fourDay = "'./images/thursdayA.jpg'); width: 250px; height: 1600px;"
			// var fiveDay = "'./images/fridayB.jpg'); width: 250px; height: 1600px;"
		}
		if(day == "Tuesday"){
			var oneDay = "'./images/tuesdayD.jpg'); width: 250px; height: 1600px;"
		}else if(day == "Wednesday"){
			var oneDay = "'http://i.imgur.com/xnRG6Yk.png'); width: 250px; height: 1600px;"
		}else if(day == "Thursday"){
			var oneDay = "'http://i.imgur.com/Jlahli7.png'); width: 250px; height: 1600px;"
		}else if(day == "Friday"){
			var oneDay = "'http://i.imgur.com/jFJhXvL.png'); width: 250px; height: 1600px;"
		}else{
		}
	}else if(letter == "E"){
		if(day == "Monday"){
			var oneDay = "'./images/mondayE.jpg'); width: 250px; height: 1600px; background-position: -146px 0px;"
			// var twoDay = "'./images/tuesdayF.jpg'); width: 250px; height: 1600px;"
			// var threeDay = "'./images/wednesdayA.jpg'); width: 250px; height: 1600px;"
			// var fourDay = "'./images/thursdayB.jpg'); width: 250px; height: 1600px;"
			// var fiveDay = "'./images/fridayC.jpg'); width: 250px; height: 1600px;"
		}
		if(day == "Tuesday"){
			var oneDay = "'http://i.imgur.com/Y62VQLU.png'); width: 250px; height: 1600px;"
		}else if(day == "Wednesday"){
			var oneDay = "'./images/wednesdayE.jpg'); width: 250px; height: 1600px;"
		}else if(day == "Thursday"){
			var oneDay = "'http://i.imgur.com/xnRG6Yk.png'); width: 250px; height: 1600px;"
		}else if(day == "Friday"){
			var oneDay = "'http://i.imgur.com/Jlahli7.png'); width: 250px; height: 1600px;"
		}else{
		}
	}else if(letter == "F"){
		if(day == "Monday"){
			var oneDay = "'http://i.imgur.com/jFJhXvL.png'); width: 250px; height: 1600px; background-position: -146px 0px;"
			// var twoDay = "'./images/tuesdayA.jpg'); width: 250px; height: 1600px;"
			// var threeDay = "'./images/wednesdayB.jpg'); width: 250px; height: 1600px;"
			// var fourDay = "'./images/thursdayC.jpg'); width: 250px; height: 1600px;"
			// var fiveDay = "'./images/fridayD.jpg'); width: 250px; height: 1600px;"
		}
		if(day == "Tuesday"){
			var oneDay = "'./images/tuesdayF.jpg'); width: 250px; height: 1600px;"
		}else if(day == "Wednesday"){
			var oneDay = "'http://i.imgur.com/Y62VQLU.png'); width: 250px; height: 1600px;"
		}else if(day == "Thursday"){
			var oneDay = "'./images/thursdayF.jpg'); width: 250px; height: 1600px;"
		}else if(day == "Friday"){
			var oneDay = "'http://i.imgur.com/xnRG6Yk.png'); width: 250px; height: 1600px;"
		}else{
		}
	}else if(letter == "no school"){
		var oneDay = "'');"
	}else{
		console.log('Letter error');
	}

	// console.log(letter);
	// console.log(date);
	// console.log(oneDay);

	var vars = { // Going to only display ONE day at a time
				// Don't feel like trying to make this work for such a soon to be useless project.
		date: date,
		letter: letter,
		dayOne: oneDay
	};

	//////////////////////
	/// File Rendering ///
	//////////////////////

	fs.readFile('./templates/homepage.html', function(err, data) {
		if (err) throw err;
		var html = mustache.to_html(data.toString(), vars);

		callback(html);
	});
}

app.get('/', function(req, res){
	var currDate = moment("11/07/2016", "MM/DD/YYYY").format("MM/DD/YYYY"); // TEST DATE
	// var currDate = moment().format("MM/DD/YYYY"); // Set it to this when actually running  
	// Gets current date everytime get/ to check to see if newLetter needs to be run

	if(oldDate != currDate){ // If the date that was init. does NOT match the acutal current date
		
		newLetter(currDate, function(newLetter){
			oldDate = currDate; // Sets old date to the new date

			// Need to add func. To get the next X letters/dates

			if(letter != newLetter){
				letter = newLetter;
				// console.log('get/')
				// console.log(letter);

				logic(oldDate, letter, function(html){
					currHtml = html; // Sets current Html to new html based off letter and date

					res.send(currHtml); // Sends mustache rendered html
				}); 
			}

		});

	}else{
		// If the dates are the same send the pre-rendered html
		res.send(currHtml);
	}

});



app.listen(8080);
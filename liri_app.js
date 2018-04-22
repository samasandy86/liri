// 
const fs = require("fs");
const request = require("request");
require("dotenv").config();
const keys = require("./keys.js")
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");

let twitter = new Twitter(keys.twitter);
let spotify = new Spotify(keys.spotify);

const argv2 = process.argv[2];
let argv3 = process.argv[3];






function argumentSelector(argv2, argv3) {

	switch (argv2) {
		case "my-tweets":
			myTweets();
			break;

		case "do-what-it-says":
			doWhatItSays();
			break;

		case "spotify-this-song":
			spotifyThisSong(argv3);
			break;

		case "movie-this":
			movieThis(argv3);
			break;



	}
}
// <------------FUNCTIONS--------------->

// Movie function, uses the Request module to call the OMDB api
function movieThis(arg) {
	if (arg === undefined) {
		arg = "shawshank";
	}


	request(`http://www.omdbapi.com/?t=${arg}&y=&plot=short&apikey=trilogy`, function (error, response, body) {
		if (!error && response.statusCode == 200) {

			let movieObject = JSON.parse(body);

			let movieResults =
				console.log("------------------------------ Start Movie Results ------------------------------" + "\r\n")
			console.log("Title: " + movieObject.Title + "\n\n")

			if (movieObject.Title === undefined) {
				console.log("Check your spelling playa!")
			} else {
				console.log("Year: " + movieObject.Year + "\n\n")
				console.log("Imdb Rating: " + movieObject.imdbRating + "\n\n")
				console.log("Country: " + movieObject.Country + "\n\n")
				console.log("Language: " + movieObject.Language + "\n\n")
				console.log("Plot: " + movieObject.Plot + "\n\n")
				console.log("Actors: " + movieObject.Actors + "\n\n")
				console.log("------------------------------ END ------------------------------" + "\r\n");
			}
			// console.log(movieResults);
			// log(movieResults); // calling log function
		} else {
			console.log("Error :" + error);
			return;
		}
	});
};
//TWITTER FUNCTION
function myTweets() {
	twitter.get('statuses/user_timeline', function (error, tweets) {
		if (error) throw error;
		for (i = 0; i < tweets.length; i++) {
			console.log(tweets[i].text)
			console.log(tweets[i].created_at)
			console.log(tweets[i].source)
		}

	});
}

//SPOTIFY FUNCTION
function spotifyThisSong(arg) {
	spotify.search({ type: 'track', query: arg }, function (err, response) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}

		//Song information variable
		
		let song = response.tracks.items

		for (i = 0; i < song.length; i++) {
		
			console.log(song[i].artist);
		}

	
	});
}

argumentSelector(argv2, argv3)




// // If the "total" function is called...
// function showTweets() {

//   // We will read the existing bank file
//   fs.readFile("bank.txt", "utf8", function (err, data) {
//     if (err) {
//       return console.log(err);
//     }

//     // Break down all the numbers inside
//     data = data.split(", ");
//     var result = 0;

//     // Loop through those numbers and add them together to get a sum.
//     for (var i = 0; i < data.length; i++) {
//       if (parseFloat(data[i])) {
//         result += parseFloat(data[i]);
//       }
//     }

//     // We will then print the final balance rounded to two decimal places.
//     console.log("You have a total of " + result.toFixed(2));
//   });
// }

// // If the "Deposit" function is called...
// function deposit() {

//   // We will add the value to the bank file.
//   fs.appendFile("bank.txt", ", " + value, function (err) {
//     if (err) {
//       return console.log(err);
//     }
//   });

//   // We will then print the value that was added (but we wont print the total).
//   console.log("Deposited " + value + ".");
// }

// // If the "Withdraw" function is called
// function withdraw() {

//   // We will add a negative value to the bank file.
//   fs.appendFile("bank.txt", ", -" + value, function (err) {
//     if (err) {
//       return console.log(err);
//     }
//   });

//   // We will then print the value that was subtracted (but we wont print the total).
//   console.log("Withdrew " + value + ".");
// }


// // If the "Lotto" function is called
// function lotto() {

//   // We will subtract 25 cents
//   fs.appendFile("bank.txt", ", -.25", function (err) {
//     if (err) {
//       return console.log(err);
//     }
//   });

//   // Then grab a random number
//   let chance = Math.floor((Math.random() * 10) + 1);

//   // If the random number equals 1...
//   if (chance === 1) {

//     // We will then add $2 to the account.
//     fs.appendFile("bank.txt", ", 2", function (err) {
//       if (err) {
//         return console.log(err);
//       }
//     });

//     // And tell the user the amount was added.
//     console.log("Congrats you won the lottery!");

//     // Otherwise we will tell them they lost 25 cents.
//   }
//   else {
//     console.log("Sorry. You just lost 25 cents. Maybe you should get a job instead.");
//   }
// }

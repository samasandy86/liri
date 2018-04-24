<<<<<<< HEAD

const fs = require('fs'); 
const request = require('request');
const dotenv = require("dotenv").config();
const keys = require("./keys.js");
let Twitter = require("twitter");
let Spotify = require('node-spotify-api');

// Grabs the command from the terminal
let command = process.argv[2];
let searchValue = "";

// Puts together the search value into one string
for (let i = 3; i < process.argv.length; i++) {
    searchValue += process.argv[i] + " ";
};

// Error Functions 
function errorFunction(respError) {
    if (respError) {
        return console.log("Error occured: ", respError);
     }
};

// For logging to log.txt
function startLog() {
    console.log("\nxxxx Log Started xxxx");
};

function endLog (respError) {
    console.log("xxxx Log Ended xxxx");
};

// -------------------- Twitter my-tweets ----------------------------
function getTweets() {

    // Accesses Twitter Keys
    let twitter = new Twitter(keys.twitter); 
    let twitterHandleInfo = {
        screen_name: 'SullivanSaer',
        count: 20
        };

    twitter.get('statuses/user_timeline', twitterHandleInfo, function(respError, tweets, response) {

        fs.appendFile("log.txt", "-----Tweets Log Entry Start-----\n\nProcessed at: \n" + Date() + "\n\n" + "terminal commands: \n" + process.argv + "\n\n" + "Data Output: \n\n", startLog());

        console.log("\n-------------- Sullivan's Latest Tweets --------------\n");

        for (i = 0; i < tweets.length; i++) {
            console.log(i + 1 + ". Tweet: ", tweets[i].text);

            // For alingment once the number of the tweet is 10 or higher
            if (i + 1 > 9) {
                console.log("    Tweeted on: ", tweets[i].created_at + "\n");
            } else {
                console.log("   Tweeted on: ", tweets[i].created_at + "\n");
            }  
            
            fs.appendFile("log.txt", (i + 1) + ". Tweet: " + tweets[i].text + "\nTweeted on: " + tweets[i].created_at + "\n\n");
        };

        console.log("--------------------------------------------------\n");

        fs.appendFile("log.txt", "-----Tweets Log Entry End-----\n\n", endLog());
    });
};

// ======================= Spotify spotify-this-song ============================
function searchSong(searchValue) {

    // Default search value if no song is given
    if (searchValue == "") {
        searchValue = "What Is Love";
    }

    // Accesses Spotify keys  
    let spotify = new Spotify(keys.spotify);

    let searchLimit = "";

    // Allows the user to input the number of returned spotify results, defaults 1 return if no input given
    if (isNaN(parseInt(process.argv[3])) == false) {
        searchLimit = process.argv[3];

        console.log("\nYou requested to return: " + searchLimit + " songs");
        
        // Resets the searchValue to account for searchLimit
        searchValue = "";
        for (let i = 4; i < process.argv.length; i++) {        
            searchValue += process.argv[i] + " ";
        };

    } else {
        console.log("\nFor more than 1 result, add the number of results you would like to be returned after spotify-this-song.\n\nExample: if you would like 3 results returned enter:\n     node.js spotify-this-song 3 Kissed by a Rose")
        searchLimit = 1;
    }
   
    // Searches Spotify with given values
    spotify.search({ type: 'track', query: searchValue, limit: searchLimit }, function(respError, response) {

        fs.appendFile("log.txt", "-----Spotify Log Entry Start-----\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n", startLog());

        

        let songResp = response.tracks.items;

        for (let i = 0; i < songResp.length; i++) {
            console.log("\n=============== Spotify Search Result "+ (i+1) +" ===============\n");
            console.log(("Artist: " + songResp[i].artists[0].name));
            console.log(("Song title: " + songResp[i].name));
            console.log(("Album name: " + songResp[i].album.name));
            console.log(("URL Preview: " + songResp[i].preview_url));
            console.log("\n=========================================================\n");

            fs.appendFile("log.txt", "\n========= Result "+ (i+1) +" =========\nArtist: " + songResp[i].artists[0].name + "\nSong title: " + songResp[i].name + "\nAlbum name: " + songResp[i].album.name + "\nURL Preview: " + songResp[i].preview_url + "\n=============================\n");
        }

        fs.appendFile("log.txt","-----Spotify Log Entry End-----\n\n", endLog());
    })
};

// ++++++++++++++++++++ OMDB movie-this +++++++++++++++++++++++++
function searchMovie(searchValue) {

    // Default search value if no movie is given
    if (searchValue == "") {
        searchValue = "Paid In Full";
    }

    let queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(respError, response, body) {

        fs.appendFile("log.txt", "-----OMDB Log Entry Start-----\n\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n\n", startLog());


        if (JSON.parse(body).Error == 'Movie not found!' ) {

            console.log("\nI'm sorry, I could not find any movies that matched the title " + searchValue + ". Please check your spelling and try again.\n")

            fs.appendFile("log.txt", "I'm sorry, I could not find any movies that matched the title " + searchValue + ". Please check your spelling and try again.\n\n-----OMDB Log Entry End-----\n\n", endLog());
        
        } else {

            movieBody = JSON.parse(body);

            console.log("\n++++++++++++++++ OMDB Search Results ++++++++++++++++\n");
            console.log("Movie Title: " + movieBody.Title);
            console.log("Year: " + movieBody.Year);
            console.log("IMDB rating: " + movieBody.imdbRating);

            // If there is no Rotten Tomatoes Rating
            if (movieBody.Ratings.length < 2) {

                console.log("There is no Rotten Tomatoes Rating for this movie.")

                fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: There is no Rotten Tomatoes Rating for this movie \nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n");
                
            } else {

                console.log("Rotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value);

                fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value + "\nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n");
            }
            
            console.log("Country: " + movieBody.Country);
            console.log("Language: " + movieBody.Language);
            console.log("Plot: " + movieBody.Plot);
            console.log("Actors: " + movieBody.Actors);
            console.log("\n+++++++++++++++++++++++++++++++++++++++++++++++++\n");
            console.log("xxxx Log Ended xxxx");
        };      
    });
};

// xxxxxxxxxxxxxxxxxx Random do-what-it-says xxxxxxxxxxxxxxxxxxxxxx
function randomSearch() {

    fs.readFile("random.txt", "utf8", function(respError, data) {

        let randomArray = data.split(", ");

     

        if (randomArray[0] == "spotify-this-song") {
            searchSong(randomArray[1]);
        } else if (randomArray[0] == "movie-this") {
            searchMovie(randomArray[1]);
        } else if(randomArray[0] == "my-tweets") {
            getTweets(randomArray[1]);
        } else {
            errorFunction();
        }
    });
};

// <<<<<<<<<<<<<<<<< Main Switch Case >>>>>>>>>>>>>>>>>>>>

// Runs corresponding function based on user command
switch (command) {
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        searchSong(searchValue);
        break;
    case "movie-this":
        searchMovie(searchValue);
        break;
    case "do-what-it-says":
        randomSearch();
        break;
    default:
        console.log(`"\nI'm sorry, " + command + " is not a command that I recognize. Please try one of the following commands: 
        \n\n  1. For a random search: node liri.js do-what-it-says 
        \n\n  2. To search a movie title: node liri.js movie-this (with a movie title following) 
        \n\n  3. To search Spotify for a song: node liri.js spotify-this-song (*optional number for amount of returned results) (specify song title)\n     Example: node liri.js spotify-this-song Thong Song
        \n\n  4. To see the last 20 of Sullivan Saer Sandy  tweets on Twitter: node liri.js my-tweets \n"`);
};
=======
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
>>>>>>> 9b47533308f35d924e71f3a348b89dd361117608

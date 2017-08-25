var fs = require("fs");
console.log('The liri is starting');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var keys = require("./keys.js");
var twitterClient = new Twitter(keys.twitterKeys);
var spotifyClient = new Spotify(keys.spotifyKeys);
var arg = process.argv;
var command = process.argv[2];
var value = process.argv[3];
var movieName = " ";
var songName = " ";
var handle = " ";

for (i = 3; i < arg.length; i++) {
    if (i > 3 && i < arg.length) {
        movieName = movieName + "+" + arg[i];
        songName = songName + "+" + arg[i];
        handle = handle + "+" + arg[i]; 
    } else {
        movieName += arg[i];
        songName += arg[i];
        handle += arg[i];
    }
}
if (command === 'do-what-it-says'){
    doThing();
}else {
    liriSwitch();
}

function liriSwitch() {
switch (command) {
    case "my-tweets":
        twitter();
        break;
    case "spotify-this-song":
        spotify();
        break;
    case "movie-this":
        omdb();
        break;
    // case "do-what-it-says":
    //     doThing();
    //     break;
    default:
        console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
        break;
}
}
//------------------ Twitter-----------------------------------------
// you make an object that has paramters (params)in it
function twitter() {
    if (process.argv[3] === undefined) {
        handle = 'yoshistunts';
    } 
    
    var params = {
        q: handle, // here giving information of what to search for
        count: 20, // get number of tweets back
        event: 'user_event',
        exclude: 'replies'
    };
    // i am asking twitter to search for tweets
    twitterClient.get('search/tweets', params, showTweets);

    function showTweets(err, tweets, response) { // call back function when the data has been returned from the API
        var tweet = tweets.statuses;
        for (var i = 0; i < tweet.length; i++) {
            console.log("------------------------------------------------");
            console.log(tweet[i].created_at);
            console.log(tweet[i].text + '\n');
            console.log("------------------------------------------------")
            fs.appendFile("log.txt", tweet[i].created_at + ':' + tweet[i].text + '\n')
        }
    };
}
//------------------Spotify-----------------------------------------
function spotify() {
    if (process.argv[3] === undefined) {
    }
    var spotify_params = {
        type: 'track',
        query: songName,
        limit: 1
    };
    spotifyClient.search(spotify_params, spotifySong);

    function spotifySong(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        };
        songInfo = data.tracks.items;
        for (var i = 0; i < songInfo.length; i++) {
            console.log("------------------------------------------------");
            console.log("Artist(s): " + songInfo[i].artists[0].name + '\n');
            console.log("Song: " + songInfo[i].name + '\n');
            console.log("Album that the song is from: " + songInfo[i].album.name + '\n');
            console.log("A preview link of the song from Spotify: ");
            console.log(data.tracks.items[0].album.artists[0].external_urls.spotify);
            console.log("------------------------------------------------")
            fs.appendFile("log.txt", "Artist(s): " + songInfo[i].artists[0].name + '\n')
            fs.appendFile("log.txt", "Song: " + songInfo[i].name + '\n')
            fs.appendFile("log.txt", "Album that the song is from: " + songInfo[i].album.name + '\n')
            fs.appendFile("log.txt", "A preview link of the song from Spotify: " + data.tracks.items[0].album.artists[0].external_urls.spotify + '\n')
        }
    };
}
//------------------OMDB-----------------------------------------
function omdb() {
    if (process.argv[3] === undefined) {
        movieName = "Mr Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
    // Then create a request to the queryUrl
    // ...
    request(queryUrl, function(error, response, body) {
        // If the request is successful
        // ...
        if (!error && response.statusCode === 200) {
            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).

            // Then log the Release Year for the movie
            // ...
            console.log("------------------------------------------------");
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Year Released: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country where movie was produced: " + JSON.parse(body).Country);
            console.log("Movie Language: " + JSON.parse(body).Language);
            console.log("Movie Plot: " + JSON.parse(body).Plot);
            console.log("Movie Actors: " + JSON.parse(body).Actors);
            console.log("------------------------------------------------")

            fs.appendFile("log.txt", "Movie Title: " + JSON.parse(body).Title + '\n')
            fs.appendFile("log.txt", "Year Released: " + JSON.parse(body).Year + '\n')
            fs.appendFile("log.txt", "IMDB Rating: " + JSON.parse(body).imdbRating + '\n')
            fs.appendFile("log.txt", "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + '\n')
            fs.appendFile("log.txt", "Country where movie was produced: " + JSON.parse(body).Country + '\n')
            fs.appendFile("log.txt", "Movie Language: " + JSON.parse(body).Language + '\n')
            fs.appendFile("log.txt", "Movie Plot: " + JSON.parse(body).Plot + '\n')
            fs.appendFile("log.txt", "Movie Actors: " + JSON.parse(body).Actors + '\n')
        }
    });
}
//------------------Do This-----------------------------------------
function doThing() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        } else {
        var dataArr = data.split(",");
        command = dataArr[0];
        value =  dataArr[1];

        // console.log(command);
        // console.log(value);

        if (value === undefined){
        handle = 'yoshistunts';
        songName = 'The+Sign';
        movieName = 'Mr.+Nobody';  
        }else {
        handle = value;
        songName = value;
        movieName = value;    
        }     

        liriSwitch();

        }
    });
}
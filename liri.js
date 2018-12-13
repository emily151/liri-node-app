var dotenv = require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var request = require("request");

var userCommand = process.argv[2];
var userInput = process.argv[3];

var spotify = new Spotify(keys.spotify);

switch (userCommand) {
  case "movie-this":
    movie();
    break;
  case "concert-this":
    concert();
    break;
  case "spotify-this-song":
    spot();
    break;
  default:
    console.log("Use a valid command");
}

function movie() {
  if (!userInput) {
    userInput = "The Lion King";
  }
  request(
    "http://www.omdbapi.com/?t=" + userInput + "&apikey=c8776a55",
    function(err, response, body) {
      console.log("statusCode:", response && response.statusCode);
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("Rating: " + JSON.parse(body).imdbRating);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("error:", err);
    }
  );
}

function concert() {
  request(
    "https://rest.bandsintown.com/artists/" +
      userInput +
      "/events?app_id=9e55ef483bb85ef33dbf17cb3eae2dab",
    function(err, response, body) {
      if (!err && response.statusCode === 200) {
        console.log(response.statusCode);
        console.log(JSON.parse(body));
        for (var i = 0; i < JSON.parse(body).length; i++) {
          var date = JSON.parse(body)[i].datetime;
          console.log("Band: " + JSON.parse(body)[i].lineup[0]);
          console.log("Venue: " + JSON.parse(body)[i].venue.name);
          console.log("City: " + JSON.parse(body)[i].venue.city);
          console.log("Date: " + moment(date).format("MM/DD/YYYY"));
        }
      }
    }
  );
}

function spot() {
  if (!userInput) {
    userInput = "High Hopes";
  }

  spotify.search({ type: "track", query: userInput, limit: 1 }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    var songData = data.tracks.items;

    console.log("Artist: " + songData[0].artists[0].name);
    console.log("Name of song: " + songData[0].name);
    console.log("Album: " + songData[0].album.name);
    console.log("Link: " + songData[0].album.external_urls.spotify);
  });
}

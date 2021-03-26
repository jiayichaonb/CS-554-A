const express = require("express");
const app = express();
const configRoutes = require("./routes");
const data = require("./data");
const movieData = data.movies;

const a = movieData.getAllmovies();
console.log(a);

//The first middleware
let totalRequests = 0;
app.use(async (req, res, next) => {
  console.log("*********************");
	totalRequests++;
	console.log(`There have been ${totalRequests} requests made to the server`);
	next();
});

//The Second middleware
app.use(function(req, res, next) {

  console.log("request body: ", req.body);
  console.log("request url path: ", req.originalUrl);
  console.log("request HTTP verb: ", req.method);
  next();
});

//Third middlieware

const pathsAccessed = {};

app.use(async (req, res, next) => {
	if (!pathsAccessed[req.path]) pathsAccessed[req.path] = 0;

	pathsAccessed[req.path]++;

	console.log(`There have now been ${pathsAccessed[req.path]} requests made to ${req.path}`);
  console.log("All of the requests:\n", pathsAccessed);
  console.log("*********************\n");
  next();
});

app.use(express.json());
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
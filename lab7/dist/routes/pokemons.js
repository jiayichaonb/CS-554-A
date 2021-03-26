"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const data = require("../data");
const movieData = data.movies;
class Pokemons {
    routes(app) {
        app.route('/api/movies/:id').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield movieData.getMovie(req.params.id);
                // res.json(req.params.id);
                res.json(result);
            }
            catch (e) {
                res.json("error in get/_:id route: " + e);
                res.status(404).json({ error: 'movie not found' });
            }
        }));
        app.route('/api/movies').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // if ((req.query.skip && typeof req.query.skip !== "number") || (req.query.take && typeof req.query.take !== "number")) {
                // 	res.status(400).json({ error: 'skip or take must be number' });
                // }
                // let skip = parseInt(req.query.skip);
                // let take = parseInt(req.query.take);
                if (req.query.skip && isNaN(parseInt(req.query.skip.toString()))) {
                    res.status(400).json({ error: 'skip must be number' });
                }
                if (req.query.take && isNaN(parseInt(req.query.take.toString()))) {
                    res.status(400).json({ error: 'take must be number' });
                }
                // if (parseInt(skip)) {
                // }
                // if (skip < 0) res.status(400).json({ error: 'skip cannot be negative' });
                // if (take > 100) take = 100;
                // if (take < 0) res.status(400).json({ error: 'take cannot be negative' });
                // if (take == 0) skip = 100;
                const movieList = yield movieData.getAllmovies(req.query.skip, req.query.take);
                res.json(movieList);
            }
            catch (e) {
                res.status(500).send({ "error": e + " in the get all movies route" });
            }
        }));
        app.route('/api/movies').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            let movieInfo = req.body;
            if (!movieInfo) {
                res.status(400).json({ error: 'You must provide data to update a movie' });
                return;
            }
            if (!movieInfo.title) {
                res.status(400).json({ error: 'You must provide a movie title' });
                return;
            }
            if (typeof movieInfo.title !== "string") {
                res.status(400).json({ error: 'title must be string' });
                return;
            }
            if (!movieInfo.cast) {
                res.status(400).json({ error: 'You must provide cast' });
                return;
            }
            if (!Array.isArray(movieInfo.cast)) {
                res.status(400).json({ error: 'cast must be array' });
                return;
            }
            if (!movieInfo.info) {
                res.status(400).json({ error: 'You must provide the info' });
                return;
            }
            if (typeof movieInfo.info !== "object") {
                res.status(400).json({ error: 'info must be object' });
                return;
            }
            if (!movieInfo.plot) {
                res.status(400).json({ error: 'You must provide the plot' });
                return;
            }
            if (typeof movieInfo.plot !== "string") {
                res.status(400).json({ error: 'plot must be string' });
                return;
            }
            if (!movieInfo.rating) {
                res.status(400).json({ error: 'You must provide the rating' });
                return;
            }
            if (typeof movieInfo.rating !== "number") {
                res.status(400).json({ error: 'rating must be number' });
                return;
            }
            //check if some of parameters are missing
            if (!movieInfo.info.hasOwnProperty('director')) {
                res.status(400).json({ error: 'missing director' });
            }
            if (!movieInfo.info.hasOwnProperty('yearReleased')) {
                res.status(400).json({ error: 'missing yearReleased' });
            }
            //special check of director and year release
            if (typeof movieInfo.info.director != "string") {
                res.status(400).json({ error: 'director must be string' });
            }
            if (typeof movieInfo.info.yearReleased != "number") {
                res.status(400).json({ error: 'yearReleased must be number' });
            }
            if (movieInfo.cast) {
                for (let i of movieInfo.cast) {
                    if (!i.hasOwnProperty('firstName')) {
                        res.status(400).json({ error: 'missing firstName' });
                    }
                    if (typeof i.firstName != "string") {
                        res.status(400).json({ error: 'firstName is not string' });
                    }
                    if (!i.hasOwnProperty('lastName')) {
                        res.status(400).json({ error: 'missing lastName' });
                    }
                    if (typeof i.lastName != "string") {
                        res.status(400).json({ error: 'lastName is not string' });
                    }
                }
                if (movieInfo.cast.length <= 0) {
                    res.status(400).json({ error: 'length of cast cannot be zero or negative' });
                }
            }
            try {
                const newMovie = yield movieData.addMovie(movieInfo.title, movieInfo.cast, movieInfo.info, movieInfo.plot, movieInfo.rating, movieInfo.comments);
                res.json(newMovie);
            }
            catch (e) {
                res.json("error in post route: " + e);
                res.sendStatus(500);
            }
        }));
        app.route('/api/movies/:id').put((req, res) => __awaiter(this, void 0, void 0, function* () {
            let movieInfo = req.body;
            if (!movieInfo) {
                res.status(400).json({ error: 'You must provide data to update a movie' });
                return;
            }
            if (!movieInfo.title) {
                res.status(400).json({ error: 'You must provide a movie title' });
                return;
            }
            if (typeof movieInfo.title !== "string") {
                res.status(400).json({ error: 'title must be string' });
                return;
            }
            if (!movieInfo.cast) {
                res.status(400).json({ error: 'You must provide cast' });
                return;
            }
            if (!Array.isArray(movieInfo.cast)) {
                res.status(400).json({ error: 'cast must be array' });
                return;
            }
            if (!movieInfo.info) {
                res.status(400).json({ error: 'You must provide the info' });
                return;
            }
            if (typeof movieInfo.info !== "object") {
                res.status(400).json({ error: 'info must be object' });
                return;
            }
            if (!movieInfo.plot) {
                res.status(400).json({ error: 'You must provide the plot' });
                return;
            }
            if (typeof movieInfo.plot !== "string") {
                res.status(400).json({ error: 'plot must be string' });
                return;
            }
            if (!movieInfo.rating) {
                res.status(400).json({ error: 'You must provide the rating' });
                return;
            }
            if (typeof movieInfo.rating !== "number") {
                res.status(400).json({ error: 'rating must be number' });
                return;
            }
            //check if some of parameters are missing
            if (!movieInfo.info.hasOwnProperty('director')) {
                res.status(400).json({ error: 'missing director' });
            }
            if (!movieInfo.info.hasOwnProperty('yearReleased')) {
                res.status(400).json({ error: 'missing yearReleased' });
            }
            //special check of director and year release
            if (typeof movieInfo.info.director != "string") {
                res.status(400).json({ error: 'director must be string' });
            }
            if (typeof movieInfo.info.yearReleased != "number") {
                res.status(400).json({ error: 'yearReleased must be number' });
            }
            if (movieInfo.cast) {
                for (let i of movieInfo.cast) {
                    if (!i.hasOwnProperty('firstName')) {
                        res.status(400).json({ error: 'missing firstName' });
                    }
                    if (typeof i.firstName != "string") {
                        res.status(400).json({ error: 'firstName is not string' });
                    }
                    if (!i.hasOwnProperty('lastName')) {
                        res.status(400).json({ error: 'missing lastName' });
                    }
                    if (typeof i.lastName != "string") {
                        res.status(400).json({ error: 'lastName is not string' });
                    }
                }
                if (movieInfo.cast.length <= 0) {
                    res.status(400).json({ error: 'length of cast cannot be zero or negative' });
                }
            }
            try {
                yield movieData.getMovie(req.params.id);
            }
            catch (e) {
                res.status(404).json({ error: 'movie not found' });
                return;
            }
            try {
                const updatedMovie = yield movieData.updateMovie(req.params.id, movieInfo.title, movieInfo.cast, movieInfo.info, movieInfo.plot, movieInfo.rating);
                res.json(updatedMovie);
            }
            catch (e) {
                res.json("error in put route: " + e);
                res.sendStatus(500);
            }
        }));
        app.route('/api/movies/:id').patch((req, res) => __awaiter(this, void 0, void 0, function* () {
            const requestBody = req.body;
            let updatedObject = {
                "title": undefined,
                "cast": undefined,
                "info": undefined,
                "plot": undefined,
                "rating": undefined
            };
            try {
                if (requestBody.title && typeof requestBody.title !== "string") {
                    res.status(400).json({ error: 'title must be string' });
                    return;
                }
                if (requestBody.cast && !Array.isArray(requestBody.cast)) {
                    res.status(400).json({ error: 'cast must be array' });
                    return;
                }
                if (requestBody.info && typeof requestBody.info !== "object") {
                    res.status(400).json({ error: 'info must be object' });
                    return;
                }
                if (requestBody.plot && typeof requestBody.plot !== "string") {
                    res.status(400).json({ error: 'plot must be string' });
                    return;
                }
                if (requestBody.rating && typeof requestBody.rating !== "number") {
                    res.status(400).json({ error: 'rating must be number' });
                    return;
                }
                //check if some of parameters are missing
                if (requestBody.info && !requestBody.info.hasOwnProperty('director')) {
                    res.status(400).json({ error: 'missing director' });
                }
                if (requestBody.info && !requestBody.info.hasOwnProperty('yearReleased')) {
                    res.status(400).json({ error: 'missing yearReleased' });
                }
                //special check of director and year release
                if (requestBody.info && typeof requestBody.info.director != "string") {
                    res.status(400).json({ error: 'director must be string' });
                }
                if (requestBody.info && typeof requestBody.info.yearReleased != "number") {
                    res.status(400).json({ error: 'yearReleased must be number' });
                }
                if (requestBody.cast) {
                    for (let i of requestBody.cast) {
                        if (!i.hasOwnProperty('firstName')) {
                            res.status(400).json({ error: 'missing firstName' });
                        }
                        if (typeof i.firstName != "string") {
                            res.status(400).json({ error: 'firstName is not string' });
                        }
                        if (!i.hasOwnProperty('lastName')) {
                            res.status(400).json({ error: 'missing lastName' });
                        }
                        if (typeof i.lastName != "string") {
                            res.status(400).json({ error: 'lastName is not string' });
                        }
                    }
                    if (requestBody.cast.length <= 0) {
                        res.status(400).json({ error: 'length of cast cannot be zero or negative' });
                    }
                }
                const oldMovie = yield movieData.getMovie(req.params.id);
                if (requestBody.title && requestBody.title !== oldMovie.title)
                    updatedObject.title = requestBody.title;
                if (requestBody.cast && requestBody.cast !== oldMovie.cast)
                    updatedObject.cast = requestBody.cast;
                if (requestBody.info && requestBody.info !== oldMovie.info)
                    updatedObject.info = requestBody.info;
                if (requestBody.plot && requestBody.plot !== oldMovie.plot)
                    updatedObject.plot = requestBody.plot;
                if (requestBody.rating && requestBody.rating !== oldMovie.rating)
                    updatedObject.rating = requestBody.rating;
            }
            catch (e) {
                res.status(404).json({ error: 'movie not found' });
                return;
            }
            try {
                const updatedMovie = yield movieData.updateMovie(req.params.id, updatedObject.title, updatedObject.cast, updatedObject.info, updatedObject.plot, updatedObject.rating);
                res.json(updatedMovie);
            }
            catch (e) {
                res.status(500).json({ error: e + " in the patch route" });
            }
        }));
        app.route('/api/movies/:id/comments').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let thisMovie = yield movieData.getMovie(req.params.id);
            }
            catch (e) {
                res.status(400).json({ error: 'no movie: ' + e });
            }
            const blogCommentData = req.body;
            if (!blogCommentData.name) {
                res.status(400).json({ error: 'You must provide name' });
                return;
            }
            if (!blogCommentData.comment) {
                res.status(400).json({ error: 'You must provide comment' });
                return;
            }
            try {
                const name = blogCommentData.name;
                const comment = blogCommentData.comment;
                const newComment = yield movieData.addComment(name, comment, req.params.id);
                res.json(yield movieData.getMovie(req.params.id));
            }
            catch (e) {
                res.status(500).json({ error: "error in post: " + e });
            }
        }));
        app.route('/api/movies/:movieId/:commentId').delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let remove = yield movieData.removeComment(req.params.movieId, req.params.commentId);
                res.json(remove);
            }
            catch (e) {
                res.status(404).json({ error: e + " in the delete route" });
            }
        }));
    }
}
exports.Pokemons = Pokemons;

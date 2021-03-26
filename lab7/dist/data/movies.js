var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
// import DbClient = require('../config/DbClient');
const uuid = require('uuid');
const { ObjectID } = require('bson');
function addMovie(title, cast, info, plot, rating, comments = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const movieCollection = yield movies();
        let newMovie = {
            "title": title,
            "cast": cast,
            "info": info,
            "plot": plot,
            "rating": rating,
            "comments": comments,
            "_id": uuid.v4()
        };
        newMovie._id = ObjectID();
        const insertInfo = yield movieCollection.insertOne(newMovie);
        if (insertInfo.insertedCount === 0)
            new SyntaxError('add fail');
        const newId = insertInfo.insertedId; //?
        const movie = yield this.getMovie(newId);
        return movie;
    });
}
function getAllmovies(skip = 0, take = 20) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof skip !== "number") {
            // throw new SyntaxError('skip must be number');
            skip = parseInt(skip);
        }
        if (typeof take !== "number") {
            // throw new SyntaxError('take must be number');
            take = parseInt(take);
        }
        if (skip < 0)
            throw new SyntaxError('skip cannot be negative');
        if (take < 0)
            throw new SyntaxError('take cannot be negative');
        if (take == 0)
            skip = 100;
        const movieCollection = yield movies();
        const movie = yield movieCollection.find({}).skip(skip).limit(take).toArray();
        return movie;
    });
}
function getMovie(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw new SyntaxError('You must provide an id to search for');
        // await DbClient.connect()
        // let db: any = await DbClient.client.db('Yichao-Jia-CS554-lab7')
        const movieCollection = yield movies();
        const movie = yield movieCollection.findOne({ _id: ObjectID(id) });
        if (movie === null)
            throw new TypeError('No movie with that id');
        return movie;
    });
}
//@@@
function updateMovie(id, title, cast, info, plot, rating) {
    return __awaiter(this, void 0, void 0, function* () {
        const movieCollection = yield movies();
        const previousMovie = yield this.getMovie(id);
        if (!title) {
            title = previousMovie.title;
        }
        if (!cast) {
            cast = previousMovie.cast;
        }
        if (!info) {
            info = previousMovie.info;
        }
        if (!plot) {
            plot = previousMovie.plot;
        }
        if (!rating) {
            rating = previousMovie.rating;
        }
        let newMovie = {
            "title": title,
            "cast": cast,
            "info": info,
            "plot": plot,
            "rating": rating,
            "comments": previousMovie.comments,
        };
        yield movieCollection.updateOne({ _id: ObjectID(id) }, { $set: newMovie });
        return yield this.getMovie(id);
    });
}
function addComment(name, comment, movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof name !== 'string')
            throw new SyntaxError('name must be string type');
        if (typeof comment !== 'string')
            throw new SyntaxError('comment must be string type');
        const movieCollection = yield movies();
        const newComment = {
            "_id": uuid.v4(),
            "name": name,
            "comment": comment
        };
        newComment._id = ObjectID();
        const movie = yield movieCollection.update({ _id: ObjectID(movieId) }, { $push: { comments: newComment } });
        return movie;
    });
}
function removeComment(movieId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const movieCollection = yield movies();
        if (!movieId)
            throw new SyntaxError('you must provide movie ID');
        if (!commentId)
            throw new SyntaxError('you must provide comment ID');
        try {
            const thisMovie = yield movieCollection.findOne({ _id: ObjectID(movieId) });
            if (!thisMovie)
                throw new SyntaxError('no movie found');
        }
        catch (e) {
            console.log(e);
        }
        try {
            const thisComment = yield movieCollection.findOne({ _id: ObjectID(movieId) }, { comments: { _id: ObjectID(commentId) } });
            if (!thisComment)
                throw new SyntaxError('no comment found');
        }
        catch (e) {
            console.log(e);
        }
        const deleted = yield movieCollection.update({ _id: ObjectID(movieId) }, { $pull: { comments: { _id: ObjectID(commentId) } } });
        if (deleted.result.nModified === 0)
            throw new TypeError(`Cannot find the comment`);
        return yield movieCollection.findOne({ _id: ObjectID(movieId) });
        ;
    });
}
module.exports = {
    firstName: "Yichao",
    lastName: "Jia",
    studentId: "10445934",
    addMovie,
    getAllmovies,
    getMovie,
    updateMovie,
    // removeMovie,
    addComment,
    removeComment
    // addCommentToMovie,
    // removeCommentFromMovie
};

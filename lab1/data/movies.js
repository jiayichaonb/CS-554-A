const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;

const uuid = require('uuid');
const { ObjectID } = require('bson');

async function addMovie(title, cast, info, plot, rating){
    if(!title || !cast || !info || !plot){
        throw "any of inputs can not be null";
    }

    if (!Array.isArray(cast)) throw 'You must provide an array of cast';

    if(cast.length <= 0){
        throw "length of cast can not 0 or negative"
    }

    const movieCollection = await movies();

    let newMovie = {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating,
        comments: [],
        _id: uuid.v4()
    }

    newMovie._id = ObjectID();

    const insertInfo = await movieCollection.insertOne(newMovie);
    if (insertInfo.insertedCount === 0) throw 'Could not add movie';

    const newId = insertInfo.insertedId;

    const movie = await this.getMovie(newId);
    return movie;
}

async function getAllmovies(skip, take){
    const movieCollection = await movies();

    const movie = await movieCollection.find({}).skip(skip).limit(take).toArray();

    return movie;
}

async function getMovie(id){
    if (!id) throw 'You must provide an id to search for';
    const movieCollection = await movies();
    const movie = await movieCollection.findOne({_id: ObjectID(id)});
    if (movie === null) throw 'No movie with that id';

    return movie;
}
//@@@
async function updateMovie(id, updatedMovie){
    const movieCollection = await movies();

    const updatedMovieData = {};

    if (updatedMovie.title) {
        updatedMovieData.title = updatedMovie.title;
    }

    if (updatedMovie.cast) {
        updatedMovieData.cast = updatedMovie.cast;
    }

    if (updatedMovie.info) {
        updatedMovieData.info = updatedMovie.info;
    }

    if (updatedMovie.plot) {
        updatedMovieData.plot = updatedMovie.plot;
    }

    if (updatedMovie.rating) {
        updatedMovieData.rating = updatedMovie.rating;
    }

    await movieCollection.updateOne({_id: ObjectID(id)}, {$set: updatedMovieData});

    return await this.getMovie(id);

}


async function addComment(name, comment, movieId) {
    if (typeof name !== 'string') throw 'No name provided';
    if (typeof comment !== 'string') throw 'No comment provided!';

    const movieCollection = await movies();


    const newComment = {
      _id: uuid.v4(),
      name: name,
      comment : comment
    };

    newComment._id = ObjectID();

    const movie = await movieCollection.update({_id: ObjectID(movieId)}, {$push: {comments: newComment}});
    return movie;  
  }

  async function removeComment(movieId, commentId) {

    const movieCollection = await movies();
    
    if(!movieId) throw "need movie ID"
    
    if(!commentId) throw "need comment ID"
    

    try{
        const thisMovie = await movieCollection.findOne({_id: ObjectID(movieId)});
        if(!thisMovie) throw "There is no movie";
    }catch(e){
        console.log(e);
    }

    
    try{
        const thisComment = await movieCollection.findOne({_id: ObjectID(movieId)}, {comments: {_id:ObjectID(commentId)}});
        if(!thisComment) throw "There is no comment"
    }catch(e){
        console.log(e);
    }


    await movieCollection.update({_id: ObjectID(movieId)}, {$pull: {comments: {_id: ObjectID(commentId)}}});
    
    return await movieCollection.findOne({_id: ObjectID(movieId)});;
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


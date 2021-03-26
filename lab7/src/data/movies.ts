const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
// import DbClient = require('../config/DbClient');


const uuid = require('uuid');
const { ObjectID } = require('bson');

interface Movie {
    "title": string,
    "cast": Object[],
    "info": Object,
    "plot": string,
    "rating": number,
    "comments": Object[],
    "_id": string
}

interface Comment {
    "_id": string,
    "name": string,
    "comment": string
}

async function addMovie(title: string, cast: Object[], info: Object, plot: string, rating: number, comments: Object[] = []){
    
    const movieCollection = await movies();

    let newMovie: Movie = {
        "title": title,
        "cast": cast,
        "info": info,
        "plot": plot,
        "rating": rating,
        "comments": comments,
        "_id": uuid.v4()
    }

    newMovie._id = ObjectID();

    const insertInfo = await movieCollection.insertOne(newMovie);
    if (insertInfo.insertedCount === 0) new SyntaxError('add fail');

    const newId = insertInfo.insertedId; //?

    const movie = await this.getMovie(newId);
    return movie;
}

async function getAllmovies(skip: number = 0, take: number = 20){
    
    
    if (typeof skip !== "number") {
        // throw new SyntaxError('skip must be number');
        skip = parseInt(skip);
    }
    if (typeof take !== "number") {
        // throw new SyntaxError('take must be number');
        take = parseInt(take);
    }
    if (skip < 0) throw new SyntaxError('skip cannot be negative');
	if (take < 0) throw new SyntaxError('take cannot be negative');
	if (take == 0) skip = 100;
    const movieCollection = await movies();

    const movie: Object[] = await movieCollection.find({}).skip(skip).limit(take).toArray();

    return movie;
}

async function getMovie(id: string){
    if (!id) throw new SyntaxError('You must provide an id to search for');

    // await DbClient.connect()
    // let db: any = await DbClient.client.db('Yichao-Jia-CS554-lab7')

    const movieCollection = await movies();
    const movie: Movie = await movieCollection.findOne({_id: ObjectID(id)});
    if (movie === null) throw new TypeError('No movie with that id');

    return movie;
}
//@@@
async function updateMovie(id: string, title: string, cast: Object[], info: Object, plot: string, rating: number){
    const movieCollection = await movies();
    const previousMovie: Movie = await this.getMovie(id);


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
    }



    await movieCollection.updateOne({_id: ObjectID(id)}, {$set: newMovie});

    return await this.getMovie(id);

}


async function addComment(name: string, comment: string, movieId: string) {
    if (typeof name !== 'string') throw new SyntaxError('name must be string type');
    if (typeof comment !== 'string') throw new SyntaxError('comment must be string type');

    const movieCollection = await movies();


    const newComment = {
      "_id": uuid.v4(),
      "name": name,
      "comment" : comment
    };

    newComment._id = ObjectID();

    const movie = await movieCollection.update({_id: ObjectID(movieId)}, {$push: {comments: newComment}});
    return movie;  
  }

  async function removeComment(movieId: string, commentId: string) {

    const movieCollection = await movies();
    
    if(!movieId) throw new SyntaxError('you must provide movie ID');
    
    if(!commentId) throw new SyntaxError('you must provide comment ID');
    

    try{
        const thisMovie = await movieCollection.findOne({_id: ObjectID(movieId)});
        if(!thisMovie) throw new SyntaxError('no movie found');
    }catch(e){
        console.log(e);
    }

    
    try{
        const thisComment = await movieCollection.findOne({_id: ObjectID(movieId)}, {comments: {_id:ObjectID(commentId)}});
        if(!thisComment) throw new SyntaxError('no comment found');
    }catch(e){
        console.log(e);
    }


    const deleted = await movieCollection.update({_id: ObjectID(movieId)}, {$pull: {comments: {_id: ObjectID(commentId)}}});
    if (deleted.result.nModified === 0) throw new TypeError(`Cannot find the comment`);


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


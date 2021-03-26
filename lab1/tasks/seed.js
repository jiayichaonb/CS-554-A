const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const movies = data.movies;


async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    
    const createdMovie = await movies.addMovie("Fast & Furious 5", [{firstName: 'Vin', lastName: 'Diesel'}], {director: 'Lin', yearReleased: 2014}, "action", 8);
    // console.log(createdBand);
    const id = createdMovie._id;
    
    await movies.addComment("Yichao", "Unbelievable action movie", id);
    await movies.addComment("Donglin Yang", "Best action movie!", id);
    
 
    

    console.log('Done seeding database');

    await db.serverConfig.close();
}

main();
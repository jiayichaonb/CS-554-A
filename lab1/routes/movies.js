const express = require("express");
const router = express.Router();
const data = require("../data");
const { updateMovie } = require("../data/movies");
const movieData = data.movies;
const commentData = data.comments;

router.get('/:id', async (req, res) => {
	try {
		let result = await movieData.getMovie(req.params.id);
		res.json(result);
	} catch (e) {
		res.status(404).json({ error: 'movie not found' });
	}
});

router.get("/", async (req, res) => {
  try {
	
	let skip = parseInt(req.query.skip);
	let take = parseInt(req.query.take);

	if (isNaN(skip)) skip = 0;
	if (isNaN(take)) take = 20;

	if (skip < 0) res.status(400).json({ error: 'skip cannot be negative' });
	if (take > 100) take = 100;
	if (take < 0) res.status(400).json({ error: 'take cannot be negative' });
	if (take == 0) skip = 100;
    const movieList = await movieData.getAllmovies(skip, take);

    res.json(movieList);
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/', async (req, res) => {
	let movieInfo = req.body;

	if (!movieInfo) {
		res.status(400).json({ error: 'You must provide data to create a movie' });
		return;
	}

	if (!movieInfo.title) {
		res.status(400).json({ error: 'You must provide a title' });
		return;
	}

	if (!movieInfo.cast) {
		res.status(400).json({ error: 'You must provide cast' });
		return;
  }
  
  if (!movieInfo.info) {
		res.status(400).json({ error: 'You must provide the info' });
		return;
  }
  
  if (!movieInfo.plot) {
		res.status(400).json({ error: 'You must provide the plot' });
		return;
  }
  
  if (!movieInfo.rating) {
		res.status(400).json({ error: 'You must provide the rating' });
		return;
	}

	try {
		const newMovie = await movieData.addMovie(movieInfo.title, movieInfo.cast, movieInfo.info, movieInfo.plot, movieInfo.rating);
		res.json(newMovie);
	} catch (e) {
		res.sendStatus(500);
  }
  
});

router.put('/:id', async (req, res) => {
  let movieInfo = req.body;

	if (!movieInfo) {
		res.status(400).json({ error: 'You must provide data to create a movie' });
		return;
	}

	if (!movieInfo.title) {
		res.status(400).json({ error: 'You must provide a movie title' });
		return;
	}

	if (!movieInfo.cast) {
		res.status(400).json({ error: 'You must provide cast' });
		return;
  }
  
  if (!movieInfo.info) {
		res.status(400).json({ error: 'You must provide the info' });
		return;
  }
  
  if (!movieInfo.plot) {
		res.status(400).json({ error: 'You must provide the plot' });
		return;
  }
  
  if (!movieInfo.rating) {
		res.status(400).json({ error: 'You must provide the rating' });
		return;
	}

	try {
		await movieData.getMovie(req.params.id);
	} catch (e) {
		res.status(404).json({ error: 'movie not found' });
		return;
	}
	try {
		const updatedMovie = await movieData.updateMovie(req.params.id, movieInfo);
		res.json(updatedMovie);
	} catch (e) {
		res.sendStatus(500);
	}
});

router.patch('/:id', async (req, res) => {
	const requestBody = req.body;
	let updatedObject = {};
	try {
		const oldMovie = await movieData.getMovie(req.params.id);
		if (requestBody.title && requestBody.title !== oldMovie.title) updatedObject.title = requestBody.title;
		if (requestBody.cast && requestBody.cast !== oldMovie.cast) updatedObject.cast = requestBody.cast;
        if (requestBody.info && requestBody.info !== oldMovie.info) updatedObject.info = requestBody.info;
        if (requestBody.plot && requestBody.plot !== oldMovie.plot) updatedObject.plot = requestBody.plot;
        if (requestBody.rating && requestBody.rating !== oldMovie.rating) updatedObject.rating = requestBody.rating;
	} catch (e) {
		res.status(404).json({ error: 'movie not found' });
		return;
	}

	try {
		const updatedMovie = await movieData.updateMovie(req.params.id, updatedObject);

		res.json(updatedMovie);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.post('/:id/comments', async (req, res) => {
    try {
            let thisMovie = await movieData.getMovie(req.params.id);
        } catch (e) {
            res.status(400).json({ error: 'no movie' });
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
		const newComment = await movieData.addComment(name, comment, req.params.id);

		res.json(await movieData.getMovie(req.params.id));
	} catch (e) {
		res.status(500).json({ error: "error in post" });
	}
});

router.delete('/:movieId/:commentId', async (req, res) => {
	


	try {
		let remove = await movieData.removeComment(req.params.movieId, req.params.commentId);
		
		res.json(remove);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

module.exports = router;
const express = require('express');
const router = express.Router();
const data = require('../data');

router.get('/', async (req, res) => {
  try {

  } catch (e) {
    console.log(e);
  }
});

router.post('/removeASong', async (req, res) => {
  console.log(req.body)
  try {
    const songId = req.body.songId.toString();
    await data.songs.deleteASong(songId);
    console.log("done1");
    res.status(200);
  } catch (e) {
    console.log({error: e})
  }
});


module.exports = router;
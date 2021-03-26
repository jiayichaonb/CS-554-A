const express = require('express');
const router = express.Router();
const data = require('../data');
const bcrypt = require('bcryptjs');
const xss = require('xss');
const multer = require('multer');
const gm = require('gm').subClass({imageMagick: true});
const nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, "profileImage." + file.mimetype.split('/')[1])
  }
});
const upload = multer({
  storage: storage,
  limit: {fileSize: 100000}
}).single("myImg");


async function getUserByEmail(email) {
  const userList = await data.users.getUsers();
  const lowerEmail = email.toLowerCase();
  for (var i = 0; i < userList.length; i++) {
    if (userList[i].email === lowerEmail) {
      return userList[i];
    }
  }
  throw `No user found`;
}

router.post('/signup', async (req, res) => {
  try {

    let mailOption = {
      from: 'webkiller554@gmail.com',
      to: req.body.email,
      subject: 'sign up success!',
      text: 'Hi! You account number is: ' + req.body.email + ' Sign up successfully (from web-killer-spotify)'
    };

    await transporter.sendMail(mailOption, function (err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log('email sent!');
      }
    });
    res.json({message: 'sign up successfully!'});
  } catch (e) {
    console.log(e);
  }
});

router.post('/add', async (req, res) => {
  try {
    const newUser = await data.users.addUser(xss(req.body.firstName), xss(req.body.lastName), xss(req.body.gender),
        xss(req.body.email), xss(req.body.password));
    res.json(newUser);
  } catch (e) {
    console.log('error: ' + e);
    res.status(500).json(e);
  }
});

router.post('/login', async (req, res) => {

  try {
    let user = await getUserByEmail(req.body.email);
    let flag = await bcrypt.compare(req.body.password, user.password);
    // console.log(user)
    // console.log(user._id)
    if (flag) {
      // req.session.loginOrNot = true;
      // req.session.userEmail = user.email;
      res.json(user);
    } else {
      res.status(500).json("error: the email or password is wrong");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});


router.post('/addsong', async (req, res) => {
  try {
    let newSong = {
      title: req.body.title,
      artist: req.body.artist,
      artistId: req.body.artistId,
      albumName: req.body.albumName,
      albumId: req.body.albumId,
      playUrl: req.body.playUrl,
      songId: req.body.songId
    };
    const user = await getUserByEmail(req.body.userEmail);

    //add song to song list
    const songId = await data.songs.addSong(newSong.title, newSong.artist, newSong.artistId, newSong.albumName, newSong.albumId, newSong.playUrl, newSong.songId);
    //add song to user favorite song list
    await data.users.addSongToUser(user._id.toString(), songId.toString());

    res.status(200).json(newSong)
  } catch (e) {
    console.log({error: e})
  }
});

router.post('/favoriteSongs', async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.userEmail);
    res.status(200).json(user.likedSongs)
  } catch (e) {
    console.log({error: e})
  }
});

router.post('/removeSong', async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.userEmail);
    const userId = user._id.toString();
    await data.users.removeSongFromUser(userId, req.body.songId.toString());
    console.log("done")
    res.status(200);
  } catch (e) {
    console.log({error: e})
  }
});

router.post('/addImg', upload, async (req, res) => {
  gm(req.file.path)
      .blur(8, 1)
      .write('client/src/img/profileImage.jpeg', function (err) {
        if (err) {
          console.log(err)
        }
      })
});


router.post('/getUser', async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.userEmail);
    res.status(200).json(user)
  } catch (e) {
    console.log({error: e})
  }
});


router.post('/updateUser', async (req, res) => {
  console.log(req.body);
  let updateObj = {
    firstName: req.body.firstName,

    lastName: req.body.lastName,
    gender: req.body.gender,
  };
  try {
    const user = await getUserByEmail(req.body.userEmail);
    const userId = user._id.toString();
    await data.users.updateUserDelta(userId, updateObj);
    res.status(200)
  } catch (e) {
    console.log({error: e})
  }
});

module.exports = router;

const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const songs = mongoCollections.songs;
const {ObjectId} = require('mongodb');
const songsUtil = require('./songs');
const bcrypt = require('bcryptjs');

function check(obj) {
  let flag = true;
  let firstName = obj.firstName;
  let lastName = obj.lastName;
  let gender = obj.gender;
  let email = obj.email;
  let password = obj.password;

  if (firstName) {
    if (typeof firstName !== 'string') {
      flag = false;
    }
  }
  if (lastName) {
    if (typeof lastName !== 'string') {
      flag = false;
    }
  }
  if (gender) {
    if (typeof gender !== 'string') {
      flag = false;
    }
  }
  if (email) {
    if (typeof email !== 'string') {
      flag = false;
    }
  }
  if (password) {
    flag = false;
  }
  return flag;
}

async function validation(name, regExp) {
  return regExp.test(name);
}

async function checkUserExists(email) {
  const userCollection = await users();
  const lowerCaseEmail = email.toLowerCase();
  const user = await userCollection.findOne({email: lowerCaseEmail});
  //console.log(user);
  return user == null;
}

// addUser('jianshuo', 'yang', 'male', '123@qq.com');
async function addUser(firstName, lastName, gender, email, password) {
  if (!firstName) throw `first name cannort be null`;
  if (typeof firstName !== 'string') throw `invalid first name`;


  if (!lastName || typeof lastName !== 'string') throw `invalid last name`;
  if (!gender || typeof gender !== 'string') throw `invalid gender input`;
  if (!email || typeof email !== 'string') throw `invalid email input`;
  if (!password || typeof password !== 'string') throw `invalid password input`;

  var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const flag1 = await validation(email, emailReg);
  const flag2 = await checkUserExists(email);

  if (!flag1 || !flag2) {
    throw `invalid email input`;
  }
  const hashed = await bcrypt.hash(password, 5);

  const userCollection = await users();
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    email: email,
    password: hashed,
    likedSongs: []
  }

  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw `Can't add user`;
  return await getUserById(insertInfo.insertedId.toString());
}

async function getUserById(id) {
  if (!id || typeof id !== 'string') throw `invalid id input`;
  const objId = ObjectId.createFromHexString(id);
  const userCollection = await users();
  const res = await userCollection.findOne({_id: objId});
  if (!res) throw `No user found`;
  return res;
}

async function getUsers() {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  if (!userList) throw `No users exist in database`;
  return userList;
}

// update works
async function updateUserDelta(id, deltasObj) {
  if (!id || typeof id !== 'string') throw `invalid id input`;
  if (!deltasObj || typeof deltasObj !== 'object') throw `invalid object input`;
  if (check(deltasObj) === false) throw `invalid object input or you can't change your password`;

  let userToBeUpdated = await getUserById(id);

  Object.assign(userToBeUpdated, deltasObj);
  const userCollection = await users();
  const objId = ObjectId.createFromHexString(id);
  const updateInfo = await userCollection.updateOne({_id: objId}, {$set: userToBeUpdated});
  if (updateInfo.modifiedCount === 0) throw `Update failed`;
  return await getUserById(id);
}

async function deleteUser(id) {
  if (!id || typeof id !== 'string') throw `invalid id input`;
  const objId = ObjectId.createFromHexString(id);
  const userCollection = await users();
  const deletionInfo = await userCollection.removeOne({_id: objId});
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete user with id of ${id}`;
  }
}

async function addSongToUser(id, songId) {
  if (!id || typeof id !== 'string') throw 'invalid id';
  if (!songId || typeof songId !== 'string') throw 'invalid song id';

  const objId = ObjectId.createFromHexString(id);
  const songObj = await songsUtil.getSongById(songId);
  let newSong = {
    id: songObj._id,
    title: songObj.title,
    artist: songObj.artist,
    artistId: songObj.artistId,
    albumName: songObj.albumName,
    albumId: songObj.albumId,
    comments: songObj.comments,
    playUrl: songObj.playUrl,
    songId: songObj.songId
  };
  const userCollection = await users();
  await userCollection.updateOne({_id: objId}, {$addToSet: {likedSongs: newSong}});
}

async function removeSongFromUser(id, songId) {
  if (!id || typeof id !== 'string') throw 'invalid id';
  if (!songId || typeof songId !== 'string') throw 'invalid song id';

  const objId = ObjectId.createFromHexString(id);
  const objId2 = ObjectId.createFromHexString(songId);
  const userCollections = await users();
  const updateInfo = await userCollections.updateOne({_id: objId}, {$pull: {likedSongs: {id: objId2}}});
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'delete song from user failed';

  const songCollections = await songs();
  const deleteInfo = await songCollections.removeOne({_id: objId2});
  if (deleteInfo.deletedCount === 0) {
    throw `Could not delete the comment with id of ${objId2}`;
  }
}

module.exports = {
  addUser,
  getUserById,
  getUsers,
  updateUserDelta,
  deleteUser,
  addSongToUser,
  removeSongFromUser
}

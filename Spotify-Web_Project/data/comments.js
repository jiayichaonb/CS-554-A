const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const {ObjectId} = require('mongodb');

async function addComment(name, comment) {

  if (typeof name !== 'string' || !name) throw 'You must provide a name or its invalid type';
  if (typeof comment !== "string" || !comment) throw `You must provide a comment`;
  const commentCollections = await comments();

  const newComment = {
    name: name,
    comment: comment
  };
  const InsertInfo = await commentCollections.insertOne(newComment);
  return InsertInfo.insertedId;
}

async function getCommentById(id) {

  if (!id || typeof id !== 'string') throw 'You must provide an id to get an comment or its a invalid type param';
  const commentCollections = await comments();
  const objId = ObjectId.createFromHexString(id);
  const comment = await commentCollections.findOne({_id: objId});
  if (!comment) throw 'Comment not found!';
  return comment;

}

module.exports = {
  addComment,
  getCommentById
}

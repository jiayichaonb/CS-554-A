const axios = require('axios').default;

export default async function addSong(songObj) {
  try {
    let newSong = {
      userEmail: window.sessionStorage.userEmail,
      title: songObj.title,
      artist: songObj.artist,
      artistId: songObj.artistId,
      albumName: songObj.albumName,
      albumId: songObj.albumId,
      playUrl: songObj.playUrl,
      songId: songObj.songId
    }
    await axios.post('http://localhost:5000/users/addsong', newSong);
  } catch (e) {
    console.log({error: e})
  }
}

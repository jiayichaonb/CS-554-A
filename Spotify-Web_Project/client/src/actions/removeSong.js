const axios = require('axios').default;

export default async function removeSong(songId) {
    let songInfo = {
        userEmail: window.sessionStorage.userEmail,
        songId: songId
    };
    try {
        await axios.post('http://localhost:5000/users/removeSong', songInfo);
        await axios.post('http://localhost:5000/songs/removeASong', songInfo);
        return true;
    } catch(e) {
        console.log({error:e})
    }
}

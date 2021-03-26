const playSong = (song, currentIndex) => {
  return {
    type: 'PLAY_SONG',
    song,
    currentIndex,
  }
};
const toSong = (song) => {
  return {
    type: 'TO_SONG',
    song,
  }
}
const updateIndex = (currentIndex) => {
  return {
    type: 'UPDATE_INDEX',
    currentIndex
  }
}
const stopSong = () => {
  return {
    type: 'STOP_SONG'
  }
}
const pauseSong = () => {
  return {
    type: 'PAUSE_SONG',
  }
};
const resumeSong = () => {
  return {
    type: 'RESUME_SONG'
  }
};
const updateSongList = (songList, track) => {
  return {
    type: 'UPDATE_SONG_LIST',
    songList,
    track,
  }
};

module.exports = {
  playSong,
  stopSong,
  pauseSong,
  resumeSong,
  updateSongList,
  updateIndex,
  toSong
};

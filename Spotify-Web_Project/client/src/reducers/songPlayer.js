const initalState = {
  playing: false,
  playTime: 0,
  song: '',
  //Pause: true,
  globalPlay: false,
  songList: [],
  currentIndex: 0

}
let copyState = null
const songPlayer = (state = initalState, action) => {
  const {type, song, songList, currentIndex, track} = action;

  switch (type) {
    case "PLAY_SONG":
      copyState = JSON.parse(JSON.stringify(state))
      copyState.globalPlay = true;
      copyState.song = song;
      copyState.playing = true;
      copyState.currentIndex = currentIndex;
      console.log(copyState);
      return copyState

    case "TO_SONG":
      copyState = JSON.parse(JSON.stringify(state))
      copyState.globalPlay = false;
      copyState.song = song;
      copyState.playing = true;
      copyState.currentIndex = currentIndex;
      return copyState

    case "STOP_SONG":
      copyState = JSON.parse(JSON.stringify(state));
      copyState.globalPlay = false;
      copyState.playing = false;
      return copyState;

    case "PAUSE_SONG":
      copyState = JSON.parse(JSON.stringify(state));
      copyState.globalPlay = false;
      copyState.playing = false;
      return copyState;


    case "RESUME_SONG":
      copyState = JSON.parse(JSON.stringify(state));
      copyState.globalPlay = true;
      copyState.playing = true;
      return copyState;

    case "UPDATE_SONG_LIST":
      copyState = JSON.parse(JSON.stringify(state))
      copyState.songList = songList;
      copyState.track = track;
      return copyState

    case "UPDATE_INDEX":
      copyState = JSON.parse(JSON.stringify(state))
      copyState.currentIndex = currentIndex;
      return copyState

    case "INCREASE_SONG_TIME":
      return {
        ...state,
        timeElapsed: action.time
      };
    default:
      return state;
  }
};
export default songPlayer;

import { combineReducers } from 'redux';
import songPlay from './songPlayer';

const rootReducer = combineReducers({
  songsPlay: songPlay
});

export default rootReducer;
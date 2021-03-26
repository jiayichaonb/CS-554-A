import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {Link} from '@material-ui/core'
import playAction from '../actions/playAction'
import removeSong from "../actions/removeSong";
import {useDispatch, useSelector} from 'react-redux';

const axios = require('axios').default;

const columns = [
  {id: 'play', label: 'Play', align: 'center', minWidth: 100},
  {id: 'title', label: 'Title', align: 'center', minWidth: 100},
  {id: 'artist', label: 'Artist', align: 'center', minWidth: 100},
  {
    id: 'albumName',
    label: 'Album Name',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'remove',
    label: 'Remove',
    minWidth: 100,
    align: 'center',
  }
];

const useStyles = makeStyles({
  root: {
    width: '100%',
    marginBottom: '300px',
    //minHeight: 1200,
  },
  container: {
    //minHeight: 700,
    height: 'auto',
  },
});
const LikedPage = () => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [favoriteSongList, SetFavoriteSongList] = useState(undefined);
  const [dataSize, SetDatSie] = useState(0);
  const [loading, SetLoading] = useState(true);
  const [error, SetError] = useState(false);
  const [play, setPlay] = useState(false);
  const allState = useSelector((state) => state);
  const songsPlay = allState.songsPlay;
  const songR = allState.songsPlay.song;
  const dispatch = useDispatch();

  async function getFavoriteSongs() {
    try {
      const userInfo = {
        userEmail: window.sessionStorage.userEmail
      };
      const favoriteSongs = await axios.post('http://localhost:5000/users/favoriteSongs', userInfo);
      let newFavoriteSongs = [];
      if (favoriteSongs.data) {
        favoriteSongs.data.map(song => {
          let newSongFormat = {
            storedId: song.id,
            track: {
              album: {
                id: song.albumId,
                name: song.albumName,
              },
              artists: [
                {
                  id: song.artistId,
                  name: song.artist
                }
              ],
              name: song.title,
              preview_url: song.playUrl,
              id: song.songId
            },
          };
          newFavoriteSongs.push(newSongFormat)
        })
      }
      await SetFavoriteSongList(newFavoriteSongs);
      await SetDatSie(newFavoriteSongs.length);
      dispatch(playAction.updateSongList(newFavoriteSongs, 'playlists'));
      await SetLoading(false);
    } catch (e) {
      SetError(true);
      console.log({error: e})
    }
  }

  useEffect(() => {
    getFavoriteSongs();
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRemoveSong = (songId) => {
    try {
      const result = removeSong(songId);

      if (result) {
        alert("Remove the song successfully");
        window.location.reload()
      }
    } catch (e) {
      console.log({error: e})
    }
  };

  const handleSongPlay = (song) => {
    if (play) {
      dispatch(playAction.pauseSong());
      //setPause(true);
      setPlay(false);
      //pauseSong();
    } else {
      if (song.track.preview_url) {
        console.log(song);
        dispatch(playAction.playSong(song));
        setPlay(true);
      } else {
        dispatch(playAction.toSong(song));
      }
    }
  };

  if (loading) {
    return (
        <div>Loading....</div>
    )
  } else if (error) {
    return (
        <div>Error.....</div>
    )
  } else {
    return (
        <Paper className={classes.root}>
          <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={dataSize}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                      <TableCell
                          key={column.id}
                          align={column.align}
                          style={{minWidth: column.minWidth}}
                      >
                        {column.label}
                      </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {favoriteSongList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((favoriteSong) => {
                  return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={favoriteSong.storedId}>
                        <TableCell align='center' onClick={() => handleSongPlay(favoriteSong)}>
                          {play && songsPlay.globalPlay && favoriteSong.track.id === songR.track.id ?
                              <PauseCircleOutlineIcon/>
                              : <PlayCircleOutlineIcon/>
                          }
                        </TableCell>
                        <TableCell align='center'>
                          {favoriteSong.track ? favoriteSong.track.name : '-'}
                        </TableCell>
                        <TableCell align='center'>
                          <Link href={favoriteSong.track ? `/albumList/${favoriteSong.track.artists[0].id}` : ""}>
                            {favoriteSong.track ? favoriteSong.track.artists[0].name : '-'}
                          </Link>
                        </TableCell>
                        <TableCell align='center'>
                          <Link href={favoriteSong.track ? `/albums/songsList/${favoriteSong.track.album.id}` : ""}>
                            {favoriteSong.track ? favoriteSong.track.album.name : '-'}
                          </Link>
                        </TableCell>
                        <TableCell align='center' onClick={() => {
                          handleRemoveSong(favoriteSong.storedId)
                        }}>
                          <DeleteOutlinedIcon/>
                        </TableCell>
                      </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
    );
  }
};

export default LikedPage






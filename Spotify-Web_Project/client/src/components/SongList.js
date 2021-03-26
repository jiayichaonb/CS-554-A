import React, {useState, useEffect} from "react";
import {withRouter} from 'react-router-dom';
import Song from './Song';
import Pagination from '@material-ui/lab/Pagination';
import {Grid, makeStyles} from '@material-ui/core';
import Information from './Infotmation';
import {useDispatch} from 'react-redux';
import playAction from '../actions/playAction'

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  play_control_header: {
    width: '200px',
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  },
  btnGroup: {
    marginTop: '50px'
  },
  song_li: {
    listStyleType: 'none',
    borderBottom: '1px solid #666',
    display: 'flex',
    lineHeight: 'normal',
    fontSize: '14px',
    cursor: 'pointer',
    '&:hover': {
      color: '#1db954',
      background: '#bbbebc'
    }
  },
  song_title_header: {
    width: '300px'
  },
  song_title: {
    width: '300px'
  },
  song_title_header1: {
    width: '300px'
  },
  song_album: {
    width: '250px'
  },
  song_album_header: {
    width: '250px'
  },
  song_artist: {
    width: '200px'
  },
  song_artist_header: {
    width: '200px'
  },
  song_length: {
    width: '60px',
  },
  song_icon: {
    width: '60px',
    textAlign: 'center',
    position: 'relative',
    top: '10px'
  },
  song_length_header: {
    width: '100px'
  },
  song_added: {
    width: '150px'
  },
  song_added_header: {
    width: '200px',
    paddingLeft: '20px',
  },
  song_header_container: {
    display: 'flex',
    borderBottom: '1px solid #666',
    paddingBottom: '6px',
    marginTop: '20px',
    marginLeft: '30px',
    marginRight: '30px',
    background: '#ccffcc',

  },
  pages: {

    textAlign: 'center',
    margin: '100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  linkhover: {
    textDecoration: 'underline'
  },
  p: {
    marginTop: 'revert',
    marginBottom: 'revert',
  }

});
const SongList = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [song, setSong] = useState(undefined);
  const [isLast, setLast] = useState(false);
  const [isFirst, setFirst] = useState(true);
  const [total, setTotal] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [follow, setFollow] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [owner, setOwner] = useState(undefined);
  const [date, setDate] = useState(undefined);
  const [artists, setArtists] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function getData(url, type) {
    var request = require('request');
    var client_id = 'c9b1db19becd48f78d6913a3431ae24a'; // Your client id
    var client_secret = '98145905039345c4a5df9542ca98cc55'; // Your secret
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    };
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var token = body.access_token;
        var options = {
          url: url,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };
        request.get(options, function (error, response, body) {
          if (error) {
            setError(true);
            setLoading(false);
          } else {
            if (type === 'playlists') {
              setDescription(body.description || body.label);
              setImage(body.images[0].url);
              setFollow(body.followers ? body.followers.total : body.popularity);
              setName(body.name);
              setOwner(body.owner ? body.owner.display_name : 'author');
              setArtists(body.artists);
              setDate(body.release_date);
            }
            if (type === 'song') {
              setTotal(Math.ceil(body.total / 10));
              setSong(body.items);
              dispatch(playAction.updateSongList(body.items, props.match.params.type));

            }
            setLoading(false);
          }
        });
      }
    });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        await getData(`https://api.spotify.com/v1/${props.match.params.type}/${props.match.params.id}`, 'playlists')
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, [props.match.params.id, props.match.params.type])


  useEffect(() => {
    async function fetchData() {
      try {
        await getData(`https://api.spotify.com/v1/${props.match.params.type}/${props.match.params.id}/tracks?limit=10&&offset=${page * 10 - 10}`, 'song');
        if (page === 1) {
          setFirst(true);
          setLast(false);
        } else {
          setFirst(false);
        }
        if (page === total) {
          setLast(true);
          setFirst(false);
        } else {
          setLast(false);
        }
      } catch (e) {
        console.log(e);
        setError(true);
      }
    }

    fetchData();
  }, [page, props.match.params.id, total, props.match.params.type]);
  const changePageHandle = (event, page) => {
    setPage(page);
    if (page === 1) {
      setFirst(true);
    } else {
      setFirst(false);
    }
    if (page === total) {
      setLast(true);
    } else {
      setLast(false);
    }
  }

  const buildList = (song, index) => {
    //console.log("chuan",song);
    let NewSong = null;
    if (!song.track) {
      NewSong = {track: song};
    } else {
      NewSong = song;
    }
    return (
        <Song song={NewSong} key={song.id ? song.id : song.track.id} index={index}/>
    )
  }
  let related_album = [];
  let card = song && song.map((song, index) => {

    if (song.track) {
      related_album.push(song.track.album.images[1]);
    }
    return buildList(song, index);
  });

  if (loading) {
    return (
        <div>
          <h2>Loading....</h2>
        </div>
    );
  } else if (error) {
    return (
        <div>
          <h2>Error....</h2>
        </div>
    );
  } else {
    return (

        <div>
          <Grid>
            <Grid item lg={11}>
              <div>
                <Information artists={artists} date={date} name={name} image={image} id='' popularity=''
    follower={follow} description={description} owner={owner}
    related_album={related_album}/>
              </div>
            </Grid>
            <Grid item lg={11}>
              <div className={classes.song_header_container}>
                <div className={classes.play_control_header}>

                </div>
                <div className={classes.song_title_header}>
                  <p className={classes.p}>Title</p>
                </div>
                <div className={classes.song_artist_header}>
                  <p className={classes.p}>Artist</p>
                </div>
                <div className={classes.song_album_header}>
                  <p className={classes.p}>Album</p>
                </div>
                <div className={classes.song_added_header}>
                  <p className={classes.p}>Date</p>
                </div>
                <div className={classes.song_length_header}>
                  <p className={classes.p}>Duration</p>
                </div>
              </div>
            </Grid>
            <Grid item lg={11}>
              {card}
            </Grid>
            {total === 1 ? <div className={classes.pages}>No More</div> :
                <div className={classes.pages}>
                  <Pagination count={total} page={page} defaultPage={page} onChange={changePageHandle}
                              variant="outlined" shape="rounded" hidePrevButton={isFirst} hideNextButton={isLast}/>
                </div>}
          </Grid>
        </div>
    );
  }
}
export default withRouter(SongList);

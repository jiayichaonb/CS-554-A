import React, {useState, useEffect} from 'react';
import {Link, withRouter} from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import {Card, CardActionArea, Grid, makeStyles, Box, Tabs, Tab, AppBar} from '@material-ui/core';
import '../App.css';
import Song from './Song';
import Information from './Infotmation';
import {useDispatch} from 'react-redux';
import playAction from '../actions/playAction'

const useStyles = makeStyles({
  card: {
    maxWidth: 300,
    height: 'auto',
    marginLeft: '20px',
    marginRight: '20px',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
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
    //color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  },
  btnGroup: {
    marginTop: '50px'
  },
  pages: {

    textAlign: 'center',
    margin: '100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  song_title_header: {
    width: '220px'
  },
  song_title_header1: {
    width: '300px'
  },
  song_album_header: {
    width: '250px'
  },
  song_artist_header: {
    width: '200px'
  },
  song_length_header: {
    width: '60px'
  },
  song_added_header: {
    width: '150px'
  },
  song_header_container: {
    display: 'flex',
    borderBottom: '1px solid #666',
    paddingBottom: '6px',
    marginTop: '20px'
  },
  appbar: {
    background: '#006600',
    marginLeft: '30px',
    marginRight: '30px',
    width: 'auto',
  },
  empty: {
    width: '250px',
  },
  list_name: {
    textAlign: 'center',
    color: '#0072ee',
  }
});

function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}>
        {value === index && (
            <Box p={2}>
              <div>{children}</div>
            </Box>
        )}
      </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const AlbumList = (props) => {
  const [value, setValue] = React.useState(0);
  //const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const [albumList, setAlbumList] = useState(undefined);
  const [page, setPage] = useState(1);
  const [isLast, setLast] = useState(false);
  const [isFirst, setFirst] = useState(true);
  const [top, setTop] = useState(undefined);
  const [singerName, setSingerName] = useState('');
  const [singerPhoto, setSingerPhoto] = useState('');
  const [singerPop, setSingerPop] = useState(0);
  const [singerF, setSingerF] = useState(0);
  const [genre, setGenre] = useState(undefined);
  const [total, setTotal] = useState(undefined);
  const [id, setId] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  let card = null;

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
          } else {
            console.log(type);
            if (type === 'artist') {
              setSingerName(body.name);
              setId(body.id);
              setSingerPhoto(body.images[1].url);
              setGenre(body.genres);
              setSingerPop(body.popularity);
              setSingerF(body.followers.total);
            }
            if (type === 'album') {
              setAlbumList(body.items);
              setTotal(Math.ceil(body.total / 24));
            }
            if (type === 'topSong') {
              setTop(body.tracks);
              dispatch(playAction.updateSongList(body.tracks, 'albums'));

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
        await getData(`https://api.spotify.com/v1/artists/${props.match.params.id}/albums?limit=24&&offset=${page * 24 - 24}`, 'album');
        await getData(`https://api.spotify.com/v1/artists/${props.match.params.id}`, 'artist');
        await getData(`https://api.spotify.com/v1/artists/${props.match.params.id}/top-tracks?country=SE`, 'topSong');
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
  }, [page, props.match.params.id]);

  const changePageHandle = (event, page) => {
    setPage(page);
    if (page === 1) {
      setFirst(true);
    } else {
      setFirst(false);
    }
    ;
    if (page === total) {
      setLast(true);
    } else {
      setLast(false);
    }
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const buildList = (albm) => {
    return (
        <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={albm.id}>
          <Card className={classes.card} variant='outlined'>
            <CardActionArea>
              <Link to={`/albums/songsList/${albm.id}`}>
                <div className='category-image'>
                  <img alt="category" src={albm.icons ? albm.icons[0].url : albm.images[1].url} width='100%'/>

                  <p className={classes.list_name}>{albm.name}</p>

                </div>
              </Link>
            </CardActionArea>
          </Card>
        </Grid>
    );
  };

  card = albumList && albumList.map((album) => {
    return buildList(album);
  });
  let topList = top && top.map((song) => {
    let NewSong = {
      track: song
    }
    return (
        <Song song={NewSong} key={song.id}/>
    )
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
          <Information name={singerName} image={singerPhoto} genre={genre} id={id} follower={singerF}
    popularity={singerPop}/>
          <AppBar position="static" className={classes.appbar}>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered variant="fullWidth">
              <Tab label="All Albums" {...a11yProps(0)} />
              <Tab label="Top Songs" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <div>

              <Grid container className={classes.grid} spacing={2}>
                {card}
              </Grid>
              {total === 1 ? <div className={classes.pages}>No More</div> :
                  <div className={classes.pages}>
                    <Pagination count={total} page={page} defaultPage={page} onChange={changePageHandle}
                                variant="outlined" shape="rounded" hidePrevButton={isFirst} hideNextButton={isLast}/>
                  </div>}
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid item lg={11}>
              <div className={classes.song_header_container}>
                <div className={classes.empty}/>
                <div className={classes.song_title_header}>
                  <p>Title</p>
                </div>
                <div className={classes.song_artist_header}>
                  <p>Artist</p>
                </div>
                <div className={classes.song_album_header}>
                  <p>Album</p>
                </div>
                <div className={classes.song_added_header}>
                  <p>Date</p>
                </div>
                <div className={classes.song_length_header}>
                  <p>Duration</p>
                </div>

              </div>
            </Grid>
            <Grid item lg={11}>
              {topList}
            </Grid>
          </TabPanel>
          <div className={classes.pages}/>
        </div>
    );
  }
}
export default withRouter(AlbumList);

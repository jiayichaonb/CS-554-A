import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Card, CardActionArea, Grid, makeStyles, AppBar, Tab} from '@material-ui/core';
import noImage from '../img/download.jpeg';
import '../App.css';

const useStyles = makeStyles({
  appbar: {
    background: '#006600',
    marginLeft: '30px',
    marginRight: '30px',
    width: 'auto',
    marginBottom: '30px',
  },
  card: {
    maxWidth: 200,
    height: 'auto',
    marginLeft: '30px',
    marginRight: '30px',
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
    color: '#1e8678',
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
  list_name: {
    textAlign: 'center',
    color: 'black'
  }
});

const Search = (props) => {
  const classes = useStyles();
  const [albumList, setAlbumList] = useState(undefined);
  const [artistsList, setArtistsList] = useState(undefined);
  const [playList, setPlayList] = useState(undefined);
  const [page, setPage] = useState(1);
  const [isLast, setLast] = useState(false);
  const [isFirst, setFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  let card = null;
  let card2 = null;
  let card3 = null;

  async function getData(url) {
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
            setAlbumList(body.albums.items);
            setArtistsList(body.artists.items);
            setPlayList(body.playlists.items);
            setLoading(false);
          }
        });
      }
    });
  }

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    // setLoading(true);
    console.log(e.target.value);
    if (e.target.value) {
      getData(`https://api.spotify.com/v1/search?query=${e.target.value}&offset=0&limit=6&type=album%2Cartist%2Cplaylist`);
    }
  };
  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  const buildCard = (genre) => {
    return (
        <Grid item xs={12} sm={4} md={3} lg={2} xl={2} key={genre.id}>
          <Card className={classes.card} variant='outlined'>
            <CardActionArea>
              <Link
                  to={genre.type === 'artist' ? `/albumList/${genre.id}` : genre.type === 'album' ? `/albums/songsList/${genre.id}` : `/playlists/songsList/${genre.id}`}>
                <div className='category-image'>
                  <img alt="category" src={genre.images && genre.images.length === 0 ? noImage : genre.images[0].url}
                       width='100%' height='180px'/>
                  <p className={classes.list_name}>{genre.name}</p>
                </div>
              </Link>
            </CardActionArea>
          </Card>
        </Grid>
    );
  };
  card = artistsList && artistsList.map((artist) => {
    return buildCard(artist);
  });
  card2 = albumList && albumList.map((artist) => {
    return buildCard(artist);
  });
  card3 = playList && playList.map((artist) => {
    return buildCard(artist);
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
        <div className='searchbox'>
          <div className="form__group field">
            <form
                className="searchform"
                method='POST '
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                name='formName'
            >
              <input id="my-input" className="form__field" autoComplete='off' type='text' name='searchTerm'
                     placeholder="Search Artists, Albums or PlayList" onChange={handleChange}/>
              <label form="my-input" class="form__label">Search</label>
            </form>
          </div>
          {(searchTerm) ? (<div>
            <AppBar position="static" className={classes.appbar}>
              <Tab label="Artists"/>
            </AppBar>
            <Grid container className={classes.grid} spacing={2}>
              {card}
            </Grid>
            <AppBar position="static" className={classes.appbar}>
              <Tab label="Albums"/>
            </AppBar>
            <Grid container className={classes.grid} spacing={2}>
              {card2}
            </Grid>
            <AppBar position="static" className={classes.appbar}>
              <Tab label="PlayList"/>
            </AppBar>
            <Grid container className={classes.grid} spacing={2}>
              {card3}
            </Grid>
          </div>) : (
              <div>
                {/* <h1 className ="searchh1">Search Artists, Albums or PlayList</h1> */}
              </div>
          )}
          {/* {total === 1?<div className={classes.pages}>No More</div>:
                    <div className={classes.pages}>
                        <Pagination count={total} page={page} defaultPage={page} onChange={changePageHandle} variant="outlined" shape="rounded" hidePrevButton={isFirst} hideNextButton={isLast} />
                    </div>} */}
        </div>
    );
  }
};

export default Search;

import React, {useState, useEffect} from 'react';
import {Link, withRouter} from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import noImage from '../img/download.jpeg';
import {Card, CardActionArea, Grid, makeStyles, AppBar, Tab} from '@material-ui/core';
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
    color: '#0072ee'
  }
});

const SearchSinger = (props) => {
  const classes = useStyles();
  const [genresList, setGenresList] = useState(undefined);
  const [page, setPage] = useState(1);
  const [isLast, setLast] = useState(false);
  const [isFirst, setFirst] = useState(true);
  const [total, setTotal] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  let card = null;

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
            setTotal(Math.ceil(body.artists.total / 24));
            setGenresList(body.artists.items);
            setLoading(false);
          }
        });
      }
    });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // console.log(props.value);
        getData(`https://api.spotify.com/v1/search?query=${props.match.params.letter}&offset=${page * 24 - 24}&limit=24&type=artist`);
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
  }, [page]);


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


  const buildCard = (genre) => {
    return (
        <Grid item xs={12} sm={4} md={3} lg={2} xl={2} key={genre.id}>
          <Card className={classes.card} variant='outlined'>
            <CardActionArea>
              <Link to={`/albumList/${genre.id}`}>
                <div className='category-image'>
                  <img alt="category" src={genre.images && genre.images.length === 0 ? noImage : genre.images[0].url}
                       width='100%' height='180px'/>
                  <p className={classes.list_name}> {genre.name}</p>
                </div>
              </Link>
            </CardActionArea>
          </Card>
        </Grid>
    );
  };
  card = genresList && genresList.map((genre) => {
    return buildCard(genre);
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
          <AppBar position="static" className={classes.appbar}>
            <Tab label={props.match.params.letter}/>
          </AppBar>
          <Grid container className={classes.grid} spacing={2}>
            {card}
          </Grid>
          {total === 1 ? <div className={classes.pages}>No More</div> :
              <div className={classes.pages}>
                <Pagination count={total} page={page} defaultPage={page} onChange={changePageHandle} variant="outlined"
                            shape="rounded" hidePrevButton={isFirst} hideNextButton={isLast}/>
              </div>}
        </div>
    );
  }
};

export default withRouter(SearchSinger);

import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import download from '../img/download.jpeg'
import {Chip, Avatar} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#ccffcc',
    display: 'flex',
    height: 400,
    margin: '30px',
  },
  details: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '0.7 0 auto',
    padding: 0
  },
  cover: {
    margin: '20px',
    width: 400,

  },
  name: {
    textAlign: 'left',

    letterSpacing: '1px',
    marginLeft: '200px',
    fontWeight: 500,
    fontSize: '40px'
  },
  tag: {
    display: 'flex',
    textAlign: 'left',
    fontWeight: 500,
    lineHeight: 4,
    marginLeft: '200px'
  },
  chip: {
    marginLeft: '7px',
    background: '#666600'
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  detail: {
    display: 'flex',
    flexDirection: 'column',
  },
  related: {
    textAlign: 'left',
    display: 'flex',
    marginLeft: '200px',
    fontWeight: 500,
    lineHeight: 2.75,
  },
  related_icon: {
    textAlign: 'left',
    display: 'flex',
  },
  icon: {
    marginLeft: '5px'
  },
  span_label: {
    marginRight: '20px'
  }
}));

export default function Information(props) {
  const classes = useStyles();
  const {name, image, genre, id, popularity, follower, description, owner, related_album, date, artists} = props;
  const [related, setRelated] = useState(undefined);


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
          setRelated(body.artists);
        });
      }
    });
  }

  const handleJump = (id) => {
    if (id) {
      window.location.href = `/albumList/${id}`;
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        if (id) {
          await getData(`https://api.spotify.com/v1/artists/${id}/related-artists`, 'related');
        }
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, [id])

  let genres = genre && genre.map((genre, index) => {
    return (
        <Chip color="primary" size="small" label={genre} className={classes.chip} key={index}/>
    )
  });
  let imageIcon = related && related.map((e, index) => {
    if (index <= 5) {
      return (
          <div className={classes.icon} key={index}>
            <Avatar alt="Remy Sharp" src={e.images[1].url} className={classes.large} onClick={() => handleJump(e.id)}/>
          </div>
      )
    }
    return null;
  });
  let imageAlbum = related_album && related_album.map((e, index) => {
    if (index <= 5) {
      return (
          <div className={classes.icon} key={index}>
            <Avatar alt="Remy Sharp" src={e.url} className={classes.large}/>
          </div>
      )
    }
    return null;
  });
  let imageArtist = artists && artists.map((e, index) => {
    if (index <= 5) {
      return (
          <div className={classes.icon} key={index}>
            <Avatar alt="Remy Sharp" className={classes.large} onClick={() => handleJump(e.id)}>{e.name}</Avatar>
          </div>
      )
    }
    return null;
  });

  return (
      <Card className={classes.root}>
        <CardMedia
            className={classes.cover}
            image={image ? image : download}
            title="photo"
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <div component="h5" variant="h5" className={classes.name}>
              {name}
            </div>
            <div variant="subtitle1" color="textSecondary" className={classes.tag}>
              <span className={classes.span_label}>{genre ? 'Styles:' : 'Description:'}</span>
              {genre ? <div>
                {genres}
              </div> : <div>
                {description}

              </div>
              }

            </div>
            {popularity ? <div variant="subtitle1" color="textSecondary" className={classes.tag}>
              <span className={classes.span_label}>Popularity:</span>
              <div>
                {popularity}
              </div>
            </div> : owner === 'author' ? <div variant="subtitle1" color="textSecondary" className={classes.tag}>
              <span className={classes.span_label}>Release Date:</span>
              <div>
                {date}
              </div>
            </div> : <div variant="subtitle1" color="textSecondary" className={classes.tag}>
              <span className={classes.span_label}>Owner:</span>
              <div>
                {owner}
              </div>
            </div>
            }
            <div variant="subtitle1" color="textSecondary" className={classes.tag}>
              <span className={classes.span_label}>Followers:</span>
              <div>
                {follower}
              </div>
            </div>

          </CardContent>
          {id ? <div className={classes.related}>
            <span className={classes.span_label}>Related Artists:</span>
            <div className={classes.related_icon}>
              {imageIcon}
            </div>
          </div> : !artists ? <div className={classes.related}>
            <span className={classes.span_label}>Related Albums:</span>
            <div className={classes.related_icon}>
              {imageAlbum}
            </div>
          </div> : <div className={classes.related}>
            <span className={classes.span_label}>Related Artists:</span>
            <div className={classes.related_icon}>
              {imageArtist}
            </div>
          </div>}
        </div>
      </Card>
  );
}

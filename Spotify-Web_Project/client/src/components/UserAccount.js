import React, {useState, useEffect} from 'react';
import {Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import PersonPinCircleOutlinedIcon from '@material-ui/icons/PersonPinCircleOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import PeopleOutlineOutlinedIcon from '@material-ui/icons/PeopleOutlineOutlined';
import Typography from '@material-ui/core/Typography';
import myImage from '../img/profileImage.jpeg'
import AddImage from "./AddImage";
import EditProfile from "./EditProfile";

const axios = require('axios').default;

const useStyles = makeStyles({
  account: {
    width: "90%",
    height: "100%",
    minHeight: 1000,
  },
  profile: {
    width: "100%",
    // backgroundColor: "yellow"
  },
  media: {
    minHeight: 120,
    minWidth: 100,
    height: "100%",
    width: "100%",
    // backgroundColor: 'lightblue'
  },
});

const UserAccount = () => {
  const classes = useStyles();
  const [user, SetUser] = useState(undefined);
  const [loading, SetLoading] = useState(false);
  const [error, SetError] = useState(false);

  async function fetchUser() {
    let userInfo = {
      userEmail: window.sessionStorage.userEmail
    };
    try {
      const userData = await axios.post('http://localhost:5000/users/getUser', userInfo);
      if (userData.data) {
        SetUser(userData.data);
        SetError(false);
        SetLoading(false);
      }
    } catch (e) {
      SetError(true);
      console.log({error: e})
    }
  }

  useEffect(() => {
    fetchUser()
  }, []);


  if (loading) {
    return (
        <div>Loading....</div>
    )
  } else if (error) {
    return (
        <div>Error....</div>)
  } else {
    return (
        <Grid container justify='center' className={classes.profile}>
          <Card container className={classes.account}>
            <CardActionArea container>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <CardMedia
                      className={classes.media}
                      image={myImage}
                      title="user image"
                  />
                </Grid>
                <Grid item xs={8}>
                  <CardContent className={classes.content}>
                    <br/>
                    <Typography>
                      <PersonPinCircleOutlinedIcon/>
                      First Name: {user && user.firstName ? user.firstName : "-"}
                    </Typography>
                    <br/>
                    <Typography>
                      <PersonPinCircleOutlinedIcon/>
                      Last Name: {user && user.lastName ? user.lastName : "-"}
                    </Typography>
                    <br/>
                    <Typography>
                      <EmailOutlinedIcon/>
                      Email Address: {user && user.email ? user.email : "-"}
                    </Typography>
                    <br/>
                    <Typography>
                      <PeopleOutlineOutlinedIcon/>
                      Gender: {user && user.gender ? user.gender : "-"}
                    </Typography>
                  </CardContent>
                </Grid>
              </Grid>
            </CardActionArea>
            <br/>
            <br/>
            <CardActions>
              <Grid container item justify='flex-start' spacing={1}>
                <Grid item>
                  <AddImage/>
                </Grid>
                <Grid item>
                  <EditProfile/>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
    )
  }
};


export default UserAccount;

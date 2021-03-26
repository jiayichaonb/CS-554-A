import React, {useState, useEffect} from "react";
import {withRouter} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import UserProfile from '../UserProfile';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap'
import {AppBar} from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';

const useStyles = makeStyles({
  topnav: {
    overflow: "hidden",
    background: "#333",
    position: "fixed",
    top: "0",
    width: "100%",
    zIndex: '200px'
  },
});

const TopNav = (props) => {
  const classes = useStyles();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const e = window.sessionStorage.getItem("userEmail");
  const [userEmail, setUserEmail] = useState(e);
  console.log("user email: " + userEmail);
  console.log("userHasAuthenticated: " + isAuthenticated);
  useEffect(() => {
    onLoadAgain();
  }, [e]);

  async function onLoadAgain() {
    if (userEmail) {
      userHasAuthenticated(true);
    } else {
      console.log("user email is empty");
      userHasAuthenticated(false);
    }
  }

  if (window.location.href.includes("access_token")) {
    return (
        <UserProfile/>
    );
  }

  function handleLogout() {
    window.sessionStorage.setItem("userEmail", "");
    userHasAuthenticated(false);
    window.location.reload(false);
  }

  const url = 'https://accounts.spotify.com/authorize?show_dialog=true&client_id=230be2f46909426b8b80cac36446b52a&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-recently-played%20playlist-modify-private%20ugc-image-upload%20user-follow-modify%20user-follow-read%20user-library-read%20user-library-modify%20user-read-private%20user-read-email%20user-top-read%20user-read-playback-state&response_type=token&redirect_uri=http://localhost:3000/callback';
  if (isAuthenticated) {
    return (
        <AppBar position="static">
          <Navbar className={classes.topnave} collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">Music Website</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/search">Search</Nav.Link>
                <Nav.Link href="/search">Playlist</Nav.Link>
              </Nav>
              <Nav>
                <NavDropdown title={userEmail} id="collasible-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Account</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Profile</NavDropdown.Item>
                  <NavDropdown.Item href="/likedpage">Favorite List</NavDropdown.Item>
                  <NavDropdown.Divider/>
                  <NavDropdown.Item onClick={handleLogout}>Log out</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </AppBar>
    )
  } else {
    return (
        <AppBar position="static">
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">Music Website</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
              </Nav>
              <Nav>
                <Nav.Link href="http://localhost:3000/register">Register</Nav.Link>
                <Nav.Link href="http://localhost:3000/login">
                  Login
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </AppBar>
    )
  }
}

export default withRouter(TopNav);

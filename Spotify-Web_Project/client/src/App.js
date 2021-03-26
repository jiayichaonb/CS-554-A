import React, {useState, useEffect} from "react";
import './App.css';
import './styles/App.scss';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {IntlProvider} from 'react-intl';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import My404Component from './components/My404Component';
import AlbumList from './components/AlbumList'
import GenresList from './components/GenresList'
import PlayList from './components/PlayList'
import SongList from './components/SongList'
import Songplay from './components/SongPlay'
import TopNav from './components/Nav/TopNav'
import Aside from './components/Nav/Aside'
import {AppContext} from "./libs/contextLib";
import Search from './components/Search';
import LikedPage from './components/LikedPage';
import NewRelease from './components/NewRelease';
import UserAccount from './components/UserAccount';
import SearchSingers from './components/SearchSinger'

function App() {

  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const e = window.sessionStorage.getItem("userEmail");
  const [userEmail, setUserEmail] = useState(e);
  const [locale, setLocale] = useState('en');

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

  return (
      <IntlProvider locale={locale}>
        <AppContext.Provider value={{isAuthenticated, userHasAuthenticated}}>
          <Router>
            {/* <TopNav></TopNav> */}
            {/* <Aside/> */}
            {isAuthenticated ? (
                    <div className={`app`}>
                      <Aside/>
                      {/* <TopNav /> */}
                      <Switch>
                        {/* Yichao's routes */}
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/userprofile" component={UserProfile}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        {/* Weijie's routes */}
                        <Route exact path="/likedpage" component={LikedPage}/>
                        <Route exact path="/account" component={UserAccount}/>
                        {/* Rupu's routes */}
                        <Route exact path='/categories' component={GenresList}/>
                        <Route exact path='/:categories/playList' component={PlayList}/>
                        <Route exact path='/:type/songsList/:id' component={SongList}/>
                        <Route exact path='/albumList/:id' component={AlbumList}/>
                        <Route exact path='/newRelease' component={NewRelease}/>
                        {/* Donglin's routes */}
                        <Route exact path='/search' component={Search}/>
                        <Route exact path='/searchsingers/:letter' component={SearchSingers}/>

                        <Route component={My404Component}/>
                      </Switch>
                      <Songplay/>
                    </div>
                )
                :
                (
                    <div>
                      <TopNav/>
                      <Switch>
                        {/* Yichao's routes */}
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        {/* Weijie's routes */}
                        <Route exact path="/likedpage" component={Home}/>
                        <Route exact path="/account" component={Home}/>
                        {/* Rupu's routes */}
                        <Route exact path='/categories' component={Home}/>
                        <Route exact path='/:categories/playList' component={Home}/>
                        <Route exact path='/:type/songsList/:id' component={Home}/>
                        <Route exact path='/albumList/:id' component={Home}/>
                        <Route exact path='/newRelease' component={Home}/>
                        {/* Donglin's routes */}
                        <Route exact path='/search' component={Home}/>
                        <Route exact path='/searchsingers/:letter' component={Home}/>
                        <Route component={My404Component}/>
                      </Switch>
                      {/* <Songplay/> */}
                    </div>
                )}
          </Router>
        </AppContext.Provider>
      </IntlProvider>
  );
}

export default App;








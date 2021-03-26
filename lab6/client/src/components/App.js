import React from 'react';
import './App.css';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import Bin from './Bin';
import Post from './Post';
import NewPost from './NewPost';
import Popularity from './Popularity';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className="App-header">
            <h1 className="App-title">
            Welcome To Colorful Binterested Website
            </h1>
            <nav>
              <NavLink className="navlink" to="/">
                Home
              </NavLink>
              <NavLink className="navlink" to="/my-bin">
                MY Bin
              </NavLink>

              <NavLink className="navlink" to="/my-posts">
                My Posts
              </NavLink>

              <NavLink className="navlink" to="/new-post">
                New Post
              </NavLink>

              <NavLink className="navlink" to="/popularity">
                Popularity
              </NavLink>
            </nav>
          </header>
          <Route exact path="/" component={Home} />
          <Route path="/my-bin/" component={Bin} />
          <Route path="/my-posts/" component={Post} />
          <Route path="/new-post/" component={NewPost} />
          <Route path="/popularity/" component={Popularity} />

        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

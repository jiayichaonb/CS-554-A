import React from "react";
import '../App.css';

const Home = () => {
  const url = 'https://accounts.spotify.com/authorize?show_dialog=true&client_id=230be2f46909426b8b80cac36446b52a&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-recently-played%20playlist-modify-private%20ugc-image-upload%20user-follow-modify%20user-follow-read%20user-library-read%20user-library-modify%20user-read-private%20user-read-email%20user-top-read%20user-read-playback-state&response_type=token&redirect_uri=http://localhost:3000/callback';
  const e = window.sessionStorage.getItem("userEmail");

  if (e) {
    return (
        <div className="home">
          <p className="welcome" style={{fontSize: '30px'}}>

            Welcome<br/>
            Spotify was founded in 2006 in Stockholm, Sweden, the company's title was initially misheard from a name
            shouted by Lorentzon. Later they thought out an etymology of a combination of "spot" and "identify."

          </p>

          <div className="child">
            <button
                className="button"
            >
                    <span>
                        <a className="homeURL"
                           href="http://localhost:3000/categories"
                        >
                            Categories
                        </a>
                    </span>
            </button>

            <button
                className="button"
            >
                    <span>
                        <a className="homeURL"
                           href="http://localhost:3000/likedpage"
                        >
                            Liked Songs
                        </a>
                    </span>
            </button>

            <button
                className="button"
            >
                    <span>
                        <a className="homeURL"
                           href="http://localhost:3000/toplists/playList"
                        >
                            Top List
                        </a>
                    </span>
            </button>

            <button
                className="button"
            >
                    <span>
                        <a className="homeURL"
                           href="http://localhost:3000/account"
                        >
                            My Profile
                        </a>
                    </span>
            </button>
          </div>
        </div>
    )
  }

  return (

      <div className="home">
        <p className="welcome" style={{fontSize: '30px'}}>
          Welcome to music website, you can access other page after login <br/>
          If you don't want to login you can &nbsp;
          <a href={url}>
            Open Spotify Online
          </a>
        </p>
      </div>
  )
};

export default Home;

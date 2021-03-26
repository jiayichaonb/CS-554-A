import '../App.css';
import React, {useState, useEffect} from 'react';


const UserProfile = (props) => {
  const playerUrl = "https://open.spotify.com";
  const [userData, setUserData] = useState('');
  var curUrl = window.location;
  const hash = window.location.hash.substr(1); //url of the current page
  const arHash = hash.split('='); //this creates an array with key ([0] element) and value ([1] element)
  const hash_value = arHash[1];

  const accessToken = hash_value;


  useEffect(() => {
    async function fetchData() {
      try {
        const url = "https://api.spotify.com/v1/me/";

        const options = {
          headers: {
            Authorization: "Bearer " + accessToken
          }
        };
        fetch(url, options)
            .then(res => res.json())
            .then(data => {
              console.log(data);
              console.log("test");
              setUserData(data)
            });
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, [accessToken]);

  return (
      <div>
        <p className="login" style={{fontSize: '30px'}}>
          Login Successful!
        </p>

        <p className="login" style={{fontSize: '30px'}}>
          <a href={playerUrl}>
            Spotify official player
          </a>
        </p>

        <p style={{fontSize: '50px'}}>
          The user's profile:
        </p>

        <p style={{fontSize: '25px'}}>
          Country: {userData.country}
        </p>

        <p style={{fontSize: '25px'}}>
          Name: {userData.display_name}
        </p>

        <p style={{fontSize: '25px'}}>
          Email: {userData.email}
        </p>

        <p style={{fontSize: '25px'}}>
          Account type: {userData.product}
        </p>
      </div>
  )
};

export default UserProfile;

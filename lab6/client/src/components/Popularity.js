import React from 'react';
import './App.css';

import { useQuery } from '@apollo/client';
import queries from '../queries';
import BinStatus from './BinStatus';


function Popularity() {

  const { loading, error, data } = useQuery(queries.GET_TOP_TEN, {
    fetchPolicy: 'cache-and-network'
  });
  let card = null;
  let sumLikes = 0;
  
  if (error) {
    return (
        <div>
            <h2>ERROR</h2>
			      <p>{error.toString()}</p>
        </div>
    );
}

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }
  if (data) {

    console.log("data of poppularity");
    console.log(data);
    const { getTopTenBinnedPosts } = data;
    
    for (let img of getTopTenBinnedPosts) {
        sumLikes += img.numBinned;
    }
    console.log("sum of likes:  " + sumLikes);

    if (getTopTenBinnedPosts.length === 0) {
      return (
        <div>
          <h2>No Binned Image</h2>
        </div>
      );
    }

    card = (
        getTopTenBinnedPosts.map ((image) => 
      {
				return (
          <div key={image.id}>
             
                
                  <div className="card" key={image.id}>
                    <div className="card-body">
                      <img src={image.url} alt="Posted" height = '100%' width = '100%'/>
                      <h2 className="card-title">{image.posterName}</h2>
                      <p>{image.description}</p>
                      <p>Likes: {image.numBinned}</p>

                      <br />
                      <br />
                      <br />
                      
                      <BinStatus image={image} />

                      <br />
                      <br />
                    
                    </div>
                  </div>
              
          </div>
    
        );
			})
    );
  }


  return (
    <div>
        {sumLikes >= 200 ? 
            (<h1>Mainstream({sumLikes})</h1>) 
            : 
            (<h1>Non-mainstream({sumLikes})</h1>)
        }
        {card}
    </div>
    
  );
}

export default Popularity;

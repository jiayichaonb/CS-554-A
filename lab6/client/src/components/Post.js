import React from 'react';
import './App.css';

import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';
import BinStatus from './BinStatus';
import NewPost from './NewPost';


function Post() {

const [removeFromPost] = useMutation(queries.DELETE_IMAGE, {
  update(cache, { data: { deleteImage } }) {
    const { userPostedImages } = cache.readQuery({ query: queries.GET_POSTED_IMAGES });
    cache.writeQuery({
      query: queries.GET_POSTED_IMAGES,
      //notice: updateImage is an array (?) has only one element, use concate to concatenate two array
      data: { userPostedImages: userPostedImages.filter(
        e => e.id !== deleteImage.id,
      )}
    });
  }
});

  const { loading, error, data } = useQuery(queries.GET_POSTED_IMAGES, {
    fetchPolicy: 'cache-and-network'
  });
  let card = null;
  
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
    const { userPostedImages } = data;

    if (userPostedImages.length === 0) {
      return (
        <div>
          <h2>No Uploaded Post, You Can Upload Now</h2>
          <NewPost/>
        </div>
      );
    }

    card = (
      userPostedImages.map ((image) => 
      {
				return (
          <div key={image.id}>
             
                
                  <div className="card" key={image.id}>
                    <div className="card-body">
                      <img src={image.url} alt="Posted" height = '100%' width = '100%'/>
                      <h2 className="card-title">{image.posterName}</h2>
                      <p>{image.description}</p>
                      <br />
                      <br />
                      <br />
                      
                      <BinStatus image={image} />

                      <br />
                      <br />
                      
                      <form
                      className="form"
                      id="add-employee"
                      onSubmit={(e) => {
                      e.preventDefault();
                      console.log(typeof(image));
                      removeFromPost({
                          variables: {
                          id: image.id,
                          // url: image.url,
                          // description: image.description,
                          // posterName: image.posterName,
                          // userPosted: image.userPosted,
                          // binned: image.binned
                          }
                      });
                      
                      alert('Removed From Post');
                      }}
                      >

                    <button className="button delete-button" type="submit">
                        Delete Post
                    </button>

                    </form>
                    
                    </div>
                  </div>
              
          </div>
    
        );
			})
    );
  }


  return (
    <div>
      <p>You Can Also Upload Here!</p>

      <NewPost/>

      {card}
    </div>
    
  );
}

export default Post;

import React from 'react';

import './App.css';
import { useMutation } from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';

//For react-modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    border: '1px solid #28547a',
    borderRadius: '4px'
  }
};

function NewPost(props) {

  const [addPost] = useMutation(queries.UPLOAD_IMAGE, {
    update(cache, { data: { uploadImage } }) {
      const { userPostedImages } = cache.readQuery({ query: queries.GET_POSTED_IMAGES });
      cache.writeQuery({
        query: queries.GET_POSTED_IMAGES,
        //notice: userPostedImages is an array has only one element, use concate to concatenate two array
        data: { userPostedImages: userPostedImages.concat([uploadImage]) }
      });
    }
  });
 
  let body = null;
    let url;
    let description;
    let posterName;
    body = (
      <div>
      <form
        className="form"
        id="add-employee"
        onSubmit={(e) => {
          e.preventDefault();
          addPost({
            variables: {
              url: url.value,
              description: description.value,
              posterName: posterName.value
            }
          });
          url.value = '';
          description.value = '';
          posterName.value = '';
          alert('Post Added');
        }}
      >
        <div className="form-group">
          <label>
            URL :
            <br />
            <input
              ref={(node) => {
                url = node;
              }}
              required
              autoFocus={true}
            />
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            Description:
            <br />
            <input
              ref={(node) => {
                description = node;
              }}
              required
            />
          </label>
        </div>
        <br />

        <div className="form-group">
          <label>
            PosterName:
            <br />
            <input
              ref={(node) => {
                posterName = node;
              }}
              required
            />
          </label>
        </div>
        <br />

        <br />
        <br />
        <button className="button addPost-button" type="submit">
          Add Post!
        </button>
      </form>
      </div>
    );
  
  return (
    <div style={customStyles}>
     
        {body}
        
    </div>
  );
}

export default NewPost;

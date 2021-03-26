import React from 'react';
import './App.css';

import { useQuery } from '@apollo/client';
import queries from '../queries';
import BinStatus from './BinStatus';


function Bin() {

//   const [removeFromBin] = useMutation(queries.UPDATE_IMAGE, {
//     update(cache, { data: { updateImage } }) {
//       const { binnedImages } = cache.readQuery({ query: queries.GET_BINNED_IMAGES });
//       cache.writeQuery({
//         query: queries.GET_BINNED_IMAGES,
//         //notice: updateImage is an array (?) has only one element, use concate to concatenate two array
//         data: { binnedImages: binnedImages.filter(
//           e => e.id !== updateImage.id,
//         )}
//       });
//     }
// });

  const { loading, error, data } = useQuery(queries.GET_BINNED_IMAGES, {
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

    const { binnedImages } = data;
    // console.log(data);
    // console.log(binnedImages);

    if (binnedImages.length === 0) {
      return (
        <div>
          <h2>No Images In Bin</h2>
        </div>
      );
    }

    card = (
      binnedImages.map ((image) => 
      {
				return (
          <div key={image.id}>
             
                
                  <div className="card" key={image.id}>
                    <div className="card-body">
                      <img src={image.url} alt="Binned" height = '100%' width = '100%'/>
                      <h2 className="card-title">{image.posterName}</h2>
                      <p>{image.description}</p>
                      <br />
                      <br />
                      <br />
                      <BinStatus image={image} />

                      {/* <form
                        className="form"
                        id="add-employee"
                        onSubmit={(e) => {
                          e.preventDefault();
                          removeFromBin({
                            variables: {
                              id: image.id,
                              url: image.url,
                              description: image.description,
                              posterName: image.posterName,
                              userPosted: image.userPosted,
                              binned: false
                            }
                          });
                          
                          alert('Removed From Bin');
                        }}
                      >
                      
                            <button className="button add-button" type="submit">
                              Remove From Bin
                            </button>

                      </form> */}
                    </div>
                  </div>
              
          </div>
    
        );
			})
    );
  }


  return (
    <div>
      {card}
      
    </div>
    
  );
}

export default Bin;

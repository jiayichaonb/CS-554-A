import React, { useState} from 'react';

import './App.css';
import queries from '../queries';
import { useQuery } from '@apollo/client';
import BinStatus from './BinStatus';




const Home = (props) => {

  const [ pageNum, setPageNum ] = useState(0);


  let card = null;
  const { loading, error, data } = useQuery(
    queries.GET_IMAGES,
    {
      fetchPolicy: 'cache-and-network',
      variables: { pageNum: pageNum}
    }
  );
  // console.log(data);
  function handleClick() {
    setPageNum(pageNum + 1);
  }

  


//   const [addToBin] = useMutation(queries.UPDATE_IMAGE, {
//       update(cache, { data: { updateImage } }) {
//         const { binnedImages } = cache.readQuery({ query: queries.GET_BINNED_IMAGES });
//         cache.writeQuery({
//           query: queries.GET_BINNED_IMAGES,
//           //notice: updateImage is an array (?) has only one element, use concate to concatenate two array
//           data: { binnedImages: binnedImages.concat([updateImage]) }
//         });
//       }
//   });

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
    const { unsplashImages } = data;
    card = (
      unsplashImages.map ((image) => 
      {
				return (
          <div key={image.id}>
             
                
                  <div className="card" key={image.id}>
                    <div className="card-body">
                      <img src={image.url} alt="unsplash" height = '100%' width = '100%'/>
                      <h2 className="card-title">{image.posterName}</h2>
                      <p>{image.description}</p>
                      <br />
                      <br />
                      <br />
                      <BinStatus image={image} />
                      {/* {image.binned === false ? (

                        <form
                        className="form"
                        id="add-employee"
                        onSubmit={(e) => {
                          e.preventDefault();
                          addToBin({
                            variables: {
                              id: image.id,
                              url: image.url,
                              description: image.description,
                              posterName: image.posterName,
                              userPosted: image.userPosted,
                              binned: true
                            }
                          });
                          
                          alert('Added To Bin');
                        }}
                        >
                      
                            <button className="button add-button" type="submit">
                              Add To Bin
                            </button>

                        </form>
                      ) : (

                        <form
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

                        </form>

                      )} */}
                    </div>
                  </div>
          </div>
    
        );
			})
    );
  }

  return (
  <div>

    <div className='text-center'>
          <button onClick={handleClick}>
            Get More Photos
          </button>
    </div>

    {card}

  </div>
  
);


};

export default Home;

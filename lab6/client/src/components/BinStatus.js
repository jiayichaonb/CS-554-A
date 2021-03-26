import React from 'react';
import './App.css';
import queries from '../queries';
import { useQuery, useMutation } from '@apollo/client';



const BinStatus = (props) => {

    const [addToBin] = useMutation(queries.UPDATE_IMAGE, {
        update(cache, { data: { updateImage } }) {
          const { binnedImages } = cache.readQuery({ query: queries.GET_BINNED_IMAGES });
          cache.writeQuery({
            query: queries.GET_BINNED_IMAGES,
            //notice: updateImage is an array (?) has only one element, use concate to concatenate two array
            data: { binnedImages: binnedImages.concat([updateImage]) }
          });
        }
    });
  
    const [removeFromBin] = useMutation(queries.UPDATE_IMAGE, {
      update(cache, { data: { updateImage } }) {
        const { binnedImages } = cache.readQuery({ query: queries.GET_BINNED_IMAGES });
        cache.writeQuery({
          query: queries.GET_BINNED_IMAGES,
          //notice: updateImage is an array (?) has only one element, use concate to concatenate two array
          data: { binnedImages: binnedImages.filter(
            e => e.id !== updateImage.id,
          )}
        });
      }
  });
    

  const { loading, error, data } = useQuery(queries.GET_BINNED_IMAGES, {
    fetchPolicy: 'cache-and-network'
  });

  if (data) {
    const { binnedImages } = data;
    // console.log(binnedImages);
    function checkBin() {
        //check if the imagePost is in binned cache

        for (var i of binnedImages) {
        //   let parseI = JSON.parse(i);
          if (i.id === props.image.id) {
            return true;
          }
        }
        return false;
      }

    return (
        <div>
            {checkBin() === false ? (

                <form
                className="form"
                id="add-employee"
                onSubmit={(e) => {
                e.preventDefault();
                addToBin({
                    variables: {
                    id: props.image.id,
                    url: props.image.url,
                    description: props.image.description,
                    posterName: props.image.posterName,
                    userPosted: props.image.userPosted,
                    binned: true,
                    numBinned:props.image.numBinned
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
                    id: props.image.id,
                    url: props.image.url,
                    description: props.image.description,
                    posterName: props.image.posterName,
                    userPosted: props.image.userPosted,
                    binned: false,
                    numBinned:props.image.numBinned
                    }
                });
                
                alert('Removed From Bin');
                }}
                >

                    <button className="button add-button" type="submit">
                    Remove From Bin
                    </button>

                </form>

            )}
        </div>
    );
  }
    

  if (error) {
    return (
        <div>
            <h2>ERROR</h2>
               <p>{error.toString()}</p>
         {/* <p>{url}</p> */}

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
  
};

export default BinStatus;



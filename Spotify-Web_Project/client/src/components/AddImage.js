import React from "react";
import Button from "@material-ui/core/Button";
import {DropzoneDialog} from "material-ui-dropzone";
import AddAPhotoTwoToneIcon from '@material-ui/icons/AddAPhotoTwoTone';

const axios = require('axios').default;
const initialState = {
  open: false,
  files: []
};

export default function DropzoneDialogExample() {
  const [state, setState] = React.useState(initialState);

  const handleOpen = () => {
    setState({
      ...state,
      open: true
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false
    });
  };

  const handleSave = files => {
    setState({
      ...state,
      files: files,
      open: false
    });
    const formData = new FormData();
    formData.append('myImg', files[0]);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.post('http://localhost:5000/users/addImg', formData, config)
        .then(() => {
          alert("Upload image successfully")
        }).catch((error) => {
      console.log({error: error})
    })

  };

  return (
      <div>
        <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={handleOpen}
            startIcon={<AddAPhotoTwoToneIcon/>}>
          Upload
        </Button>
        <h1/>
        <DropzoneDialog
            open={state.open}
            onSave={handleSave}
            acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
            showPreviews={true}
            maxFileSize={5000000}
            onClose={handleClose}
            cancelButtonText={"Cancel"}
            submitButtonText={"Upload"}
            showFileNamesInPreview={true}
            dialogTitle={"Upload Image"}
            dropzoneText={"Drag and drop an image file here or click"}
        />
      </div>
  );
}

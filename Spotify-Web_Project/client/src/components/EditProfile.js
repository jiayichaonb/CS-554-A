import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import {makeStyles, Grid} from "@material-ui/core";
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  form: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '15ch',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
export default function FormDialog() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const initialFormData = Object.freeze({
    firstName: '',
    lastName: '',
    gender: '',
  });
  const [formData, SetFormData] = useState(initialFormData);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      let updateInfo = {
        userEmail: window.sessionStorage.userEmail,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
      };
      axios.post('http://localhost:5000/users/updateUser', updateInfo);
      window.location.reload()
    } catch (e) {
      console.log()
    }
  };
  const handleChange = (e) => {
    if (e.target.name && e.target.value) {
      SetFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  };

  return (
      <div>
        <Button variant="contained"
                color="primary"
                size="medium"
                onClick={handleClickOpen}
                startIcon={<EditIcon/>}>
          Edit
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <h1/>
          <DialogTitle id="form-dialog-title">Edit Profile Information</DialogTitle>
          <DialogContent>
            <form
                className={classes.form}
                onSubmit={handleSubmit}
            >
              <TextField className="form-group"
                         required
                         id="standard-required"
                         label="First Name"
                         name="firstName"
                         onChange={handleChange}
              />
              <TextField className="form-group"
                         required
                         id="outlined-required"
                         label="Last Name"
                         name="lastName"
                         onChange={handleChange}
              />
              <FormControl className={classes.formControl}>
                <InputLabel>gender</InputLabel>
                <Select
                    required
                    id="outlined-required"
                    name="gender"
                    value={formData.gender}
                    displayEmpty
                    className={classes.selectEmpty}
                    inputProps={{'aria-label': 'Without label'}}
                    onChange={handleChange}
                >
                  <MenuItem value={"Male"}> Male</MenuItem>
                  <MenuItem value={"Female"}>Female</MenuItem>
                  <MenuItem value={"Transgender"}>Transgender</MenuItem>
                  <MenuItem value={"Gender-neutral"}>Gender-neutral</MenuItem>
                  <MenuItem value={"Non-binary"}>Non-binary</MenuItem>
                  <MenuItem value={"Others"}>Others</MenuItem>
                </Select>
              </FormControl>
              <br/>
              <br/>
              <Grid container justify="flex-end">
                <Button onClick={handleClose} color="primary" align='right'>
                  Cancel
                </Button>
                <Button type="submit" color="primary" align='right'>
                  Submit
                </Button>
              </Grid>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
}

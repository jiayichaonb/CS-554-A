import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchShows from './SearchShows';
import PageOfSeriesList from './PageOfSeriesList';
import noImage from '../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';
import '../App.css';
import {baseUrl, searchHashUrl ,seriesListUrl} from '../key';

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});


const SeriesList = (props) => {
//   const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();

	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ seriesData, setSeriesData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ notFound, setNotFound ] = useState(false);
  let card = null;
  


	useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			try {
        const offsetValue = (parseInt(props.match.params.pagenum) * 12).toString();
        console.log(offsetValue);
				const { data } = await axios.get(seriesListUrl + '&limit=12&offset=' + offsetValue);
                setSeriesData(data.data.results);
				setLoading(false);
                setNotFound(false);
                if (data.data.results.length === 0) {
                    setNotFound(true);
          
                  }
			} catch (e) {
				console.log(e);
                setNotFound(true);
			}
		}
		fetchData();
	}, [props.match.params.pagenum]);
	
	 

	useEffect(
		() => {
			console.log('search useEffect fired');
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
                    const { data : search } = await axios.get(`${baseUrl}/series?${searchHashUrl}&limit=100&titleStartsWith=${searchTerm}`);
					setSearchData(search.data.results);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				fetchData();
			}
		},
		[ searchTerm ]
	);


	const searchValue = async (value) => {
		setSearchTerm(value);
	};
	const buildCard = (show) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/series/${show.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={show.thumbnail && (show.thumbnail==null)? noImage: `${show.thumbnail.path}.${show.thumbnail.extension}`}
								title='show image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
									{show.title}
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
  };
  
  if (searchTerm) {
		card =
			searchData &&
			searchData.map((show) => {
				return buildCard(show);
			});
	} else {
		card =
			seriesData &&
			seriesData.map((show) => {
				return buildCard(show);
			});
	}

    if (notFound) {
        return (
            <div>
                <h2>404 NOT FOUND</h2>
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
    else if (searchTerm){
        return (
        <div>
            <SearchShows searchValue={searchValue} />
            
            <br />
            <br />
            <Grid container className={classes.grid} spacing={5}>
            {card}
            </Grid>
        </div>
        );
    } else {
        return (
            <div>
              <SearchShows searchValue={searchValue} />
              <div>
                <PageOfSeriesList pageNo = {props.match.params.pagenum}/>
                
                  </div>
              <br />
              <br />
              <Grid container className={classes.grid} spacing={5}>
                {card}
              </Grid>
            </div>
          );
    }

};

export default SeriesList;

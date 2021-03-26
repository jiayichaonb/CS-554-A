import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import '../App.css';
import {baseUrl, hashUrl} from '../key';
const useStyles = makeStyles({
	card: {
		maxWidth: 550,
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

const SingleComic = (props) => {
	const [ singleComicData, setSingleComicData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);
    const [ notFound, setNotFound ] = useState(false);
    const [ charactersData, setCharactersData] = useState(undefined);
	const [ seriesData, setSeriesData] = useState(undefined);
	const classes = useStyles();
	
	const formatDate = (showdate) => {
		var year = showdate.substring(0, 4);
		var month = showdate.substring(5, 7);
		var day = showdate.substring(8, 10);
		return month + '/' + day + '/' + year;
	};
	useEffect(
		() => {
			console.log ("useEffect fired")
			async function fetchData() {
				try {
					const { data } = await axios.get(baseUrl + 'comics/' + props.match.params.id + hashUrl);
                    setSingleComicData(data.data.results[0]);
                    setCharactersData(data.data.results[0].characters);
                    setSeriesData(data.data.results[0].series);
					console.log(baseUrl + 'comics/' + props.match.params.id + hashUrl);
					console.log(data.data.results[0]);
                    console.log(singleComicData);
                    console.log(charactersData);
                    console.log(seriesData);

					setLoading(false);
				} catch (e) {
					console.log(e);
					setNotFound(true);
				}
			}
			fetchData();
		},
		[ props.match.params.id ]
    );
    
    //build the detail of comics
	let charactersItems = null;
	charactersItems = charactersData &&
	charactersData.items.map((character) => {
				return (
					<li>
					<Link to={`/characters${character.resourceURI.substring(character.resourceURI.lastIndexOf('/'))}`}>
						{character.name}
						
					</Link>
					</li>
					
				);
	});  

	

	let description = null;
	const regex = /(<([^>]+)>)/gi;
	if (singleComicData && singleComicData.description) {
		description = singleComicData && singleComicData.description.replace(regex, '');
	} else {
		description = 'No description';
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
	} else {
		return (
			<Card className={classes.card} variant='outlined'>
				<CardHeader className={classes.titleHead} title={singleComicData.title} />
				
				<CardMedia
					className={classes.media}
					component='img'
					image={singleComicData.thumbnail && (singleComicData.thumbnail==null)? noImage: `${singleComicData.thumbnail.path}.${singleComicData.thumbnail.extension}`}
					title='comic image'
				/>

				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>
							<p>
								<dt className='title'>Name:</dt>
								{singleComicData && singleComicData.title ? <dd>{singleComicData.title}</dd> : <dd>N/A</dd>}
							</p>
							
							
							
							
							<p>
								<dt className='title'>Modified:</dt>
								{singleComicData && singleComicData.modified ? <dd>{formatDate(singleComicData.modified)}</dd> : <dd>N/A</dd>}
							</p>
							
							
					
							<p>
								<dt className='title'>Summary:</dt>
								<dd>{description}</dd>
							</p>

                            <p>
								<dt className='title'>Find Related Characters:</dt>
								<dd>{charactersData.available}</dd>

							</p>

							<ul>
								{charactersItems}
							</ul>

							<p>
								<dt className='title'>Find Related Series:</dt>
								<dd>{''}</dd>

							</p>

                            <a href= {`/series${seriesData.resourceURI.substring(seriesData.resourceURI.lastIndexOf('/'))}`}> {seriesData.name} </a>

							
						</dl>
						<Link to='/comics/page/0'>Back to all comics...</Link>
					</Typography>
				</CardContent>
			</Card>
		);
	}
};

export default SingleComic;

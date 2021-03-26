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

const SingleSeries = (props) => {
	const [ singleSeriesData, setSingleSeriesData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);
    const [ notFound, setNotFound ] = useState(false);
    const [ charactersData, setCharactersData] = useState(undefined);
	const [ comicsData, setComicsData] = useState(undefined);
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
					const { data } = await axios.get(baseUrl + 'series/' + props.match.params.id + hashUrl);
                    setSingleSeriesData(data.data.results[0]);
                    setCharactersData(data.data.results[0].characters);
                    setComicsData(data.data.results[0].comics);

					console.log(baseUrl + 'series/' + props.match.params.id + hashUrl);
					console.log(data.data.results[0]);
					console.log(singleSeriesData);
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
    
	//build the detail of series
	let comicsItems = null;
	comicsItems = comicsData &&
	comicsData.items.map((comic) => {
				return (
					<li>
					<Link to={`/comics${comic.resourceURI.substring(comic.resourceURI.lastIndexOf('/'))}`}>
						{comic.name}
						
					</Link>
					</li>
					
				);
	});

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
	if (singleSeriesData && singleSeriesData.description) {
		description = singleSeriesData && singleSeriesData.description.replace(regex, '');
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
				<CardHeader className={classes.titleHead} title={singleSeriesData.title} />
				{/* <CardMedia
						className={classes.media}
						component='img'
						image={show.thumbnail && (show.thumbnail==null)? noImage: `${show.thumbnail.path}.${show.thumbnail.extension}`}
						title='show image'
				/>

				<CardContent>
					<Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
						{show.name}
					</Typography>
				</CardContent> */}
				<CardMedia
					className={classes.media}
					component='img'
					image={singleSeriesData.thumbnail && (singleSeriesData.thumbnail==null)? noImage: `${singleSeriesData.thumbnail.path}.${singleSeriesData.thumbnail.extension}`}
					title='series image'
				/>

				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>
							<p>
								<dt className='title'>Name:</dt>
								{singleSeriesData && singleSeriesData.title ? <dd>{singleSeriesData.title}</dd> : <dd>N/A</dd>}
							</p>
							
							
							
							<p>
								<dt className='title'>Modified:</dt>
								{singleSeriesData && singleSeriesData.modified ? <dd>{formatDate(singleSeriesData.modified)}</dd> : <dd>N/A</dd>}
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
								<dt className='title'>Find Related Comics:</dt>
								<dd>{comicsData.available}</dd>

							</p>

							<ul>
								{comicsItems}
							</ul>

							
						</dl>
						<Link to='/series/page/0'>Back to all series...</Link>
					</Typography>
				</CardContent>
			</Card>
		);
	}
};

export default SingleSeries;

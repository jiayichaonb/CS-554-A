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

const SingleCharacter = (props) => {
	const [ singleCharacterData, setSingleCharacterData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);
	const [ notFound, setNotFound ] = useState(false);
	const [ comicsData, setComicsData] = useState(undefined);
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
					const { data } = await axios.get(baseUrl + 'characters/' + props.match.params.id + hashUrl);
					setSingleCharacterData(data.data.results[0]);
					setComicsData(data.data.results[0].comics);
					setSeriesData(data.data.results[0].series);
					console.log(baseUrl + 'characters/' + props.match.params.id + hashUrl);
					console.log(data.data.results[0].comics);
					console.log(singleCharacterData);
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

	//build the detail of character
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

	let seriesItems = null;
	seriesItems = seriesData &&
	seriesData.items.map((series) => {
				return (
					<li>
					<Link to={`/series${series.resourceURI.substring(series.resourceURI.lastIndexOf('/'))}`}>
						{series.name}
						
					</Link>
					</li>
					
				);
	});

	let description = null;
	const regex = /(<([^>]+)>)/gi;
	if (singleCharacterData && singleCharacterData.description) {
		description = singleCharacterData && singleCharacterData.description.replace(regex, '');
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
				<CardHeader className={classes.titleHead} title={singleCharacterData.name} />
				
				<CardMedia
					className={classes.media}
					component='img'
					image={singleCharacterData.thumbnail && (singleCharacterData.thumbnail==null)? noImage: `${singleCharacterData.thumbnail.path}.${singleCharacterData.thumbnail.extension}`}
					title='character image'
				/>

				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>
							<p>
								<dt className='title'>Name:</dt>
								{singleCharacterData && singleCharacterData.name ? <dd>{singleCharacterData.name}</dd> : <dd>N/A</dd>}
							</p>
							
							
							
							
							<p>
								<dt className='title'>Modified:</dt>
								{singleCharacterData && singleCharacterData.modified ? <dd>{formatDate(singleCharacterData.modified)}</dd> : <dd>N/A</dd>}
							</p>
							
							
					
							<p>
								<dt className='title'>Summary:</dt>
								<dd>{description}</dd>
							</p>

							<p>
								<dt className='title'>Find Related Comics:</dt>
								<dd>{comicsData.available}</dd>

							</p>

							<ul>
								{comicsItems}
							</ul>

							<p>
								<dt className='title'>Find Related Series:</dt>
								<dd>{seriesData.available}</dd>

							</p>

							<ul>
								{seriesItems}
							</ul>

						</dl>
						<Link to='/characters/page/0'>Back to all characters...</Link>
					</Typography>
				</CardContent>
			</Card>
		);
	}
};
export default SingleCharacter;

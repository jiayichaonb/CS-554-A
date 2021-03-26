import React from 'react';
import classes from './BackgroundVideo.module.css';
import video from './video/marvel.mp4'
import './App.css';
import CharacterList from './components/CharacterList';
import ComicList from './components/ComicList';
import SeriesList from './components/SeriesList';
import Home from './components/Home';
import SingleCharacter from './components/SingleCharacter'
import SingleComic from './components/SingleComic'
import SingleSeries from './components/SingleSeries';

// import iron_man from './img/iron_man.jpeg'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
const App = () => {
	return (
		<Router>
			<div className='App'>
				<header className='App-header'>
				
					<div className={classes.Container} >
						<video autoPlay="autoplay" loop="loop" muted className={classes.Video} >
							<source src={video} type="video/mp4" />
							Your browser does not support the video tag.
						</video>

						<div className={classes.Content}>
							<div className={classes.SubContent} >
								<h1 className='App-title'>Welcome to the Marvel API World</h1>
								<Link className='showlink' to='/'>
									Home
								</Link>
								<Link className='showlink' to='/characters/page/0'>
									Characters
								</Link>
								<Link className='showlink' to='/comics/page/0'>
									Comics
								</Link>
								<Link className='showlink' to='/series/page/0'>
									Series
								</Link>
							</div>
						</div>
					</div>
				</header>
				<br />
				<br />
				<div className='App-body'>
					<Route exact path='/' component={Home} />
					<Route exact path='/characters/page/:pagenum' component={CharacterList} />
					<Route exact path='/comics/page/:pagenum' component={ComicList} />
					<Route exact path='/series/page/:pagenum' component={SeriesList} />
					<Route exact path='/characters/:id' component={SingleCharacter} />
					<Route exact path='/comics/:id' component={SingleComic} />
					<Route exact path='/series/:id' component={SingleSeries} />


				</div>
			</div>
		</Router>
	);
};

export default App;

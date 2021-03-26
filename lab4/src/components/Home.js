import React from 'react';
import '../App.css';

const Home = () => {

    return (
		<div>
			<p style={{fontSize:'60px'}}>
				Welcome To React Marvel Api World
			</p>

			<p className='hometext' style={{backgroundColor:'white', width:'500px'}}>
				The application queries three of Marvel's api end-points:{' '}
				
			</p>

			<p className='hometext' style={{backgroundColor:'white', width:'300px'}}>
				<a rel='noopener noreferrer' target='_blank' href='https://www.marvel.com/characters'>
					https://www.marvel.com/characters
				</a>{' '}
			</p>

			<p className='hometext' style={{backgroundColor:'white', width:'300px'}}>
				<a rel='noopener noreferrer' target='_blank' href='https://www.marvel.com/characters'>
					https://www.marvel.com/comics
				</a>{' '}
			</p>

			<p className='hometext' style={{backgroundColor:'white', width:'300px'}}>
				<a rel='noopener noreferrer' target='_blank' href='https://www.marvel.com/characters'>
					https://www.marvel.com/series
				</a>{' '}
			</p>

			
		</div>
        // <div className={classes.Container} >
        //     <video autoPlay="autoplay" loop="loop" muted className={classes.Video} >
        //         <source src={video} type="video/mp4" />
        //         Your browser does not support the video tag.
        //     </video>

        //     <div className={classes.Content}>
        //         <div className={classes.SubContent} >
        //             <h1>Reactjs Course</h1>
        //             <p>Learn how to develope React projects</p>
        //             <button type="button" className="btn btn-outline-dark">View the course</button>
        //             <img
        //                 src="https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
        //                 alt="profile" />
        //         </div>
        //     </div>
        // </div>
    )
};

export default Home;

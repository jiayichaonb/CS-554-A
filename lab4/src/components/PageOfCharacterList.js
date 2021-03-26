import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {characterListUrl} from '../key';


const PageOfCharacterList = (props) => {
    const [ haveNext, setHaveNext ] = useState(true);
    const [ havePrevious, setHavePrevious ] = useState(true);
    let previous = (parseInt(props.pageNo) - 1).toString();
    let next = (parseInt(props.pageNo) + 1).toString();
    let previousOffset = ((parseInt(props.pageNo) - 1) * 12).toString();
    let nextOffset = ((parseInt(props.pageNo) + 1) * 12).toString();

    let previousLink = "/characters/page/" + previous;
    let nextLink = "/characters/page/" + next;


    // if (parseInt(previous) < 0) {
    //     pageNegative = true;
    // }

    // if (parseInt(props.match.params.pagenum) === 205) {
    //     pageOutOfBound = true;
    // }

    useEffect(() => {
        console.log('on load useeffect');
        async function fetchData() {
            try {
                await axios.get(characterListUrl + '&limit=20&offset=' + previousOffset);
                setHavePrevious(true);
               
            } catch (e) {
                if (e.response.status === 500) {
                    setHavePrevious(false);
                }else {
                    setHavePrevious(true);

                }

                console.log(e);
            }
        }
        fetchData();
    }, [previousOffset]);

    useEffect(() => {
        console.log('on load useeffect');
        async function fetchData() {
            try {
                const { data } =  await axios.get(characterListUrl + '&limit=20&offset=' + nextOffset);
                if (data.data.results.length === 0) {
                    setHaveNext(false);
                }else {
                    setHaveNext(true);
                }
            } catch (e) {
                console.log(e);
                setHaveNext(false);
            }
        }
        fetchData();
    }, [nextOffset]);

    

    if (!havePrevious){
        return (

            <div>
                <Link to = {nextLink}>
                <button>Next</button>
                </Link>
            </div>
                

        );
    }
    else if (!haveNext) {
        return (
            <div>
                <Link to = {previousLink}>
                <button>Previous</button>
                </Link>
            </div>
        );
    }
    else {
        return (
            <div>
                <Link to = {previousLink}>
                <button>Previous</button>
                </Link>

                <Link to = {nextLink}>
                <button>Next</button>
                </Link>
            </div>
        );
    }
};

export default PageOfCharacterList;

const express = require('express');
const router = express.Router();
const redis = require('redis');
const bluebird = require('bluebird');
const client = redis.createClient();
const axios = require('axios');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/', async (req, res) => {
    let ifExist = await client.existsAsync('showListHomepage');
    if (ifExist) {
        //if exist, just send to client
        console.log("Show List From Cache");
        let showsHomePage = await client.getAsync('showListHomepage');
        console.log("Send HTML From Redis...");
        res.send(showsHomePage);
        return;
    }else {
        console.log("The Showlist Not Cached");
        //the showlist is not in the cache, now let's add and send it
        let {data} = await axios.get("http://api.tvmaze.com/shows");
        
        res.render('shows/showlist', {shows: data}, async (err, html) => {
            await client.setAsync('showListHomepage', html);
            res.send(html);
        });
    }  
});

router.get('/show/:id', async (req, res) => {
    let ifExist = await client.existsAsync(req.params.id);
    if (ifExist) {
        //if exit, just send to client
        console.log("Show The Detail from cache");
        let showDetailPage = await client.getAsync(req.params.id);
        console.log("Send HTML From Redis...");
        res.send(showDetailPage);
        return;
    }else{
        console.log("The show not in the cache");
        //the show is not in the cache, now let's add and send it
        let listUrl = 'http://api.tvmaze.com/shows';
        let url = listUrl + '/' + req.params.id;
        try {
            let {data} = await axios.get(url);
        }
        catch (e) {
            res.sendStatus(404);
        }
        let {data} = await axios.get(url);
        console.log(data);
        
        res.render('shows/show', {show: data}, async (err, html) => {
            await client.setAsync(req.params.id, html);
            res.send(html);
        });
    }
});

router.get('/popularsearches', async (req, res) => {
    const rank = await client.zrevrangeAsync('searchTexts', 0, 9);
    console.log("1 " +rank);
    let upperFirstChar = rank.map((element) => {
        return element.charAt(0).toUpperCase() + element.slice(1);
    });
    console.log("2 " +upperFirstChar);
    res.render('shows/topsearch', {rank: upperFirstChar});
});

router.post('/search', async (req, res) => {
    
    var str = req.body.searchText;

    if (req.body.searchText.length === 0 || !str.replace(/\s/g, '').length) {
        res.render('shows/searchresult', { error:"ERROR : BLANK SEARCH INPUT"});
        return;
    }
    let searchInRank = await client.zrankAsync('searchTexts', req.body.searchText);
    if (searchInRank !== null) {
        //found in searchTexts, increase by 1
        await client.zincrby('searchTexts', 1, req.body.searchText.toLowerCase());
    }else {
        //not found in searchTexts, add to searchTexts and set the score 1
        await client.zaddAsync('searchTexts', 1, req.body.searchText.toLowerCase());
    }

    //now we check id the search result in cache
    let ifExist = await client.existsAsync(req.body.searchText.toLowerCase());
    if (ifExist) {
        //the result is in cache, just send to client
        console.log("search result in cache");
        let searchResult = await client.getAsync(req.body.searchText.toLowerCase());
        console.log("Send HTML From Redis...");
        res.send(searchResult);
    }else{
        //not in cache, so we need to query the api and store html in the cache
        console.log("search result not in cache");
        let partOfUrl = "http://api.tvmaze.com/search/shows?q=";
        let queryText = req.body.searchText.toLowerCase();
        let url = partOfUrl + queryText;
        let {data} = await axios.get(url);

        res.render('shows/searchresult', {show: data}, async (err, html) => {
            await client.setAsync(req.body.searchText.toLowerCase(), html);
            res.send(html);
        });
    }
});

module.exports = router;
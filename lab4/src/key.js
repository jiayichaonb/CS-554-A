

const md5 = require('blueimp-md5');
const publickey = 'cacedd740f504be279a83b3b3efa5c7c';
const privatekey = '5d347ff458b3f4daa3a0644d52df153238fb235b';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/';
const hashUrl = `?ts=${ts}&apikey=${publickey}&hash=${hash}`;
const searchHashUrl = `ts=${ts}&apikey=${publickey}&hash=${hash}`;

const characterListUrl =`${baseUrl}characters?ts=${ts}&apikey=${publickey}&hash=${hash}`;
const comicsListUrl = `${baseUrl}comics?ts=${ts}&apikey=${publickey}&hash=${hash}`;
const seriesListUrl = `${baseUrl}series?ts=${ts}&apikey=${publickey}&hash=${hash}`;
export {baseUrl, hashUrl, searchHashUrl, characterListUrl, comicsListUrl, seriesListUrl}


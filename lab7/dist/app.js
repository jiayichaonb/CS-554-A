"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const pokemons_1 = require("./routes/pokemons");
var totalRequests = 0;
class App {
    constructor() {
        this.pokeRoutes = new pokemons_1.Pokemons();
        this.middleware_01 = (req, res, next) => {
            totalRequests++;
            //first middleware
            console.log("*********************");
            console.log(`There has been ${totalRequests} requests made to the site`);
            next();
        };
        this.middleware_02 = (req, res, next) => {
            //second middleware
            console.log("request body: ", req.body);
            console.log('request url path: ' + req.protocol + '://' + req.get('host') + req.originalUrl);
            console.log("request HTTP verb: ", req.method);
            next();
        };
        this.middleware_03 = (req, res, next) => {
            //third middleware
            const pathsAccessed = {};
            if (!pathsAccessed[req.path])
                pathsAccessed[req.path] = 0;
            pathsAccessed[req.path]++;
            console.log(`There have now been ${pathsAccessed[req.path]} requests made to ${req.path}`);
            console.log("All of the requests:\n", pathsAccessed);
            console.log("*********************\n");
            next();
        };
        this.app = express();
        this.config();
        this.pokeRoutes.routes(this.app);
    }
    config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.middleware_01);
        this.app.use(this.middleware_02);
        this.app.use(this.middleware_03);
    }
}
exports.default = new App().app;

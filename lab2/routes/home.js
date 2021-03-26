const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    try{
        res.render('layouts/main');
    }catch{
        res.sendStatus(500);
    }
});

module.exports = router;
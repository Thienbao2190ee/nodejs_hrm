const cityController = require("../controllers/city.controller");
const router = require('express').Router();

module.exports = app => {
    //getall
    router.get("/getall", cityController.getAll);
    
    app.use('/api/city', router);
}
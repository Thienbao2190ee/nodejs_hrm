const districtsController = require("../controllers/districts.controller");
const router = require('express').Router();

module.exports = app => {
    //getall
    router.get("/getall", districtsController.getAll);
    
    app.use('/api/districts', router);
}
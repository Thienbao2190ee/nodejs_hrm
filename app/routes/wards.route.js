const wardsController = require("../controllers/wards.controller");
const router = require('express').Router();

module.exports = app => {
    //getall
    router.get("/getall", wardsController.getAll);
    
    app.use('/api/wards', router);
}
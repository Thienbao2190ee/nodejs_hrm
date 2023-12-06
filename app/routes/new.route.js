const newController = require("../controllers/new.controller");
const router = require('express').Router();
const {body} = require('express-validator');
const uploadImages = require('../middlewares/uploadMiddleware');

module.exports = app => {
    //register
    router.post('/register',uploadImages.single('image'),[
        body('title','Tiêu đề không được bỏ trống').notEmpty(),
        body('des','Mô tả không được bỏ trống').notEmpty(),
    ], newController.register)

    router.put('/updatebyid/:id',uploadImages.single('image'),[
        body('title','Tiêu đề không được bỏ trống').notEmpty(),
        body('des','Mô tả không được bỏ trống').notEmpty(),
    ], newController.update)


    app.use('/api/new', router);
}
const hrmController = require("../controllers/hrm.controller");
const router = require('express').Router();
const {body} = require('express-validator');

module.exports = app => {
    //register
    router.post('/register',[
        body('name','Họ và tên không được bỏ trống')
        .notEmpty(),
        body('email','Email không được bỏ trống')
        .notEmpty(),
        body('phone','Số điện thoại không được bỏ trống')
        .notEmpty(),
        body('gender','Giới tính không được bỏ trống')
        .notEmpty(),
        body('birth','Ngày sinh không được bỏ trống')
        .notEmpty(),
        body('hometown','Nguyên quán không được bỏ trống')
        .notEmpty(),
    ], hrmController.register)
    //register
    router.put('/updatebyid/:id',[
        body('name','Họ và tên không được bỏ trống')
        .notEmpty(),
        body('email','Email không được bỏ trống')
        .notEmpty(),
        body('phone','Số điện thoại không được bỏ trống')
        .notEmpty(),
        body('gender','Giới tính không được bỏ trống')
        .notEmpty(),
        body('birth','Ngày sinh không được bỏ trống')
        .notEmpty(),
        body('hometown','Nguyên quán không được bỏ trống')
        .notEmpty(),
    ], hrmController.update)
    router.delete('/delete/:id',hrmController.delete)
    

    app.use('/api/hrm', router);
}
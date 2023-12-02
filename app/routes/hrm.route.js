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
    // router.post('/login',[
    //     body('email','Email không được bỏ trống')
    //     .notEmpty(),
    //     body('password','Mật khẩu không được bỏ trống')
    //     .notEmpty(),
    // ], hrmController.login)

    // router.post('/check-code',[
    //     body('email','Email không được bỏ trống')
    //     .notEmpty(),
    //     body('code','Mã không được bỏ trống')
    //     .notEmpty(),
    // ], hrmController.sendEmail)

    app.use('/api/hrm', router);
}
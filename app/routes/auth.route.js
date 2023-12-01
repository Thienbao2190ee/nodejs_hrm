const authController = require("../controllers/auth.controller");
const router = require('express').Router();
const {body} = require('express-validator');

module.exports = app => {
    //register
    router.post('/register',[
        body('fullName','Họ và tên không được bỏ trống')
        .notEmpty(),
        body('email','Email không được bỏ trống')
        .notEmpty(),
        body('password','Mật khẩu không được bỏ trống')
        .notEmpty(),
    ], authController.register)
    router.post('/login',[
        body('email','Email không được bỏ trống')
        .notEmpty(),
        body('password','Mật khẩu không được bỏ trống')
        .notEmpty(),
    ], authController.login)

    router.post('/check-code',[
        body('email','Email không được bỏ trống')
        .notEmpty(),
        body('code','Mã không được bỏ trống')
        .notEmpty(),
    ], authController.sendEmail)

    app.use('/api/auth', router);
}
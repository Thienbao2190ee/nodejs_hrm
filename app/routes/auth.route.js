const authController = require("../controllers/auth.controller");
const router = require('express').Router();
const {body} = require('express-validator');

module.exports = app => {
    //register
    router.post('/register',[
        body('fullName','Họ và tên không được bỏ trống')
        .notEmpty(),
        body('account','Tên đăng nhập không được bỏ trống')
        .notEmpty(),
        body('password','Mật khẩu không được bỏ trống')
        .notEmpty(),
    ], authController.register)
    router.post('/login',[
        body('account','Tên đăng nhập không được bỏ trống')
        .notEmpty(),
        body('password','Mật khẩu không được bỏ trống')
        .notEmpty(),
    ], authController.login)

    app.use('/api/auth', router);
}
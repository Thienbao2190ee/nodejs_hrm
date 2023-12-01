const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../models/connectDB");
const jwt = require("../helper/auth.helper");
const regex = require("../ultils/regex.js");
const authService = require("../services/auth.service");
const constantNotify = require("../config/constantNotify.js");
const { generateRandomNumberWithLength } = require("../ultils/randomNumber.js");
const sendEmail = require("../ultils/sendEmail.js");
const e = require("method-override");
const authRoute = require("../routes/auth.route.js");

const tableName = "tbl_user";
//register
exports.register = async (req, res) => {
  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      console.log(error);
      return res.send({ result: false, error: error.array() });
    }
    const errors = [];

    const { fullName, email, password } = req.body;

    if (!regex.regexEmail.test(email)) {
      errors.push({ param: "email", msg: constantNotify.VALIDATE_EMAIL });
    }

    if (!regex.regexAccount.test(password) || password.length < 9) {
      errors.push({ param: "password", msg: constantNotify.VALIDATE_PASSWORD });
    }

    if (errors.length > 0) {
      return res.send({
        result: false,
        error: errors,
      });
    }

    //check account
    db.getConnection((err, conn) => {
      if (err) {
        console.log("connect db fail");
        return;
      }
      conn.query(
        `SELECT email FROM ${tableName} WHERE email = ?`,
        email,
        async (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }

          if (dataRes.length !== 0) {
            await res.send({
              result: false,
              error: [
                {
                  param: "email",
                  msg: `Email ${constantNotify.ALREADY_EXITS}`,
                },
              ],
            });
            return;
          }
          const salt = await bcrypt.genSalt(12);
          const hashPass = await bcrypt.hash(password, salt);
          const accessToken = await jwt.make({ fullName: fullName });
          const refreshToken = await jwt.refreshToken({ fullName: fullName });
          const generateOTP = generateRandomNumberWithLength(6);
          const dataSendEmail = {
            to: email,
            text: "Hey user",
            subject: "Xác thực tài khoản",
            html: `Đây là mail xác thực tài khoản của bạn vui lòng nhập mã OTP bên dưới ở trang đăng kí để xác minh tài khoản <br/>
                  Mã OTP là ${generateOTP}  
                  `,
          };
          await sendEmail(dataSendEmail)
            .then((resDataSendEmail) => {
              const data = {
                email: email,
                fullName: fullName,
                password: hashPass,
                refreshToken,
                accessToken,
                createdAt: Date.now(),
                updatedAt: null,
                generateOTP: generateOTP,
              };

              authService.register(data, (err, res_) => {
                if (err) {
                  res.send({ result: false, error: [err] });
                } else {
                  res.send({
                    result: true,
                    msg: constantNotify.REGISTER_SUCCESS,
                  });
                  // conn.query(
                  //   `SELECT id,refreshToken,accessToken FROM ${tableName} WHERE id = ?`,
                  //   res_,
                  //   (err, dataRes) => {
                  //     if (err) {
                  //       return res.send({
                  //         result: false,
                  //         error: [{ msg: constantNotify.ERROR }],
                  //       });
                  //     }
                      
                  //   }
                  // );
                }
              });
              // return res.send({
              //   result: true,
              //   data: {
              //     msg: constantNotify.SEND_SUCCESS,
              //     newData: {
              //       code: generateOTP,
              //     },
              //   },
              // });
            })
            .catch((err) => {
              return res.send({
                result: false,
                error: [{ msg: constantNotify.ERROR }],
              });
            });
        }
      );
      conn.release();
    });
  } catch (error) {
    console.log(error);
  }
};
//login
exports.login = async (req, res) => {
  try {
    console.log(123);
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.send({ result: false, error: error.array() });
    }
    const { email, password } = req.body;

    const errors = [];

    if (!regex.regexEmail.test(email)) {
      errors.push({ param: "email", msg: constantNotify.VALIDATE_EMAIL });
    }

    if (!regex.regexAccount.test(password) || password.length < 9) {
      errors.push({ param: "password", msg: constantNotify.VALIDATE_PASSWORD });
    }

    if (errors.length > 0) {
      return res.send({
        result: false,
        error: errors,
      });
    }
    
    authService.login(email, password, (err, res_) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      res.send({
        result: true,
        msg: constantNotify.LOGIN_SUCCESS,
        data: res_,
      });
    });
  } catch (error) {
    console.log(error);
  }
};
// sendEmail
exports.sendEmail = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.send({ result: false, error: error.array() });
    }
    const { code, email } = req.body;

    authService.checkCodeGmail(email,code,(err, res_) => {
      if(err){
        return res.send({
          result: false,
          error: [err],
        });
      }
      res.send({
        result: true,
        msg: constantNotify.CODE_SUCCESS,
        newData: res_,
      });

    })

   
  } catch (error) {
    console.log(error);
  }
};

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../models/connectDB");
const jwt = require("../helper/auth.helper");
const regex = require("../ultils/regex.js");
const authService = require("../services/auth.service");
const constantNotify = require("../config/constantNotify.js");

const tableName = "tbl_user";
//register
exports.register = async (req, res) => {
  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      console.log(error);
      return res.send({ result: false, error: error.array() });
    }
    const { fullName, account, password } = req.body;

    const errors = [];

    if (!regex.regexAccount.test(account)) {
      errors.push({ param: "account", msg: constantNotify.VALIDATE_ACCOUNT });
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
        `SELECT account FROM ${tableName} WHERE account = ?`,
        account,
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
                  param: "account",
                  msg: `Tài khoản ${constantNotify.ALREADY_EXITS}`,
                },
              ],
            });
            return;
          }
          const salt = await bcrypt.genSalt(12);
          const hashPass = await bcrypt.hash(password, salt);
          const accessToken = await jwt.make({ fullName: fullName });
          const refreshToken = await jwt.refreshToken({ fullName: fullName });
          const data = {
            account: account,
            fullName: fullName,
            password: hashPass,
            refreshToken,
            accessToken,
            createdAt: Date.now(),
            updatedAt: null,
          };

          // console.log(data);

          authService.register(data, (err, res_) => {
            if (err) {
              res.send({ result: false, error: [err] });
            } else {
              conn.query(
                `SELECT id,refreshToken,accessToken FROM ${tableName} WHERE id = ?`,
                res_,
                (err, dataRes) => {
                  if (err) {
                    return res.send({
                      result: false,
                      error: [{ msg: constantNotify.ERROR }],
                    });
                  }
                  res.send({
                    result: true,
                    data: {
                      msg: constantNotify.REGISTER_SUCCESS,
                      newData: dataRes,
                    },
                  });
                }
              );
            }
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
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.send({ result: false, error: errors.array() });
    }
    const { account, password } = req.body;

    const errors = [];

    if (!regex.regexAccount.test(account)) {
      errors.push({ param: "account", msg: constantNotify.VALIDATE_ACCOUNT });
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

    authService.login(account,password,(err, res_) => {
      if (err) {
          return res.send({
              result: false,
              error: [err],
          });
      }

      res.send({
          result: true,
          msg:constantNotify.LOGIN_SUCCESS,
          data: res_,
      });
  })


  } catch (error) {
    console.log(error);
  }
};

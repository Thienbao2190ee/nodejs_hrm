const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../models/connectDB");
const regex = require("../ultils/regex.js");
const hrmService = require("../services/hrm.service");
const constantNotify = require("../config/constantNotify.js");

const tableName = "tbl_hrm";
//register
exports.register = async (req, res) => {
  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      console.log(error);
      return res.send({ result: false, error: error.array() });
    }

    const { name, email, phone, gender, birth, hometown } = req.body;

    if (!regex.regexEmail.test(email)) {
      return res.send({
        result: false,
        error: [{ param: "email", msg: constantNotify.VALIDATE_EMAIL }],
      });
    }

    if (!regex.regexPhone.test(phone)) {
      return res.send({
        result: false,
        error: [{ param: "phone", msg: constantNotify.VALIDATE_PHONE }],
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
        [email],
        async (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }

          if (dataRes.length !== 0) {
            if (dataRes[0]?.email) {
              return res.send({
                result: false,
                error: [
                  {
                    param: "email",
                    msg: `Email ${constantNotify.ALREADY_EXITS}`,
                  },
                ],
              });
            }
          }
          conn.query(
            `SELECT phone FROM ${tableName} WHERE phone = ?`,
            [phone],
            async (err, dataRes) => {
              if (err) {
                return res.send({
                  result: false,
                  error: [{ msg: constantNotify.ERROR }],
                });
              }
              console.log("=====", dataRes);
              if (dataRes.length !== 0) {
                if (dataRes[0]?.phone) {
                  return res.send({
                    result: false,
                    error: [
                      {
                        param: "phone",
                        msg: `Số điện thoại ${constantNotify.ALREADY_EXITS}`,
                      },
                    ],
                  });
                }
              }
              const data = {
                name: name,
                email: email,
                phone: phone,
                birth: birth,
                gender: gender,
                hometown: hometown,
                createdAt: Date.now(),
                updatedAt: null,
              };

              hrmService.register(data, (err, res_) => {
                try {
                  if (err) {
                    return res.send({
                      result: false,
                      error: [err],
                    });
                  }
                  // console.log('_____',res_);
                  conn.query(
                    `SELECT * FROM ${tableName} WHERE id = ?`,
                    res_,
                    (err, dataRes) => {
                      // console.log(dataRes);
                      if (err) {
                        return res.send({
                          result: false,
                          error: [err],
                        });
                      }
                      return res.send({
                        result: true,
                        newData: dataRes,
                      });
                    }
                  );
                } catch (error) {
                  console.log("hrm register ====>", error);
                }
              });
            }
          );
        }
      );
      conn.release();
    });
  } catch (error) {
    console.log(error);
  }
};

//register
exports.update = async (req, res) => {
  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      console.log(error);

      return res.send({ result: false, error: error.array() });
    }

    const { name, email, phone, gender, birth, hometown } = req.body;

    const id = req.params.id;

    if (!regex.regexEmail.test(email)) {
      return res.send({
        result: false,
        error: [{ param: "email", msg: constantNotify.VALIDATE_EMAIL }],
      });
    }

    if (!regex.regexPhone.test(phone)) {
      return res.send({
        result: false,
        error: [{ param: "phone", msg: constantNotify.VALIDATE_PHONE }],
      });
    }

    //check account
    db.getConnection((err, conn) => {
      if (err) {
        console.log("connect db fail");
        return;
      }
      conn.query(
        `SELECT id,email FROM ${tableName} WHERE email =?`,
        [email],
        async (err, dataRes) => {
          if (err) {
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }

          if (
            dataRes?.length > 0 &&
            Number(dataRes[0]?.id) !== Number(id) &&
            dataRes[0]?.email
          ) {
            return res.send({
              result: false,
              error: [
                {
                  param: "email",
                  msg: `Email ${constantNotify.ALREADY_EXITS}`,
                },
              ],
            });
          }
          conn.query(
            `SELECT id,phone FROM ${tableName} WHERE phone =?`,
            [phone],
            async (err, dataRes) => {
              if (err) {
                return res.send({
                  result: false,
                  error: [{ msg: constantNotify.ERROR }],
                });
              }
              if (
                dataRes?.length > 0 &&
                Number(dataRes[0]?.id) !== Number(id) &&
                dataRes[0]?.phone
              ) {
                return res.send({
                  result: false,
                  error: [
                    {
                      param: "phone",
                      msg: `Số điện thoại ${constantNotify.ALREADY_EXITS}`,
                    },
                  ],
                });
              }
              const data = {
                name: name,
                email: email,
                phone: phone,
                birth: birth,
                gender: gender,
                hometown: hometown,
                updatedAt: Date.now(),
              };

              hrmService.updateById(id, data, (err, res_) => {
                try {
                  if (err) {
                    return res.send({
                      result: false,
                      error: [err],
                    });
                  }
                  const newData = {
                    id,
                    ...data,
                  };
                  return res.send({
                    result: true,
                    data: {
                      msg: constantNotify.UPDATE_DATA_SUCCESS,
                      newData: newData,
                    },
                  });
                } catch (error) {
                  console.log("hrm update ====>", error);
                }
              });
            }
          );
        }
      );
      conn.release();
    });
  } catch (error) {
    console.log(error);
  }
};

exports.delete = async (req, res) => {
  try {
      const id = req.params.id;
      hrmService.delete(id, (err, res_) => {
          if (err) {
              return res.send({
                  result: false,
                  error: [err],
              });
          }

          res.send({
              result: true,
              data: { msg: constantNotify.DELETE_DATA_SUCCESS },
          });
      });
  } catch (error) {
      res.send({
          result: false,
          error: [{ msg: constantNotify.SERVER_ERROR }],
      });
  }
};

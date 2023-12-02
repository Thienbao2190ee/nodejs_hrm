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
        console.log('fhwdf');
      console.log(error);
      return res.send({ result: false, error: error.array() });
    }

    const { name, email, phone, gender, birth, hometown } = req.body;

    console.log(phone);

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
        `SELECT email,phone FROM ${tableName} WHERE email = ?`,
        [email, phone],
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
            ;
          }
          const data = {
            name: name,
            email: email,
            phone: phone,
            birth: birth,
            gender : gender,
            hometown : hometown	,
            createdAt: Date.now(),
            updatedAt: null,
          };

          hrmService.register(data,(err, res_) => {
            try {
                if(err){
                    return res.send({
                        result : false,
                        error : [err]
                    })
                }
                // console.log('_____',res_);
                conn.query(`SELECT * FROM ${tableName} WHERE id = ?`,res_,(err,dataRes) => {
                    // console.log(dataRes);
                    if(err) {
                        return res.send({
                            result : false,
                            error : [err]
                        })
                    }
                    return res.send({
                        result : true,
                        newData : dataRes
                    })

                })
            } catch (error) {
                console.log('hrm register ====>',error);
            }   
          })


        }
      );
      conn.release();
    });
  } catch (error) {
    console.log(error);
  }
};

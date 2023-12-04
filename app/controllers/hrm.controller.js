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

    const {
      name,
      email,
      phone,
      gender,
      birth,
      address,
      cityID,
      districtID,
      wardID,
    } = req.body;

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
                address: address,
                cityID: cityID,
                districtID: districtID,
                wardID: wardID,
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
                      conn.query(
                        `SELECT full_name FROM tbl_city WHERE id = ?`,
                        dataRes[0].cityID,
                        (err, _res) => {
                          if (err) {
                            return res.send({
                              result: false,
                              error: constantNotify.ERROR,
                            });
                          }
                          dataRes[0].cityName = _res[0].full_name;
                          conn.query(
                            `SELECT full_name FROM tbl_districts WHERE id = ?`,
                            dataRes[0].districtID,
                            (err, _res) => {
                              if (err) {
                                return res.send({
                                  result: false,
                                  error: constantNotify.ERROR,
                                });
                              }
                              dataRes[0].districtName = _res[0].full_name;
                              conn.query(
                                `SELECT full_name FROM tbl_wards WHERE id = ?`,
                                dataRes[0].wardID,
                                (err, _res) => {
                                  if (err) {
                                    return res.send({
                                      result: false,
                                      error: constantNotify.ERROR,
                                    });
                                  }
                                  dataRes[0].wardName = _res[0].full_name;
                                  return res.send({
                                    result: true,
                                    msg: constantNotify.ADD_DATA_SUCCESS,
                                    newData: dataRes,
                                  });
                                }
                              );
                            }
                          );
                        }
                      );
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

//get all
exports.getAll = async (req, res) => {
  try {
    let total = await hrmService.getTotal(); // total data row
    const dataSearch = req.query;
    let offset = 0;
    let limit = 10;

    if (dataSearch.offset) {
      offset = dataSearch.offset;
    }

    if (dataSearch.limit) {
      limit = dataSearch.limit;
    }

    hrmService.getAll(dataSearch, offset, limit, (err, dataRes) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }

      // Calculate TotalPage
      const totalPage = Math.ceil(total / limit);
      db.getConnection((err, conn) => {
        if (err) {
          console.log("connect db fail");
          return;
        }
        conn.query(
          `SELECT full_name FROM tbl_city WHERE id = ?`,
          dataRes[0].cityID,
          (err, _res) => {
            if (err) {
              return res.send({
                result: false,
                error: constantNotify.ERROR,
              });
            }
            dataRes[0].cityName = _res[0].full_name;
            conn.query(
              `SELECT full_name FROM tbl_districts WHERE id = ?`,
              dataRes[0].districtID,
              (err, _res) => {
                if (err) {
                  return res.send({
                    result: false,
                    error: constantNotify.ERROR,
                  });
                }
                dataRes[0].districtName = _res[0].full_name;
                conn.query(
                  `SELECT full_name FROM tbl_wards WHERE id = ?`,
                  dataRes[0].wardID,
                  (err, _res) => {
                    if (err) {
                      return res.send({
                        result: false,
                        error: constantNotify.ERROR,
                      });
                    }
                    dataRes[0].wardName = _res[0].full_name;
                    return res.send({
                      result: true,
                      totalPage: totalPage ? totalPage : 0,
                      newData: dataRes,
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  } catch (error) {
    console.log(error);
    return res.send({
      result: false,
      error: [{ msg: constantNotify.SERVER_ERROR }],
    });
  }
};

//get all
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;

    hrmService.getbyid(id, (err, dataRes) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      db.getConnection((err, conn) => {
        if (err) {
          console.log("connect db fail");
          return;
        }
        conn.query(
          `SELECT full_name FROM tbl_city WHERE id = ?`,
          dataRes[0].cityID,
          (err, _res) => {
            if (err) {
              return res.send({
                result: false,
                error: constantNotify.ERROR,
              });
            }
            dataRes[0].cityName = _res[0].full_name;
            conn.query(
              `SELECT full_name FROM tbl_districts WHERE id = ?`,
              dataRes[0].districtID,
              (err, _res) => {
                if (err) {
                  return res.send({
                    result: false,
                    error: constantNotify.ERROR,
                  });
                }
                dataRes[0].districtName = _res[0].full_name;
                conn.query(
                  `SELECT full_name FROM tbl_wards WHERE id = ?`,
                  dataRes[0].wardID,
                  (err, _res) => {
                    if (err) {
                      return res.send({
                        result: false,
                        error: constantNotify.ERROR,
                      });
                    }
                    dataRes[0].wardName = _res[0].full_name;
                    return res.send({
                      result: true,
                      newData: dataRes,
                    });
                  }
                );
              }
            );
          }
        );
      });

      // Calculate TotalPage
    });
  } catch (error) {
    console.log(error);
    return res.send({
      result: false,
      error: [{ msg: constantNotify.SERVER_ERROR }],
    });
  }
};

//update
exports.update = async (req, res) => {
  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      console.log(error);

      return res.send({ result: false, error: error.array() });
    }

    const {
      name,
      email,
      phone,
      gender,
      birth,
      address,
      cityID,
      districtID,
      wardID,
    } = req.body;

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
                address: address,
                cityID: cityID,
                districtID: districtID,
                wardID: wardID,
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
                  const dataRes = [
                    {
                      id,
                      ...data,
                    },
                  ];

                  conn.query(
                    `SELECT full_name FROM tbl_city WHERE id = ?`,
                    dataRes[0].cityID,
                    (err, _res) => {
                      if (err) {
                        return res.send({
                          result: false,
                          error: constantNotify.ERROR,
                        });
                      }
                      dataRes[0].cityName = _res[0].full_name;
                      conn.query(
                        `SELECT full_name FROM tbl_districts WHERE id = ?`,
                        dataRes[0].districtID,
                        (err, _res) => {
                          if (err) {
                            return res.send({
                              result: false,
                              error: constantNotify.ERROR,
                            });
                          }
                          dataRes[0].districtName = _res[0].full_name;
                          conn.query(
                            `SELECT full_name FROM tbl_wards WHERE id = ?`,
                            dataRes[0].wardID,
                            (err, _res) => {
                              if (err) {
                                return res.send({
                                  result: false,
                                  error: constantNotify.ERROR,
                                });
                              }
                              dataRes[0].wardName = _res[0].full_name;
                              return res.send({
                                result: true,
                                msg: constantNotify.UPDATE_DATA_SUCCESS,
                                newData: dataRes,
                              });
                            }
                          );
                        }
                      );
                    }
                  );
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
//delete
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
        msg: constantNotify.DELETE_DATA_SUCCESS,
      });
    });
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: constantNotify.SERVER_ERROR }],
    });
  }
};

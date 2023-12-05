const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../models/connectDB");
const regex = require("../ultils/regex.js");
const hrmService = require("../services/hrm.service");
const constantNotify = require("../config/constantNotify.js");
const { getYearFromTimestamp } = require("../ultils/getYear.js");

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
        async (err, _res) => {
          if (err) {
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }

          if (_res.length !== 0) {
            if (_res[0]?.email) {
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
            async (err, _res) => {
              if (err) {
                return res.send({
                  result: false,
                  error: [{ msg: constantNotify.ERROR }],
                });
              }
              console.log("=====", _res);
              if (_res.length !== 0) {
                if (_res[0]?.phone) {
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
                        `SELECT tbl_city.full_name AS cityName,tbl_city.id AS cityID, tbl_districts.full_name AS districtName,tbl_districts.id AS districtID, tbl_wards.full_name AS wardName,tbl_wards.id AS wardID
                      FROM tbl_hrm
                      JOIN tbl_city ON tbl_hrm.cityID = tbl_city.id
                      JOIN tbl_districts ON tbl_hrm.districtID = tbl_districts.id
                      JOIN tbl_wards ON tbl_hrm.wardID = tbl_wards.id
                      ORDER BY tbl_hrm.id DESC`,
                        (err, _res) => {
                          if (err) {
                            return res.send({
                              result: false,
                              error: constantNotify.ERROR,
                            });
                          }
                          dataRes.forEach((item) => {
                            const matchingItem = _res.find(
                              (resItem) =>
                                resItem.cityID === item.cityID &&
                                resItem.districtID === item.districtID &&
                                resItem.wardID === item.wardID
                            );

                            if (matchingItem) {
                              item.cityName = matchingItem.cityName;
                              item.districtName = matchingItem.districtName;
                              item.wardName = matchingItem.wardName;
                            }
                          });
                          return res.send({
                            result: true,
                            msg: constantNotify.ADD_DATA_SUCCESS,
                            newData: dataRes,
                          });
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
    // let total = await hrmService.getTotal(); // total data row
    const dataSearch = req.query;
    let offset = 0;
    let limit = 10;

    if (dataSearch.offset) {
      offset = dataSearch.offset;
    }

    if (dataSearch.limit) {
      limit = dataSearch.limit;
    }

    hrmService.getAll(dataSearch, offset, limit, (err, totalCount,dataRes) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      if (dataSearch.yearbirth) {
        
        const newDate = dataRes.filter((item) => getYearFromTimestamp(item.birth) == dataSearch.yearbirth);
        dataRes = newDate
      }
      // Calculate TotalPage
      const totalPage = Math.ceil(totalCount / limit);
      return res.send({
        result: true,
        totalPage: totalPage ? totalPage : 0,
        newData: dataRes,
      });
      // db.getConnection((err, conn) => {
      //   if (err) {
      //     console.log("connect db fail");
      //     return;
      //   }
      //   conn.query(
      //     `SELECT tbl_city.full_name AS cityName,tbl_city.id AS cityID, tbl_districts.full_name AS districtName,tbl_districts.id AS districtID, tbl_wards.full_name AS wardName,tbl_wards.id AS wardID
      //   FROM tbl_hrm
      //   JOIN tbl_city ON tbl_hrm.cityID = tbl_city.id
      //   JOIN tbl_districts ON tbl_hrm.districtID = tbl_districts.id
      //   JOIN tbl_wards ON tbl_hrm.wardID = tbl_wards.id
      //   ORDER BY tbl_hrm.id DESC`,
      //     (err, _res) => {
      //       if (err) {
      //         return res.send({
      //           result: false,
      //           error: constantNotify.ERROR,
      //         });
      //       }
      //       dataRes.forEach((item) => {
      //         const matchingItem = _res.find((resItem) =>
      //           resItem.cityID === item.cityID &&
      //           resItem.districtID === item.districtID &&
      //           resItem.wardID === item.wardID
      //         );

      //         if (matchingItem) {
      //           item.cityName = matchingItem.cityName;
      //           item.districtName = matchingItem.districtName;
      //           item.wardName = matchingItem.wardName;
      //         }
      //       });

      //       return res.send({
      //         result: true,
      //         totalPage: totalPage ? totalPage : 0,
      //         newData: dataRes,
      //       });
      //     }
      //   );
      // });
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
      return res.send({
        result: true,
        newData: dataRes,
      });
      // db.getConnection((err, conn) => {
      //   if (err) {
      //     console.log("connect db fail");
      //     return;
      //   }
      //   conn.query(
      //     `SELECT tbl_city.full_name AS cityName,tbl_city.id AS cityID, tbl_districts.full_name AS districtName,tbl_districts.id AS districtID, tbl_wards.full_name AS wardName,tbl_wards.id AS wardID
      //   FROM tbl_hrm
      //   JOIN tbl_city ON tbl_hrm.cityID = tbl_city.id
      //   JOIN tbl_districts ON tbl_hrm.districtID = tbl_districts.id
      //   JOIN tbl_wards ON tbl_hrm.wardID = tbl_wards.id
      //   ORDER BY tbl_hrm.id DESC`,
      //     (err, _res) => {
      //       if (err) {
      //         return res.send({
      //           result: false,
      //           error: constantNotify.ERROR,
      //         });
      //       }
      //       dataRes.forEach((item) => {
      //         const matchingItem = _res.find((resItem) =>
      //           resItem.cityID === item.cityID &&
      //           resItem.districtID === item.districtID &&
      //           resItem.wardID === item.wardID
      //         );

      //         if (matchingItem) {
      //           item.cityName = matchingItem.cityName;
      //           item.districtName = matchingItem.districtName;
      //           item.wardName = matchingItem.wardName;
      //         }
      //       });
      //       return res.send({
      //         result: true,
      //         newData: dataRes,
      //       });
      //     }
      //   );
      //   conn.release()
      // });

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
                    `SELECT tbl_city.full_name AS cityName,tbl_city.id AS cityID, tbl_districts.full_name AS districtName,tbl_districts.id AS districtID, tbl_wards.full_name AS wardName,tbl_wards.id AS wardID
                  FROM tbl_hrm
                  JOIN tbl_city ON tbl_hrm.cityID = tbl_city.id
                  JOIN tbl_districts ON tbl_hrm.districtID = tbl_districts.id
                  JOIN tbl_wards ON tbl_hrm.wardID = tbl_wards.id
                  ORDER BY tbl_hrm.id DESC`,
                    (err, _res) => {
                      if (err) {
                        return res.send({
                          result: false,
                          error: constantNotify.ERROR,
                        });
                      }
                      dataRes.forEach((item) => {
                        const matchingItem = _res.find(
                          (resItem) =>
                            resItem.cityID === item.cityID &&
                            resItem.districtID === item.districtID &&
                            resItem.wardID === item.wardID
                        );

                        if (matchingItem) {
                          item.cityName = matchingItem.cityName;
                          item.districtName = matchingItem.districtName;
                          item.wardName = matchingItem.wardName;
                        }
                      });
                      return res.send({
                        result: true,
                        msg: constantNotify.UPDATE_DATA_SUCCESS,
                        newData: dataRes,
                      });
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

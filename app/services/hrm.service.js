const constantNotify = require("../config/constantNotify");
const db = require("../models/connectDB");
const tableName = "tbl_hrm";
//register
exports.register = async (data, result) => {
  try {
    const query = `INSERT INTO ${tableName} SET ?`;
    db.query(query, data, async (err, dataRes) => {
      if (err) {
        console.log("=====", err);
        return result({ msg: constantNotify.ERROR }, null);
      }

      result(null, dataRes.insertId);
    });
  } catch (error) {
    // console.log(error);
    result({ msg: constantNotify.SERVER_ERROR }, null);
  }
};
// exports.getAll = async (keySearch, offset, limit, result) => {
//     try {
//         let query = `SELECT * FROM ${tableName} W `;

//         if (keySearch.gender) {
//             query += `WHERE gender = ${keySearch.gender} `;
//         }

//         if (keySearch.cityID) {
//             query += `WHERE cityID = ${keySearch.cityID} `;
//         }

//         if (keySearch.districtID) {
//             query += `WHERE cityID = ${keySearch.districtID} `;
//         }

//         if (keySearch.wardID) {
//             query += `WHERE wardID = ${keySearch.wardID} `;
//         }

//         if (keySearch.keyword && keySearch.keyword !== '') {
//             const keyword = `%${keySearch.keyword}%`;
//             // Thêm điều kiện tìm kiếm cho name, email, phone
//             if (query.includes('WHERE')) {
//                 query += ` AND (name LIKE "${keyword}" OR email LIKE "${keyword}" OR phone LIKE "${keyword}")`;
//             } else {
//                 query += ` WHERE (name LIKE "${keyword}" OR email LIKE "${keyword}" OR phone LIKE "${keyword}")`;
//             }
//         }

//         query += ` ORDER BY id DESC LIMIT ${offset},${limit}`;

//         db.query(query, (err, dataRes) => {
//             if (err) {
//                 return result({ msg: constantNotify.ERROR }, null);
//             }
//             result(null, dataRes);
//         });
//     } catch (error) {
//         result({ msg: constantNotify.SERVER_ERROR }, null);
//     }
// }

exports.getAll = async (keySearch, offset, limit, result) => {
  try {
    let countQuery = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE 1`;

    if (keySearch.gender) {
      countQuery += ` AND gender = ${keySearch.gender}`;
    }

    if (keySearch.cityID) {
      countQuery += ` AND cityID = ${keySearch.cityID}`;
    }

    if (keySearch.districtID) {
      countQuery += ` AND districtID = ${keySearch.districtID}`;
    }

    if (keySearch.wardID) {
      countQuery += ` AND wardID = ${keySearch.wardID}`;
    }

    if (keySearch.keyword && keySearch.keyword !== "") {
      const keyword = `%${keySearch.keyword}%`;
      countQuery += ` AND (name LIKE "${keyword}" OR email LIKE "${keyword}" OR phone LIKE "${keyword}" OR address LIKE "${keyword}")`;
    }

    db.query(countQuery, (countErr, countResult) => {
      if (countErr) {
        return result({ msg: constantNotify.ERROR }, null);
      }

      const totalCount = countResult[0].totalCount;

      let query = `SELECT * FROM ${tableName} WHERE 1`; // Start with "WHERE 1" to simplify subsequent conditions

      if (keySearch.gender) {
        query += ` AND gender = ${keySearch.gender}`;
      }

      if (keySearch.cityID) {
        query += ` AND cityID = ${keySearch.cityID}`;
      }

      if (keySearch.districtID) {
        query += ` AND districtID = ${keySearch.districtID}`;
      }

      if (keySearch.wardID) {
        query += ` AND wardID = ${keySearch.wardID}`;
      }

      if (keySearch.keyword && keySearch.keyword !== "") {
        const keyword = `%${keySearch.keyword}%`;
        query += ` AND (name LIKE "${keyword}" OR email LIKE "${keyword}" OR phone LIKE "${keyword}" OR address LIKE "${keyword}")`;
      }

      query += ` ORDER BY id DESC LIMIT ${offset},${limit}`;

      db.query(query, (err, dataRes) => {
        if (err) {
          console.log(err);
          return result({ msg: constantNotify.ERROR }, null);
        }

        db.getConnection((err, conn) => {
          if (err) {
            console.log("connect db fail");
            return;
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
                //   return res.send({
                //     result: false,
                //     error: constantNotify.ERROR,
                //   });
                return result({ msg: constantNotify.ERROR }, null);
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
              result(null, totalCount, dataRes);
            }
          );
          conn.release();
        });
      });
    });
  } catch (error) {
    result({ msg: constantNotify.SERVER_ERROR }, null);
  }
};

//get Total
exports.getTotal = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as total FROM ${tableName}`;
    db.query(query, (err, dataRes) => {
      if (err) {
        return reject(err);
      }
      resolve(dataRes[0]?.total);
    });
  });
};

//getbyid

exports.getbyid = (id, result) => {
  try {
    const query = `SELECT * FROM ${tableName} WHERE id = ?`;
    db.query(query, [id], (err, dataRes) => {
      if (err) {
        console.log(err);
        return result({ msg: constantNotify.ERROR }, null);
      }
      db.getConnection((err, conn) => {
        if (err) {
          console.log("connect db fail");
          return;
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
              return result({ msg: constantNotify.ERROR }, null);
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
            result(null, dataRes);
          }
        );
        conn.release();
      });
    });
  } catch (error) {
    result({ msg: constantNotify.SERVER_ERROR }, null);
  }
};

//register
exports.updateById = async (id, data, result) => {
  try {
    const query = `UPDATE ${tableName} SET name =?,email =?, phone =?,gender =?,birth =?,address =?,cityID =?,districtID =? ,wardID =? , updatedAt=? WHERE id = ?`;
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
      updatedAt,
    } = data;
    db.query(
      query,
      [
        name,
        email,
        phone,
        gender,
        birth,
        address,
        cityID,
        districtID,
        wardID,
        updatedAt,
        id,
      ],
      (err, dataRes) => {
        if (err) {
          console.log(err);
          return result({ msg: constantNotify.UPDATE_DATA_FAILED }, null);
        }
        if (dataRes.affectedRows === 0) {
          return result({ msg: `id ${constantNotify.NOT_EXITS}` }, null);
        }
        result(null, dataRes);
      }
    );
  } catch (error) {
    // console.log(error);
    result({ msg: constantNotify.SERVER_ERROR }, null);
  }
};

//delete
exports.delete = async (id, result) => {
  try {
    const query = `DELETE FROM ${tableName} WHERE id =?`;

    db.query(query, id, (err, dataRes) => {
      if (err) {
        return result({ msg: constantNotify.ERROR }, null);
      }
      if (dataRes.affectedRows === 0) {
        return result({ msg: `id ${constantNotify.NOT_EXITS}` });
      }
      result(null, dataRes);
    });
  } catch (error) {
    result({ msg: constantNotify.SERVER_ERROR }, null);
  }
};

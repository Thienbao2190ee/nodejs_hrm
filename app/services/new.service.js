const constantNotify = require("../config/constantNotify");
const db = require("../models/connectDB");
const tableName = "tbl_new";
//register
exports.register = async (data, result) => {
  try {
    const query = `INSERT INTO ${tableName} SET ?`;
    db.query(query, data, async (err, dataRes) => {
      if (err) {
        return result({ msg: constantNotify.ERROR }, null);
      }

      result(null, dataRes.insertId);
    });
  } catch (error) {
    // console.log(error);
    result({ msg: constantNotify.SERVER_ERROR }, null);
  }
};

//register
exports.updateById = async (id, data, result) => {
    try {
      const {
        title,
        des,
        image,
        active,
        updatedAt,
      } = data;
  
      const query = `
        UPDATE ${tableName}
        SET title=?, des=?, image=?,active=?,updatedAt=?
        WHERE id = ?
      `;
  
      db.query(query, [title, des, image,active, updatedAt, id], (err, dataRes) => {
        if (err) {
          console.error(err);
          return result({ msg: constantNotify.UPDATE_DATA_FAILED }, null);
        }
  
        if (dataRes.affectedRows === 0) {
          return result({ msg: `id ${constantNotify.NOT_EXITS}` }, null);
        }
  
        result(null, dataRes);
      });
    } catch (error) {
      result({ msg: constantNotify.SERVER_ERROR }, null);
    }
  };
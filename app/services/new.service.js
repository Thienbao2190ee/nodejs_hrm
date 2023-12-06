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

exports.getAll = async (keySearch, offset, limit, result) => {
  try {
    let countQuery = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE 1`;

    if (keySearch.active) {
      countQuery += ` AND active = ${keySearch.active}`;
    }

    if (keySearch.keyword && keySearch.keyword !== "") {
      const keyword = `%${keySearch.keyword}%`;
      countQuery += ` AND (title LIKE "${keyword}")`;
    }

    db.query(countQuery, (countErr, countResult) => {
      if (countErr) {
        return result({ msg: constantNotify.ERROR }, null);
      }

      const totalCount = countResult[0].totalCount;

      let query = `SELECT * FROM ${tableName} WHERE 1`; // Start with "WHERE 1" to simplify subsequent conditions

      if (keySearch.active) {
        query += ` AND active = ${keySearch.active}`;
      }

      if (keySearch.keyword && keySearch.keyword !== "") {
        const keyword = `%${keySearch.keyword}%`;
        query += ` AND (title LIKE "${keyword}")`;
      }

      query += ` ORDER BY id DESC LIMIT ${offset},${limit}`;

      db.query(query, (err, dataRes) => {
        if (err) {
          console.log(err);
          return result({ msg: constantNotify.ERROR }, null);
        }
        result(null, totalCount, dataRes);
      });
    });
  } catch (error) {
    result({ msg: constantNotify.SERVER_ERROR }, null);
  }
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
        if(dataRes.length === 0) {
            return result({ msg: `Id ${constantNotify.NOT_EXITS}` }, null);
        }
        result(null, dataRes);
      });
    } catch (error) {
      result({ msg: constantNotify.SERVER_ERROR }, null);
    }
  };

  //update active

exports.updateActive = (id,active, result) => {
  try {
    const query = `UPDATE ${tableName} SET active=? WHERE id = ?`;
    db.query(query, [active,id], (err, dataRes) => {
      if (err) {
        console.log(err);
        return result({ msg: constantNotify.ERROR }, null);
      }
      if(dataRes.length === 0) {
          return result({ msg: `Id ${constantNotify.NOT_EXITS}` }, null);
      }
      result(null, dataRes);
    });
  } catch (error) {
    result({ msg: constantNotify.SERVER_ERROR }, null);
  }
};

//register
exports.updateById = async (id, data, result) => {
  try {
    const { title, des, image, active, updatedAt } = data;

    const query = `
        UPDATE ${tableName}
        SET title=?, des=?, image=?,active=?,updatedAt=?
        WHERE id = ?
      `;

    db.query(
      query,
      [title, des, image, active, updatedAt, id],
      (err, dataRes) => {
        if (err) {
          console.error(err);
          return result({ msg: constantNotify.UPDATE_DATA_FAILED }, null);
        }

        if (dataRes.affectedRows === 0) {
          return result({ msg: `id ${constantNotify.NOT_EXITS}` }, null);
        }

        result(null, dataRes);
      }
    );
  } catch (error) {
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

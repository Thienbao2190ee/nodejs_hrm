const constantNotify = require("../config/constantNotify");
const db = require("../models/connectDB");
const tableName = "tbl_hrm";
//register
exports.register = async (data, result) => {
    try {
        const query = `INSERT INTO ${tableName} SET ?`;
        db.query(query, data, async (err, dataRes) => {
            if (err) {
                console.log('=====',err);
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
        const query = `UPDATE ${tableName} SET name =?,email =?, phone =?,gender =?,birth =?,hometown =?, updatedAt=? WHERE id = ?`;
        const {name, email, phone, gender, birth, hometown, updatedAt} = data
        db.query(query, [name, email, phone, gender, birth, hometown,updatedAt,id], (err, dataRes) => {
            if (err) {
                return result({ msg: constantNotify.UPDATE_DATA_FAILED }, null);
            }
            if (dataRes.affectedRows === 0) {
                return result({ msg: `id ${constantNotify.NOT_EXITS}` }, null);
            }
            result(null, dataRes);
        });
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
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
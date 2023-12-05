const constantNotify = require("../config/constantNotify");
const db = require("../models/connectDB");

const tableName = 'tbl_city'


exports.getAll = async (result) => {
    try {
        const query = `SELECT id,full_name FROM ${tableName} `;
        
        db.query(query, (err, dataRes) => {
            if (err) {
                return result({ msg: constantNotify.ERROR }, null);
            }
            result(null, dataRes);
        });
    } catch (error) {
        result({ msg: constantNotify.SERVER_ERROR }, null);
    }
}
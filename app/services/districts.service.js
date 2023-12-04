const constantNotify = require("../config/constantNotify");
const db = require("../models/connectDB");

const tableName = 'tbl_districts'


exports.getAll = async (cityID,result) => {
    try {
        const query = `SELECT * FROM ${tableName} WHERE cityID =?`;
        
        db.query(query,[cityID], (err, dataRes) => {
            if (err) {
                return result({ msg: constantNotify.ERROR }, null);
            }
            result(null, dataRes);
        });
    } catch (error) {
        result({ msg: constantNotify.SERVER_ERROR }, null);
    }
}
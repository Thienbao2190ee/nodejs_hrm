const constantNotify = require("../config/constantNotify");
const db = require("../models/connectDB");

const tableName = 'tbl_wards'


exports.getAll = async (districtsID,result) => {
    try {
        const query = `SELECT id,full_name FROM ${tableName} WHERE districtID =?`;
        
        db.query(query,[districtsID], (err, dataRes) => {
            if (err) {
                console.log(err);
                return result({ msg: constantNotify.ERROR }, null);
            }
            result(null, dataRes);
        });
    } catch (error) {
        result({ msg: constantNotify.SERVER_ERROR }, null);
    }
}
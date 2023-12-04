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
exports.getAll = async (keySearch, offset, limit, result) => {
    try {
        let query = `SELECT * FROM ${tableName} `;
        
        if (keySearch.gender) {
            query += `WHERE gender = ${keySearch.gender} `;
        }

        if (keySearch.keyword && keySearch.keyword !== '') {
            const keyword = `%${keySearch.keyword}%`;
            // Thêm điều kiện tìm kiếm cho name, email, phone
            if (query.includes('WHERE')) {
                query += ` AND (name LIKE "${keyword}" OR email LIKE "${keyword}" OR phone LIKE "${keyword}")`;
            } else {
                query += ` WHERE (name LIKE "${keyword}" OR email LIKE "${keyword}" OR phone LIKE "${keyword}")`;
            }
        }
    
        query += ` ORDER BY id DESC LIMIT ${offset},${limit}`;
    
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
        db.query(query,[id] ,(err,dataRes) => {
            if(err) {
                console.log(err);
                return result({ msg: constantNotify.ERROR }, null);
            }
            result(null, dataRes);
        })
    } catch (error) {
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
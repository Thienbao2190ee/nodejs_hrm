const constantNotify = require("../config/constantNotify");
const db = require("../models/connectDB");
const bcrypt = require("bcryptjs");
const tableName = "tbl_user";
const jwt = require("../helper/auth.helper");
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
//login
exports.login = async (account,password,result ) => {
    try {
        db.getConnection((err,conn) => {
            if (err) {
                return result({ msg: constantNotify.ERROR }, null);
            }

            conn.query(`SELECT id,password FROM ${tableName} WHERE account = ?`,account,async(err,dataRes) => {
                try {
                    if (err) {
                        return result({ msg: constantNotify.ERROR }, null);
                    }
                    if (dataRes.length === 0) {
                        return result(
                            {
                                param: 'account',
                                msg: constantNotify.ACCOUNT_FAILED,
                            },
                            null,
                        );
                    }
                    // console.log(dataRes[0]);
                    const passMatch = await bcrypt.compare(password, dataRes[0].password);
                    // console.log(passMatch);
                    if (!passMatch) {
                        return result({ param: 'password', msg: constantNotify.PASS_FAILED }, null);
                    }
                    
                    const _token = await jwt.make({ userid: dataRes[0].id });
                    const _refreshToken = await jwt.refreshToken({ userid: dataRes[0].id });

                    const qe = `UPDATE ${tableName} SET refreshToken = ? WHERE id = ?`;
                        conn.query(qe, [_refreshToken, dataRes[0].id], (err, dataRes_) => {
                            // console.log(qe);
                            if (err) {
                                console.log(err);
                                return result({ msg: constantNotify.ERROR }, null);
                            }
                            result(null, {
                                id: dataRes[0].id,
                                accessToken: _token,
                                refreshToken: _refreshToken,
                            });
                        });
                } catch (error) {
                    console.log(error);
                }
            })
        })
    } catch (error) {
        console.log(error);
    }
} 
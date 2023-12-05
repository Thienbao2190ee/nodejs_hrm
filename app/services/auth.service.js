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
exports.login = async (email,password,result ) => {
    try {
        db.getConnection((err,conn) => {
            if (err) {
                return result({ msg: constantNotify.ERROR }, null);
            }

            conn.query(`SELECT id,password FROM ${tableName} WHERE email = ?`,email,async(err,dataRes) => {
                try {
                    if (err) {
                        return result({ msg: constantNotify.ERROR }, null);
                    }
                    if (dataRes.length === 0) {
                        return result(
                            {
                                param: 'email',
                                msg: constantNotify.EMAIL_FAILED,
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

exports.checkCodeGmail = async (email,code,result ) => {
    try {
        db.getConnection((err,conn) => {
            if (err) {
                return result({ msg: constantNotify.ERROR }, null);
            }

            conn.query(`SELECT generateOTP,email,fullName,accessToken,refreshToken,createdAt,id FROM ${tableName} WHERE email = ?`,email,async(err,dataRes) => {
                try {
                    if (err) {
                        return result({ msg: constantNotify.ERROR }, null);
                    }
                    
                    if (dataRes[0]?.generateOTP != code) {
                        return result({msg: constantNotify.CODE_FAILED }, null);
                    }

                    return result(null, dataRes);
                    
                } catch (error) {
                    console.log(error);
                }
            })
        })
    } catch (error) {
        console.log(error);
    }
} 

exports.getbyid = async (id, result) => {
    try {
        db.getConnection((err,conn) => {
            if (err) {
                return result({ msg: constantNotify.ERROR }, null);
            }
            conn.query(`SELECT id,email,fullName,createdAt FROM ${tableName} WHERE id =?`,[id], (err,dataRes) => {
                if(err){
                    return result({msg : constantNotify.ERROR},null)
                }
                return result(null,dataRes)
            })
            conn.release()
        })
    } catch (error) {
        
    }
}
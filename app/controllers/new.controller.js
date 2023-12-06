const path = require("path");
const db = require("../models/connectDB");
const constantNotify = require("../config/constantNotify");
const newService = require("../services/new.service");
const fs = require("fs");
const { validationResult } = require("express-validator");
const tableName = "tbl_new";
const __basedir = path.resolve();
exports.register = async (req, res) => {
  try {
    const directoryPath = path.join(__basedir, "/uploads/new/images/");

    const error = validationResult(req);

    const file = req.file;
    const { title, des, active } = req.body;
    if (!error.isEmpty()) {
      if (fs.existsSync(directoryPath + file.filename)) {
        await fs.unlinkSync(directoryPath + file.filename);
      }
      return res.send({ result: false, error: error.array() });
    }

    if (req?.file?.size > 2097152) {
      if (fs.existsSync(directoryPath + file.filename)) {
        await fs.unlinkSync(directoryPath + file.filename);
      }
      return res.send({
        result: false,
        error: [{ msg: constantNotify.VALIDATE_FILE_SIZE }],
      });
    }

    db.getConnection((err, conn) => {
      if (err) {
        console.log("connect db fail");
        return;
      }
      conn.query(
        `SELECT title FROM ${tableName} WHERE title =?`,
        [title],
        async (err, _res) => {
          if (err) {
            console.log(err);
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }
          if (_res.length !== 0) {
            if (_res[0]?.title) {
              if (fs.existsSync(directoryPath + file.filename)) {
                await fs.unlinkSync(directoryPath + file.filename);
              }
              return res.send({
                result: false,
                error: [
                  {
                    param: "title",
                    msg: `Title ${constantNotify.ALREADY_EXITS}`,
                  },
                ],
              });
            }
          }
          const data = {
            title,
            des,
            image: file?.filename,
            createdAt: Date.now(),
            active,
            updatedAt: null,
          };
          newService.register(data, (err, res_) => {
            try {
              if (err) {
                return res.send({
                  result: false,
                  error: [err],
                });
              }
              const query = `SELECT * FROM ${tableName} WHERE id=?`;
              conn.query(query, res_, (err, dataRes) => {
                if (err) {
                  return res.send({
                    result: false,
                    error: constantNotify.ERROR,
                  });
                }
                return res.send({
                  result: true,
                  newData: dataRes,
                });
              });
            } catch (error) {
              console.log(error);
              return res.send({
                result: false,
                error: constantNotify.SERVER_ERROR,
              });
            }
          });
        }
      );

      conn.release();
    });
  } catch (error) {
    console.log(error);
    return res.send({
      result: false,
      error: constantNotify.SERVER_ERROR,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const directoryPath = path.join(__basedir, "/uploads/new/images/");

    const error = validationResult(req);

    const file = req.file;
    const { title, des, image, active } = req.body;
    const id = req.params.id;

    if (!error.isEmpty()) {
      if (fs.existsSync(directoryPath + file.filename)) {
        await fs.unlinkSync(directoryPath + file.filename);
      }
      return res.send({ result: false, error: error.array() });
    }

    if (req?.file?.size > 2097152) {
      if (fs.existsSync(directoryPath + file.filename)) {
        await fs.unlinkSync(directoryPath + file.filename);
      }
      return res.send({
        result: false,
        error: [{ msg: constantNotify.VALIDATE_FILE_SIZE }],
      });
    }

    db.getConnection((err, conn) => {
      if (err) {
        console.log("connect db fail");
        return;
      }
      conn.query(
        `SELECT id,title FROM ${tableName} WHERE title =?`,
        [title],
        async (err, _res) => {
          if (err) {
            console.log(err);
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }
          if (
            _res?.length > 0 &&
            Number(_res[0]?.id) !== Number(id) &&
            _res[0]?.title
          ) {
            return res.send({
              result: false,
              error: [
                {
                  param: "title",
                  msg: `Title ${constantNotify.ALREADY_EXITS}`,
                },
              ],
            });
          }
          if (file) {
            const query = `SELECT image FROM ${tableName} WHERE id =?`;
            conn.query(query, [id], async (err, res_) => {
              if (err) return res.send({ result: false,error: [err]});
              const oldImageName = res_[0].image

              if (fs.existsSync(directoryPath + oldImageName)) {
                await fs.unlinkSync(directoryPath + oldImageName);
              }
            });
          }
          const data = {
            title,
            des,
            image: !file ? image : file.filename,
            active,
            updatedAt: Date.now(),
          };
          newService.updateById(id, data, (err, res_) => {
            try {
              if (err) {
                return res.send({
                  result: false,
                  error: [err],
                });
              }
              const dataRes = [
                {
                  id,
                  ...data,
                },
              ];
              return res.send({
                result: true,
                newData: dataRes,
              });
            } catch (error) {
              console.log(error);
              return res.send({
                result: false,
                error: constantNotify.SERVER_ERROR,
              });
            }
          });
        }
      );

      conn.release();
    });
  } catch (error) {
    console.log(error);
    return res.send({
      result: false,
      error: constantNotify.SERVER_ERROR,
    });
  }
};

const db = require("../models/connectDB");
const constantNotify = require("../config/constantNotify");
const newService = require("../services/new.service");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const __basedir = path.resolve();
const sharp = require("sharp");

const tableName = "tbl_new";

let directoryPath = path.join(__basedir, "/uploads/new/images/");
let directoryThumbPath = path.join(__basedir, "/uploads/new/thumb/");
exports.register = async (req, res) => {
  try {
    const error = validationResult(req);

    const file = req.file;
    const { title, des, active } = req.body;
    // console.log({ title, des, active });
    // console.log(file);
    if (!error.isEmpty()) {
      if (fs.existsSync(directoryPath + oldImageName)) {
        await fs.unlinkSync(directoryPath + oldImageName);
      }
      if (fs.existsSync(directoryThumbPath + oldImageName)) {
        await fs.unlinkSync(directoryThumbPath + oldImageName);
      }
      return res.send({ result: false, error: error.array() });
    }

    db.getConnection((err, conn) => {
      if (err) {
        console.log("connect db fail");
        return;
      }
      conn.query(
        `SELECT title FROM ${tableName} WHERE title =?`,
        [title],
        async (err, dataRes) => {
          if (err) {
            // console.log('====',err);
            // err
            conn.release();
            return res.send({
              result: false,
              error: [{ msg: constantNotify.ERROR }],
            });
          }

          if (dataRes.length !== 0) {
            if (fs.existsSync(directoryPath + file.filename)) {
              await fs.unlinkSync(directoryPath + file.filename);
            }
            if (fs.existsSync(directoryThumbPath + file.filename)) {
              await fs.unlinkSync(directoryThumbPath + file.filename);
            }
            conn.release();
            return res.send({
              result: false,
              error: [
                {
                  param: "title",
                  msg: `Tiêu đề ${constantNotify.ALREADY_EXITS}`,
                },
              ],
            });
          }

          await sharp(req?.file?.path)
            .resize({ width: 150, height: 150 })
            .toFile(`uploads/new/thumb/` + req?.file?.filename, async (err) => {
              if (err) {
                console.log("====", err);
                if (fs.existsSync(directoryPath + file.filename)) {
                  await fs.unlinkSync(directoryPath + file.filename);
                }
                if (fs.existsSync(directoryThumbPath + file.filename)) {
                  await fs.unlinkSync(directoryThumbPath + file.filename);
                }
                conn.release();
                return res.send({
                  result: false,
                  error: [{ msg: constantNotify.ERROR }],
                });
              }
            });

          const data = {
            title,
            des,
            image: file?.filename,
            active,
            createdAt: Date.now(),
            updatedAt: null,
          };
          newService.register(data, (err, res_) => {
            if (err) return res.send({ result: false, error: [err] });
            data.id = res_;
            conn.release();
            return res.send({ result: true, newData: data });
          });
        }
      );
    });
  } catch (error) {
    console.log(error);
    return res.send({
      result: false,
      error: constantNotify.SERVER_ERROR,
    });
  }
};
//get all
//get all
exports.getAll = async (req, res) => {
  try {
    // let total = await hrmService.getTotal(); // total data row
    //   console.log(req.userID);
    const dataSearch = req.query;
    let offset = 0;
    let limit = 10;

    if (dataSearch.offset) {
      offset = dataSearch.offset;
    }

    if (dataSearch.limit) {
      limit = dataSearch.limit;
    }

    newService.getAll(dataSearch, offset, limit, (err, totalCount, dataRes) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }

      // Calculate TotalPage
      const totalPage = Math.ceil(totalCount / limit);
      return res.send({
        result: true,
        totalPage: totalPage ? totalPage : 0,
        newData: dataRes,
      });
    });
  } catch (error) {
    console.log(error);
    return res.send({
      result: false,
      error: [{ msg: constantNotify.SERVER_ERROR }],
    });
  }
};

//get all
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;

    newService.getbyid(id, (err, dataRes) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      return res.send({
        result: true,
        newData: dataRes,
      });
    });
  } catch (error) {
    return res.send({
      result: false,
      error: [{ msg: constantNotify.SERVER_ERROR }],
    });
  }
};

//update Active
exports.updateActive = async (req, res) => {
  try {
    const id = req.params.id;
    const active = req.body.active;

    newService.updateActive(id, active, (err, dataRes) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      return res.send({
        result: true,
        msg: constantNotify.UPDATE_DATA_SUCCESS,
      });
    });
  } catch (error) {
    return res.send({
      result: false,
      error: [{ msg: constantNotify.SERVER_ERROR }],
    });
  }
};
//update
exports.update = async (req, res) => {
  try {
    const error = validationResult(req);
    const file = req.file;
    const { title, des, image, active } = req.body;
    const id = req.params.id;

    if (!error.isEmpty()) {
      if (fs.existsSync(directoryPath + file.filename)) {
        await fs.unlinkSync(directoryPath + file.filename);
      }
      if (fs.existsSync(directoryThumbPath + file.filename)) {
        await fs.unlinkSync(directoryThumbPath + file.filename);
      }
      return res.send({ result: false, error: error.array() });
    }

    if (req?.file?.size > 2097152) {
      if (fs.existsSync(directoryPath + file.filename)) {
        await fs.unlinkSync(directoryPath + file.filename);
      }
      if (fs.existsSync(directoryThumbPath + file.filename)) {
        await fs.unlinkSync(directoryThumbPath + file.filename);
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
              if (err) return res.send({ result: false, error: [err] });
              const oldImageName = res_[0].image;

              console.log("oldImageName", oldImageName);
              console.log(directoryPath, "===", directoryThumbPath);

              if (fs.existsSync(directoryPath + oldImageName)) {
                await fs.unlinkSync(directoryPath + oldImageName);
              }
              if (fs.existsSync(directoryThumbPath + oldImageName)) {
                await fs.unlinkSync(directoryThumbPath + oldImageName);
              }
            });
            await sharp(req?.file?.path)
              .resize({ width: 150, height: 150 })
              .toFile(
                `uploads/new/thumb/` + req?.file?.filename,
                async (err) => {
                  if (err) {
                    console.log("====", err);
                    if (fs.existsSync(directoryPath + file.filename)) {
                      await fs.unlinkSync(directoryPath + file.filename);
                    }
                    if (fs.existsSync(directoryThumbPath + file.filename)) {
                      await fs.unlinkSync(directoryThumbPath + file.filename);
                    }
                    conn.release();
                    return res.send({
                      result: false,
                      error: [{ msg: constantNotify.ERROR }],
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
                  console.log("next");
                }
              );
          } else {
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
//delete
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    db.getConnection((err, conn) => {
      if (err) {
        return console.log("connect db fail");
      }
      const query = `SELECT image FROM ${tableName} WHERE id =?`;
      conn.query(query, [id], async (err, res_) => {
        if (err) return res.send({ result: false, error: [err] });
        const oldImageName = await res_[0]?.image;

        newService.delete(id, async (err, res_) => {
          if (err) {
            return res.send({
              result: false,
              error: [err],
            });
          }
          if (fs.existsSync(directoryPath + oldImageName)) {
            await fs.unlinkSync(directoryPath + oldImageName);
          }
          if (fs.existsSync(directoryThumbPath + oldImageName)) {
            await fs.unlinkSync(directoryThumbPath + oldImageName);
          }
          return res.send({
            result: true,
            msg: constantNotify.DELETE_DATA_SUCCESS,
          });
        });

        console.log(oldImageName);
      });
    });
  } catch (error) {
    res.send({
      result: false,
      error: [{ msg: constantNotify.SERVER_ERROR }],
    });
  }
};

const constantNotify = require("../config/constantNotify");
const districtsService = require("../services/districts.service");
//get all
exports.getAll = async (req, res) => {
    try {
      console.log(req.params);
      const cityID = req.query.cityid
      // if(!cityID) {
      //   return res.send({
      //     result: false,
      //     error: "CityID không được bỏ trống",
      //   });
      // }
      districtsService.getAll(cityID ,(err, res_) => {
        if (err) {
          return res.send({
            result: false,
            error: [err],
          });
        }
  
        // Calculate TotalPage
        return res.send({
          result: true,
          data: res_,
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
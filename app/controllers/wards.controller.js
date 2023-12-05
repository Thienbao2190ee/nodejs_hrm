const constantNotify = require("../config/constantNotify");
const wardsService = require("../services/wards.service");
//get all
exports.getAll = async (req, res) => {
    try {
      const districtsID = req.query.districtsid
      // if(!districtsID){
      //   return res.send({
      //     result: false,
      //     error: "DistrictsID không được bỏ trống",
      //   });
      // }
      wardsService.getAll(districtsID,(err, res_) => {
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
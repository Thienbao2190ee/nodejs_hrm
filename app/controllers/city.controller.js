const constantNotify = require("../config/constantNotify");
const cityService = require("../services/city.service");
//get all
exports.getAll = async (req, res) => {
    try {
      cityService.getAll((err, res_) => {
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
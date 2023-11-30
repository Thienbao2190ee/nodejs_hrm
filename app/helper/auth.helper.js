const jwt = require("jsonwebtoken");
const Constants = require("../config/constant");
const RBush = require("rbush");
const tree = new RBush(16);

const {
  TOKEN_TIME_LIFE,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_TIME_LIFE,
} = Constants.TOKEN_CONST;

const make = async (data) => {
  try {
    const token = await jwt.sign(data, ACCESS_TOKEN, {
      algorithm: "HS256",
      expiresIn: TOKEN_TIME_LIFE,
    });
    return token;
  } catch (err) {
    throw err;
  }
};

const refreshToken = async (data) => {
  try {
    const refreshToken = await jwt.sign(data, REFRESH_TOKEN, {
      algorithm: "HS256",
      expiresIn: REFRESH_TOKEN_TIME_LIFE,
    });
    return refreshToken;
  } catch (err) {
    throw err;
  }
};

// check token
const checkToken = async (token) => {
  try {
    const data = await jwt.verify(token, ACCESS_TOKEN);
    return {
      data,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  make: make,
  refreshToken: refreshToken,
  checkToken: checkToken,
  tree,
};

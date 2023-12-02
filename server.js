const express = require('express');
const app = express();
const cors = require('cors');

const bodyParser = require('body-parser');
const methodOverride = require('method-override');

require('dotenv').config();

const jwtMiddleware = require('./app/middlewares/jwt.middleware');
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*"); //Cấp quyền cho client được truy cập để sử dụng tài nguyên, "*" là tất cả client.
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS, PATCH'); // Các phương thức của client khi gọi api
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); //Content-Type: application/json định dạng kiểu dữ liệu json
    res.header('Access-Control-Allow-Credentials', true);
    next();
}
app.use(allowCrossDomain); // nhận biến allowCrossDomain ở trên
app.use(cors({ origin:true })); // origin: true cho phép client truy cập.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }
}));



// routes list
require('./app/routes/auth.route')(app);
app.use(jwtMiddleware.isAuth); // check login
require('./app/routes/hrm.route')(app);

app.listen(process.env.PORT, function(){
    console.log('Server running: ' + process.env.BASE_URL + ':' + process.env.PORT);
});
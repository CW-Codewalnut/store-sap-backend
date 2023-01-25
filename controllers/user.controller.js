const db = require('../models');
const Sequelize = db.Sequelize;
const User = require("../models").user;
const format = require("../config/response").format;
var md5 = require("md5");

module.exports.create = async (req, res) => {
    try {
        if (!req.body || 
            !req.body.name ||
            !req.body.mobile || 
            !req.body.email || 
            !req.body.password
            ) {
              const response = format("400", "failure", "Content can not be empty!");
              return res.send(response);
          }
      
        if(req.body.password) {
            req.body.password = md5(req.body.password.trim());
        }

        const regMob =  /^[6-9]\d{9}$/;
        const isValidMobile = regMob.test(req.body.mobile.trim());
        if (!isValidMobile) {
          const response = format(
            "400",
            "BAD_REQUEST",
            "Invalid mobile number!",
            null
          );
          return res.send(response);
        } else {
          req.body.mobile = req.body.mobile.trim();
        }
      
        await User.create(req.body);
        const response = format("201", "success", "Created", null);
        res.status(201).send(response);
    } catch(err) {
        console.log('err=> ', err);
        const response = format("400", "failure", JSON.stringify(err), null);
        res.send(response);
    }
};

module.exports.findWithPaginate = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);
        const search = req.query.search;
        const offset = page * pageSize - pageSize;
        const limit = pageSize;
    
        let condition = {};
    
        if (search) {
          condition = {
            [Op.or]: {
            name: { [Op.like]: '%' + search + '%' },
            mobile: { [Op.like]: '%' + search + '%' },
            email: { [Op.like]: '%' + search + '%' }
            }
          }
        }
    
        const users = await User.findAndCountAll({
          where: condition,
          order: [['createdAt', 'DESC']],
          offset: offset,
          limit: limit,
        });

        const response = format("200","success","Fetched",users);
        res.status(200).send(response);
      } catch(err) {
        const response = format("400","failure",err,null)
        res.send(response);
      }  
};
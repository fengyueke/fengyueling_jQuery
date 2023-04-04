const joi=require('joi')

const name=joi.string().min(1).max(10).required()
const password=joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义验证注册和登录的表单数据的规则对象
exports.reg_login_schema={
  body:{
    name,
    password
  }
}
const express=require('express')
const route=express.Router()
const handler=require('../router-handler/user')
const {reg_login_schema}=require('../schema/user')
const expressJoi=require('@escook/express-joi')
// 创建注册新用户的处理函数
route.post('/register',expressJoi(reg_login_schema),handler.resUser)

// 创建登录的处理函数
route.post('/login',expressJoi(reg_login_schema),handler.login)



module.exports=route
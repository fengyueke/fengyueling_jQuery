const express=require('express')
const route=express.Router()

// 退出登录
const {exitLogin} =require('../router-handler/exitUser')
route.post('/exitLogin',exitLogin)


module.exports=route
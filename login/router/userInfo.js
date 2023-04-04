const express=require('express')
const route=express.Router()

const {getUserInfo}=require('../router-handler/userInfo')
route.get('/userInfo',getUserInfo)



module.exports=route
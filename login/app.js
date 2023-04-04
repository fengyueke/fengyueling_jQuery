const express=require('express')
const app=express()
const joi=require('joi')

// 解决跨域问题
const cors=require('cors')
app.use(cors())
// 静态资源管理
app.use(express.static('../jQuery'))

// 解析post 表单传递过来的数据
app.use(express.urlencoded({extended:false})) 

// 优化res.send()
app.use(function(req,res,next){
  res.cc=function(err,status=1){
    res.send({
      status,
      msg: err instanceof Error ? err.message:err
    })
  }
  next()
})

// 导入session
const session=require('express-session')
// 配置session 中间件
app.use(session({
  secret:'风月聆 no.1 ^_^',
  resave:false,
  saveUninitialized:true
}))

// 挂载登录和注册的路由模块
const userRouter=require('./router/user')
app.use('/api',userRouter)

// 挂载获取用户信息的路由模块
const userInfoRouter=require('./router/userInfo')
app.use('/api',userInfoRouter)
// 挂载退出登录的路由模块
const exitLogin=require('./router/exitUser')
app.use('/api',exitLogin)

// 注册全局错误中间件
app.use((err,req,res,next)=>{
  // 判断验证失败导致的错误
  if(err instanceof joi.ValidationError) return res.cc(err)
  res.cc(err)
})


app.listen(80,()=>{
  console.log('server running http://127.0.0.1');
})
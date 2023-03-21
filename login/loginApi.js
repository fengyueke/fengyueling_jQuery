const express=require('express')
const app=express()
const mysql =require('mysql')
const session=require('express-session')


// 配置 mysql 中间件
let infoArr=[]
const db=mysql.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'admin123',
  database:'fengyueling'
})
db.query('select * from user',(err,results)=>{
  if(err) return console.log(err.message);
  // console.log(results);
  infoArr=[...results]
  console.log(infoArr);
})
// 解析POST提交过来的表单数据
app.use(express.urlencoded({ extended: false }));
// 解决跨域问题
const cors=require('cors')
app.use(cors())
// 配置Session 中间件
app.use(session({
  secret:'fengyueling',
  resave: false,
  saveUninitialized: true
}))
app.use(express.static('../jQuery'))

// 判断登录是否成功
app.post('/api/login',(req,res)=>{
  // 判断用户提交的登录信息是否正确
  const flag= infoArr.some(item =>{
    if(item.status===0){
      if(req.body.username === item.name && req.body.pwd==='123456' ){
        return true
      }
    }
  })
  if(!flag){
    return res.send({status: 256,msg:'账号或密码错误'})
  }
  req.session.user = req.body // 用户的信息
  req.session.isLogin = true // 用户的登录状态
  res.send({status:200,msg:'登录成功'})
})
// 获取所登录的用户姓名
app.get('/api/username',(req,res)=>{
  // 请从Session 中获取用户的名称，响应给客户端
  if(!req.session.isLogin){
    return res.send({status: 0,msg: 'fail'})
  }
  res.send({status:200,msg:'success',username: req.session.user.username})
})
// 注册用户
app.post('/api/register',(req,res)=>{
  const flag= infoArr.some(item=>{
    if(req.body.username===item.name){
      return true
    }
  })
  if(flag){
    return res.send({status:400,msg:'用户名重复'})
  }
  console.log(flag);
  // 向user表中新增数据，
  const user={username: req.body.username,pwd:req.body.pwd}
  // 定义待执行的 SQL 语句
  const sqlStr='insert into user(name,password) values(?,?)'
  // 执行 SQL 语句
  db.query(sqlStr,[user.username,user.pwd],(err,results)=>{
    if(err) return res.send(err.message);
    db.query('select * from user',(err,results)=>{
      if(err) return console.log(err.message);
      // console.log(results);
      infoArr=[...results]
    })
  })
  res.send({status:200,msg:'注册成功！'})
})
// 退出登录接口
app.post('/api/logout',(req,res)=>{
  req.session.destroy()
  res.send({
    status:200,
    msg:'退出登录成功'
  })
})
app.listen(80,()=>{
  console.log('Server running http://127.0.0.1');
})
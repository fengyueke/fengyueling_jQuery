const db=require('../db/index')

// 导入加密包
const bcrypt=require('bcryptjs')

// 注册用户
exports.resUser=(req,res)=>{
  const user=req.body
  const sql='select * from user where name=?'
  db.query(sql,[user.name],(err,results)=>{
    if(err) return res.cc(err)
    if(results.length!==0) return res.cc('用户名重复')
    // 进行加密
  user.password=bcrypt.hashSync(user.password,10)
  // 创建 sql 语句
  const sqlStr='insert into user(name,password) VALUES (?,?)'
  db.query(sqlStr,[user.name,user.password],(err,results)=>{
    console.log(results);
    if(err) return res.cc(err)
    if(results.affectedRows!==1) return res.cc('注册用户失败,请稍后再试')
    res.cc('注册成功',200)
  })
  })
  
}

// 登录
exports.login=(req,res)=>{
  const user=req.body
  const sqlStr='select * from user where name=?'
  db.query(sqlStr,[user.name],(err,results)=>{
    if(err)  return res.cc(err)
    if(results.length!==1) return res.cc('登录错误，请稍后再试')
    const compareRoute= bcrypt.compareSync(user.password,results[0].password)
    if(!compareRoute) return res.cc('账号或密码错误')
    req.session.user=user.name
    req.session.isLogin=true
    res.cc('登录成功',200)
  })
}



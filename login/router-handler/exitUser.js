

exports.exitLogin=(req,res)=>{
  req.session.destroy()
  res.cc('退出登录成功',200)
}
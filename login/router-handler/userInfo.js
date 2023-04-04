

exports.getUserInfo=(req,res)=>{
  if(!req.session.isLogin){
    return res.cc('fail')
  }
  res.send({status:200,msg:'获取成功',data:req.session.user})
}
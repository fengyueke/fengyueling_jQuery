$(function () {
  let count=2
  $('.modal').fadeIn();
   // 点击空白 返回登录页
   $('.zhe').on('click',function(){
    location.href='../login.html'
   })
  //  点击 X 返回登录页
   $('.modal .title span').on('click',function(){
    location.href='../login.html'
  })
  $('.acces').on('click',function(){
    $('.modal').fadeOut();
  })
  $("#form1").on("submit", function (e) {
    e.preventDefault();
    if ($(".ipt").val() === "" || $(".pwd").val() === "") {
      alert('账号和密码不得为空')
    }
    $.post(
      "http://127.0.0.1/api/register",
      { username: $(".ipt").val(), pwd: $(".pwd").val() },
      function (res) {
        if(res.status===200){
          $('body').html('')
          setInterval(function() {
            if(count>0){
              $('body').html('')
              document.write('注册成功'+count+'秒后自动跳转')
              count--
            }else{
              location.href='../login.html'
            }
          }, 1000);
        }else{
          alert(res.msg)
        }
      }
    );
   
  });
});

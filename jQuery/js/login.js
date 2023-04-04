$(function () {
  $("#form2").on("submit", function (e) {
    e.preventDefault();
  });
  let count=2
  $(".login").on("click", function () {
    if ($(".ipt").val() === "" || $(".pwd").val() === "") {
      return alert('请输入账号或密码')
    }
    $.post(
      "http://127.0.0.1/api/login",
      { name: $(".ipt").val(), password: $(".pwd").val() },
      function (res) {
        console.log(res);
        if(res.status===200){
          $('body').html('')
          setInterval(function(){
            if(count>0){
              $('body').html('')
              document.write('登录成功',+count+'秒后自动跳转到主页面')
              count--
            }else{
              location.href='./index.html'
            }
          },1000)
        }else{
          alert(res.msg)
        }
      }
    );
  });
  $(".register").on("click", function () {
    location.href='./register.html'
  });
});

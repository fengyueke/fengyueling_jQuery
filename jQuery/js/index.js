$(function(){
  let locList = localStorage.getItem('musicList')
  $('.right .list ul').html(locList)
  if($(' .list li').length!==0){
    $('.list .clear').fadeIn()
  }else{
    $('.right .clear').fadeOut()
  }
  $('.song').on('click',function(){
    playThis(this)
   })
  //  处在列表中的歌曲id
   let ids=[]
  for(let i=0;i<$(' .list .liked').length;i++){
    ids.push($(' .list .liked').eq(i).attr('id'))
  }
  // 在播放但不在播放列表的id
  let nullListId=-1
  $('[data-toggle="tooltip"]').tooltip()
  $.get('http://127.0.0.1/api/username',function(res){
  if(res.status===200){
    $('.hrefLogin').html(`<span><i>欢迎</i><i class="red">&nbsp;&nbsp;${res.username}</i></span>`)
    $('.exit').fadeIn()
  }
})
 
  $('.exit').on('click',function(){
    $.post('http://127.0.0.1/api/logout',function(res){
      if(res.status===200){
        alert('退出成功')
        $('.exit').fadeOut()
        $('.hrefLogin').html(`<span><i>还没有登录快去登录吧</i><a href="./login.html">登录</a></span>`)
      }else{
        alert('退出错误')
      }
    })
  })
  // 页面关闭前将右侧列表存储起来
  window.onbeforeunload=function(){
    let musicList = $('.right ul').html()
    localStorage.setItem('musicList',musicList)
  }

  // 发起请求并渲染页面
  async function getSearcher(str){  
     const { data:res } = await axios.get('https://autumnfish.cn/search',{
      params:{
        keywords:str
      }
    })
    // 判断是否请求成功
    if(res.code===200){
     let list=res.result.songs;
    //  将请求回来的数据渲染到左侧列表中
     list.forEach(item => {
      $('[data-toggle="tooltip"]').tooltip()
      if(item.mvid===0){
        const newLi= `
        <li>
          <span class="icon" id="${item.id}"></span>
          <span class="song" data-toggle="tooltip" data-placement="top" title="点击歌曲名播放此音乐">${item.name}</span>
          <span class="name">${item.artists[0].name}</span>
        </li>
        `
        const oldStr= $('.left ul').html()
        $('.left ul').html(oldStr+newLi)
      }else{
        const newLi= `
        <li>
          <span class="icon"  id="${item.id}"></span>
          <span class="song" data-toggle="tooltip" data-placement="top" title="点击歌曲名播放此音乐">${item.name}</span>
          <span class="name">${item.artists[0].name}</span>
          <span class="mv"></span>
        </li>
        `
        const oldStr= $('.left ul').html()
        $('.left ul').html(oldStr+newLi)
      }
     });
    //  初始化喜欢列表
     initLiked(list)
    //  点击歌名播放此音乐
     $('.song').on('click',function(){
      playThis(this)
     })
      
     //  点击喜欢按钮，添加到喜欢和播放列表
     $('.left .icon').on('click',function(){
      addLiked(this)
      // 根据点击当前状态渲染页面
      if($(this).attr('class')!=='icon'){
        if($(this).siblings('.mv').length===0){
          let liked=`<li>${$(this).parent().html()}</li>`
          let oldStr=$('.right .list ul').html()
          $('.right .list ul').html(liked+oldStr)
        }else{
          let liked=`<li>${$(this).parent().html()}</li>`
          let oldStr=$('.right .list ul').html()
          $('.right .list ul').html(liked+oldStr)
        }
      }else{
        for(let i=0;i<$('.right .list .liked').length;i++){
          if($('.right .list .liked').eq(i).attr('id')===$(this).attr('id')){
            $('.right .list .liked').eq(i).parent().remove();
          }
        }
      }
      if($('.right li').length!==0){
        $('.right .list .clear').fadeIn()
      }
      // 点击右测的喜欢和取消左侧的喜欢并在右侧列表删除这个元素
      $('.right .liked').on('click',function(){
        delLiked(this)
      })
    })
    
    }
    
  }
  // 发起请求歌曲播放地址的get请求
  async function getMusicUrl(id){
    const {data:res}= await axios.get('https://autumnfish.cn/song/url',{
      params:{
        id:id
      }
    })
    if(res.code===200){
      let data=res.data
      $('#ad').attr('src',data[0].url)
      getMusicCover(id)
      getMusicComment(id)
    }
  }
  // 获取歌曲的封面
  async function getMusicCover(id){
    const {data:res}= await axios.get('https://autumnfish.cn/song/detail',{
      params:{
        ids:id
      }
    })
    if(res.code===200){
      $('.main img').attr('src',res.songs[0].al.picUrl)
    }
  }
  // 获取歌曲评论
  async function getMusicComment(id){
    const {data:res}= await axios.get('https://autumnfish.cn/comment/hot',{
      params:{
        type:0,
        id:id
      }
    })
    if(res.code===200){
      let list=res.hotComments
      list.forEach(item=>{
        const newStr=`
        <li>
            <span class="headPhoto"
              ><img src="${item.user.avatarUrl}" alt=""
              /></span>
            <span class="nickname text-wrap">${item.user.nickname}</span>
            <br />
            <span class="content">${item.content}</span>
        </li>
        `
        let oldStr= $('.right .comment ul').html()
        $('.right .comment ul').html(oldStr+newStr)
      })
    }
  }
  // 获取mv
  async function getMusicMv(id){
    const {data:res}= await axios.get('https://autumnfish.cn/mv/url',{
      params:{
        id:id
      }
    })
    console.log(res);
    if(res.code===200){
      console.log(res.url);
    }
  }
  // input 中输入回车代表搜索
  $('.searcher').on('keyup',function(e){
    if(e.keyCode===13){
      getSearcher($('.searcher').val())
      $('.searcher').val('')
    }
  })
  // 点击搜索图标进行搜索
  $('header i').on('click',function(){
    getSearcher($('.searcher').val())
  })
  // 向本地存储中判断是否存在搜索值，若存在，默认为喜欢
  function initLiked(_list){
    for(let i=0;i<$('.right .liked').length;i++){
      $('.right .liked').eq(i).attr('id')
      for(let u=0;u<_list.length;u++){
        let l_id = _list[u].id.toString()
        if($('.right .liked').eq(i).attr('id')===l_id){
          $('.left .icon').eq(u).attr('class','liked')         
        }
      }
    }
  }
  // 添加到喜欢列表
  function addLiked (_this){
    if($(_this).attr('class')!=='liked'){
      $(_this).attr('class','liked')
    }else{
      $(_this).attr('class','icon')
    }
  }
  // 点击右侧列表，取消喜欢
  function delLiked (_this){
    // console.log($('.right ul').html());
    for(let i=0;i<$('.left .liked').length;i++){
      if($('.left .liked').eq(i).attr('id')===$(_this).attr('id')){
        addLiked($('.left .liked').eq(i))
      }
    }
    $(_this).parent().remove()
  }
  // 清空所有数据
  function clearRight(){
    $('.right ul').html('')
    $('.left .liked').attr('class','icon')
  }
  $('.right .clear').on('click',function(){
    clearRight()
    $(this).fadeOut();
  })

  // 播放 点击的音乐
  function playThis(_this){
    let id=$(_this).siblings().eq(0).attr('id')
    id=parseInt(id)
    nullListId=id
    getMusicUrl(nullListId)
  }

  // 点击展示/隐藏播放列表
  let tem=0
  $('.tabList').on('click',function(){
    if(tem===0){
      $('.right .list').fadeToggle(function(){
        $('.right .comment').fadeToggle()
      })
      tem+=1
    }else{
      $('.right .comment').fadeToggle(function(){
        $('.right .list').fadeToggle()
      })
      tem=0
    }
  })
  $('.right .comment').hide()
  // 点击切换播放顺序
  let count=0;
  function togglePlay(_this){
    switch(count){
      case 0:
        count+=1
        $(_this).attr('class','circulate one')
        break
        case 1:
        count+=1
        $(_this).attr('class','circulate two')
        break
        case 2:
        count=0
        $(_this).attr('class','circulate zero')
        break
    }
  }
    // 播放，列表
  // 单曲循环
  function loop(_this){
    let src =_this.src
    _this.src=''
    _this.src=src
  }
  // 播放列表
  function change(_this){
    switch(count){
      case 0:
        loop(_this)
        break
        case 1:
          // 判断当前歌曲是否在播放列表
          // 当前歌曲下标
          let index =$.inArray(nullListId+'',ids)
          console.log(index);
          if(index>-1){
            // 判断是否只有一首歌
            if(ids.length===1){
              loop(_this)
            }else{
              // 判断当前歌曲是否是最后一首
              if(index===ids.length-1){
                nullListId=ids[0]
                getMusicUrl(nullListId)
              }else{
                nullListId=ids[index+1]
                getMusicUrl(nullListId)
              }
            }
            
          }else{
            nullListId=ids[0]
            console.log(nullListId);
            getMusicUrl(nullListId)
          }
          break
    }
  }
  $('#ad').on('ended',function(){
    change(this)
  })
  // 点击播放mv
  function changeMv(_this){
    console.log(count);
    console.log(_this);
    switch(count){
      case 0:
        loop(_this)
        break
    }
  }
  $('.mv').on('click',function(){
    console.log(1);
    console.log(this);
    console.log($(this).siblings().eq(0).attr('id'));
    let mvId=$(this).siblings().eq(0).attr('id')
    mvId=parseInt(mvId)
    console.log(typeof mvId);
    getMusicMv(mvId)
    $('#modal').fadeIn()
  })
  // 点击空白,关闭mv
  $('#modal i').on('click',function(){
    $(this).parent().fadeOut()
  })
  $('.circulate').on('click',function(){
    togglePlay(this)
  })
})
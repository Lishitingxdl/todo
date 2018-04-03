 var mySwiper = new Swiper ('.swiper-container', {
    direction: 'vertical',
    loop: true,
    
    
    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    direction : 'horizontal',
    speed:500,

    // 如果需要滚动条
    // scrollbar: {
    //   el: '.swiper-scrollbar',
    // },
  }) 
  var iscroll=new IScroll(".content",{
     mouseWheel: true,  
     scrollbars: true,
     shrinkScrollbars:"scale",
     fadeScroll:true,
  })       
 //点击新增
var state="project";
$(".add").click(function () {
    $(".mask").show();
    $(".submit").show();
    $(".update").hide();
    $(".area").transition({y:0},500)
 });
$(".cancel").click(function(){  
    $(".area").transition({y:"-62vh"},500, function(){
       $(".mask").hide();
    })
});
$(".submit").click(function(){
    var val=$("#text").val();
    if(val===""){
      return;
    }
  $("#text").val("");

    var data=getDate();
    var time=new Date().getTime();
    data.push({content: val, time, star:false, done:false});  
    var index=$(this).data("index");
    saveData(data);
    $(".area").transition({y:"-62vh"},500, function(){
       $(".mask").hide();
       render();
  });
  });

$(".project").click(function () {
      $(this).addClass("active").siblings().removeClass("active");
      state="project";
      render();
 });

$(".done").click(function () {
     $(this).addClass("active").siblings().removeClass("active");
      state="done";
      render();
 });
$(".update").click(function () {
    var val=$("#text").val();
    if(val===""){
      return;
    }
    $("#text").val("");
    var data=getDate();
    var index=$(this).data("index");
    data[index].content=val;
    saveData(data);
    $(".area").transition({y:"-62vh"},500, function(){
       $(".mask").hide();
       render();
  });
});
  //事件委派
$(".itemlist")
  .on("click",".changestate",function(){
    var index=$(this).parent().attr("id");
    var data=getDate();
    data[index].done=true;
    saveData(data);
    render();
  })
  .on("click",".del",function(){
    var index=$(this).parent().attr("id");
    var data=getDate();
    data.splice(index,1);
    saveData(data);
    render();
  })
  .on("click","span",function(){
     var index=$(this).parent().attr("id");
     var data=getDate();
     data[index].star=!data[index].star;
     saveData(data);
    render();
  })
  .on("click","p",function(){
     var index=$(this).parent().attr("id");
     var data=getDate();
      $(".mask").show();
      $(".area").transition({y:0},500);
      $("#text").val(data[index].content);    //总数的第几个
      $("submit").hide();
      $("update").show().data("index",index);
  })
  function getDate(){
    return localStorage.todo?JSON.parse(localStorage.todo):[];
  };
  function saveData(data){
    localStorage.todo=JSON.stringify(data);
  };
  function render(){
    var data=getDate();
    var str="";
    data.forEach(function(val, index){
        if (state=== "project" && val.done === false) {
            str += "<li id=" + index + "><p>"+ val.content + "</p><time>" + parseTime(val.time) +"</time><span class="+(val.star?"active":"")+">※</span><div class='changestate'>完成</div></li>"  //加载字符串 val.content当前要连接的内容
        }else if(state==="done"&&val.done===true){
            str += "<li id=" + index + "><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">※</span><div class='del'>删除</div></li>"  
      } 
    });
    
    $(".itemlist").html(str);
    iscroll.refresh();
    addTouchEvent();
  };
  
  render();
  addTouchEvent();
  function parseTime(time){          //封装处理时间
    var date=new Date();      //实例化一个对象 
    date.setTime(time);     //把日期变成当前消息生成的日期
    var year=date.getFullYear();       //获取完整的年份
    var month=setZero(date.getMonth()+1);
    var day=setZero(date.getDate());
    var hour=setZero(date.getHours());
    var min=setZero(date.getMinutes());
    var sec=setZero(date.getSeconds());
    return year+"/"+month+""+day+"<br>"+hour+":"+min+":"+sec;
  }
  function setZero(n){         //根据n处理 
    return n<10?"0"+n:n;
  }
  function addTouchEvent(){
    $(".itemlist>li").each(function(index,ele){
        var hammerobj=new Hammer(ele);
        let sx,movex;
        let state="start";
       let max=window.innerWidth/5;
        let flag=true;

hammerobj.on("panmove",function(e){
      let cx=e.center.x;
      movex=cx-sx;    //提升作用域  去掉let
      if(movex>0&&state==="start"){
        flag=false;
        return;
      }
      if(movex<0&&state==="end"){
        flag=false;
        return;
      }
      if(Math.abs(movex)>max){
        flag=false;
        state=state==="start"?"end":"start";
        return;
      }
      if(state==="end"){
        $(ele).css("x",-max);   
      }else{
        $(ele).css("x",0); 
      }
    if(state==="end"){
        movex=-max+cx-sx;      
      }
    flag=true;
    $(ele).css("x",movex);
  });

   hammerobj.on("panend",function(){
      if(!flag){return};
      if(Math.abs(movex)>max/2){
         $(ele).transition({x:0});
        state="start";
      }else{
        $(ele).transition({x:-max});
        state="end";
      }
    });
  });
};



//  原生app  主流  java安卓  QQ微信
//  webapp   百度
//  hybird 混合型app   html+css+js+底层接口
//  微信小程序  特殊的混合型app  
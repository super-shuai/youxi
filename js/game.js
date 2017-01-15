/*创建人物*/
function person(canvas,cobj,runs,jumps){
	this.canvas=canvas;
	this.cobj=cobj;
	this.runs=runs;
	this.jumps=jumps;
	this.x=0;
	this.y=240;
	this.width=200;
	this.height=200;
	this.status="runs";
	this.state=0;
	this.zhongli=5;
	this.speedx=5;
	this.speedy=5;
	this.life=3;
}
person.prototype={
	draw:function(){
		this.cobj.save();
		this.cobj.translate(this.x,this.y);
		this.cobj.drawImage(this[this.status][this.state],0,0,200,200,0,0,this.width,this.height);
		this.cobj.restore();
	}
}

/*创建障碍物*/
function hinder(canvas,cobj,hinderImg){
	this.canvas=canvas;
	this.cobj=cobj;
	this.hinderImg=hinderImg;
	this.x=canvas.width-20;
	this.y=345;
	this.width=100;
	this.height=100;
	this.state=0;
	this.speedx=12;
	this.flag=false;
}
hinder.prototype={
	draw:function(){
		this.cobj.save();
		this.cobj.translate(this.x,this.y);
		this.cobj.drawImage(this.hinderImg[this.state],0,0,100,100,0,0,this.width,this.height);
		this.cobj.restore();
	}
}

/*粒子*/
function lizi(cobj){
	this.cobj=cobj;
	this.x=230;
	this.y=250;
	this.r=1+2*Math.random();
	this.color="red";
	this.speedy=6*Math.random()-3;   //y轴的速度
	this.speedx=6*Math.random()-3;   //x轴的速度
	this.zhongli=0.3;  //重力
	this.speedr=0.1;  //半径
}
lizi.prototype={
	draw:function(){
		this.cobj.save();
		this.cobj.translate(this.x,this.y);
		this.cobj.beginPath();
		this.cobj.fillStyle=this.color;
		this.cobj.arc(0,0,this.r,0,2*Math.PI);
		this.cobj.fill();
		this.cobj.restore();
	},
	update:function(){
		this.x+=this.speedx;
		this.y+=this.speedy;
		this.speedy+=this.zhongli;
		this.r-=this.speedr;
	}
}

/*出血--粒子*/
function xue(cobj,x,y){
	var arr=[];
	for (var i = 0; i < 30; i++) {
		var obj=new lizi(cobj);
		obj.x=x;
		obj.y=y;
		arr.push(obj);
	};
	var t=setInterval(function(){
		for (var i = 0; i < arr.length; i++) {
			arr[i].draw();
			arr[i].update();
			if(arr[i].r<0){
		 		arr.splice(i,1);   //删除
			}
		};
		if(arr.length==0){
			clearInterval(t);
		}
	},50)
}

/*********子弹**********/
function zidan(canvas,cobj){
	this.canvas=canvas;
	this.cobj=cobj;
	this.x=0;
	this.y=0;
	this.width=10;
	this.height=10;
	this.color="red";
	this.speedx=5;
	this.jia=1;   //加速度
}
zidan.prototype={
	draw:function(){
		var cobj=this.cobj;
		cobj.save();
		cobj.translate(this.x,this.y);
		cobj.fillStyle=this.color;
		cobj.fillRect(0,0,this.width,this.height);
		cobj.restore();
	}
}

/*游戏属性*/
function game(canvas,cobj,runs,jumps,hinderImg,back,pressage,grad,distance){
	this.canvas=canvas;
	this.cobj=cobj;
	this.width=canvas.width;
	this.height=canvas.height;
	this.backw=0;
	this.backspeed=5;
	this.hinderArr=[];
	this.hinderImg=hinderImg;
	this.score=0;
	this.isfire=false;
	this.person=new person(canvas,cobj,runs,jumps);
	this.zidan=new zidan(canvas,cobj);
	this.back=back;
	this.ts={}; //创建时间的对象，用来存储下边时间setInterval();
	this.num=0;	//人物图片下标变量
	this.stemp=0;// 障碍物变量
	this.rand=(2+Math.ceil(6*Math.random()))*1000  //随机数

	this.init=0;
	this.speed=10;
	this.y=this.person.y;

	this.flag = true;//控制跳跃的开关

	this.flag2=false;//控制暂停开始的开关

	this.current=0;//记录跳跃几个障碍物
	this.step=1; //跳过几个障碍物，会加速。
	// new hinder(canvas,cobj,hinderImg).draw();
	// this.obj=new hinder(canvas,cobj,hinderImg);
	this.pressage=pressage;
	this.grad=grad;
	this.distance=distance;
}
game.prototype={
	play:function(){
		this.name=prompt("请输入姓名","gahsuai");
		this.runs();
		this.key();
		this.mouse();
	},
	runs:function(){
		var that=this;
		// var num=0;
		// var stemp=0; 
		this.back.play();
		// var rand=(2+Math.ceil(6*Math.random()))*1000;
		that.ts.t1=setInterval(function(){
			that.move();
		},50)
	},
	/*移动*/
	move:function(){
			var that=this;
			that.cobj.clearRect(0,0,that.width,that.height);
			that.num++;
			that.stemp+=50;
			if(that.person.status=="runs"){
				that.person.state=that.num%8;
			}else{
				that.person.state=0;
			}
			that.person.x+=that.person.speedx;
		// 	that.person.speedy+=that.person.zhongli;
			if(that.person.x>that.width/3){
				that.person.x=that.width/3;
			}
			that.person.draw();
			/*操作背景*/
			that.backw-=that.backspeed;
			that.canvas.style.backgroundPositionX=that.backw+"px";
			that.distance.innerHTML=Math.abs(that.backw);
			/*障碍物*/
			if(that.stemp%that.rand==0){
				that.rand=(2+Math.ceil(6*Math.random()))*1000;
				that.stemp=0;
				var obj=new hinder(that.canvas,that.cobj,that.hinderImg);
				obj.state=Math.floor(Math.random()*that.hinderImg.length);  //图片随机
				that.hinderArr.push(obj);
			}
			for (var i = 0; i < that.hinderArr.length; i++) {
				that.hinderArr[i].x-=that.hinderArr[i].speedx;
				that.hinderArr[i].draw();
				if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
					if(!that.hinderArr[i].flag){
						xue(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
						that.person.life--;
						// var pressage=document.getElementsByClassName("pressage")[0];
						that.pressage.style.width= Math.floor(that.person.life/3*100)+"%";
						if(that.person.life<=0){
							var messages=localStorage.messages?JSON.parse(localStorage.messages):[];
							var temp={name:that.name,score:that.score};
							if(messages.length>0){
								messages.sort(function(a,b){
									return a.score<b.score;
								})
								if(temp.score>messages[messages.length-1].score){
									if(messages.length==5){    //如果大于5个,替换掉最小的
										messages[messages.length-1]=temp;
									}else if(messages.length<5){  //如果不够5个,直接放进去即可
										messages.push(temp); //添加游戏信息到messages中
									}
								}
							}else{
								messages.push(temp);
							}
							// location.reload();
							localStorage.messages=JSON.stringify(messages);
							that.back.pause(); //停止背景音乐
							that.over();
							// alert("游戏结束");
						}

					}
					that.hinderArr[i].flag=true;
				}
				/*没有发生碰撞，人物跳过*/
				if(that.person.x>that.hinderArr[i].x+that.hinderArr[i].width){
					if(!that.hinderArr[i].flag&&!that.hinderArr[i].flag1){
						that.score++;
						that.current++;
						if(that.current%that.step==0){
							that.backspeed++;
							for (var j = 0; j < that.hinderArr.length; j++) {
								that.hinderArr[j].speedx++; //障碍物加速
							};
							// that.obj.speedx+=100;
						}
						
						that.grad.innerHTML=that.score;
						that.hinderArr[i].flag1=true;
					}	
				}
			}
			/*操作子弹*/
			if(that.isfire){
				that.zidan.speedx+=that.zidan.jia;
				that.zidan.x+=that.zidan.speedx;
				that.zidan.draw();
			}
	},
	move2:function(){
		var that=this;
		that.init+=that.speed;
		if(that.init>=180){
			that.person.y=that.y;
			clearInterval(that.ts.t2);
			that.person.status="runs";
			that.flag=true;
			that.init=0;
		}else{
			var top=Math.sin(that.init*Math.PI/180)*150;
			that.person.y=that.y-top;
		}
	},
	/*跳跃的方法*/
	key:function(){
		var that=this;
		document.onkeydown=function(e){  //跳跃方法
			if(e.keyCode==13){
				// if(that.flag2){
					for(var i in that.ts){
					clearInterval(that.ts[i]);
					}
					that.back.pause();
					that.flag2=true;
				// }
			}else if(e.keyCode==65){
				if(that.flag2){
					that.ts.t1=setInterval(function(){
					that.move();
					},50);
					if(!that.flag){
						// clearInterval(that.ts.t2);
						that.ts.t2=setInterval(function(){
							that.move2();
						},50);
					}
					that.back.play();
					that.flag2=false;
				}
				
			}else if(e.keyCode==32){
				if(!that.flag){
                	return;
            	}
            	that.flag = false;
				that.person.status="jumps";
				// var init=0;
				// var speed=10;
				// var y=that.person.y;
				that.ts.t2=setInterval(function(){
					that.move2();
				},50)
			}

		}
	},
	mouse:function(){
		var that=this;
		document.querySelector(".mask").onclick=function(){
			that.zidan.x=that.person.x+that.person.width/2;
			that.zidan.y=that.person.y+that.person.height-20;
			that.zidan.color="red";
			that.zidan.speedx=5;
			that.isfire=true;
		}
	},
	over:function(){
		for(var i in this.ts){
			clearInterval(this.ts[i]);  //关闭所有的计时器
		}
		var over=document.querySelector(".over");
		over.style.animation="start 2s ease forwards";
		this.back.pause();
		//记录分数
		var scoreEle=document.querySelector(".scoreEle");
		scoreEle.innerHTML=this.score;
		var lis=document.querySelector(".over ul");
		var messages=localStorage.messages?JSON.parse(localStorage.messages):[];
		var str="";
		for (var i = 0; i < messages.length; i++) {
			str+="<li>"+messages[i].name+":"+messages[i].score;
		};
		lis.innerHTML=str;

		this.again();
	},
	again:function(){
		var that=this;
		var btn=document.querySelectorAll(".btn")[1];
		btn.onclick=function(){
			var over=document.querySelector(".over");
			over.style.animation="start1 2s ease forwards";
			that.person.x=0;
			that.person.y=240;
			// that.status="runs";
			that.score=0;
			that.grad.innerHTML=0;
			that.person.life=3;
			that.hinderArr=[];
			that.init=0;
			that.y=that.person.y;
			that.backspeed=5;
			that.runs();
			that.pressage.style.width=100+"%";
			that.backw=0;
			btn.onclick=null;
			// that.hinder.speedx=12;
		}
	}
}
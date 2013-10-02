var mqarea;

var mqmousebase;
$(function() {
  
  $(window).load(function() {
        hasTouch = 'ontouchstart' in document.documentElement;
  	mqarea = $('.mathquill-editable');
	$('.mathquill-rendered-math').mathquill('redraw');
  	mqarea.find('textarea').focus();
  	
  	
  	if (!hasTouch) {
  		$('#mqee td.mqeebtn').bind('mouseover mouseup', function() {
			if (!$(this).hasClass("mqeeactive")) {
				$(this).addClass("mqeehighlight");	
			}
		}).bind('mousedown', function () {
			$(this).addClass("mqeeclick");	
		}).bind('mouseout', function () {
			$(this).removeClass("mqeehighlight");
		}).bind('mouseup', function () {
			$(this).removeClass("mqeeclick");
		}).bind('click',mqeeinsert);
  		$('#mqeetopbar').mousedown(function(evt) {
			mqmousebase = {left:evt.pageX, top: evt.pageY};
			$("body").bind('mousemove',mqeemousemove);
			$("body").mouseup(function(event) {
				var p = $('#mqee').offset();
				lasteepos.left = p.left;
				lasteepos.top = p.top;
				$("body").unbind('mousemove',mqeemousemove);
				$(this).unbind(event);
			});
		});
  	} else {
  		$('#mqee td.mqeebtn').bind('touchstart', function () {
			$(this).addClass("mqeeclick");	
		}).bind('touchend', function () {
			$(this).delay(500).removeClass("mqeeclick");
		}).bind('touchend', mqeeinsert);
		$('#mqeetopbar').bind('touchstart', function(evt) {
			var touch = evt.originalEvent.changedTouches[0] || evt.originalEvent.touches[0];
			mqmousebase = {left:touch.pageX, top: touch.pageY};
			$("body").bind('touchmove',mqeetouchmove);
			$("body").bind('touchend', function(event) {
				var p = $('#mqee').offset();
				lasteepos.left = p.left;
				lasteepos.top = p.top;
				$("body").unbind('touchmove',mqeetouchmove);
				$(this).unbind(event);
			});	
		});
  	}
  	
  });

  //tabs 
//from http://www.sohtanaka.com/web-design/simple-tabs-w-css-jquery/
$(document).ready(function() {

	//When page loads...
	$(".tab_content").hide(); //Hide all content

	//On Click Event
	$("ul.tabs li").click(function() {

		$("ul.tabs li").removeClass("active"); //Remove any "active" class
		$(this).addClass("active"); //Add "active" class to selected tab
		$(".tab_content").hide(); //Hide all tab content

		var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		$(activeTab).show(); //Fade in the active ID content
		return false;
	});
	
	//$("td.mqeebtn span.mathquill-rendered-math").mathquill().mathquill("redraw");
});
}); 

function mqPrepTabs(type,extras) {   //type: 0 basic, 1 advanced.  extras = 'interval' or 'ineq'
	$(".tab_content").hide();
	$("ul.tabs li").removeClass("active").each(function(index,el) {
		if (index==0) {  	
			if (type==0) { 
				$(el).addClass("active").show();
				var activeTab = $(el).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
				$(activeTab).show();
			} else {
				$(el).hide();
			}
		} else if (index==1) {  	
			if (type==1) { 
				$(el).addClass("active").show();
				var activeTab = $(el).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
				$(activeTab).show();
			} else {
				$(el).hide();
			}
		} else if (index==2) {
			if (extras=='int') {
				$(el).show();
			} else {
				$(el).hide();
			}
		} else if (index==3) {
			if (extras=='ineq') {
				$(el).show();
			} else {
				$(el).hide();
			}
		} else {
			if (type==1) { 
				$(el).show();
			} else {
				$(el).hide();
			}
		}		
	});
	
}
function mqeemousemove(evt) {
	$('#mqee').css('left', (evt.pageX - mqmousebase.left) + lasteepos.left)
	  .css('top', (evt.pageY - mqmousebase.top) + lasteepos.top);
	return false;
}
function mqeetouchmove(evt) {
	var touch = evt.originalEvent.changedTouches[0] || evt.originalEvent.touches[0];
  		
	$('#mqee').css('left', (touch.pageX - mqmousebase.left) + lasteepos.left)
	  .css('top', (touch.pageY - mqmousebase.top) + lasteepos.top);
	  evt.preventDefault();

	return false;
}

function mqeeinsert() {
	var t = $(this).attr("btntext");
        var type = $(this).attr("btntype");
        t = t.replace('\\\\','\\');
        if (type==0) {
		mqarea.mathquill('cmd', t).find('textarea').focus();
	} else if (type==1) {
		mqarea.mathquill('write', t).find('textarea').focus();
	} else if (type==2) {
		mqarea.mathquill('writesimpfunc', t).find('textarea').focus();
	} else if (type==3) {
		mqarea.mathquill('writefunc', t).find('textarea').focus();
	} else if (type==4) {
		mqarea.mathquill('writeint', t).find('textarea').focus();
	} else if (type==5) {
		mqarea.mathquill('movecursor', t).find('textarea').focus();
	}
}

var mqeeddclosetimer = null;
var cureedd = null;
var lasteepos = null;
function showeedd(eln,type,extras) {
	if (mqeeddclosetimer) {
		window.clearTimeout(mqeeddclosetimer);
		mqeeddclosetimer = null;
	}
	hideee();
	cureedd = {"id":eln, "type":type, "extras": extras};
	var dd = $("#mqeedd");
	var el = $("#"+eln);
	
	var p = el.offset();
	p.left += el.outerWidth();
	dd.css('left',p.left+"px").css('top',p.top+"px").height(el.outerHeight()-2).show();
}
function hideeedd() {
	mqeeddclosetimer = setTimeout(function() {$("#mqeedd").hide();}, 250);
}

function mqeetoggleactive(n) {
	for (var i=1; i<=5; i++) {
		if (n==i) {
			$('#mqeetab'+i).addClass('mqeeactive').removeClass("mqeehighlight");
			document.getElementById("mqee"+i).style.display = "";
		} else {
			document.getElementById("mqee"+i).style.display = "none";
			$('#mqeetab'+i).removeClass('mqeeactive');
		}
	}
	mqeeactivetab = n;
	mqarea.find('textarea').focus();
}

function showee() {
	mqPrepTabs(cureedd.type - 3,cureedd.extras);
	var mqee = $("#mqee");
	if (!lasteepos) {
		
		lasteepos = {
			left: ($(window).width() - mqee.outerWidth())/2,
			top: $(window).scrollTop() + ((window.innerHeight ? window.innerHeight : $(window).height()) - mqee.outerHeight())/2, 
			scroll: $(window).scrollTop()
		};
	} else {
		var scrollchg = $(window).scrollTop() - lasteepos.scroll;
		lasteepos.top = lasteepos.top + scrollchg;
		lasteepos.scroll = $(window).scrollTop();
	}
	mqee.css('left',lasteepos.left).css('top',lasteepos.top).show();
	mqarea.mathquill('latex', AMtoMQ($("#"+cureedd.id).val()));
	mqarea.find('textarea').focus();
	
}
function hideee() {
	$("#mqee").hide();
}
function savemathquill() {
	$("#"+cureedd.id).val(MQtoAM(mqarea.mathquill('latex')));
	hideee();	
}



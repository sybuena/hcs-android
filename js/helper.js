
function swipeEvent(event, direction, distance, duration, fingerCount){
    var deleteShow 	= $('#delete-undo').css('display');

    if((distance == '0' && duration < 100) && deleteShow != 'block') {

    	$('#message-list .go-detail').each(function() {
			//get the background color
			var color = rgb2hex($(this).css('background-color'));
			
			//if found selected message list
			if(color == '#81b9cc') {
				//put back the color depending if messages
				//is read or unread
				if($(this).attr('unread') == 'true') {
					$(this).css('background-color', 'white');
				} else {
					$(this).css('background-color', '#f7f7f7');
				}
			}
		});

       	$(this).css('background-color', '#81B9CC');	

       	var guid 	= $(this).attr('id');
       	var unread 	= $(this).attr('unread');
       	var type 	= $('ul.nav-stacked li.active a.left-navigation').attr('id');
       	//wait for milli sec before going to detail page
       	setTimeout(function() {
       		
       		getDetail(guid, unread, type);
       	}, 200);
    } 

    
        
}
function tapEvent(event, target) {

	/*var id 			= $(this).attr('id');	
	var deleteBar 	= $('#delete-bar').css('display');
	var unread 		= $(this).attr('unread')

	if(deleteBar != 'block') {
		var count = 0
		var tapDetail = setInterval(
			function(){
				count++;
				console.log(count)
				if(count == '5') {
					clearInterval(tapDetail)
				} 
				//console.log('tap')
				//$(this).css('background-color', '#81B9CC');
				//clearInterval(tapDetail)
			},500);

		//$(this).css('background-color', '#81B9CC');
		

		//setTimeout(function() {
			//getDetail(id, unread);
		//},200)
	}*/
}	

function holdStatus(event, target) {
	var parentPage 	= $('ul.nav-stacked li.active a.left-navigation').attr('id');
		
	if(parentPage != 'Deleted' && parentPage !== 'Outbox') {
		var selected = false;

		//check firs if there is already selected
		$('#message-list .go-detail').each(function() {
			//get the background color
			var color = rgb2hex($(this).css('background-color'));
			
			//if found selected message list
			if(color == '#81b9cc') {
				selected = true;
			}
		});	

		if(!selected) {
			var id = $(this).attr('id');

			window.tapSelected = id;
			window.tapHold = true;
			
			$('#main-bar').hide();
			$('#delete-bar').show();

			$(this).css('background-color', '#81B9CC');

			$('.delete-message-list').one('tap', function(e) { 
						
				$('#'+window.tapSelected).hide();
				$('#main-bar').show();
				$('#delete-bar').hide();
				
				//re count unread message
	        	if($('#'+window.tapSelected).attr('unread') == 'true') {
	        		window.unreadInbox = parseInt(window.unreadInbox) - 1;
					displayCounter(true);
	        	}    
	           
				var deleteMessage = setTimeout(function() {
					var type = $('ul.nav-stacked li.active a.left-navigation').attr('id');
					window.messages.delete(window.tapSelected, type, true);
					clearInterval(deleteMessage);
				}, 500);
			
			});
			
		}
	}
}

function swipeStatusEvent(event, phase, direction, distance, fingers) {


	var deleteBar 	= $('#delete-bar').css('display');
	var deleteShow 	= $('#delete-undo').css('display');
	var id 			= $(this).attr('id');
	var type 		= $('ul.nav-stacked li.active a.left-navigation').attr('id');

	if(phase == 'start' && deleteBar != 'block') { 
		if(deleteShow == 'block') {
			//re count unread message
        	if($('#'+id).attr('unread') == 'true') {
        		window.unreadInbox = parseInt(window.unreadInbox) - 1;
				displayCounter(true);
        	}   
        	
        	$('#delete-undo').hide();
			$('.delete-wait').hide(200);
			$('#delete-undo').css('z-index', '0');	
			
			setTimeout(function() {
				
				window.messages.delete(window.tapSelected, type, true);
			}, 500);
			
		} 
	}

	if(phase == 'start' && deleteBar == 'block') {
	
		$('#message-list .go-detail').each(function() {
			//get the background color
			var color = rgb2hex($(this).css('background-color'));
			
			//if found selected message list
			if(color == '#81b9cc') {
				//put back the color depending if messages
				//is read or unread
				if($(this).attr('unread') == 'true') {
					$(this).css('background-color', 'white');
				} else {
					$(this).css('background-color', '#f7f7f7');
				}
			}
		});

		//toggle navbar
		$('#main-bar').show();
		$('#delete-bar').hide();
	}

	if(phase == 'cancel' && deleteBar != 'block') { 

		$('#message-list .go-detail').each(function() {
			//get the background color
			var color = rgb2hex($(this).css('background-color'));
			
			//if found selected message list
			if(color == '#81b9cc') {
				//put back the color depending if messages
				//is read or unread
				if($(this).attr('unread') == 'true') {
					$(this).css('background-color', 'white');
				} else {
					$(this).css('background-color', '#f7f7f7');
				}
			}
		});

		$('#'+id).css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		$('#'+id).css("-webkit-transform", "translate3d(0px,0px,0px)");
	} 
	
	if(phase == 'move' && deleteBar != 'block') {
		
		$('#delete-undo').hide();
		$('.delete-wait').hide(200);
		$('#delete-undo').css('z-index', '0');	
		
		$('#message-list .go-detail').each(function() {
			//get the background color
			var color = rgb2hex($(this).css('background-color'));
			
			//if found selected message list
			if(color == '#81b9cc') {
				//put back the color depending if messages
				//is read or unread
				if($(this).attr('unread') == 'true') {
					$(this).css('background-color', 'white');
				} else {
					$(this).css('background-color', '#f7f7f7');
				}
			}
		});

		window.iscroll.refresh();
		window.swipeDelete = '';
	}

	if(direction == 'left' && deleteBar != 'block') {
	
		var width 	= parseInt($(this).css('width'))/5;

		if(phase == 'move') { 
			window.swipeDelete = id;
			//unset all div 1st
			$('.go-detail').css("-webkit-transform", "translate3d(0px,0px,0px)");
				
			var duration = 0;

			swipeLeft((defaultWidth * currentImg) + distance, duration, id, direction, phase);
				
		} else if(phase == 'end') {
			swipeLeft((defaultWidth * currentImg) + distance, speed, id, direction, phase);	
		} else if(phase == 'cancel') {
			swipeLeft((defaultWidth * currentImg) + distance, speed, id, direction, phase);	
		}
	}

	setTimeout(function() {
		window.tapSelected = id;
	}, 500);
}

/**
 * Manually update the position of the div on drag
 *
 */
function swipeLeft(distance, duration, id, direction, phase) { 
	
	var value 	= (distance < 0 ? "" : "-") + Math.abs(distance).toString();
	var limit 	= (parseInt($('#'+id).css('width')) / 2);
	var width 	= (parseInt($('#'+id).css('width')) / 4);
	var page 	= $('ul.nav-stacked li.active a.left-navigation').attr('id')
	
	if(page == 'Deleted') {
		return false;
	}

	if(phase == 'move') {
		$('#'+id).css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		
		//follow the touch event in div
		$('#'+id).css("-webkit-transform", "translate3d("+value +"px,0px,0px)");
		
		window.snapper.enable();

		
	} else if(phase == 'end') {
		
		//animate
		$('#'+id).css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		//if less than limit
		if(Math.abs(value) < width) {
			//enable left sidebar
			window.snapper.enable();
			
			//slide to the beginning
			$('#'+id).css("-webkit-transform", "translate3d(0px,0px,0px)");
		//if hit the limit
		} else {

			var offset 		= $('#'+id).offset();
    		$('#'+id).addClass('delete-wait');
    		$('#delete-undo').show();
    		$('#delete-undo').css('z-index', '9999');
    		$('#delete-undo').css('top', (offset.top)+'px');
    		
			//slide to the limit
			$('#'+id).css("-webkit-transform", "translate3d(-100%,0px,0px)");
			/* -----------------------------------------
						DELETE MESSAGE HERE
			   ----------------------------------------- */
			//var type = $('ul.nav-stacked li.active a.left-navigation').attr('id');
			
			//window.messages.delete(id, type);
	
			window.snapper.enable();
		}	

	} else if(phase == 'cancel') {
		$('#'+id).css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		$('#'+id).css("-webkit-transform", "translate3d(0px,0px,0px)");
	}
};

function buildListing() {

	window.iscroll = new IScroll('#wrapper', { 
		probeType	: 3, 
		mouseWheel	: true ,
	});
	
	var pullDownEl 		= document.getElementById('pullDown');
	var pullUpEl 		= document.getElementById('pullUp');	

	window.iscroll.on('refresh', function () { 

	});

	window.iscroll.on('scroll', function() { 
		//infinite scroll
		if(this.y < this.maxScrollY) {
			
			var type 			= $('ul.nav-stacked li.active a.left-navigation').attr('id');
			var end 			= window.startCount;
			window.startCount 	= window.startCount + 10;
			
			window.messages.pullDown(window.messageList[type], type, window.startCount, end, false);	
	        
	        this.refresh()        
		}   

		//prepare for refresh 
		if(this.y > 50) {
			$('#message-list').attr('isRefresh', 'true');
		}
		
	});

	window.iscroll.on('scrollEnd', function(e) {
		//pull to refresh
		if($('#message-list').attr('isRefresh') == 'true') {
			NProgress.start();
			$('#message-list').attr('isRefresh', 'false');
			window.messages.checkInbox('Inbox');
		}
		
	});			
}

function setBadge(count) {
	/*if(typeof window.plugin !== 'undefined') {
		window.plugin.notification.badge.set(count);
	}*/
}

function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function showNotification(text, id) {

	/*window.plugin.notification.local.add({ 
		id 			: id, 						//unique id of the notification
		message 	: '"'+text+'"',				//the message that is displayed
		sound 		: 'TYPE_NOTIFICATION', 		//a sound to be played
		title 		: 'New message received', 	//the title of the message
		autoCancel 	: true						//Setting this flag and the notification is automatically canceled when the user clicks it
	});*/
}

function removeNotification(ID) {
	/*window.plugin.notification.local.cancel(ID, function () {
	    alert('notification has been remove - '+ID);
	});*/
}


/**
 * Helper function to make first char of
 * string uppercase 
 *
 * @param string
 * @return string
 */
function capitalize(str) {
    strVal 	= '';
    str 	= str.split(' ');

    for(var chr = 0; chr < str.length; chr++) {
        strVal += str[chr].substring(0, 1).toUpperCase() + str[chr].substring(1, str[chr].length) + ' '
    }

    return strVal
}

/**
 * Main page loading animation
 *
 * @param string
 */
function mainLoader(action) {
	if(action == 'start') {
		$('.loading-messages').show();
	} else {
		$('.loading-messages').hide();
	}
}

function hideKeyboard() {
   // document.activeElement.blur();
   // $("input").blur();
};

function displayCounter(force) {
	if(!force) {
		if(window.unreadInbox == 0){
			window.messageList['Inbox'] = _string.unlock('Inbox');
			for(i in window.messageList['Inbox']) {
	 			//count if unread
	 			if(window.messageList['Inbox'][i]['b:MessageRead'] == 'false') {
	 				window.unreadInbox++;
	 			}
	 		}
		}
	}
	var page = $('ul.nav-stacked li.active a.left-navigation').attr('id');

	//only display if current page is inbox
	if(page == 'Inbox') {
		$('#Inbox span.badge').html(window.unreadInbox);
		$('#folder-name').html($('a#Inbox').html());
	}
  		
}

/**
 * Pops out at th bottom of the application
 * when ever it calls and fade after 5secs.
 *
 * @param string html or text to the notification
 */
function notification(html) {
	
	$('.message-ajax #message-here').html(html);
	$('.message-ajax').show();
	$('.message-ajax').fadeOut(4000);
}

function short(length) {
    var s = document.getElementsByClassName("list-title");
    var len = s.length;
    for(var i = 0; i < len; i++) {
       var g = s[i].innerHTML;
       var x = ". . .";
       var leng = length-5;
       var html = g.substring(0, leng)+"";
       var allHTML = html+x;
       s[i].innerHTML = allHTML;
    }
}

/* --------------------------------------------
			Protected Function
   -------------------------------------------- */
var _date = (function() {
	return {
		minus : function(days) {
			var d 	= new Date($.format.date(new Date().getTime(), "yyyy-MM-ddThh:mm:ss"));
			var end = d.setDate(d.getDate() - days);

			return $.format.date(end, "yyyy-MM-ddThh:mm:ss");			
		}
	}
}());

/**
 * Convert Date to current local timezone
 * 
 * @param date
 * 
 */
var _local = (function() {
	return {
		date : function(date) {
			//get local UTC offset by hour
			var localOffset = Math.abs((new Date().getTimezoneOffset()/60*2)+1);
			//server date from SOAP call
			var serverDate 	= new Date(date);
			//get server offset by msec
		  	var serverOffset = serverDate.getTimezoneOffset() * 60000;
		  	//convert server date as timstamp
		  	var serverTimeStamp = serverDate.getTime();
		  	//get UTC time in msec
		  	var utc = serverTimeStamp + serverOffset;
		  	var now = utc + (3600000*localOffset);

			return now;
		}
	}
}());

var _string = (function() {

	return {
		encrypt : function(text) {
			var keyBase64 = CryptoJS.enc.Base64.parse("ITU2NjNhI0tOc2FmZExOTQ==");
			var iv = CryptoJS.enc.Base64.parse('AAAAAAAAAAAAAAAAAAAAAA==');

			var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), keyBase64,
				{
					keySize: 128 / 8,
					iv: iv,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7
				});

			//alert("Encrypted = " + encrypted);
			// Returns a Base64 encoded string.
			return encrypted.toString();
		},

		//convert array to string, encryp string then save to local storage
		lock : function(object, key) { 
			//convert object to string format
			var string = JSON.stringify(object);
			
			if(key != 'Inbox' && key != 'Sent' && key != 'Draft' && key != 'Deleted' && key != 'Outbox') {
				
				//now encrypt it
				var encrypted = CryptoJS.AES.encrypt(string, SECRET);
				
				//save to local storage together with KEY
				localStorage.setItem(key, encrypted.toString());
				return encrypted.toString();
			} else {
				localStorage.setItem(key, string);
				return string;
			}
			
			
		},
		//get local storage, decryp string
		unlock : function(key) {
			
			var string = localStorage.getItem(key);
			
			//if string from local storage is null
			if(string === null || string == ''/* || $.isEmptyObject(string)*/) { 
				//just return it, do nothing
				return string;
			}
			
			if(key != 'Inbox' && key != 'Sent' && key != 'Draft' && key != 'Deleted' && key != 'Outbox') { 
				var decrypted = CryptoJS.AES.decrypt(string, SECRET);
				var json = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
			} else { 
				
				var json = JSON.parse(string);
			}

			return json;
		}
	}
}());

/**
 * Do the jquery SOAP call
 *
 * @param string
 * @param string
 * @param function|callback 
 *
 */
var _SOAP = (function() {
	return {
		//all ajax call goes here
		post : function(method, xml, callback, error) {
			
			$.soap({
		        url 		: SOAP_URL,
		        method 		: method,
		        SOAPAction 	: 'urn:CaregiverPortalService/'+method,
		        data 		: xml.join(''),		
		        success 	: callback,
		        error 		: error
		    });
		}
	}
}());























/* ------------------------------------------------------------
		OLD FUNCTION, NOT USING ANYMORE FOR BACKUP PURPOSE
   ------------------------------------------------------------ */
/**
 * Core method on pulling message listing
 * lets go navite javascript
 *
 
function loaded() {
	
	if($.isEmptyObject(window.iscroll) || typeof window.iScroll === 'undefined') {
		
		var pullDownEl 		= document.getElementById('pullDown');
		var pullDownOffset 	= pullDownEl.offsetHeight;
		var pullUpEl 		= document.getElementById('pullUp');	
		var pullUpOffset 	= pullUpEl.offsetHeight;
		var option 			= {
			useTransition 	: true,
			topOffset 		: pullDownOffset,
			onRefresh 		: function () {
				if (pullDownEl.className.match('loading')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '';
				} else if (pullUpEl.className.match('loading')) {
					pullUpEl.className = '';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
				}
			},
			onScrollStart : function(e) {
				$('.go-detail').css("-webkit-transition-duration", 1 + "s");
				$('.go-detail').css("-webkit-transform", "translate3d(0px,0px,0px)");
				//hide mobile keyboard
				hideKeyboard();
				
			},
			onScrollMove 	: function (e) {
				
				//check where page we are
				var currentPage = $('.current-page').attr('id');

				//disable left sidebar if inside compose page
				if(currentPage != 'compose') {
					
					window.snapper.enable();
				} 
					
				$('#message-list').css('pointer-events', 'all');
				
				if(this.y > 5 && !pullDownEl.className.match('flip')) {
					
					$('#pullDown').show();
					
					$('#message-archive').css('margin-top', '45px');

					pullDownEl.className = 'flip';
					this.minScrollY = 0;

				} else if (this.y < 5 && pullDownEl.className.match('flip')) {

					pullDownEl.className = '';
					this.minScrollY = pullDownOffset;
				
				} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				
					pullUpEl.className = 'flip';
					this.maxScrollY = this.maxScrollY;
					
				} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
					
					pullUpEl.className = '';
					this.maxScrollY = pullUpOffset;
				}

				
			},
			onScrollEnd 	: function () {
				//check where page we are
				var currentPage = $('.current-page').attr('id');
				//do nothing if we are in compose page
				if(currentPage == 'compose') {
					return false;
				}
				
				//if(this.y == '-0') {
				//	pullDownEl.className = 'loading';		
					
					//check messages on pull down
				//	setTimeout(function() {
				//		pullDownAction();	
				//	}, 500);
					
				 if (pullDownEl.className.match('flip')) {

					pullDownEl.className = 'loading';	
					//check messages on pull down
					setTimeout(function() {
						pullDownAction();	
					}, 500);
					
				//on pull up release		
				} 

				if (pullUpEl.className.match('flip')) {
					pullUpEl.className = 'loading';
					//pagination loading			
					//addOne();
					pullUpAction(10);	
				//only trigger on pull up	
				} 
			}
		}
		
		//execute message listing
		window.iscroll = new iScroll('wrapper', option);
		
		
		//no rubber band effect
		/*window.composePage = new iScroll('message-compose', {
			useTransition 			: true,
			bounce 					: false
		});
		window.sidebar = new iScroll('sidebar', {bounce : false});

		
		//no rubber band effect
		window.messageDetail = new iScroll('message-detail', {bounce : false});

	} 
	
}
*/

/*
function pullDownAction () {
	
	//get the active listing
	var type = $('ul.nav-stacked li.active a.left-navigation').attr('id');
	
    //now make request to backend
    window.messages.checkInbox(type, 1);
	
	window.messageList[type] = _string.unlock(type);			
}

function addOne() {
	
	var type 			= $('ul.nav-stacked li.active a.left-navigation').attr('id');
	var end 			= window.startCount;
	window.startCount 	= window.startCount + 1;
	
	window.messages.pullDown(window.messageList[type], type, window.startCount, end);	
	
	//Remember to refresh when contents are loaded (ie: on ajax completion)
	window.iscroll.refresh();		
	//On click message listing then load message detail
	//base on Message GUID
	onClickDetail(type);	
}

function pullUpAction (count, fromDelete) {
	
	var type 			= $('ul.nav-stacked li.active a.left-navigation').attr('id');
	var end 			= window.startCount;
	window.startCount 	= window.startCount + count;
	
	window.messages.pullDown(window.messageList[type], type, window.startCount, end, fromDelete);	
	//$(".list-title").shorten();
	//Remember to refresh when contents are loaded (ie: on ajax completion)
	window.iscroll.refresh();		
	//On click message listing then load message detail
	//base on Message GUID
	onClickDetail(type);	
}


/**

function pullRefresh() {
	
	//get the active listing
	var type = $('ul.nav-stacked li.active a.left-navigation').attr('id');
	var start = 10;
	var end  = 0;
	//on pull down the message listing
	$(document).on('pulled', '#message-list', function() {
	    //now make request to backend
	    window.messages.checkInbox(type, 1);
	});	
	
	window.messageList[type] = _string.unlock(type);

}

function pullDown() {

	var type = $('ul.nav-stacked li.active a.left-navigation').attr('id');
	var start = 10;
	var count = 11;
	
	//window.messageList[type] = _string.unlock(type);
	
	$(document).on('bottomreached', '#message-list', function() {

		start = start = 10;
		count++;
		//dont go beyond end of list
		if(window.messageList[type].length >= count) {
			
			window.messages.pullDown(window.messageList[type], type, start, 0);	
		}
		
		//On click message listing then load message detail
		//base on Message GUID
		onClickDetail(type);
		//$(".list-title").shorten();
		
	});
}
*/

/*function swipelisting(distance, duration, id, direction,phase) {
	//do some math
	var limit 	= parseInt($('#'+id).css('width')) / 2;	
	//inverse the number we set in the css
	var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();
	
	//if drag value is bigger than limit and drag end
	if(Math.abs(value) > limit && phase == 'end') {
		//remove the div from the listing
		$('#'+id).hide(500);
	//if drag end but not more than the limit	
	} else if(phase == 'end') {
		//animate
		$('#'+id).css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		//slide to the beginning
		$('#'+id).css("-webkit-transform", "translate3d(0px,0px,0px)");
	} else {
		//animate
		$('#'+id).css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		//follow the touch event in div
		$('#'+id).css("-webkit-transform", "translate3d("+value +"px,0px,0px)");
	}
}



*/
/**
 * Manually update the position of the div on drag
 *

function swipelisting(distance, duration, id, direction, phase) { 
	
	var value 	= (distance < 0 ? "" : "-") + Math.abs(distance).toString();
	//get the width of the current div then divided by two as limit
	var limit 	= (parseInt($('#'+id).css('width')) / 2);
	var width 	= (parseInt($('#'+id).css('width')) / 4);

	if(phase == 'start') {
	
		//$('#delete_'+id).show();
		$('#message-list').css('pointer-events', 'all');
		$('.go-detail').css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		//slide to the limit
		$('.go-detail').css("-webkit-transform", "translate3d(-"+limit+"px,0px,0px)");
		//on touch end or leave
	} else if(phase == 'end') {

		$('#message-list').css('pointer-events', 'all');
		//animate
		$('#'+id).css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		//if less than limit
		if(Math.abs(value) < width) {
			//enable left sidebar
			window.snapper.enable();
			
			//slide to the beginning
			$('#'+id).css("-webkit-transform", "translate3d(0px,0px,0px)");
		//if hit the limit
		} else {
			
			//slide to the limit
			$('#'+id).css("-webkit-transform", "translate3d(-50%,0px,0px)");
			//prevent click 
			$('#message-list').css('pointer-events', 'none');
			//disable dragging left panel
			window.snapper.disable();
		}

	} else if(phase == 'cancel'){

		$('#'+id).css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		$('#'+id).css("-webkit-transform", "translate3d(0px,0px,0px)");
		//enable left panel
		window.snapper.enable();

	} else {
		$('#message-list').css('pointer-events', 'all');
		//animate
		$('#'+id).css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		//follow the touch event in div
		$('#'+id).css("-webkit-transform", "translate3d("+value +"px,0px,0px)");
		//console.log(value);
		//$('#d_'+id).css('width', Math.abs(value)++);
		window.snapper.enable();

		$('#message-list').css('pointer-events', 'all');	
	} 
};*/
//get Token
		/*window.user.getToken(window.username, window.password, function(soapResponse){
			
			var results 	= soapResponse.toString();	
	        var json 		= $.xml2json(results);
		 	var response 	= json['s:Envelope']['s:Body']['LoginCaregiverPortalResponse']['LoginCaregiverPortalResult'];
		 	var token 		= response['a:Token'];
			var start 		= '1950-04-01T09:00:00';
			var end 		= $.format.date(new Date().getTime(), "yyyy-MM-ddThh:mm:ss");
			var xml 		=
		        ['<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:heal="http://schemas.datacontract.org/2004/07/HealthCareAssistant" xmlns:hsim="http://schemas.datacontract.org/2004/07/HSIMessageExchange">',
		            '<soapenv:Header/>',
		            '<soapenv:Body>',
		                '<RetrieveMessages>',
		                    '<caregiverId>'+token+'</caregiverId>',
		                    '<messageFolder>',
		                        '<heal:m_IsDirty>false</heal:m_IsDirty>',
		                        '<heal:m_DefaultValue></heal:m_DefaultValue>',
		                        '<heal:m_FilterSet>false</heal:m_FilterSet>',
		                        '<heal:m_Key>'+type+'</heal:m_Key>',
		                        '<heal:m_SerializeList></heal:m_SerializeList>',
		                    '</messageFolder>',
		                    '<dateRange>',
		                        '<heal:m_IsDirty>false</heal:m_IsDirty>',
		                        '<heal:m_EndDate>',
		                            '<heal:m_IsDirty>false</heal:m_IsDirty>',
		                            '<heal:DateName></heal:DateName>',
		                            '<heal:DateStringFormat>YYYY-MM-DDThh:mm:ss</heal:DateStringFormat>',
		                            '<heal:InnerDate>'+end+'</heal:InnerDate>',
		                        '</heal:m_EndDate>',
		                        '<heal:m_StartDate>',
		                            '<heal:m_IsDirty>false</heal:m_IsDirty>',
		                            '<heal:DateName></heal:DateName>',
		                            '<heal:DateStringFormat>YYYY-MM-DDThh:mm:ss</heal:DateStringFormat>',
		                            '<heal:InnerDate>'+start+'</heal:InnerDate>',
		                        '</heal:m_StartDate>',
		                    '</dateRange>',
		                    '<unreadOnly>true</unreadOnly>',
		                '</RetrieveMessages>',
		            '</soapenv:Body>',
		        '</soapenv:Envelope>'];

		    //do ajax SOAP call    
			_SOAP.post('RetrieveMessages', xml, function(soapResponse) { 

				var json 	= $.xml2json(soapResponse.toString()); 
				
	            var data 	= json['s:Envelope']['s:Body'];
	           	var result 	= data['RetrieveMessagesResponse']['RetrieveMessagesResult']['a:MessagesResult'];
         		var count 	= 0;	
         		
         		//if no unread messages
         		if(result['b:MessageLabel'] == null) {

         			$('#'+type+' span.badge').html(count);
         			$('#folder-name').html($('a#'+type).html());
         			
         			return false;
         		} 

         		//if in single
         		if(typeof result['b:MessageLabel'][0] === 'undefined') {
         			count++;
         		//else there s mutiple unread message	
         		} else {
         			for(i in result['b:MessageLabel']) {
         				count++;
         			}
         		}
         		
         		$('#'+type+' span.badge').html(count);
         		$('#folder-name').html($('a#'+type).html());
         		setBadge(count)
         		
			});		        
		});*/

/*

function populateArchive(ids) { 
	//setTimeout(loaded, 200);
	
	setTimeout(function() {
		var currentId;
		var counter = 0;	
		
		for(i in ids) {
			var height = $("#"+ids[i]).css('height');
			
			if(currentId != ids[i]) {	
				$('#message-archive').append(
					'<div id="delete_'+ids[i]+'" class="row" style="height:'+height+'">'+
		            '<div class="delete-swipe col-xs-6 col-sm-6 pull-right">'+
		            '<a href="#" onclick="deleteSwipe.call(this,event)" id="'+ids[i]+'"><i class="fa fa-trash-o fa-2x center-swipe"></i></a>'+
		            '</div></div>');
			}

			counter++;
			var currentId = ids[i];
		}
		
	}, 200);
}

function populateArchive2(ids) {

	setTimeout(loaded, 200);

	setTimeout(function() {

		var currentId;
		var counter = 0;	
		
		$('#message-list').children().each(function() {

			var id = $(this).attr('id');

			//dont process if there is no GUID on the message listing
			if(typeof id !== 'undefined') {
				var height = $("#"+id).css('height');
				
				var deleteSwipe = $('#delete_'+id).css('height');
				
				//if ID is still not i the list
				//prevent duplicate
				if(typeof deleteSwipe === 'undefined') {
					$('#message-archive').append(
						'<div id="delete_'+id+'" class="row" style="height:'+height+'">'+
			            '<div onclick="deleteSwipe.call(this,event)" id="'+id+'" class="delete-swipe col-xs-6 col-sm-6 pull-right">'+
			            '<p><i class="fa fa-trash-o fa-2x center-swipe"></i></p>'+
			            '</div></div>');
				}
			}
		});
	}, 200);	
}	

function deleteSwipe(e) {
	$('#message-archive').attr('isOpen', 'true');
	
	var guid = $(this).attr('id');
	var type 	= $('ul.nav-stacked li.active a.left-navigation').attr('id');
	
	window.messages.delete(guid, type);
	
	window.snapper.enable();

	return false;
}

function swipeDelete(uid) {

	//make this guys always unique
	$('#'+uid).swipe({
		triggerOnTouchEnd 	: true,
		triggerOnTouchLeave : true,
		allowPageScroll 	: 'vertical',
		swipeStatus 		: function(event, phase, direction, distance, fingers) {
			//get the GUID pf the current div
			var id 		= $(this).attr('id');
			var width 	= parseInt($(this).css('width'))/5;
			
			//disable click on all child of archive 
			$('#message-archive .delete-swipe a').css('pointer-events', 'none');
			//enable specific click
			$('#message-archive #delete_'+id+' .delete-swipe a').css('pointer-events', 'all');
			
			//done process if drag up or down
			if(direction != 'up' && direction != 'down' && direction != 'right') {
				
				//If we are moving before swipe, and we are going L or R, then manually drag the images
				if(phase == "move" && direction == "left") {
					//unset all div 1st
					$('.go-detail').css("-webkit-transform", "translate3d(0px,0px,0px)");
					
					var duration = 0;

					//if swipe to the left
					if(direction == "left") {
						swipelisting((defaultWidth * currentImg) + distance, duration, id, direction, phase);
					//else it is to the right
					} else if (direction == "right") {
						//swipelisting((defaultWidth * currentImg) - distance, duration, id, direction, phase);
					}	
				//else, cancel means snap back to the begining
				} else if (phase == "cancel") {
					//swipelisting(defaultWidth * currentImg, speed, id, direction, phase);
					swipelisting((defaultWidth * currentImg) + distance, speed, id, direction, phase);	
				//else end means the swipe was completed, so move to the next image
				} else if (phase == "end" ) {
					//on touch end
					swipelisting((defaultWidth * currentImg) + distance, speed, id, direction, phase);	
				}
			//on dragging up or down	
			} else {
				$('#message-list').css('pointer-events', 'all');
				//unset all div in listing
				$('.go-detail').css("-webkit-transform", "translate3d(0px,0px,0px)");
				
				if(direction == 'left') {
						//enable dragging left panel
					window.snapper.enable();
				}
				
			}
		},
		
	}); 
}
/*
 * Click event on message in listing
 * (this must be touchstart)
 *
 
function onClickDetail(type) {

	$('.delete-message-list').bind('tap', function(e) { 
		
		$('#message-archive').attr('isOpen', 'true');
	
		var guid = window.tapSelected;

		var type 	= $('ul.nav-stacked li.active a.left-navigation').attr('id');
	
		window.messages.delete(guid, type);
	
		window.snapper.enable();
		window.iscroll.enable();

		return false
	});

	$('#cancel-select').bind('tap', function(e) { 
		
		$('#message-list').css('pointer-events', 'all');
		$('#message-archive').css('pointer-events', 'all');
		window.tapSelected 	= ''
		window.tapHold 		= false;
		window.iscroll.enable();
		window.snapper.enable();

		//find the selected
		$('#message-list .go-detail').each(function() {
			//get the background color
			var color = rgb2hex($(this).css('background-color'));
			
			//if found selected message list
			if(color == '#81b9cc') {
				//put back the color depending if messages
				//is read or unread
				if($(this).attr('unread') == 'true') {
					$(this).css('background-color', 'white');
				} else {
					$(this).css('background-color', '#f7f7f7');
				}
			}
		});
		//toggle navbar
		$('#main-bar').show();
		$('#delete-bar').hide();
	});

	

	$('#message-list .go-detail').on('touchstart', function(e){ 
		setTimeout(function() {
		var deleteBar = $('#delete-bar').css('display')
		
		if(deleteBar == 'block') {
			
	
			//find the selected
			$('#message-list .go-detail').each(function() {
				//get the background color
				var color = rgb2hex($(this).css('background-color'));
				
				//if found selected message list
				if(color == '#81b9cc') {
					//put back the color depending if messages
					//is read or unread
					if($(this).attr('unread') == 'true') {
						$(this).css('background-color', 'white');
					} else {
						$(this).css('background-color', '#f7f7f7');
					}
				}
			});
			
			//toggle navbar
			$('#main-bar').show();
			$('#delete-bar').hide();	
			$('#message-archive').css('pointer-events', 'all');
			
			window.tapSelected 	= ''
			
			//make some delay
			setTimeout(function() {
				window.iscroll.enable();
				window.tapHold 	= false;
			}, 500)
			
			window.snapper.enable();

		} else {

			//$(this).css('background-color', '#81B9CC !important');
		}	
		}, 500)
	}).on('touchend', function(e){
		
	

	}).on('touchmove', function(e){ 
		var deleteBar = $('#delete-bar').css('display')
		
		if(deleteBar == 'block') {
			window.snapper.disable();	
		} else {
			window.snapper.enable();	
		}

	}).on('taphold', function(e){ 
		var parentPage 	= $('ul.nav-stacked li.active a.left-navigation').attr('id');
		
		if(parentPage != 'Deleted' && parentPage !== 'Outbox') {
			var selected = false;

			//check firs if there is already selected
			$('#message-list .go-detail').each(function() {
				//get the background color
				var color = rgb2hex($(this).css('background-color'));
				
				//if found selected message list
				if(color == '#81b9cc') {
					selected = true;
				}
			});	

			if(!selected) {
				var id = $(this).attr('id');

				window.tapSelected = id;
				window.tapHold = true;
				window.snapper.disable();
				window.iscroll.disable();

				$('#message-archive').css('pointer-events', 'none');
				$('#main-bar').hide();
				$('#delete-bar').show();

				$(this).css('background-color', '#81B9CC');
				
			}
		}
	});
	
	//on tap message in listing
	$('.go-detail').bind('tap', function(e) {
		
		

		//$(this).css('background-color', '#81B9CC');
		if(window.tapHold) {
			return false;
		}

		//prevent double click
		e.stopPropagation();
		e.preventDefault();
		
		
		//get the GUID of the message
		var id 		= $(this).attr('id');
		var unread 	= $(this).attr('unread');
		
		//check if message is unread
		if(unread == 'true') {
			//count the current unread message
			var count = $('#Inbox span.badge').html();
			//only process if there is unread message	
			if(count != 0) {
				//do the math
				var plus = parseInt(count) - 1;

				$('#Inbox span.badge').html(plus);
				$('#folder-name').html($('#Inbox').html());
				setBadge(plus);
				
			}

			$(this).css('background-color', '#E4E4E4');
			$(this).css('font-weight', 'none');

			removeNotification(id);
		}

		//prepare UI for detail page
		$('#message-detail').hide();
		$('.message-elem').hide();
		
		//main loading
		mainLoader('start');

		//and put it sa hidden input 
		$('#detail-guid').val(id);

		//do ajax call and show detail page
		//if message detail is already saved it 
		//the local storage, then just get the saved
		//local data but if not saved then make 
		//SOAP request to get message datail and save 
		//to local storage
		window.messages.getDetail(id, type, unread);

		return false;
	});	
}*/
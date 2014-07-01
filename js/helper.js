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

	window.plugin.notification.local.add({ 
		id 			: id, 						//unique id of the notification
		message 	: '"'+text+'"',				//the message that is displayed
		sound 		: 'TYPE_NOTIFICATION', 		//a sound to be played
		title 		: 'New message received', 	//the title of the message
		autoCancel 	: true						//Setting this flag and the notification is automatically canceled when the user clicks it
	});
}

function removeNotification(ID) {
	window.plugin.notification.local.cancel(ID, function () {
	    alert('notification has been remove - '+ID);
	});
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
				appendMethodToURL: false,
				HTTPHeaders : { 
					//'Content-Type' : 'application/xml; charset=ISO-8859-1', 
				//	'Content-Type' : 'application/xml; charset=UTF-8'
				},
				dataFilter : function ( data, type ) {
				    console.log(data);
				    //return data;
				},
		        success: callback,
		        error: error/*function (SOAPResponse) {
		        	mainLoader('stop');
		            return false;
		            console.log(SOAPResponse);
		            console.log(SOAPResponse['content']);
		            //convert the XML response to string
	            var results = SOAPResponse.toString();  
	            //the convert the string to json data
	            var json 	= $.xml2json(results);
	            
console.log(json);
		        }*/
		    });
		}
	}
}());























/* ------------------------------------------------------------
		OLD FUNCTION, NOT USING ANYMORE FOR BACKUP PURPOSE
   ------------------------------------------------------------ */





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
}*/


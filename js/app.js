//window.localStorage.clear(); return false;
//set URL and interval for settings page
window.url 		= localStorage.getItem('url');
window.interval = localStorage.getItem('interval');

//if empty or null
if(window.url == null || window.url == '') { 

	//default value of SOAP URL
	window.url = 'https://webapp.healthcaresynergy.com:8002/demoalpha/CaregiverPortalMobile/CaregiverPortalService.svc?singleWsdl';
	
	localStorage.setItem('url', window.url);
}

//if empty or null
if(window.interval == null || window.interval == '') { 
	//default value of refresh Inbox
	window.interval = '5';

	localStorage.setItem('interval', window.interval);
}

/* --------------------------------------------------
			  GLOBAL/CONSTANT VARIABLES
   -------------------------------------------------- */ 
var BASE_URL 				= 'http://hcs-mobile-rest.herokuapp.com/dummy/';
var SOAP_URL 				= window.url+'?singleWsdl';//'https://webapp.healthcaresynergy.com:8002/demoalpha/CaregiverPortalMobile/CaregiverPortalService.svc?singleWsdl';
var PORTAL 					= 'CaregiverPortal';
var NAME_SPACE_URL 			= 'http://www.w3.org/2001/XMLSchema';
var NAME_SPACE_QUALIFIER 	= 'xs';
var SECRET 					= 'w@lkingd3@d!!';
var CONTACT_LIST   			= '<li class="ui-screen-hidden"><a href="#" id="[ID]" class="contact-pick ui-btn ui-btn-icon-right ui-icon-carat-r">[NAME]</a></li>';

window.messages  		= new Messages();
window.user 	 		= new User();
window.messageList  	= [];
window.messageDetail 	= [];
window.users 			= [];
window.contactList  	= [];
window.sender  			= [];
window.online  			= true;
window.start 			= false;
window.username 		= localStorage.getItem('username');
window.password 		= localStorage.getItem('password');
window.snapper;
//scroll message listing up/dowm parameters
window.startCount		= 20;		
window.iscroll;
window.composePage;
window.messageDetail;
window.sidebar;
//swipe message listing paramaters
var defaultWidth 		= 500;
var	currentImg 			= 0;
var	maxImages 			= 3;
var	speed				= 500;
window.font 			= [];
window.connection 		= true;
window.keyboard 		= false;
window.tapHold 			= false;
window.tapSelected 		= '';
window.swipeDelete 		= '';
window.minLength  		= 20;
window.unreadInbox 		= 0;

function bind() { 
	//calculate screen height
	var height 			= $(window).height();
	var defaultheight   = parseInt(height) - 40;
	window.minLength 	= Math.round((height - 50) / 75) + 10;

	//add default min height to the message listing
	$('#message-list').css('min-height', defaultheight+'px');

	//get the login user data
	var loginUser = window.user.get();

	//check if there is a login user
	if($.isEmptyObject(loginUser)) {
		//show login/ make login
  		window.user.login();
  	//else if there is a user	
  	} else {
  		
  		//only add event listener to DOM if user is login
		setTimeout(function() {
			//build scroller, add listener to the
			//scroller behavior
			buildListing();

		}, 200);
		

		//get the login username
		var name = loginUser.sender['c:Name']['d:m_firstName']+' '+loginUser.sender['c:Name']['d:m_lastName'];
		
		//make all lowercase then capitalize first letter
		var newName = capitalize(name.toLowerCase());
		
		//now add the user fullname to the left panel
		$('.user-info h5').html('<b>'+newName+'</b>');
		
		//touch start event on every button on navbar	
		$('.navbar-inverse .navbar-nav li a').on('touchstart', function(e){ 
			$(this).css('background-color', '#006687');
		//touch end event on every button on navbar
		}).on('touchend', function(e){
			$(this).css('background-color', '#324a61');
		}).on('touchmove', function(e){
			$(this).css('background-color', '#324a61');
		});		

		//touch start event on every button on navbar	
		$('.navbar-custom .navbar-nav li a').on('touchstart', function(e){ 
			$(this).css('background-color', '#E94836');
		//touch end event on every button on navbar
		}).on('touchend', function(e){
			$(this).css('background-color', '#c0392b');
		}).on('touchmove', function(e){
			$(this).css('background-color', '#c0392b');
		});		

		$('#message-detail .ui-btn, #draft-modal .ui-btn').on('touchstart', function(e){ 
			$(this).css('background-color', '#4e6d8d');
		//touch end event on every button on navbar
		}).on('touchend', function(e){
			$(this).css('background-color', '#2c3e50');
		}).on('touchmove', function(e){
			$(this).css('background-color', '#2c3e50');
		});

		//$('#message-compose').slimScroll({height: 'auto'});
		
		$('#message-detail').slimScroll({height: 'auto'});
		
		NProgress.configure({
			parent 		: '#wrapper',
			showSpinner : false,
			speed 		: 1000
		});

		//undo delete swipe event
		$('#delete-icon').swipe({
			swipeStatus : function(event, phase, direction, distance, fingers) {
				//on tap undo icon
				if(phase == 'start') {
					$(this).css('background-color', '#81b9cc');
				//on move undo icon
				} else if(phase == 'move') {
					$(this).css('background-color', '#ccc');
				}

				//on tap up icon
				if(phase == 'cancel') {
					//undo delete
					$('#'+window.swipeDelete).removeClass('delete-wait');
					$('#delete-undo').hide();
					$('#delete-undo').css('z-index', '0');
					$('.go-detail').css("-webkit-transform", "translate3d(0px,0px,0px)");
					
					$(this).css('background-color', '#ccc'); 
				}
				
			}	
		});
  		//get contact list
  		window.contactList = window.users = _string.unlock('contactList');

  		//left panel toggle initialization
  		window.snapper = new Snap({
		  //core content
		  element: document.getElementById('content')
		});

  		//count unread message in inbox
		//window.messages.countFolder('Inbox');
		
		//get INBOX
  		window.messages.get('Inbox', window.minLength, 0);

 		displayCounter();

  		//show main page
  		mainPage(window.snapper,loginUser);

  		//check Inbox only if there is connection
		if(window.connection) { 
	  		//check inbox for new messages (every 5mins as default)
	  		checkInbox(loginUser);
	  		//on first load, check Outbox
	  		checkOutbox();
	  	}
  	}
}

function init() {
	/* -----------------------------------------
			  LOGIN PAGE/SETTING PAGE
	   ----------------------------------------- */
	//show setting page
	$('#setting-page').click(function() {
		
		$('.login-error').html('Welcome');
		$('#setting-content').show();
		$('#login-content').hide();
		$('#login-page').show();
		$(this).hide();

		$('#soap-url').val(window.url);
		
		$('#setting-button').click(function() {
			if($('#soap-url').val().length == 0) {
				$('.login-error').html('Url cannot be empty');
				return false;
			}
			localStorage.setItem('url', $('#soap-url').val());
			window.url = localStorage.getItem('url');
	  		SOAP_URL = window.url; 
			
			$('.login-error').html('Url successfully saved');
			return false;
		});
	});

	//show login page
	$('#login-page').click(function() {
		
		$('.login-error').html('Welcome');
		$('#login-content').show();
		
		$('#setting-content').hide();
		$('#setting-page').show();
		$('#loading-login').hide();
		$('.loading-circle').hide();
		
		$(this).hide();

	});
}

function getDetail(id, unread, type) {
	
	//check if message is unread
	if(unread == 'true') {
		//count the current unread message
		window.unreadInbox = parseInt(window.unreadInbox) - 1;

		displayCounter(true);
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
}


/**
 * Check outbox and if found items on it,
 * then send it and make outbox empty
 *
 */ 
function checkOutbox() {
	//send draft left
	window.messageList['Outbox'] = _string.unlock('Outbox');

	//if outbox is empty
	if($.isEmptyObject(window.messageList['Outbox'])) {
		
		return false;
	}
	
	//send if ever there is message saved in outbox
	//whenever has internet
	for(i in window.messageList['Outbox']) {
		//prepare variables
		var subject 	= window.messageList['Outbox'][i]['b:Subject'];
		var content 	= window.messageList['Outbox'][i]['content'];
		var priority 	= window.messageList['Outbox'][i]['priority'];
		var recipients 	= window.messageList['Outbox'][i]['recipients'];
		var guidFake 	= window.messageList['Outbox'][i]['b:Label']['b:MessageGUID'];

		//now send
		window.messages.send(subject, content, priority, recipients, 0);
	}

	//empty out Outbox in local storage
	localStorage.setItem('Outbox', '');
}


/**
 * This guy will run checkInbox function every 
 * 5 secs if there is a user login
 *
 */
function checkInbox() {

	//get the saved settings of interval
  	window.interval = localStorage.getItem('interval');
	//corvert sec to millisec
	timer = Math.floor(Number(window.interval))*60000;

	//start loop 
	window.setInterval(function(){ 
		var loginUser = _string.unlock('loginUser');
		
		if(loginUser != null) {
		
			//we 1st load os done
			if(window.start) {
				//then check inbox for new message
				window.messages.checkInbox('Inbox', 0);
	  		}	
  		}
	//}, localStorage.getItem('interval')*60000);
	}, timer);
}

function processSendAgain(guid) {

	$('#process-send-again').unbind().click(function() {

		//prepare variables
		var recipients 	= []
		var subject 	= $('#compose-subject').val();
		var content 	= $('#compose-content').val();
		var priority 	= $('#compose-important option:selected').html();

		//get list of recipients
		$('.to-holder div').each(function() {
			recipients.push(window.contactList[this.id]);
		});

		//if no recipients
		if(recipients.length == 0) {
			//add warning
			$('.warning-holder').html('<div class="alert alert-danger" id="11"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><strong>Please add at least one recipient</strong></div>');
			
			return false;
		}
		
		$('#subject-modal').modal('hide');

		//if no internet connection
		if(!window.connection) {
			//loading animation
			$('#loading-ajax #text').html('Saving Message');
			$('#loading-ajax').popup('open');
			//save message to outbox		
			saveOutbox(subject, content, priority, recipients);	

		} else { 
			//loading animation
			$('#loading-ajax #text').html('Sending Message');
			$('#loading-ajax').popup('open');
			
			//now do ajax call to send it
			window.messages.send(subject, content, priority, recipients, guid);
		}

		return false;
	});
}

/**
 * Send button handler
 *
 * @param string message GUID
 */
function processSend(guid) {
	//on click send button
	$('#process-send').unbind().click(function() {
	
		//prepare variables
		var recipients 	= []
		var subject 	= $('#compose-subject').val();
		var content 	= $('#compose-content').val();
		var priority 	= $('#compose-important option:selected').html();

		//get list of recipients
		$('.to-holder div').each(function() {
			recipients.push(window.contactList[this.id]);
		});

		//if no recipients
		if(recipients.length == 0) {
			//add warning
			$('.warning-holder').html('<div class="alert alert-danger" id="11"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><strong>Please add at least one recipient</strong></div>');
			
			return false;
		}

		if(subject.length == 0) {
			$('#subject-modal').modal('show');
			processSendAgain(guid);
			return false;
		}
		//if no internet connection
		if(!window.connection) {
			//loading animation
			$('#loading-ajax #text').html('Saving Message');
			$('#loading-ajax').popup('open');
			//save message to outbox		
			saveOutbox(subject, content, priority, recipients);	

		} else { 
			//loading animation
			$('#loading-ajax #text').html('Sending Message');
			$('#loading-ajax').popup('open');
			
			//now do ajax call to send it
			window.messages.send(subject, content, priority, recipients, guid);
		}

		return false;
	});
}

function removeToLocal(guid, type) {
	var data 	= _string.unlock(type);
   	var data2 	= _string.unlock('Deleted');
	var newData = [];
		
	//now remove the message to the local storage
	for(i in  data) {
		if(data[i]['b:MessageGUID'] != guid){
			
			newData.push(data[i])
		} else {
			
			//only add if deleted message is already loaded
			if(data2 !== null) {
				//push to the beginning of the listing
				data2.splice(0, 0, data[i]);
				_string.lock(data2, 'Deleted');
			}
		}
	}
	
	_string.lock(newData, type);
	_string.lock(data2, 'Deleted');
}

/**
 * On show compose page, 
 *
 * @return false;
 */
function compose() { 	
	
	$('.slimScrollDiv').hide();
	$('.slimScrollDiv').has('#message-compose').show();

	//disable left sidebar if in compose page
	window.snapper.disable();
	
	//flag page as COMPOSE
	$('.current-page').attr('id', 'compose');
	
	//navbars
	//hide delete message icon
	$('#delete-message').hide();
	//show send button icon
	$('#process-send').show();
	//hide compose button icon
	$('#compose-message').hide();
	//back button show
	$('#back-top').show();
	//hide sidebar icon	
	$('#sidebar-top').hide();

	//unset compose fields
	$('form.ui-filterable').
		children().
		children().
		first().
		val('');

	//unset message priority	
	$('#compose-important option').
		removeAttr('selected').
		filter('[value=0]').
		attr('selected', true);

	//to Normal as defailt	
    $('#compose-important-button span').html('Normal')     

	$('.loading-messages').hide();
	$('.message-elem').hide();
	$('#message-compose').show();

	$('.to-holder').html('');
	$('.to-holder-shrink').html('');
	$('.to-holder-shrink').hide();
	$('#compose-subject').val('');
	$('#compose-content').val('');
	$('#compose-content').html('');
	$('#compose-contact').val('');
	$('#compose-contact').prev().html('');
	$('.warning-holder').html('');
	$('#compose-contact-list').html('');

	//populate the contact listing auto search
	for(i in window.contactList) {
		//append, append, append
		$('#compose-contact-list').append(CONTACT_LIST.
			replace('[ID]', i).
			replace('[NAME]', window.contactList[i].name));
		
	}
	
	$('#compose-content').val('').trigger('autosize.resize');
	
	//on typing in To field
	$('.contact-pick').click(function() {
		var id 		= $(this).attr('id');
		var name 	= $(this).html();
		var hasID 	= false;

		//empty out the warning error
		$('.warning-holder').html('');

		//prevent dual TO name in listing
		$('.to-holder div').each(function() {
			var ids = $(this).attr('id');

			if(ids == id) {
				hasID = true;
			}
		});

		//now unset 
		$('input#compose-contact-list').val('');
		$('ul#compose-contact-list li').each(function() {
			$(this).addClass('ui-screen-hidden');
		});

		$('form.ui-filterable').children().children().first().val('');
		$('form.ui-filterable').children().children().first().focus();

		//prevent adding the same contacts
		if(!hasID) {
			$('.to-holder').append(TO_COMPOSE.
	    		replace('[ID]', id).
	    		replace('[NAME]', name)
	    	);
		}

		return false;
	});
}

/**
 * Load if you need to populate 
 * compose UI (ex. draft and outbox 
 * detail page).
 *
 * @param object compose data
 * @param string message type
 */
function composeWith(data, type) {
	
	$('.slimScrollDiv').hide();
	$('.slimScrollDiv').has('#message-compose').show();

	//disable left sidebar if in compose page
	window.snapper.disable();
	
	//flag page as compose
	$('.current-page').attr('id', 'compose');

	//navbar unset
	//hide delete message icon
	$('#delete-message').hide();
	//show send message icon
	$('#process-send').show();
	//hide compose message icon
	$('#compose-message').hide();
	$('.loading-messages').hide();
	$('.message-elem').hide();
	$('#message-compose').show();
	$('.to-holder').html('');
	$('.to-holder-shrink').html('');
	$('.to-holder-shrink').hide();
	$('#compose-contact').val('');
	$('#compose-contact').prev().html('');
	$('.warning-holder').html('');
	$('#compose-contact-list').html('');
	$('#compose-content').html('');
	$('#compose-content').val('');
	$('#compose-content').empty();
	var contactList = window.contactList;
	
	//FOR OUTBOX
	if(type == 'Outbox') {
		var res = data['b:Recipients']['b:Recipient'];
		//MESSAGE CONTENT
		$('#compose-content').html(data['content']);
		$('#compose-content').val(data['content']);
 		//MESSAGE SUBJECT
 		$('#compose-subject').val(data['b:Subject']);
 		
 		//MESSAGE PRIORITY
 		if(typeof data['b:Priority'] !== 'undefined'){
			if(typeof data['b:Priority']['m_Value'] !== 'undefined') {
				if(data['b:Priority']['m_Value']['_'] == 'High') {
					$('#compose-important option')
				     .removeAttr('selected')
				     .filter('[value=1]')
				         .attr('selected', true)
				    $('#compose-important-button span').html('High')     
				} else {
					$('#compose-important option')
				     .removeAttr('selected')
				     .filter('[value=0]')
				         .attr('selected', true)
				    $('#compose-important-button span').html('Normal')     
					
				}
			}
		}

	//FOR DRAFT	
	} else {
		
		var res = data['b:Label']['b:Recipients']['b:Recipient'];
		
		//MESSAGE CONTENT
		$('#compose-content').html(data['b:Content']);
		$('#compose-content').val(data['b:Content']);
 		//MESSAGE SUBJECT
 		$('#compose-subject').val(data['b:Label']['b:Subject']);
 		
 		//MESSAGE PRIORITY
		if(typeof data['b:Label']['b:Priority'] !== 'undefined'){
			if(typeof data['b:Label']['b:Priority']['m_Value'] !== 'undefined') {
				if(data['b:Label']['b:Priority']['m_Value']['_'] == 'High') {
					$('#compose-important option')
				     .removeAttr('selected')
				     .filter('[value=1]')
				         .attr('selected', true)
				    $('#compose-important-button span').html('High')     
				} else {
					$('#compose-important option')
				     .removeAttr('selected')
				     .filter('[value=0]')
				         .attr('selected', true)
				    $('#compose-important-button span').html('Normal')     
					
				}
			}
		}	
	}
	
	if(typeof res !== 'undefined') {
		//MESSAGE TO LISTING
		//if multiple contact list
		if(typeof res[0] !== 'undefined') {
			//find name
			for(i in res) {
				for(x in contactList) {
					
					if(res[i]['b:m_Receiver']['c:PortalAccess']['c:LoginId'] == contactList[x].data['b:PortalAccess']['b:LoginId']) {
						
				    	if(i < 2) {
							$('.to-holder').append(TO_COMPOSE.
					    		replace('[ID]', x).
					    		replace('[NAME]', window.contactList[x].name)
					    	);		
						} else {
							
							$('.to-holder-shrink').append(TO_COMPOSE.
					    		replace('[ID]', x).
					    		replace('[NAME]', window.contactList[x].name)
					    	);		
						}
					}	
				}
			}

			$('.to-holder').append(
				'<div id="toggle-shrink" style="float: left;margin-right: 7px;" class="alert alert-info" ><strong>more ...</strong></div>'
			);
			$('#toggle-shrink').click(function() {
				$('.to-holder-shrink').toggle();
				console.log('click')
			});

		} else {
			for(x in contactList) {
				
				if(res['b:m_Receiver']['c:PortalAccess']['c:LoginId'] == contactList[x].data['b:PortalAccess']['b:LoginId']) {
					$('.to-holder').append(TO_COMPOSE.
			    		replace('[ID]', x).
			    		replace('[NAME]', contactList[x].name)
			    	);
				}	
			}
		}
	}
	//populate autocomplete with contact listing
	for(i in contactList) {
		
		$('#compose-contact-list').append(CONTACT_LIST.
			replace('[ID]', i).
			replace('[NAME]', contactList[i].name));
	}

	$('.ui-filterable input').focus();
	
	$('.ui-filterable input').click(function(e){ 
	 	$(this).focus(); 
	});

    $('.ui-filterable input').click(function(e) {
        $('.ui-filterable input').trigger('click');
    })


	$('.contact-pick').click(function() {
		var id 		= $(this).attr('id');
		var name 	= $(this).html();
		var hasID 	= false;

		//unset warning
		$('.warning-holder').html('');
		
		$('.to-holder div').each(function() {
			var ids = $(this).attr('id');
			if(ids == id) {
				hasID = true;
			}
		});

		//unset now
		$('input#compose-contact-list').val('');
		$('ul#compose-contact-list li').each(function() {
			$(this).addClass('ui-screen-hidden');
		});

		//prevent double TO name in listing
		if(!hasID) {
			$('.to-holder').append(TO_COMPOSE.
	    		replace('[ID]', id).
	    		replace('[NAME]', name)
	    	);
		}

		//refresh page
		/*setTimeout(function(){window.composePage.refresh();
		console.log('xxx');}, 1000)*/
	});

	//now get the GUID
	var guid = data['b:Label']['b:MessageGUID'];
	//and put it sa hidden input 
	$('#detail-guid').val(guid);
	
	SoftKeyboard.show();

	//on click send button
	processSend(guid);
}

function outbox() {
	var loginUser 	= window.user.get();

	$('#back-top').hide();
	$('#sidebar-top').show();
	$('#delete-message').hide();
	$('#compose-message').show();
	$('#process-send').hide();

	$('#folder-name').html($('a#Outbox').html());
	$('.loading-messages').hide();
	
	//get outbox from localstorage
	window.messages.getOutbox(loginUser);
}

/**
 * If ever user logout, then the settings for
 * message will be set to default as the user login
 * again inside the system
 *
 * @return bool 
 */
function settings() {
	$('.slimScrollDiv').hide();
	$('#back-top').hide();
	$('#sidebar-top').show();
	$('#delete-message').hide();
	$('#compose-message').show();
	$('#process-send').hide();

	//flag currrent page as LIST
	$('.message-elem').hide();
	$('.current-page').attr('id', 'list');	
	$('#folder-name').html('Settings');
	$('.loading-messages').hide();
	$('#message-settings').show();

	//get settings variables from local storage
	window.url 		= localStorage.getItem('url');
  	window.interval = parseInt(localStorage.getItem('interval'));
	//populate fields, URL
	$('#settings-url').val(window.url);

	//populate fields, INTERVAL
	$('#settings-interval option').
		removeAttr('selected').
		filter('[value='+window.interval+']').
		attr('selected', true);
	
	$('#settings-interval-button span').html(window.interval);

	//on click save settings button
	$('#save-settings').click(function() {
		//save new settigns to local storage
		localStorage.setItem('url', 		$('#settings-url').val());
		localStorage.setItem('interval', 	$('#settings-interval').val());
		//then update the GLOBAL VARIABLES
		window.url 		= localStorage.getItem('url');
  		window.interval = localStorage.getItem('interval');
  		SOAP_URL 		= window.url; 
  		
  		checkInbox();

		notification('Settings successfully saved');	
	});

	return false;
}

function mainPage(snapper, loginUser) {

	//hide the login and show the main page
	$('#login').hide();
	$('.main-page').show();

	/**
	 * Left Panel navigation toggle
	 * no loading happening just static
	 * html/css
	 *
	 */
	//$('.deploy-sidebar').click(function(){
	$('.deploy-sidebar').bind('tap', function(e) {		
		e.preventDefault();
		e.stopPropagation();

		//if panel already active	
		if(window.snapper.state().state=="left" ){
			//close it
			window.snapper.close();
		//else 	
		} else {
			//open it
			window.snapper.open('left');
			$('#sidebar').show();
		}

		return false;
	});

	//on click back button
	//$('#back-top').click(function() {
	$('#back-top').bind('tap', function(e) {		
		e.preventDefault();
		e.stopPropagation();

		backEvent();
	});

	/**
	 * On click link in left panel
	 * load specific message folder list
	 *
	 */
	//$('.left-navigation').unbind().click(function(e) {
	$('.left-navigation').bind('tap', function(e) {	
		e.preventDefault();
		e.stopPropagation();

		//close left panel
		window.snapper.close();
			
		$('.no-connection').hide();
		//hide send message icon
		$('#process-send').hide();
		//show compose message icon
		$('#compose-message').show();
		//remove active class
		$('.left-navigation').parent().removeClass('active');
		//then add active class to current element
		$(this).parent().addClass('active');
		//show loading it main content
		$('.loading-messages').show();
		//hide detail page
		$('#message-detail').hide();
		//hide compose page
		$('#message-compose').hide();
		//hide settings page
		$('#message-settings').hide();
		
		//get the message folder type
		var type = $(this).attr('id');
		
		//on logout
		if(type == 'logout') {
			$('.message-elem').hide();
			//clear local storage
			window.localStorage.clear();
			
		 	//bind();
		 	location.reload();

			//bind();
			return false;
		/* ------------------------------------
			SPECIAL CASE : if setting page is 
			click, then show message settings
		   ------------------------------------ */
		} else if(type == 'Settings') {
			
			//show message settings page 
			settings();

			return false
		
		/* ------------------------------------
			SPECIAL CASE : if OUTBOX page is 
			click, then dont make any SOAP CALL
			just check local storage for data
			(if user logout, then outbox listing 
			will be deleted)
		   ------------------------------------ */
		} else if(type == 'Outbox') {

			$('#folder-name').html($('a#Outbox').html());
			$('.loading-messages').hide();
			//get outbox from localstorage
			window.messages.
	  			getOutbox(loginUser);
	  		//pullDown();

	  	//else it is common page loading
		} else {
			//unset pagination whenevery changing to another
			//message listing
			window.startCount = 10;

			//get message list according on what
			//user clicked on the LI left panel
	  		window.messages.get(type, window.minLength, 1);
  		}	

		return false;
	});

	/**
	 * On click Compose message on the navbar
	 *
	 */   	   
	$('#compose-message').click(function() { 
		$('#folder-name').html('Compose');
		//close snapper/left panel
		window.snapper.close();
		//prepare compose fields
		compose();

		$('.ui-filterable input').val('');
		$('.ui-filterable input').focus();
		
		//handle message sending
		processSend(0);
	}); 
}

/**
 * If no internet connection, all sending will 
 * be save to outbox
 *
 */
function ifNoInternet() {

	//if no internet access
	if(!window.connection) {
		
		//prepare variables
		var recipients 	= []
		var subject 	= $('#compose-subject').val();
		var content 	= $('#compose-content').val();
		var priority 	= $('#compose-important option:selected').html();

		//get list of recipients
		$('.to-holder div').each(function() {
			recipients.push(window.contactList[this.id]);
		});

		//if no recipients
		if(recipients.length == 0) {
			//add warning
			$('.warning-holder').html('<div class="alert alert-danger" id="11"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><strong>Please add at least one recipient</strong></div>');
			
			return false;
		}
		//do some animation
		$('#loading-ajax #text').html('Saving Message');
		$('#loading-ajax').popup('open');

		//save to outbox
		saveOutbox(subject, content, priority, recipients);	

		return false;
	}
}

/**
 * Save messages to outbox, (lock and save)
 *
 */
function saveOutbox(subject, content, priority, recipients) { 
	var list = [];
	//i hate this part
	//manually create XML 		
	for(i in recipients) {
		var raw = {
			'b:m_Receiver' : {
				'c:Name' : {
					'd:m_IsDirty' 		: recipients[i].data['b:Name']['c:m_IsDirty'],
					'd:m_firstName' 	: recipients[i].data['b:Name']['c:m_firstName'],
					'd:m_lastName' 		: recipients[i].data['b:Name']['c:m_lastName'],
					'd:m_middleInitial' : recipients[i].data['b:Name']['c:m_middleInitial'],
					'd:m_suffix' 		: recipients[i].data['b:Name']['c:m_suffix'],
					'd:m_title' 		: recipients[i].data['b:Name']['c:m_title'],
				},
				'c:PortalAccess' : {
					'c:LoginId' : recipients[i].data['b:PortalAccess']['b:LoginId']
				}
			}
		}
		//push, push, push
		list.push(raw);
	}

	//get the login user detail
	var loginUser 	= window.user.get();
	
	//just create a random GUID for OUTBOX
    var randLetter 	= String.fromCharCode(65 + Math.floor(Math.random() * 26));
	var guid 		= randLetter + Date.now();

	//XML again
	var data = {
		'b:DateCreated' 		: {
			'c:m_IsDirty' 		: 'false',
			'c:m_StampForma' 	: 'MM/dd/yyyy HH:mm:ss.fff',
			//use current date
			'c:m_When' 			: $.format.date(new Date().getTime(), "yyyy-MM-ddThh:mm:ss")
		},
		'b:DateSent' 			: {
			'c:m_IsDirty' 		: 'false',
			'c:m_StampForma' 	: 'MM/dd/yyyy HH:mm:ss.fff',
			//use current date
			'c:m_When' 			: $.format.date(new Date().getTime(), "yyyy-MM-ddThh:mm:ss")

		},
		//the random GUID we generated
		'b:MessageGUID' 		: guid,
		'b:Label'				: {
			'b:MessageGUID' 	: guid,
			'b:Sender' 			: loginUser.sender,
			'b:Recipients'  	: {
				'b:Recipient' 	: list
			},
			'b:Priority' 		: {
				'm_Value' 		: {
					'_' 		: priority
				}
			},
			'b:Content' 		: content
		},
		'b:MessageRead'		 	: 'false',
		'b:Priority' 			: {
			'm_Value' 			: {
				'_' 			: priority
			}
		},
		'b:Recipients'  		: {
			'b:Recipient' 		: list
		},

		'b:Sender' 				: loginUser.sender,
		'b:Subject' 			: subject,
		'content' 				: content,
		'priority' 				: priority,
		'recipients' 			: recipients
	};

	window.messageList['Outbox'] = _string.unlock('Outbox');
	//if everthe outbox listing is empty
	if(window.messageList['Outbox'] === null || window.messageList['Outbox'].length == 0) {
		//make it an empty array
		window.messageList['Outbox'] = [];
	}

	//push 
	window.messageList['Outbox'].push(data);

	//lock and save
	_string.lock(window.messageList['Outbox'], 'Outbox');

	$('#loading-ajax').popup('close');
	$('#process-send').hide();

	//show nofication
	notification('Message saved on outbox');

	return false;	
}

/**
 * Check whenever there is an internet connection
 *
 */
function checkConnection() {
	
	$('.no-connection').hide();

	//if no internet
	if(!window.connection) {
		/* ---------------------------------
			IF NO INTENET CONNECTION	
		   ---------------------------------*/
		//stop all loading stuff in the main page 
		mainLoader('stop');
		var detail 	= $('#message-detail').css('display');
		var currentPage = $('.current-page').attr('id');
		
		//if no elemet in the field
		if(detail == 'none' && currentPage != 'compose') {
			$('.current-page').attr('id', 'list');
			//show no connection icon	
			$('.no-connection').show();
		}
		
		return false;
	}
}

function fromDetailPage() {
	//get the parent page from the LI active to the left swipe
	var parentPage 	= $('ul.nav-stacked li.active a.left-navigation').attr('id');

	var clicked = false;

	//check if it it from message detail
	$('.detail-button-group').each(function() {
		
		if($(this).attr('isClick') == 'true') {
			clicked = true;
		}
	});
	
	//if it comes from message detail
	if(clicked) {

		var guid = $('#detail-guid').val();
		//gi back to detail page
		window.messages.getDetail(guid, parentPage, false);
		
		
		//makr button as false
		$('.detail-button-group').each(function() {
			$(this).attr('isClick', false);
		});

		return true;
	}

	return false;
}

/**
 * Back event happen whenever user click the back button 
 * on the app or the hitting the back button of the phone
 *
 */
function backEvent() {
	
	//hide keyboard
	document.activeElement.blur();
   	$("input").blur();
   	
   	//SoftKeyboard.hide();

	//get the login user
	var loginUser 	= window.user.get();
	//get the current page if (home, list)
	var currentPage = $('.current-page').attr('id');
	//get the parent page from the LI active to the left swipe
	var parentPage 	= $('ul.nav-stacked li.active a.left-navigation').attr('id');
	
	//stop the main loader
	mainLoader('stop');
	
	$('.no-connection').hide();
	
	//if in compose then hit back button
	if(currentPage == 'compose') {
		//prepare variables
		var recipients 	= [];
		var subject 	= $('#compose-subject').val();
		var content 	= $('#compose-content').val();
		var priority 	= $('#compose-important option:selected').html();
		var guid 		= $('#detail-guid').val();
		var empty 		= true;

		//if no GUID found
		if($.isEmptyObject(guid)) {
			guid = 0;
		}
		
		//get list of recipients
		$('.to-holder div').each(function() {
			
			if(this.id !== 'toggle-shrink') {
				recipients.push(window.contactList[this.id]);
			}
		});

		$('.to-holder-shrink div').each(function() {
			
			if(this.id !== 'toggle-shrink') {
				recipients.push(window.contactList[this.id]);
			}
		});

		
		if(subject.length > 0 || content.length > 0 || recipients.length > 0) {
			empty = false;
		}

		//if everything is empty, then dont show modal
		if(empty) {

			//enable left sidebar if in compose page
			window.snapper.enable();

			$('#draft-modal').modal('hide');
			$('#process-send').hide();	
			
			//if  page is from settings
			if(parentPage == 'Settings') {
				
				//show message settings page 
				settings();

				return false;
			}
			
			if(parentPage == 'Outbox') {
				
				outbox();

		  		return false;
	  		}	
	  		
	  		//check if previous page is detail page
	  		if(fromDetailPage()) {
	  			return false;
	  		}

			//unset pagination whenevery changing to another
			//message listing
			window.startCount = 10;

			//get message list according on what
			//user clicked on the LI left panel
	  		window.messages.get(parentPage, 15, 1);
			
			return false;
		}

		//if keyboard is show
		if(window.keyboard) {

			//wait for keyboard to hide
			setTimeout(function() {

				//show dialog
				$('#draft-modal').modal('show');
			}, 1000);
		
		} else {

			//show dialog
			$('#draft-modal').modal('show');
		}


		//on click Save 
		//$('#process-draft').unbind().click(function(e) {
		$('#process-draft').bind('tap', function(e) {
			
			e.preventDefault();
			e.stopPropagation();


			//enable left sidebar if in compose page
			window.snapper.enable();

			$('#draft-modal').modal('hide');

			if(!window.connection) {
				$('.no-connection').hide();
				/* ---------------------------------
					IF NO INTENET CONNECTION	
				   ---------------------------------*/
				$('.notification-ajax').show();
				$('.notification-ajax #notification-here').html('<i class="fa fa-warning"></i> No Internet connection');
				return false;
			}
			
			$('#loading-ajax #text').html('saving message')
			$('#loading-ajax').popup('open');
			
			//now do a ajax call to send it
			window.messages.draft(subject, content, priority, recipients, guid);
			
			$('#process-send').hide();
		});
	
		//on click Discard
		//$('#cancel-draft').unbind().click(function(e) {
		$('#cancel-draft').bind('tap', function(e) {	
			//enable left sidebar if in compose page
			window.snapper.enable();

			e.preventDefault();
			e.stopPropagation();
			$('#draft-modal').modal('hide');
			$('#process-send').hide();	

			//if  page is from settings
			if(parentPage == 'Settings') {
				
				//show message settings page 
				settings();

				return false;
			}

			// page is outbox
			if(parentPage == 'Outbox') {
				
				outbox();

		  		return false;
	  		}

	  		//check if previous page is detail page
	  		if(fromDetailPage()) {
	  			return false;
	  		}


			//unset pagination whenevery changing to another
			//message listing
			window.startCount = 10;
			
			//get message list according on what
			//user clicked on the LI left panel
	  		window.messages.get(parentPage, 15, 1);
	  		return false;
		});

		return false;

	//if page is in Inbox Listing	
 	} else if(parentPage == 'Inbox' && currentPage == 'home'){
 		console.log('time to go');
 		//time to exit app
 		navigator.app.exitApp();

 		return false;

 	} else if(currentPage == 'list') {
 		//put Inbox as Active LI to prevent error on 
 		//next back click
		$('ul.nav-stacked li.active').removeClass('active');
		$('ul.nav-stacked li #Inbox').parent().addClass('active');

		//checkConnection();
		//go back to Inbox
		window.messages.get('Inbox', 20, 1);

		return false;
  	} else if(typeof currentPage === 'undefined'){
  		console.log('time to go');
 		//time to exit app
 		navigator.app.exitApp();

 		return false;	
 	//else it is not in Inbox listing	
 	} else {

 		//if  page is from settings
		if(parentPage == 'Settings') {
			
			//show message settings page 
			settings();

			return false;
		}

		// page is outbox
		if(parentPage == 'Outbox') {
			
			outbox();

	  		return false;
  		}

  		//check if previous page is detail page
	  	if(fromDetailPage()) {
  			return false;
  		}
 		
 		//unset pagination whenevery changing to another
		//message listing
		window.startCount = 10;

		//get message list according on what
		//user clicked on the LI left panel
  		window.messages.get(parentPage, 15, 1);
 	}  
}

/**
 * Fixed for IOS position : fixed
 *
 */
document.addEventListener('touchmove', function (e) { 	
 	if(e.srcElement.type !== "textarea"){ 
       //e.preventDefault();
    } 
    
}, false);

document.addEventListener('deviceready', function() {	
	/*if(typeof window.plugin !== 'undefined') {
		//Enables the background mode. The app will not pause while in background.
		window.plugin.backgroundMode.enable();
		//unset badge
		window.plugin.notification.badge.set(0);
	}

	navigator.geolocation.getCurrentPosition(
		//do nothing
		function() {

		}, 
		//do nothing
		function() {

		}
	);*/
	
    //check internet on load
	window.connection = true;//window.navigator.onLine;
	
	//whenever app is open, check if there is internet connection
	if(!window.connection) {
		//if no connection
		//show no connection at the bottom
		$('.notification-ajax').show();
		$('.notification-ajax #notification-here').html('<i class="fa fa-warning"></i> No Internet connection');
	}

	/**
	 * This guy will only trigger if there is an internet connection
	 * Does not trigger on first load of app
	 *
	 */
	document.addEventListener("online", function(e) {
		window.connection = true;
		//hide notification
		$('.notification-ajax').hide();
		//check outbox
		checkOutbox();
		
	}, false);

	//for WEB TEST
	window.addEventListener("online", function(e) {
		window.connection = true;
		$('.notification-ajax').hide();
		checkOutbox();
	});

	/**
	 * This guy will only trigger if connection is lost
	 * Does not trigger on first load of app
	 *
	 */
	document.addEventListener("offline", function(e) {
		window.connection = false;

		//sho no connection notification
		$('.notification-ajax').show();
		$('.notification-ajax #notification-here').html('<i class="fa fa-warning"></i> No Internet connection');

	}, false);

	//for WEB TEST
	window.addEventListener("offline", function(e) {
		window.connection = false;
		
		$('.notification-ajax').show();
		$('.notification-ajax #notification-here').html('<i class="fa fa-warning"></i> No Internet connection');		
	});
  	
  	window.addEventListener('native.showkeyboard', function(e) {
		window.keyboard = true;
		/*var keyboard = e.keyboardHeight;
		var height = $('#message-compose').css('height');
		var newHeight = parseInt(height) + keyboard;
		//$('#message-compose').css('height', newHeight+'px');
		window.messageCompose.refresh();
		$('#compose-content').val(keyboard+' + '+height+' = '+newHeight);*/
		//$('#message-compose').slimScroll({height: newHeight+'px'});
		//setTimeout(function() {
		//	$('#message-compose').scrollTo(0, newHeight, {queue:true});
		//}, 1000);
		
	});

	window.addEventListener('native.hidekeyboard', function(e) {
		window.keyboard = false;
	});

	//if all DOM is loaded
	$(document).ready(function(){
		
		$(function() {
		    FastClick.attach(document.body);
		});
		
		$('#compose-content').autosize();

		//do the responsive font size
		$('body').flowtype({
			 minimum   : 300,
			 maximum   : 1000,
			 minFont   : 12,
			 maxFont   : 15,
			 fontRatio : 30
		});
		
		//for login UI
		init();
		//start application
		bind();

		$(window).bind('orientationchange', function() {

			$('#message-list').children().each(function() {
				var id = $(this).attr('id');

				// element's width or height has changed!
				$('#'+id).bind('resize', function(e) {
					var h = $(this).css('height');		
				  
				  	$('#delete_'+id).css('height', h);
				});
			});		
	  	});


	});

}, false);

/**
 * On hitting back button event, if page is in Inbox listing,
 * then we will exit the app or if it is in componse, then we will
 * save compose as draft, else if not then just go back to the 
 * previous listing page
 *
 * @return mixed
 */
document.addEventListener("backbutton", function(e){
	
	backEvent();

}, false);



function setBadge(count) {
	/*if(typeof window.plugin !== 'undefined') {
		window.plugin.notification.badge.set(count);
	}*/
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
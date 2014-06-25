function setBadge(count) {
	/*if(typeof window.plugin !== 'undefined') {
		window.plugin.notification.badge.set(count);
	}*/
}

function showNotification(text) {
	
	window.plugin.notification.local.add({ 
		message 	: '"'+text+'"',
		sound 		: 'TYPE_NOTIFICATION',
		title 		: 'New message received',
		autoCancel 	: true
	});
}
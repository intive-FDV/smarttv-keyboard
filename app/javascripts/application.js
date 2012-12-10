var keyc, widgetAPI;


var log = function(message) {
 	$('#log').prepend(message + ' <br />');
}

var imeReady = function(ime) {
	bIMEinit = true;
        log('IME ready');
	setTimeout($('#testInput').focus,5);

}

var initializeApp = function() {
	window.alert = log;
	keyc = new Common.API.TVKeyValue();

	widgetAPI = new Common.API.Widget();
	widgetAPI.sendReadyEvent();

    log('pre IME');
    try {
      window.ime = new IMEShell('testInput',imeReady, 'en');
    } catch(e) {
      log(e);
    }
    
    log('post IME');
};



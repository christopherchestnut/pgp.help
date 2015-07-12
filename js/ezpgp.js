(function($){

    var TIMEOUT = 600;
    var timeout = null;	

    var openpgp = window.openpgp; //require('openpgp');

	function loadPgp(pgp, userw, fingerw) {
		setErrorState(pgp, false);
		var newKey = pgp.val();
		var publicKey = openpgp.key.readArmored(newKey);

		try {
			var prefferedKey = publicKey.keys[0];
			var user = prefferedKey.getPrimaryUser();
			var keyIds = prefferedKey.getKeyIds();
			userw.val(user.user.userId.userid ); //TODO: This looks ugly, is there a better way?
			fingerw.val(prefferedKey.primaryKey.fingerprint);
		} catch (err) {
			setErrorState(pgp, true);
			console.log(err);
		}

		return publicKey;
	}

    function translate() {

        var str = $('#src').val();
        var publicKey = loadPgp($('#pgppub'), $('#username'), $('#fingerprint'));

		openpgp.encryptMessage(publicKey.keys, str).then(function(pgpMessage) {
		    text = pgpMessage;
		    $('#dest').val(text);
		}).catch(function(error) {
		    text = error;
		    $('#dest').val(text);
		});
    }

    function decrypt() {
    	var privKey = loadPgp($('#pgppriv'), $('#usernamep'), $('#fingerprintp'));
    }

    function onInput(id, func) {
        $(id).bind("input keyup keydown keypress change blur paste", function() {
            if ($(this).val() != jQuery.data(this, "lastvalue")) {
                func();
            }
            jQuery.data(this, "lastvalue", $(this).val());
        });
        $(id).bind("focus", function() {
           jQuery.data(this, "lastvalue", $(this).val());
        });
    }

    function onChangeFrom() {
        clearTimeout(timeout);
        timeout = setTimeout(translate, TIMEOUT);
    }

    function onChangeDecrypt() {
        clearTimeout(timeout);
        timeout = setTimeout(decrypt, TIMEOUT);
    }    

	//Hooks on startup
	$(document).ready( function() {
		//console.log ('document ready - woot!');

		onInput('#src', onChangeFrom);
		onInput('#pgppub', onChangeFrom);
		
		onInput('#encmsg', onChangeDecrypt);
		onInput('#pgppriv', onChangeDecrypt);		
    });

    function setErrorState(field, err, msg) {
        var group = field.closest('.controls').parent();
        if (err) {
            group.addClass('has-error');
            group.attr('title',msg);
        } else {
            group.removeClass('has-error');
            group.attr('title','');
        }
    }

	//Make it easer to cut-and-paste.
	//Thanks to: https://stackoverflow.com/questions/5797539/jquery-select-all-text-from-a-textarea
    $('.autoselectall').focus(function() {    	
	    var $this = $(this);
	    $this.select();

	    // Work around Chrome's little problem
	    $this.mouseup(function() {
	        // Prevent further mouseup intervention
	        $this.unbind("mouseup");
	        return false;
    });

	$('.autoselectall').blur(function() {
		$(this).scrollTop(0);
	});
});

})(jQuery);


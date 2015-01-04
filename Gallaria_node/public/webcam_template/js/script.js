jQuery(document).ready(function() {
	var pageHeight = $(window).height();
	$('header').css({'height': pageHeight});


	$(window).resize(function() {
		var pageHeight = $(window).height();
		$('header').css({'height': pageHeight});
	});

/****************************************
			Newsletter Validation
*****************************************/
	$('#NewsletterForm').validate({
		rules: {
			NewsletterEmail: {
				required: true,
				email: true
			}
		},
		highlight: function(label) {
	    	$(label).closest('.control-group').addClass('error');
	    },
	    success: function(label) {
	    	label.text('OK!').addClass('valid').closest('.control-group').addClass('success');
	    },
	    submitHandler: function(){
	    	//REPLACE your-serverside-script.php WITH YOUR SCRIPT TO RESIGTER EMAIL SUBSCRIPTION
	    	$.post('your-serverside-script.php', $('#NewsletterForm').serialize(), function(data) {
	    		$('#NewsletterFormContainer').html('<div class="alert alert-success"><p>Thanks to subscribe your email</p></div>');
	    	});
	    	return false;
    	}
	});

/****************************************
			Contact Form Validation
*****************************************/
	$('#ContactForm').validate({
		rules: {
			ContactSubject: {
				minlength: 2,
				required: true
			},
			ContactEmail: {
				required: true,
				email: true
			},
			ContactMessage: {
				minlength: 2,
				required: true
			}
		},
		highlight: function(label) {
	    	$(label).closest('.control-group').addClass('error');
	    },
	    success: function(label) {
	    	label.text('OK!').addClass('valid').closest('.control-group').addClass('success');
	    },
	    submitHandler: function(){
	    	//REPLACE your-serverside-script.php WITH YOUR SCRIPT TO SEND EMAIL
	    	$.post('your-serverside-script.php', $('#ContactForm').serialize(), function(data) {
	    		$('#ContactFormContainer').html('<div class="alert alert-success"><p>Thanks to write us, we will answer you soon!</p></div>');
	    	});
	    	return false;
    	}
	});
});
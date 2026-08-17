jQuery(window).load(function() {
	// Animate loader off screen
	jQuery(".page-load").fadeOut("slow");;
});

jQuery( document ).ready(function() {
    jQuery("#mobileburger").click(function(){
	  jQuery(this).toggleClass("open");
	  jQuery("#graynav").slideToggle('fast');
	});
	
	jQuery(".plusmin").click(function(){
	  jQuery(this).toggleClass("open");
	  jQuery(this).parent().find(".cardcontent").slideToggle('fast');
	});
	
	jQuery(".d-location-title").click(function(){
	  jQuery(this).parent().find(".plusmin").toggleClass("open");
	  jQuery(this).parent().find(".cardcontent").slideToggle('fast');
	});
	
	jQuery(".faq-block").click(function(){
	  jQuery(this).toggleClass("open");
	  jQuery(this).find(".faq-content").slideToggle('fast');
	});
	jQuery("#homecarousel").carousel({
		 interval: 7000	
	});
	
	jQuery(".btn").hover(
		function(){
			jQuery(this).addClass('bounce');
		},
		function(){
			jQuery(this).removeClass('bounce');
		}
	);
	
	jQuery("#cuscinfo").click(function(){
	  jQuery("#cuscinfotag").slideToggle('fast');
	});
	
	if (jQuery(window).width() <= 767){
		jQuery(".mainnav > li").click(function(){
			if(jQuery(this).hasClass("menu-item-has-children")){
				jQuery(this).toggleClass("open");
				jQuery(this).find(".sub-menu").slideToggle('fast');
			}
		});
		jQuery(".mainnav > li > a").click(function(e){
			if(jQuery(this).parent().hasClass("menu-item-has-children")){
				e.preventDefault();
			}
		});
		jQuery("#homecarousel").carousel({
			 pause: true,
			 interval: false	
		});
		jQuery(".navsearch").attr("placeholder", "Search").val('');
	}
	if (jQuery(window).width() > 767){
		jQuery(".mainnav li").hover(
			function(){
				jQuery(this).addClass('active');
			},
			function(){
				jQuery(this).removeClass('active');
			}
		);
		jQuery(".mainnav > li > a").hover(
			function(){
				jQuery(".mainnav > li > a").removeClass("orange");
				jQuery(this).addClass("orange");
			},
			function(){
				jQuery(".mainnav > li > a").removeClass("orange");
			}
		);
		jQuery(".mainnav > li > .sub-menu").hover(
			function(){
				jQuery(".mainnav > li > a").removeClass("orange");
				jQuery(this).parent().find("a").addClass("orange");
			},
			function(){
				jQuery(".mainnav > li > a").removeClass("orange");
			}
		);
		
		jQuery(".navsearch").attr("placeholder", "").val('');
	}

	jQuery('#filter').submit(function(){
		var filter = jQuery('#filter');
		jQuery.ajax({
			url:filter.attr('action'),
			data:filter.serialize(), // form data
			type:filter.attr('method'), // POST
			beforeSend:function(xhr){
				filter.find('button').text('Processing...'); // changing the button label
			},
			success:function(data){
				filter.find('button').text('Apply Filter'); // changing the button label back
				jQuery('#response').html(data); // insert data
			}
		});
		return false;
	});

	
});


jQuery(document).on('click', '.searchbutton', function(e){
	if (jQuery(window).width() > 767){
		if(jQuery(".navsearch").hasClass("open")){
				
		}
		else{
			e.preventDefault();
			jQuery(".navsearch").addClass("open");
			jQuery(".searchclose").fadeIn('fast', function(){
				jQuery(".navsearch").attr("placeholder", "Search").val('');
			});
		}
	}
}); 

jQuery(document).on('click', '.searchclose', function(f){
	jQuery(this).hide();	
	jQuery(".navsearch").removeClass("open");
	jQuery(".navsearch").attr("placeholder", "").val('');
}); 

jQuery(document).on('click', '.tab', function(g){
	
	var $el = jQuery(this),
		tabName = $el.data('tab-name');
	jQuery('.tab').removeClass('active');
	$el.addClass('active');
	
	jQuery('.tabcontent.active').removeClass('active').fadeOut('fast', function(){
		jQuery('#'+tabName).fadeIn('fast').addClass('active');
	});
	
	
});








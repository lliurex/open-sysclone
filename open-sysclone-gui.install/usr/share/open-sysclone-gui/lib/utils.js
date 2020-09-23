// Common Utility Functions

function sanitize(name){
	// Sanitize a input name field whihout spaces and wrong chars
	return name.replace(/([^a-z0-9]+)/gi, '');
};


function CustomNofity(title, content){
	icon="lmd_icon_pink.png";
	window.LOCAL_NW.desktopNotifications.notify(icon, title, content, function(){
				/*$('#status').text('Clicked on '+title);*/
				$('#status').fadeIn('fast',function(){
					setTimeout(function(){
						$('#status').fadeOut('fast');
						self.destroy();
					},1800);
				  });
				});						
					
}

function exceptionAlert(message){
	content=$("#bottom").html();
	$("#bottom").empty();
	$("#bottom").html(message).addClass("ExceptionAlert");
	
	//$("#bottom").unbind("click");
	$("#bottom").bind("click", function(){
		$("#bottom").empty();
		$("#bottom").html(content);
		$("#bottom").removeClass("ExceptionAlert");
		$("#bottom").unbind("click");
		});
	
}

function myalert(title, text){
	//
	//var slide = $(document.createElement('div')).addClass('slide');
	
	var alertdiv = $(document.createElement('div'));
	alertdiv.attr('id', 'dialog-modal');
	alertdiv.attr('title',  title);
	
	var span= $(document.createElement('i'));
	span.addClass("icon-warning-sign");
	span.attr('style', 'float:left; margin:0 7px 20px 0; font-size: 3em; color: #cccccc; text-shadow: 2px 2px #333333;');
	
	alertdiv.html(span);
	alertdiv.append(text);
	
	//		var slide = $(document.createElement('div')).addClass('slide');
	//		content = $(document.createElement('div')).attr('statusname',this.status).html(this.name);
	
	
	$("html").append(alertdiv);
	
	 $(function() {
		$(alertdiv).dialog({
		height: 140,
		modal: true
		});
	});
	 
	 $(alertdiv).unbind('dialogclose');
	 $(alertdiv).bind('dialogclose', function(event) {

	 $(alertdiv).remove();
	 
	});
	 
	
}


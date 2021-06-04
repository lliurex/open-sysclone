/* Class definition*/
function MainManager(){

}
/*Method definition*/
MainManager.prototype.BindLoginEventHandlers = function(){

//check and save protocol variable for TFTP or HTTP and init it
var protocol = "tftp";
//alert ('Voy a inicializar la variable')

$.xmlrpc({
			url: 'https://'+sessionStorage.server+':9779',
			methodName: 'get_variable',
			params: ['OPENSYSCLONE_SQUASHFS_PROTOCOL'],
			success: function(response,status,jqXHR){
					//console.log('get_variable')
					//console.log(response)
					//console.log(status)		
					if ( response[0]['status'] !== 0){
						//entramos aqui si la variable existe pero tiene un valor distinto de tftp o http
						//alert ('valor extranyo en la variable lo inicializamos a tftp')
						$.xmlrpc({
								url: 'https://'+sessionStorage.server+':9779',
								methodName: 'set_variable',
								params: [[sessionStorage.username , sessionStorage.password],'OPENSYSCLONE_SQUASHFS_PROTOCOL',protocol],
								success: function(response,status,jqXHR){
									//console.log('Not exists, set_variable')
									//console.log(response)
									//console.log(status)
									},
								error: function(jqXHR, status, error) {
									//console.log(response)
									//console.log(status)
									alert("Status: "+status+"\nError: N4d server is down"+error);
								}
						});
					} else{
						//console.log('Variable exists, good value??')
						if ( response[0]['return'] !== 'tftp' && response[0]['return'] !== 'http'){
							$.xmlrpc({
								url: 'https://'+sessionStorage.server+':9779',
								methodName: 'set_variable',
								params: [[sessionStorage.username , sessionStorage.password],'OPENSYSCLONE_SQUASHFS_PROTOCOL',protocol],
								success: function(response,status,jqXHR){
									//console.log('Value different, set to good value, set_variable')
									//console.log(response)
									//console.log(status)
									},
								error: function(jqXHR, status, error) {
									//console.log(response)
									//console.log(status)
									alert("Status: "+status+"\nError: N4d server is down"+error);
								}
							});

						}else{
							protocol = response[0]['return']
							//console.log(protocol)
						}
					}
			},
			error: function(jqXHR, status, error) {
				//console.log(response)
				//console.log(status)
				alert("Status: "+status+"\nError: N4d server is down"+error);
			}
			
});

	
	$("#make_image").bind('click',make_image);
	$("#restore_image").bind('click',restore_image);
	$("#restore_image_multicast").bind('click',restore_image_multicast);
	if(sessionStorage.server.toLowerCase() === 'localhost' || sessionStorage.server.toLowerCase() === '127.0.0.1' || sessionStorage.server.toLowerCase() === '127.0.1.1'){
		$("#networkiso").bind('click',networkiso);
		
	}
	else{
		// $("#networkiso").attr('style','display:inline-block');
		// $("#networkiso").after("<br><span style='color:red; margin-left: 5px;'>This function is only available when you connect locally</span>");
		$('#networkiso div[class="optiondescription"]').replaceWith('<div class="optiondescription" style="color:red;font-weight:bolder;">This function is only available when you connect locally</div>');
	}
	
	$("#delete_pxe").bind('click',delete_pxe);
	$("#delete_image").bind('click',delete_image);
	$("#managepxe").bind('click',manage_pxe);
	$("#rescuepxe").bind('click',rescuepxe);
}

$(".textinfo").hover( function() { // Changes the .image-holder's img src to the src defined in .list a's data attribute.
    var value=$(this).attr('id');
    $("li").attr("src", value);
});


function make_image(event){
	window.location='make_image.html';
}

function restore_image(event){
	window.location='restore_image.html';
}

function restore_image_multicast(event){
	window.location='restore_image_multicast.html';
}

function networkiso(event){
	window.location='networkiso.html';
}

function delete_pxe(event){
	window.location='delete_pxe.html';
}

function delete_image(event){
	window.location='delete_image.html';
}

function manage_pxe(event){
	window.location='bootmanager.html#start';	
}

function rescuepxe(event){
	$("body").addClass("CursorWaiting");
	$.xmlrpc({
				url: 'https://localhost:9779',
				methodName: 'validate_user',
				params: [sessionStorage.username, sessionStorage.password],
				success: function(response,status,jqXHR){
					//alert(response[0]['status']);
					//alert(response[0]['msg'].length);
					
					//if ( response[0][0]===true){
					if ( response[0]['status']===0){

						sessionStorage.localusername = sessionStorage.username;
						sessionStorage.localpassword = sessionStorage.password;
						/*iniciar seleccion device*/
						$("body").removeClass("CursorWaiting");
						window.location='rescuepxe.html';
					}
					else {
						$("#content").removeClass("CursorWaiting");
						window.location='rescuepxe_uservalidate.html';
					};
					
				},
				error: function(jqXHR, status, error) {
					$("body").removeClass("CursorWaiting");
					alert("Status: "+status+"\nError: N4D server is down "+error);
				}
			})
	/*window.location='rescuepxe.html';*/

}

$(document).ready(function() {
	var mm = new MainManager();
	mm.BindLoginEventHandlers();
});
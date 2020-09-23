var fs = require('fs');
function loginManager(){
    this.BindLoginEventHandlers = function BindLoginEventHandlers(){
		// Click on Login Button
		
		$("#LoginButton").bind('click', function( event ){
			// Even managing click on login button
			// gets username, password and server, checks it
			// and stores in session.
			
			username=$("#input_username").val();
			password=$("#input_password").val();
			server=$("#input_server").val();
			
			sessionStorage.username = username;
			sessionStorage.password = password;
			sessionStorage.server = server;
			
			// Going to main window
			login();
		});
		$(document).keypress(clickLoginButton);

	}	
}

function clickLoginButton(event){
	if(event.keyCode === 13){
		$("#LoginButton").trigger("click");
	}				
}

function login() {
	
	$("body").addClass("CursorWaiting");
	$("#msg_err").html("");
	$("#input_password").removeClass("wrong_pass");
	$("#input_username").removeClass("wrong_pass");
	





	//login function

	$.xmlrpc({
			url: 'https://'+sessionStorage.server+':9779',
			methodName: 'validate_user',
			params: [sessionStorage.username , sessionStorage.password],
			success: function(response,status,jqXHR){
				$("body").removeClass("CursorWaiting");
				groups=response[0][1];				
				if ((groups.indexOf('adm')!==-1)||(groups.indexOf('admins')!==-1)||(groups.indexOf('teachers')!==-1)) {
					// Check if it is a LMD Server
					//checkServerVersion();
					$("body").removeClass("CursorWaiting");
					window.location="main.html";

						
						
				} else{
					$("body").removeClass("CursorWaiting");
					$("#input_password").addClass("wrong_pass");
					$("#input_username").addClass("wrong_pass");
					$("#msg_err").html("Username or password error!")
				}
			},
			error: function(jqXHR, status, error) {
				$("body").removeClass("CursorWaiting");
				alert("Status: "+status+"\nError: N4d server is down"+error);
			}
		});

}


function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}


$(document).ready(function() {
	
	deleteFolderRecursive("/tmp/.chromium_open");
	var lm = new loginManager();
	lm.BindLoginEventHandlers();
	$('#input_username').val(process.env.USER);
	$('#input_password').focus();
});

/* Class definition*/

function RescuepxeManagerFloppy(){
	var self = this;
	this.BindLoginEventHandlers = function(){
		$("#goback2").bind('click',this.goback_floppy);
		$("#rescuepxe_floppy").bind('click',this.rescuepxe_floppy);
	}

	this.goback_floppy = function (event){
		window.location='bootmanager.html#rescue';
	}

	this.rescuepxe_floppy = function (){
		console.log("Burn the floppy");
		// VALIDATE USER
		$.xmlrpc({
				url: 'https://localhost:9779',
				methodName: 'validate_user',
				params: [sessionStorage.username, sessionStorage.password],
				success: function(response,status,jqXHR){
					//alert(response[0]['status']);
					//alert(response[0]['msg'].length);
					console.log(response)
					if ( response[0]['status'] !== 0){

						$("#content").removeClass("CursorWaiting");
						window.location='rescuepxe_uservalidate.html';
						console.log('Wrong validation')
					}
					else {
						console.log('Validation is OK')
						sessionStorage.localusername = sessionStorage.username;
						sessionStorage.localpassword = sessionStorage.password;
						console.log('localusername:'+sessionStorage.localusername)
						console.log('localpassword:'+sessionStorage.localpassword)
						self.rescuepxe_floppy_execute(sessionStorage.localusername,sessionStorage.localpassword)
						/*iniciar seleccion device*/
						$("body").removeClass("CursorWaiting");
						
					};
					
				},
				error: function(jqXHR, status, error) {
					$("body").removeClass("CursorWaiting");
					alert("Status: "+status+"\nError: N4D server is down "+error);
				}
		});
	}
	this.rescuepxe_floppy_execute = function (usernme,passwd){
		// BURNING FLOPPY
		$.xmlrpc({
				url: 'https://localhost:9779',
				methodName: 'rescuepxe_floppy',
				params: [[usernme, passwd],"OpenSysCloneRescue"],
				success: function(response,status,jqXHR){
					//vacio la variable que me informara del resultado
					$('#result').empty();
					console.log('Burning floppy, init function.')
					console.log(response)

					result=response[0]['return'][0];
					if (result){
						console.log("Floppy disk created");
						var img = $(document.createElement('img')).attr('src','img/ok.png');
						alert(i18n.gettext("rescuepxe.finished_burn"));
					}
					else{
						console.log("Error in floppy PXE boot creation",response[0]['return'][1]);
						var img = $(document.createElement('img')).attr('src','img/fail.png');
					}
					//Añado los valores al identificador que me mostrara la respuesta por pantalla
					//Especificamos el tamaño de la imagen
					img.attr('style',"width: 15px; height: 15px; margin: 5px;");
					//añado a la variable text la respuesta de N4D
					var text = $(document.createElement('span')).html(response[0]['return'][1]);
					//Uno la imagen y el texto dentro del identificador de la web result
					$('#result').append(img);
					$('#result').append(text);
					document.getElementById("result").className ="n4dresult";
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
		});
	}
}
$(document).ready(function() {
	var mim = new RescuepxeManagerFloppy();
	mim.BindLoginEventHandlers();
});
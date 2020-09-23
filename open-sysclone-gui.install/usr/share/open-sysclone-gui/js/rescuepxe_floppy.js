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
					
					if ( response[0][0]===true){

						sessionStorage.localusername = sessionStorage.username;
						sessionStorage.localpassword = sessionStorage.password;
						/*iniciar seleccion device*/
						$("body").removeClass("CursorWaiting");
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
		// BURNING FLOPPY
		$.xmlrpc({
				url: 'https://localhost:9779',
				methodName: 'rescuepxe_floppy',
				params: [[sessionStorage.localusername, sessionStorage.localpassword],"OpenSysCloneRescue"],
				success: function(response,status,jqXHR){
					//vacio la variable que me informara del resultado
					$('#result').empty();

					result=response[0][0];
					if (result){
						console.log("Floppy disk created");
						var img = $(document.createElement('img')).attr('src','img/ok.png');
						alert(i18n.gettext("rescuepxe.finished_burn"));
					}
					else{
						console.log("Error in floppy PXE boot creation",response[0]);
						var img = $(document.createElement('img')).attr('src','img/fail.png');
					}
					//Añado los valores al identificador que me mostrara la respuesta por pantalla
					//Especificamos el tamaño de la imagen
					img.attr('style',"width: 15px; height: 15px; margin: 5px;");
					//añado a la variable text la respuesta de N4D
					var text = $(document.createElement('span')).html(response[0][1]);
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
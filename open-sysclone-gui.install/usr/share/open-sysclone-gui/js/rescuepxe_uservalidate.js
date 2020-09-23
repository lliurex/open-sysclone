/* Class definition*/
function UserValidateManager(){
	var self = this;
	this.BindLoginEventHandlers = function(){
		$("#goback").bind('click',this.goback);
		$("#uservalidate").bind('click',this.uservalidate);
	}

	this.goback = function (event){
		window.location='main.html';
	}

	this.uservalidate = function (){
		var localuser = $("#localuser").val();
		var localpasswd = $("#localpasswd").val();

		$("#content").addClass("CursorWaiting");
		if (localuser === ""){
			console.log("Falta el nombre");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text =  document.createTextNode("Insert a system user valid");
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			$("#content").removeClass("CursorWaiting");
			return false;
		}
		if (localpasswd === ""){
			console.log("Falta el passwd");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text =  document.createTextNode("Insert the password");
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			$("#content").removeClass("CursorWaiting");
			return false;
		}

		$.xmlrpc({
				url: 'https://localhost:9779',
				methodName: 'validate_user',
				params: [localuser, localpasswd],
				success: function(response,status,jqXHR){
					//alert(response[0]['status']);
					//alert(response[0]['msg'].length);
					
					if ( response[0][0]===true){

						sessionStorage.localusername = localuser;
						sessionStorage.localpassword = localpasswd;
						/*iniciar seleccion device*/
						$("#content").removeClass("CursorWaiting");
						window.location='rescuepxe.html';
					}
					else {
						$('#result').empty();
						var img = $(document.createElement('img')).attr('src','img/fail.png');
						//Añado los valores al identificador que me mostrara la respuesta por pantalla
						//Especificamos el tamaño de la imagen
						img.attr('style',"width: 15px; height: 15px; margin: 5px;");
						//añado a la variable text la respuesta de N4D
						var text =  document.createTextNode("You wrong in user or password");
						//Uno la imagen y el texto dentro del identificador de la web result
						$('#result').append(img);
						$('#result').append(text);
						$("#content").removeClass("CursorWaiting");
						return false;
					};
					
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4D server is down "+error);
				}
			})
	}
}
$(document).ready(function() {
	var mim = new UserValidateManager();
	mim.BindLoginEventHandlers();
});
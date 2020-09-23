/* Class definition*/
function RescuepxeManagerCdrom(){
	var self = this;
	this.BindLoginEventHandlers = function(){
		$("#goback").bind('click',this.goback);
		$("#rescuepxe_cdrom").bind('click',this.start_process);
	}

	this.goback = function (event){
		window.location='bootmanager.html#rescue';
	}

	this.start_process = function (){
		console.log("Inicio...");
		$("#rescuepxe_cdrom").addClass('state-1');
		setTimeout(function(){self.rescuepxe_cdrom_test()}, 2000);
	}

	this.setInitialButtonState = function (){
		console.log("Fin");
		$("#rescuepxe_cdrom").removeClass("state-1");
		$("#rescuepxe_cdrom").removeClass("state-2");
		$("#rescuepxe_cdrom").removeClass("state-3");
	}


	this.rescuepxe_cdrom_test = function (){
		console.log("Proceso");
		var device = $("#device").val();

		if (device === ""){
			console.log("You don't tell my the device to burn CD");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text =  document.createTextNode("You don't tell my the device to burn CD");
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			return false;
		}
		console.log("Test N4D USER");
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
		console.log("Test CDROM device");
		$.xmlrpc({
				url: 'https://localhost:9779',
				methodName: 'rescuepxe_cdrom_test',
				params: [[sessionStorage.localusername, sessionStorage.localpassword],"OpenSysCloneRescue",device],
				success: function(response,status,jqXHR){
					//vacio la variable que me informara del resultado
					$('#result').empty();

					result=response[0][0];
					if (result){
						console.log("CDRom it's in device");
						self.rescuepxe_cdrom_blank_test(device);
					}
					else{
						console.log("There is not a CD-Rom in device",response[0]);
						alert(i18n.gettext("rescuepxe.cdrom_test"));
						self.setInitialButtonState()
					}
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
					self.setInitialButtonState()
				}
			});
		// console.log("CDRom it's in device");
		// setTimeout(function(){self.rescuepxe_cdrom_blank_test(device)}, 2000);
		 }

	this.rescuepxe_cdrom_blank_test = function (device){
		var device = $("#device").val();
		console.log("Test CDROM device");
		$.xmlrpc({
				url: 'https://localhost:9779',
				methodName: 'rescuepxe_cdrom_blank_test',
				params: [[sessionStorage.localusername, sessionStorage.localpassword],"OpenSysCloneRescue",device],
				success: function(response,status,jqXHR){
					//vacio la variable que me informara del resultado
					$('#result').empty();

					result=response[0][0];
					if (result){
						console.log("CD-Rom in device is blank");
						$("#rescuepxe_cdrom").addClass('state-2');
						self.rescuepxe_cdrom(device);
					}
					else{
						console.log("CD-Rom in device is full",response[0]);
						alert(i18n.gettext("rescuepxe.cdrom_blank_test"));
						self.setInitialButtonState()
					}
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
					self.setInitialButtonState()
				}
			});
		// console.log("CD-Rom in device is blank");
		// $("#rescuepxe_cdrom").addClass('state-2');
		// setTimeout(function(){self.rescuepxe_cdrom(device)}, 2000);
		}


	this.rescuepxe_cdrom = function (device){
		var device = $("#device").val();
		console.log("Create CDROM PXE menu boot loader");
		$.xmlrpc({
				url: 'https://localhost:9779',
				methodName: 'rescuepxe_cdrom',
				params: [[sessionStorage.localusername, sessionStorage.localpassword],"OpenSysCloneRescue",device],
				success: function(response,status,jqXHR){
					//vacio la variable que me informara del resultado
					$('#result').empty();

					result=response[0][0];
					if (result){
						console.log("CDRom PXE menu boot loader");
						var img = $(document.createElement('img')).attr('src','img/ok.png');
						alert(i18n.gettext("rescuepxe.finished_burn"));
						// window.location='main.html';
					}
					else{
						console.log("Error in CDRom PXE boot creation",response[0]);
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

					$("#rescuepxe_cdrom").addClass('state-3');
					self.setInitialButtonState()
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
					self.setInitialButtonState()
				}
			});
		// var img = $(document.createElement('img')).attr('src','img/ok.png');
		// img.attr('style',"width: 15px; height: 15px; margin: 5px;");
		// $('#result').append(img);
		// document.getElementById("result").className ="n4dresult";
		// $("#rescuepxe_cdrom").addClass('state-3');
		// setTimeout(function(){self.setInitialButtonState()}, 2000);
		}


		
}
$(document).ready(function() {
	var mim = new RescuepxeManagerCdrom();
	mim.BindLoginEventHandlers();
});
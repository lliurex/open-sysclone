/* Class definition*/
function RestoreImageManagerMulticast(){
	
	/*Esential definition*/
	
	var self = this;

		
	
	this.BindLoginEventHandlers = function(){
		
		/*Define actions for buttons*/
		
		$("#goback").bind('click',this.goback);
		$("#advanced_ops").bind('click',this.advanced_ops);
		$("#restoreimagemulticast").bind('click',this.restoreimagemulticast);
		$("#goback2").bind('click',this.goback);
		
		
		var pathfile = 'imagenes';

		/*This function list Images in path_file defined by defect as imagenes*/
		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'list_img',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone"],
				success: function(response,status,jqXHR){
					result=response[0]['return'][0];
					if (result){
						if ($.isArray(response[0]['return'][1])){
							$("#imagename").append('<option value="no_option">Select an image</option>');
							response[0]['return'][1].forEach(function (item){
								var aux_option = $(document.createElement('option')).val(item).html(item);
								$("#imagename").append(aux_option[0]);
							});
						}
						else{
							$("#imagename").append('<option value="no_option">No yet image avaiable</option>');

						}
					}
					else {
						$("#imagename").append('<option value="no_option">No yet image avaiable</option>');
					}
					initial_combo();
					
				},
				error: function(jqXHR, status, error) {
					$("#imagename").append('<option value="no_option">N4d server is down</option>');
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
		});
	}
	

	/*this function is for buttom goback*/
	
	this.goback = function (event){
		window.location='main.html';
	}
	
	this.advanced_ops = function (event){
		window.location='advanced_ops.html';
	}

	/*This function is the main process when click done button*/
	
	this.restoreimagemulticast = function (){
		document.getElementById("result").className ="n4dresult_erase";
		var imgname = $("#imagename").val();
		var imagehdd = $("#imagehdd").val();
		var finaloperation = $("#finaloperation").val();
		var clientswait = $("#clientswait").val();
		var timemax = $("#timemax").val();
		var pathfile = 'imagenes';
		var hostoperation = $("#hostoperation").val();
		var testdisk = '-sfsck';

		console.log("Valores de las variables al inicio del programa ",imgname,imagehdd,finaloperation,clientswait,timemax,pathfile);

		console.log(imgname);
		if (pathfile === ""){
			console.log("Please insert the pathfile of image to restore");
			return false;
		}
		if (imgname === "no_option"){
			console.log("Please insert the name of image to restore");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text = $(document.createElement("span")).html(i18n.gettext("restore.imgname"));
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			document.getElementById("result").className ="n4dresult";
			return false;
		}
		if (!imgname){
			console.log("Please insert the name of image to restore");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text = $(document.createElement("span")).html(i18n.gettext("restore.imgname"));
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			document.getElementById("result").className ="n4dresult";
			return false;
		}
		if (imagehdd === ""){
			console.log("You don't tell my the HDD to restore image");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text = $(document.createElement("span")).html(i18n.gettext("restore.imagehdd"));
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			document.getElementById("result").className ="n4dresult";
			return false;
		}
		if (clientswait === ""){
			console.log("You don't tell my the number of clients to restore image");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text = $(document.createElement("span")).html(i18n.gettext("restore_multicast.clientswait"));
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			document.getElementById("result").className ="n4dresult";
			return false;
		}
		if (timemax === ""){
			console.log("You don't tell my the time to wait to restore image");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text = $(document.createElement("span")).html(i18n.gettext("restore_multicast.timewait"));
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			document.getElementById("result").className ="n4dresult";
			return false;
		}

		/*Now we call n4d in server and print menu PXE*/
		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'nfs_export_start',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone",pathfile],
				success: function(response,status,jqXHR){
					result=response[0]['return'][0];
					if (result){
						console.log("Valores de las variables dentro del primer if ",imgname,imagehdd,finaloperation,clientswait,timemax);
						self.write_menu_pxe(imgname,imagehdd,finaloperation,clientswait,timemax,testdisk,hostoperation);
					}
					else{
						console.log("ha habido un error en la primera",response[0]['return']);
					}
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
			});


	}


	/*This function call n4d in server for RestoreImageMulticast method*/
	
	this.write_menu_pxe = function (name,hdd,finaloperation,clientsw,timer,testdisk,hostoperation){
		
		/*by defect OpenSysClone work in /net/OpenSysClone/imagenes, defined /net/OpenSysClone in n4d_python_plugins and pathfile=imagenes*/
		var pathfile = 'imagenes';
		
		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'write_menu_pxe',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone",'RestoreImageMulticast.tpl',pathfile,name,hdd,finaloperation,testdisk,hostoperation],
				success: function(response,status,jqXHR){
					result=response[0]['return'][0];
					if (result){
						
						var protocol = $(document.createElement('span')).html(response[0]['return'][2][0]);
						var path_writed = $(document.createElement('span')).html(response[0]['return'][2][1]);
						self.send_multicast_file(pathfile,name,clientsw,timer,protocol,path_writed);
					}
					else{
						console.log("ha habido un error escribiendo el menu PXE",response[0]['return']);
					}
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
			});
	}



	/*This function call n4d in server for send_multicast_file method*/

	this.send_multicast_file = function (pathfiler,namer,clients,time,protocols,path_writeds){
		
		console.log("Valores de las variables dentro de la funcion ",pathfiler,namer,clients,time);

		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'send_multicast_file',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone",pathfiler,namer,clients,time],
				success: function(response,status,jqXHR){
					//vacio la variable que me informara del resultado
					$('#result').empty();

					result=response[0]['return'][0];
					if (result){
						console.log("todo ha ido bien");
						var img = $(document.createElement('img')).attr('src','img/ok.png');
					}
					else{
						console.log("ha habido un error en la ejecucion de multicast " +response[0]['return']);
						var img = $(document.createElement('img')).attr('src','img/fail.png');
					}
					//Añado los valores al identificador que me mostrara la respuesta por pantalla
					//Especificamos el tamaño de la imagen
					img.attr('style',"width: 15px; height: 15px; margin: 5px;");
					
					//añado a la variable text la respuesta de N4D
					
					var title = "MULTICAST: "
					var response1 = $(document.createElement("span")).html(i18n.gettext("write_menu_pxe.response1"));
					var response2 =  $(document.createElement("span")).html(i18n.gettext("write_menu_pxe.response2"));
					//Uno la imagen y el texto dentro del identificador de la web result
					$('#result').append(img);
					$('#result').append(title);
					$('#result').append(response1);
					$('#result').append(protocols);
					$('#result').append(response2);
					$('#result').append(path_writeds)
					document.getElementById("result").className ="n4dresult";
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
			});
	}

	
}

/*Main*/

$(document).ready(function() {
	var rimm = new RestoreImageManagerMulticast();
	rimm.BindLoginEventHandlers();
});
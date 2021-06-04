/* Class definition*/
function ExportIsoManager(){
	var self = this;
	this.BindLoginEventHandlers = function(){
		$("#goback").bind('click',this.goback);
		$("#goback2").bind('click',this.goback);
		$("#exportiso").bind('click',this.exportiso);
	}

	this.goback = function (event){
		window.location='main.html';
	}
	
	this.checkblank = function (namecheck){
		
		console.log("Valores de las variables dentro de la funcion check ",namecheck);
		
		//Compruebo que no tiene espacios el path de la ISO
		var espacios = false;
		var cont = 0;
		while (!espacios && (cont < namecheck.length)){
			if (namecheck.charAt(cont) == " "){
				espacios = true;
			}
			cont++;
		}
	}
	

	this.exportiso = function (){
		document.getElementById("result").className ="n4dresult_erase";
		var isopath = $("#isopath").val();
		var name_iso = $("#isoname").val();

		if (name_iso === ""){
			console.log("Falta el nombre de la iso");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text =  $(document.createElement("span")).html(i18n.gettext("export_iso.nameiso"));
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			document.getElementById("result").className ="n4dresult";
			return false;
		}
		
		console.log("Valores de las variables dentro del export iso ",isopath,name_iso);
//		if(! self.checkblank (isopath)){
//			console.log("No se puede servir ISO con espacios en blanco en el nombre o en la ruta.");
//				$('#result').empty();
//				var img = $(document.createElement('img')).attr('src','img/fail.png');
//				//Añado los valores al identificador que me mostrara la respuesta por pantalla
//				//Especificamos el tamaño de la imagen
//				img.attr('style',"width: 15px; height: 15px; margin: 5px;");
//				//añado a la variable text la respuesta de N4D
//				var text =  document.createTextNode("You can't share ISO with blank spaces in file or path");
//				//Uno la imagen y el texto dentro del identificador de la web result
//				$('#result').append(img);
//				$('#result').append(text);
//				return false;
//		}

		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'export_iso',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysCloneExport",isopath, name_iso],
				success: function(response,status,jqXHR){
					$('#result').empty();
					// return 'False'
					// response[0] = False
					// return [False,[1,2,3,4]]
					// response[0] = [False,[1,2,3,4]]
					// response[0][0] = False
					// response[0][1] = [1,2,3,4]
					// response[0][1][0] = 1
					console.log(response)
					result=response[0]['return'][0];
					if (result){
						var img = $(document.createElement('img')).attr('src','img/ok.png');
						var text = $(document.createElement("span")).html(i18n.gettext("export_iso.ok"));
					}
					else{
						var img = $(document.createElement('img')).attr('src','img/fail.png');
						switch (response [0]['return'][1]){
							case 'path_failed':
								var text = $(document.createElement("span")).html(i18n.gettext("export_iso.path_failed"));
								break;
							case 'export_failed':
								var text = $(document.createElement("span")).html(i18n.gettext("export_iso.export_failed"));
								break;
							case 'mount_failed':
								var text = $(document.createElement("span")).html(i18n.gettext("export_iso.mount_failed"));
								break;
							default:
								var text = $(document.createElement('span')).html(response[0]['return'][1]) ;
						}
					}
						
					img.attr('style',"width: 15px; height: 15px; margin: 5px;");
					
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
	var mim = new ExportIsoManager();
	mim.BindLoginEventHandlers();
});


/* Class definition*/
function RestoreImageManager(){
	var self = this;
	this.BindLoginEventHandlers = function(){
		$("#goback").bind('click',this.goback);
		$("#goback2").bind('click',this.goback);
		$("#advanced_ops").bind('click',this.advanced_ops);
		$("#restoreimage").bind('click',this.restoreimage);
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

	this.goback = function (event){
		window.location='main.html';
	}

	this.advanced_ops = function (event){
		window.location='advanced_ops.html';
	}

	this.restoreimage = function (){
		var imgname = $("#imagename").val();
		var imagehdd = $("#imagehdd").val();
		var finaloperation = $("#finaloperation").val();
		var hostoperation = $("#hostoperation").val();
		document.getElementById("result").className ="n4dresult_erase";

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
		if (imgname === "no_option"){
			console.log("Please insert the name of image to restore NO_OPTION SELECTED");
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

		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'nfs_export_start',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone"],
				success: function(response,status,jqXHR){
					result=response[0]['return'][0];
					if (result){
						self.write_menu_pxe(imgname,imagehdd,finaloperation,hostoperation);
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

	this.write_menu_pxe = function (name,hdd,finaloperation,hostoperation){
		var pathfile = 'imagenes';
		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'write_menu_pxe',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone",'RestoreImageUnicast.tpl',pathfile,name,hdd,finaloperation,hostoperation],
				success: function(response,status,jqXHR){
					//vacio la variable que me informara del resultado
					$('#result').empty();

					result=response[0]['return'][0];
					if (result){
						console.log("todo ha ido bien");
						var img = $(document.createElement('img')).attr('src','img/ok.png');
					}
					else{
						console.log("ha habido un error",response[0]['return']);
						var img = $(document.createElement('img')).attr('src','img/fail.png');
					}
					//Añado los valores al identificador que me mostrara la respuesta por pantalla
					//Especificamos el tamaño de la imagen
					img.attr('style',"width: 15px; height: 15px; margin: 5px;");
					//añado a la variable text la respuesta de N4D
					var protocol = $(document.createElement('span')).html(response[0]['return'][2][0]);
					var path_writed = $(document.createElement('span')).html(response[0]['return'][2][1]);
					
					var response1 = $(document.createElement("span")).html(i18n.gettext("write_menu_pxe.response1"));
					var response2 =  $(document.createElement("span")).html(i18n.gettext("write_menu_pxe.response2"));
					//Uno la imagen y el texto dentro del identificador de la web result
					$('#result').append(img);
					$('#result').append(response1);
					$('#result').append(protocol);
					$('#result').append(response2);
					$('#result').append(path_writed);
					document.getElementById("result").className ="n4dresult";
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
				
			});
	}

	
}

$(document).ready(function() {
	var rim = new RestoreImageManager();
	rim.BindLoginEventHandlers();
});
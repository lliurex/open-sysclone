// Class definition

function DeleteImageManager(){
	
	//Esential definition
	
	var self = this;

		
	
	this.BindLoginEventHandlers = function(){
		
		//Define actions for buttons
		
		$("#goback").bind('click',this.goback);
		$("#deleteimage").bind('click',this.deleteimage);
		$("#goback2").bind('click',this.goback);
		
		
		var pathfile = 'imagenes';

		//This function list Images in path_file defined by defect as imagenes

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
	

	//this function is for buttom goback
	
	this.goback = function (event){
		window.location='main.html';
	}

	//This function is the main process when click done button
	
	this.deleteimage = function (){
		document.getElementById("result").className ="n4dresult_erase";
		var imgname = $("#imagename").val();

		console.log("Valores de las variables al inicio del programa ",imgname);

		console.log(imgname);
		if (imgname === ""){
			console.log("Please insert the name of image to delete");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text =  $(document.createElement("span")).html(i18n.gettext("delete.imgname"));
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			document.getElementById("result").className ="n4dresult";
			return false;
		}
		if (imgname === "no_option"){
			console.log("Please insert the name of image to delete");
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text = $(document.createElement("span")).html(i18n.gettext("delete.imgname"));
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			document.getElementById("result").className ="n4dresult";
			return false;
		}
	
		//Now we call n4d method in server and print menu PXE

		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'del_image',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone",imgname],
				success: function(response,status,jqXHR){
					//vacio la variable que me informara del resultado
					$('#result').empty();

					result=response[0]['return'][0];
					if (result){
						console.log("Se ha borrado la imagen ",imgname);
						var img = $(document.createElement('img')).attr('src','img/ok.png');
						img.attr('style',"width: 15px; height: 15px; margin: 5px;");
						
						var text = $(document.createElement("span")).html(i18n.gettext("delete_image.ok"));
						var text_imgname = document.createTextNode(imgname);
						
						$('#result').append(img);
						$('#result').append(text);
						$('#result').append(text_imgname);
						document.getElementById("result").className ="n4dresult";
					}
					else{
						console.log("ha habido un error borrando la imagen",response[0]['return']);
						var img = $(document.createElement('img')).attr('src','img/fail.png');
						//AÃ±ado los valores al identificador que me mostrara la respuesta por pantalla
						//Especificamos el tamaÃ±o de la imagen
						img.attr('style',"width: 15px; height: 15px; margin: 5px;");
						//aÃ±ado a la variable text la respuesta de N4D
						var text =  $(document.createElement("span")).html(i18n.gettext("delete.imgname"));
						//Uno la imagen y el texto dentro del identificador de la web result
						$('#result').append(img);
						$('#result').append(text);
						document.getElementById("result").className ="n4dresult";
					}
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
			});
	}

}

/*Main*/

$(document).ready(function() {
	var dim = new DeleteImageManager();
	dim.BindLoginEventHandlers();
});
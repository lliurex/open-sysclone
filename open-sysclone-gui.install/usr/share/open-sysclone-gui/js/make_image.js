/* Class definition*/
function MakeImageManager(){
	var self = this;
	this.BindLoginEventHandlers = function(){
		$("#goback").bind('click',this.goback);
		$("#goback2").bind('click',this.goback);
		$("#advanced_ops").bind('click',this.advanced_ops);
		$("#makeimage").bind('click',this.makeimage);
	}

	this.goback = function (event){
		window.location='main.html';
	}

	this.advanced_ops = function (event){
		window.location='advanced_ops.html';
	}

	this.makeimage = function (){

		document.getElementById("result").className ="n4dresult_erase";
		var imgname = $("#imgname").val();
		var imagehdd = $("#imagehdd").val();
		var finaloperation = $("#finaloperation").val();
		var pathfile = 'imagenes';
		if (imgname === ""){
			// console.log("Falta el nombre");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text =  document.createTextNode("You don't tell my the name to make image");
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			document.getElementById("result").className ="n4dresult";
			return false;
		}
		if (imgname.match(/\s/)){
			// console.log("No se permiten espacios en blanco en el nombre");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añ los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text =  document.createTextNode("You can't put white spaces in name of image, please insert new name and press done.");
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			document.getElementById("result").className ="n4dresult";
			return false;
		}
		if (imagehdd === ""){
			// console.log("Falta el disco duro");
			$('#result').empty();
			var img = $(document.createElement('img')).attr('src','img/fail.png');
			//Añado los valores al identificador que me mostrara la respuesta por pantalla
			//Especificamos el tamaño de la imagen
			img.attr('style',"width: 15px; height: 15px; margin: 5px;");
			//añado a la variable text la respuesta de N4D
			var text =  document.createTextNode("You don't tell my the the HDD to make image");
			//Uno la imagen y el texto dentro del identificador de la web result
			$('#result').append(img);
			$('#result').append(text);
			document.getElementById("result").className ="n4dresult";
			return false;
		}


		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'check_path',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone",pathfile],
				success: function(response,status,jqXHR){
					// console.log(response)
					result=response[0]['return'][0];
					if (result){
						self.nfs_export_start(imgname,imagehdd,finaloperation,pathfile);
					}
					else{
						// console.log("ha habido un error en la primera",response[0]);
					}
					
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
			});
	}


	this.nfs_export_start = function (imgnamer,imagehddr,finaloperationr,pathfilen){

		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'nfs_export_start',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone",pathfilen],
				success: function(response,status,jqXHR){
					result=response[0]['return'][0];
					if (result){
						self.write_menu_pxe(imgnamer,imagehddr,finaloperationr,pathfilen);
					}
					else{
						// console.log("ha habido un error en la primera",response[0]);
					}
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
			});


	}

	this.write_menu_pxe = function (name,hdd,finaloperations,pathfiles){
		
		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'write_menu_pxe',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone",'SaveImage.tpl',pathfiles,name,hdd,finaloperations],
				success: function(response,status,jqXHR){
					//vacio la variable que me informara del resultado
					$('#result').empty();

					result=response[0]['return'][0];
					if (result){
						// console.log("todo ha ido bien");
						var img = $(document.createElement('img')).attr('src','img/ok.png');
					}
					else{
						// console.log("ha habido un error",response[0]);
						var img = $(document.createElement('img')).attr('src','img/fail.png');
					}
					//Añado los valores al identificador que me mostrara la respuesta por pantalla
					//Especificamos el tamaño de la imagen
					img.attr('style',"width: 15px; height: 15px; margin: 5px;");
					//Capturo de n4d las respuestas que me interesan que son de una lista que tengo al final los dos valores protocol y la ruta del path
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
	var mim = new MakeImageManager();
	mim.BindLoginEventHandlers();
});
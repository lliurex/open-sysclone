/* Class definition*/
function DeletePXEManager(){
	var self = this;
	this.BindLoginEventHandlers = function(){
		$("#goback").bind('click',this.goback);
		$("#delete").bind('click',this.nfs_export_stop);
	}

	this.goback = function (event){
		window.location='main.html';
	}

	this.nfs_export_stop = function (){

		$.xmlrpc({
				//dejamos de servir por nfs la unidad de las imagenes
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'nfs_export_stop',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone",'imagenes'],
				success: function(response,status,jqXHR){
					result=response[0]['return'][0];
					if (result){
						self.delete_menu_pxe();
					}
					else{
						console.log("ha habido un error deteniendo el servicio de nfs",response[0]['return']);
					}
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
			});


	}

	this.delete_menu_pxe = function (){
		
		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'del_menu_pxe',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone"],
				success: function(response,status,jqXHR){
					//vacio la variable que me informara del resultado
					$('#result').empty();

					result=response[0]['return'][0];
					var test=response[0]['return'].length
					if (result){
						
						//añado a la variable text la respuesta de N4D
						if (test > 2 ){
							console.log("todo ha ido bien");
							var img = $(document.createElement('img')).attr('src','img/ok.png');
							//Añado los valores al identificador que me mostrara la respuesta por pantalla
							//Especificamos el tamaño de la imagen
							img.attr('style',"width: 15px; height: 15px; margin: 5px;");
							var pxe_path = $(document.createElement('span')).html(response[0]['return'][2][0]);
							var text = $(document.createElement("span")).html(i18n.gettext("delete_pxe.ok"));
							//Uno la imagen y el texto dentro del identificador de la web result
							
						}
						else{
							var img = $(document.createElement('img')).attr('src','img/fail.png');
							//Añado los valores al identificador que me mostrara la respuesta por pantalla
							//Especificamos el tamaño de la imagen
							img.attr('style',"width: 15px; height: 15px; margin: 5px;");
							var pxe_path = "";
							var text = $(document.createElement("span")).html(i18n.gettext("delete_pxe.fail"));
							//Uno la imagen y el texto dentro del identificador de la web result
						}
						$('#result').append(img);
						$('#result').append(text);
						$('#result').append(pxe_path);
						document.getElementById("result").className ="n4dresult";
					}
					else{
						console.log("No se puede borrar la entrada",response[0]['return']);
						var img = $(document.createElement('img')).attr('src','img/fail.png');
						//Añado los valores al identificador que me mostrara la respuesta por pantalla
						//Especificamos el tamaño de la imagen
						img.attr('style',"width: 15px; height: 15px; margin: 5px;");
						//añado a la variable text la respuesta de N4D
						var text = $(document.createElement("span")).html(i18n.gettext("delete_pxe.fail"));
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

$(document).ready(function() {
	var dpm = new DeletePXEManager();
	dpm.BindLoginEventHandlers();
});
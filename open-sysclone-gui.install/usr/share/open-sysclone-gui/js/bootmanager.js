function BootManager(){

var self = this;
}

//BootManager.prototype.goback = function(event) {
//	window.location='main.html';
//};

BootManager.prototype.BindLoginEventHandlers = function() {
	$("#goback").bind('click',this.goback);
	$("#goback2").bind('click',this.goback);
	$("#goback3").bind('click',this.goback);
	$("#goback4").bind('click',this.goback);
	$("#delete_pxe").bind('click',this.nfs_export_stop);
	$("#rescuepxe_cdrom").bind('click',this.rescuepxe_cdrom_test);


	$('#bootmanager').attr('src','llx-bootmanager-gui/main.html');
	$('#bootmanager').css("width","100%");
	$('#bootmanager').css("height","380px");
	$('#bootmanager').css("margin-top","30px");
	$('#bootmanager').css("-webkit-transform","scale(1)");
	$('#bootmanager').css("-webkit-transform-origin","50% 0");
	
	$('#bootmanager').bind('load',function(){
		var style = "<style>body{background-color: rgba(255,255,255,0.5) !important } #MainFrame{padding:0px; margin:20px;} #timer{margin-left:20px;}#BootListDiv{width:280px}#btSave{margin-top:-40px}</style>";
		$('#bootmanager').contents().find('head').append(style);
	});
	$('.top_menu .element_menu').click(function(){
		$(".top_menu .animation").removeAttr("data-top_menu");
		$(".top_menu .animation").attr("data-top_menu",$(this).attr("data-top_menu"));
		//CHANGE BANNER INFO WITH OPTION MENU SELECTED
		if ( $(".top_menu .animation").attr("data-top_menu") == "management" ){
			console.log("management");
			$(".bannerbox .optiontitle").html(i18n.gettext("bootmanager.bootmanager"));
			$(".bannerbox .optiondescription").html(i18n.gettext("bootmanager.description"));
		}else if ( $(".top_menu .animation").attr("data-top_menu") == "delete" ){
			console.log("delete");
			$(".bannerbox .optiontitle").html(i18n.gettext("delete_pxe.title"));
			$(".bannerbox .optiondescription").html(i18n.gettext("delete_pxe.description"));
		}else if ( $(".top_menu .animation").attr("data-top_menu") == "rescue" ){
			console.log("rescue");
			$(".bannerbox .optiontitle").html(i18n.gettext("main.rescuepxe"));
			$(".bannerbox .optiondescription").html(i18n.gettext("rescuepxe.description"));
		}
	});
};
//DELETE_PXE functions
	this.nfs_export_stop = function (){

		$.xmlrpc({
				//dejamos de servir por nfs la unidad de las imagenes
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'nfs_export_stop',
				params: [[sessionStorage.username , sessionStorage.password],"OpenSysClone",'imagenes'],
				success: function(response,status,jqXHR){
					result=response[0][0];
					if (result){
						self.delete_menu_pxe();
					}
					else{
						console.log("ha habido un error deteniendo el servicio de nfs",response[0]);
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

					result=response[0][0];
					var test=response[0].length
					if (result){
						
						//añado a la variable text la respuesta de N4D
						if (test > 2 ){
							console.log("todo ha ido bien");
							var img = $(document.createElement('img')).attr('src','img/ok.png');
							//Añado los valores al identificador que me mostrara la respuesta por pantalla
							//Especificamos el tamaño de la imagen
							img.attr('style',"width: 15px; height: 15px; margin: 5px;");
							var pxe_path = $(document.createElement('span')).html(response[0][2][0]);
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
						console.log("No se puede borrar la entrada",response[0]);
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

//this function is for buttom goback
	
this.goback = function (event){
	window.location='main.html';
}


$(document).ready(function(){
	var bm = new BootManager();
	setTimeout(bm.BindLoginEventHandlers,100);
});

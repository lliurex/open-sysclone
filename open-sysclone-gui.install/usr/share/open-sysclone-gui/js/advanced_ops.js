/* Class definition*/
function AdvancedOpsManager(){
	var self = this;
	this.BindLoginEventHandlers = function(){
		$("#goback_make").bind('click',this.goback_make);
		$("#apply_advanced_ops").bind('click',this.apply_advanced_ops);
		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'get_variable',
				params: ['OPENSYSCLONE_SQUASHFS_PROTOCOL'],
				success: function(response,status,jqXHR){
					if ( response[0]['status'] === 0){
						protocol = response[0]['return'];
					}else{
						protocol = 'NOT AVAILABLE'
					}
					$("#protocol option[value='"+protocol+"']").attr("selected","selected");
					var text_value = $("#protocol option[value='"+protocol+"']")[0].childNodes[1].textContent;
					$("#protocol ~ .select-selected").html(text_value);
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
		});
	}

	this.goback_make = function (event){
		window.history.back()
	}

	this.apply_advanced_ops = function (){
		var protocol = $("#protocol").val();
		document.getElementById("result").className ="n4dresult_erase";

		$.xmlrpc({
				url: 'https://'+sessionStorage.server+':9779',
				methodName: 'set_variable',
				params: [[sessionStorage.username , sessionStorage.password],'OPENSYSCLONE_SQUASHFS_PROTOCOL',protocol],
				success: function(response,status,jqXHR){
					//vacio la variable que me informara del resultado
					$('#result').empty();
					if ( response[0]['status'] === 0){
						var img = $(document.createElement('img')).attr('src','img/ok.png');
						//Añado los valores al identificador que me mostrara la respuesta por pantalla
						//Especificamos el tamaño de la imagen
						img.attr('style',"width: 15px; height: 15px; margin: 5px;");
						//añado a la variable text la respuesta de N4D
						var response1 = $(document.createElement("span")).html(i18n.gettext("avanced_ops.response1"));
						var text = document.createTextNode(protocol);
						//Uno la imagen y el texto dentro del identificador de la web result
						$('#result').append(img);
						$('#result').append(response1);
						$('#result').append(text);
						document.getElementById("result").className ="n4dresult";
					} else{
						alert("Status: "+response[0]['msg'])
					}
					
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4d server is down"+error);
				}
				
		});
	}
}

$(document).ready(function() {
	var mim = new AdvancedOpsManager();
	mim.BindLoginEventHandlers();
});
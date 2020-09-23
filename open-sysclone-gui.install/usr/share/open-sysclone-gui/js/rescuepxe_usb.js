/* Class definition*/
function RescuepxeManagerUsb(){
	var self = this;

	this.first_device_list=new Array();
	this.second_device_list=new Array();
	this.searchInterval="";
	this.selecteddevice = "";

	this.BindLoginEventHandlers = function(){
		$("#goback").bind('click',this.goback);
		$("#rescuepxe_usb").bind('click',this.rescuepxe_usb);
		this.showMe();
		
	}

	this.goback = function (event){
		clearInterval(self.searchInterval);
		window.location='bootmanager.html#rescue';
	}

	this.setFirstDeviceList=function setFirstDeviceList(data){
		self.first_device_list=data;
	}
	
	this.setSecondDeviceList=function setSecondDeviceList(data){
		self.second_device_list=data;
	}
	
	this.getDeviceList=function getDeviceList(setfunc, callback){

		/*Aqui llamamos a la funcion n4d sin parametros de login y passwd ya que esta funcion es anonymous.*/
		/*Ademas lo hacemos contra localhost puesto que queremos que la función se ejecute en la maquina local de la GUI*/
		$.xmlrpc({
				url: 'https://localhost:9779',
				methodName: 'get_devices',
				params: ['', "OpenSysCloneRescue"],
				success: function(response,status,jqXHR){
					//alert(response[0]['status']);
					//alert(response[0]['msg'].length);
					
					if ( response[0]['status']===true){
						setfunc(response[0]['msg']);
						callback();
					}
					else alert("Error: "+response[0]['msg']);
					
				},
				error: function(jqXHR, status, error) {
					alert("Status: "+status+"\nError: N4D server is down "+error);
				}
			})
		
	}
	
	this.showStage1=function showStage1(){
		$("#divWizard").empty();
		var title=$(document.createElement("label")).addClass("customlabel").html(i18n.gettext("rescuepxe.stage1.tittle"));
		title.addClass("optiontitle_rescue_usb");
		$("#divWizard").append(title);
		var newline=$(document.createElement("br"))
		$("#divWizard").append(newline);
		var text=$(document.createElement("label")).addClass("customlabel").html(i18n.gettext("rescuepxe.stage1.description"));
		text.addClass("optiondescription_rescue_usb");
		$("#divWizard").append(text);
		var btWizard_1=$(document.createElement("button")).addClass("submit-button").attr("id", "btwiz1").html(i18n.gettext("rescuepxe.stage1.button"));
		btWizard_1.css("margin-top","50px");
		btWizard_1.bind("click",function(){
			self.getDeviceList(self.setFirstDeviceList, self.showStage2);
		});
		$("#divWizard").append(btWizard_1);

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
					console.log("Test N4D USER RESULT, username: "+sessionStorage.localusername+" -- passwd: "+sessionStorage.localpassword);
					
				},
				error: function(jqXHR, status, error) {
					$("body").removeClass("CursorWaiting");
					alert("Status: "+status+"\nError: N4D server is down "+error);
				}
			})
	}
	
	
	this.showStage2=function showStage2(){
		$("#divWizard").empty();
		var title=$(document.createElement("label")).addClass("customlabel").html(i18n.gettext("rescuepxe.stage2.tittle"));
		title.addClass("optiontitle_rescue_usb");
		$("#divWizard").append(title);
		var newline=$(document.createElement("br"))
		$("#divWizard").append(newline);
		var text=$(document.createElement("label")).addClass("customlabel").html(i18n.gettext("rescuepxe.stage2.description"));
		text.addClass("optiondescription_rescue_usb");
		$("#divWizard").append(text);
		
		var wait=$(document.createElement("div")).addClass("Waiting").attr("id", "waiting_div");
		$("#divWizard").append(wait);

		var CloseBt=$(document.createElement("button")).addClass("submit-button").attr("id", "cancel_button").attr("style","width: 200px;margin-top:60px").html(i18n.gettext("rescuepxe.cancel"));
		//var CloseBt=$(document.createElement("button")).addClass("red btWizard firstbutton").attr("id", "cancel_button").html(i18n.gettext("rescuepxe.cancel"));
		CloseBt.css("margin-top","50px");
		$("#divWizard").append(CloseBt);
		$(CloseBt).bind("click", function(){
			self.showMe();
		});
		
		
		self.searchInterval=setInterval(function(){
			self.getDeviceList(self.setSecondDeviceList, self.check_for_sd_ready);
		}, 3000);
		
		// Wait for SD insertion...
		
	}
	
	this.showStage3=function showStage3(diff){
		$("#divWizard").empty();
		var title=$(document.createElement("label")).addClass("customlabel").html(i18n.gettext("rescuepxe.stage3.tittle"));
		title.addClass("optiontitle_rescue_usb");
		$("#divWizard").append(title);
		var newline=$(document.createElement("br"))
		$("#divWizard").append(newline);
		var text=$(document.createElement("label")).addClass("customlabel").html(i18n.gettext("rescuepxe.stage3.description"));
		text.addClass("optiondescription_rescue_usb");
		$("#divWizard").append(text);
		
		var device_table=$(document.createElement("table")).attr("style","width: 400px; border-spacing: 0px 10px;margin-bottom:30px");
		var t_header=$(document.createElement("tr"));
		// $(t_header).css("text-align", "left");
		$(t_header).attr("style","text-align: left");
		var thcol1=$(document.createElement("th")).addClass("optiondescription_rescue_usb").css("color","black").html(i18n.gettext("rescuepxe.stage3.tablecol1"));
		var thcol2=$(document.createElement("th")).addClass("optiondescription_rescue_usb").css("color","black").html(i18n.gettext("rescuepxe.stage3.tablecol2"));
		var thcol3=$(document.createElement("th")).addClass("optiondescription_rescue_usb").css("color","black").html(i18n.gettext("rescuepxe.stage3.tablecol3"));
		$(t_header).append(thcol1);
		$(t_header).append(thcol2);
		$(t_header).append(thcol3);
		$(device_table).append(t_header);
				
		for (i in diff) {
			model=diff[i]['model'];
			device=diff[i]['name'];
			size=diff[i]['size'];
			
			var t_row=$(document.createElement("tr")).attr("id", device);
			var trcol1=$(document.createElement("td")).css("color","yellow").html(device);
			var trcol2=$(document.createElement("td")).css("color","yellow").html(model);
			var trcol3=$(document.createElement("td")).css("color","yellow").html(size);
			$(t_row).append(trcol1);
			$(t_row).append(trcol2);
			$(t_row).append(trcol3);
			$(t_row).bind("click",function(){
				$("#"+self.selecteddevice).removeClass("selected");
				self.selecteddevice = $(this).attr("id");
				$("#"+self.selecteddevice).addClass("selected");
				$("#btwiz3").removeClass("btWizardHidden").addClass("btWizard green firstbutton");
				});
			$(device_table).append(t_row);
			
		}
		var table_container = $(document.createElement("div")).attr("id","table_container");
		table_container.css("margin-top","40px");
		table_container.append(device_table);
		$("#divWizard").append(table_container);
		
		var btWizard_3=$(document.createElement("button")).addClass("submit-button").attr("id", "btwiz3");
		var icon=$(document.createElement("i")).addClass("icon-sd").attr("style", "font-size:0.7em;");
		btWizard_3.addClass("btWizardHidden").html(i18n.gettext("rescuepxe.stage3.media")).prepend(icon);
		$("#divWizard").append(btWizard_3);
		
		var CloseBt=$(document.createElement("button")).addClass("submit-button").attr("id", "cancel_button").attr("style","width: 200px;margin-top:60px").html(i18n.gettext("rescuepxe.cancel"));

		$("#divWizard").append(CloseBt);
		$(CloseBt).bind("click", function(){
			self.showMe();
		});
		
		
		$(btWizard_3).bind("click", function(){

			var wait=$(document.createElement("div")).addClass("Waiting").attr("id", "waiting_div");
			$("#table_container").append(wait);
			if (self.selecteddevice === ""){
				alert("Select device");
				return 0;
			}
			$("#content").addClass("CursorWaiting");

			/*Los parametros de user y passwd han de ser de usuario local de la maquina, queremos ejecutar algo aqui, si se hace desde una maquina ajena al server tendremos que validar con user local.*/
			/*Aqui llamamos a la funcion n4d con localhost puesto que queremos que la función se ejecute en la maquina local de la GUI*/
			$.xmlrpc({
				url: 'https://localhost:9779',
				methodName: 'rescuepxe_usb',
				params: [[sessionStorage.localusername, sessionStorage.localpassword], "OpenSysCloneRescue", self.selecteddevice],
				success: function(response,status,jqXHR){
					$("#content").removeClass("CursorWaiting");
					if ( response[0][0]===true){
						alert(i18n.gettext("rescuepxe.finished_burn"));
						$("#waiting_div").remove();
						window.location='main.html';
					} 
					else{
						alert("Error: "+response[0][1]);
					}
				},
				error: function(jqXHR, status, error) {
					$("#content").removeClass("CursorWaiting");
					alert("Status: "+status+"\nError: N4D server is down "+error);
				}
			})

			});
		
		
	}
	
	
	
	this.check_for_sd_ready=function check_for_sd_ready(){
		// Cal detectar que siguen iguals...
		//alert(typeof(self.second_device_list));
		if ( JSON.stringify(self.second_device_list)!=JSON.stringify(self.first_device_list)) {
			clearInterval(self.searchInterval);
			diff=self.deviceDiff(self.second_device_list,self.first_device_list);
			
			self.showStage3(diff);
			

			//alert(JSON.stringify(diff));
			
		}
	}
	
	this.deviceDiff=function deviceDiv(second, first)	{
		var listaux=new Array();
		var list_dif=new Array();
		for (var item in first){
			listaux.push(JSON.stringify(first[item]));
		}
		
		for (var item in second){
			if (listaux.indexOf(JSON.stringify(second[item])) === -1)
				list_dif.push(second[item]);
		}
		return list_dif;
	}
	
	this.showMe=function showMe(){
		clearInterval(self.searchInterval);
		this.selecteddevice = "";
		self.showStage1();
	}

}
$(document).ready(function() {
	var mim = new RescuepxeManagerUsb();
	mim.BindLoginEventHandlers();
});
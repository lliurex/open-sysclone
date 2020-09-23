/* Class definition*/
function RescuepxeManager(){
	var self = this;
	this.BindLoginEventHandlers = function(){
		$("#goback").bind('click',this.goback);
		$("#rescuepxe").bind('click',this.rescuepxe);
	}

	this.goback = function (event){
		window.location='main.html';
	}

	this.rescuepxe = function (event){
		var media = $("#media input:checked").val();
		if (media === "floppy"){
			window.location='rescuepxe_floppy.html';
		}
		if (media === "cdrom"){
			window.location='rescuepxe_cdrom.html';
		}
		if (media === "usb"){
			window.location='rescuepxe_usb.html';
		}
	}
}
$(document).ready(function() {
	var mim = new RescuepxeManager();
	mim.BindLoginEventHandlers();
});
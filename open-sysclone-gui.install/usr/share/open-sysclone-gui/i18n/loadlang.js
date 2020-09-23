var language = process.env.LANGUAGE;
var lang = process.env.LANG; 
if(language.indexOf("ca_ES")>=0){
	language = "ca_ES.UTF-8@valencia";
}else if (language.indexOf("es")>=0){
	language = "es_ES.UTF-8";
}else if(lang.indexOf("ca_ES")>=0){
	language = "ca_ES.UTF-8@valencia";
}else if(lang.indexOf("es")>=0){
	language = "es_ES.UTF-8";
}

var i18n = new I18n(language,'open-sysclone');
try{
	i18n.loadfile();
}
catch(err){
	var i18n = new I18n('en','open-sysclone');
	i18n.loadfile();
}
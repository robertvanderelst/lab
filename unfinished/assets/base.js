function loadjs(filename, filetype){
	var fileref=document.createElement('script')
	fileref.setAttribute("type","text/javascript")
	fileref.setAttribute("src", filename)
}

if (typeof fileref!="undefined")
	document.getElementsByTagName("head")[0].appendChild(fileref)
}

loadjs("assets/jquery-1.4.2.min.js", "js")
loadjs("assets/jquery-ui-1.8.2.custom.min.js", "js")
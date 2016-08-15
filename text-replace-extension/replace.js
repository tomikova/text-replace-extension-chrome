var a;

function GetFiles(fun)
{
    var url = "http://localhost/Slike/LoopFiles.php";

    var xmlhttp;
  
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
	
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
			fun.call(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET",url,false);
    xmlhttp.send();
}

function DecodeUtf8(str)
{
	var DecodedString = str.replace("\u009a","š");
	DecodedString = DecodedString.replace("\u00e8","č");
	DecodedString = DecodedString.replace("\u00e6","ć");
	DecodedString = DecodedString.replace("\u00f0","đ");
	DecodedString = DecodedString.replace("\u009e","ž");
	return DecodedString;
}

GetFiles(function() {lista = this;} );	
var obj = eval('(' + lista + ')');

for(var i in obj) {
	if (i != 'Thumbs' && i!= 'null')
	{
		a = chrome.extension.getURL(DecodeUtf8(obj[i]));
		findAndReplace(DecodeUtf8(i),'<img src="'+a+'"height="30" width="30">');
	}
}

function findAndReplace(searchText, replacement, searchNode) {
    if (!searchText || typeof replacement === 'undefined') {
        return;
    }
    var regex = typeof searchText === 'string' ?
                new RegExp(searchText, 'gi') : searchText,
        childNodes = (searchNode || document.body).childNodes,
        cnLength = childNodes.length,
        excludes = 'html,head,style,title,link,meta,script,object,iframe';
    while (cnLength--) {
        var currentNode = childNodes[cnLength];
        if (currentNode.nodeType === 1 &&
            (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
            arguments.callee(searchText, replacement, currentNode);
        }
        if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
            continue;
        }
        var parent = currentNode.parentNode,
            frag = (function(){
                var html = currentNode.data.replace(regex, replacement),
                    wrap = document.createElement('div'),
                    frag = document.createDocumentFragment();
                wrap.innerHTML = html;
                while (wrap.firstChild) {
                    frag.appendChild(wrap.firstChild);
                }
                return frag;
            })();
        parent.insertBefore(frag, currentNode);
        parent.removeChild(currentNode);
    }
}

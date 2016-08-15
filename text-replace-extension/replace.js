function GetFiles(fun)
{
    var url = "http://localhost/Service/LoopFiles.php"; //lokacija php skripte na serveru za slanje ajax zahtjeva

    var xmlhttp;
  
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest(); //kreiranje objekta potrebnog za slanje zahtjev
    }
	
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) //ukoliko dođe do promjene svojstva readyState i ako je status jednak 200 (OK) poziva se funkcija koju sadrži onreadystatechange događaj
        {
			fun.call(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET",url,false); //slanje GET zahtjeva na poslužitelj, asinkrono
    xmlhttp.send();
}

function DecodeUtf8(str) //funkcija za ispravno dekodiranje hrvatskih dijakritičkih znakova
{
	var DecodedString = str.replace("\u009a","š");
	DecodedString = DecodedString.replace("\u00e8","č");
	DecodedString = DecodedString.replace("\u00e6","ć");
	DecodedString = DecodedString.replace("\u00f0","đ");
	DecodedString = DecodedString.replace("\u009e","ž");
	return DecodedString;
}

function UrlEncode(str) //funkcija za kreiranje ispravnog url-a
{
	return str.replace(" ", "%20");
}

GetFiles(function() {lista = this;} );	
var obj = eval('(' + lista + ')'); //evaluacija json odgovora sa poslužitelja

for(var i in obj) {
	if (i != 'Thumbs' && i!= 'null')
	{
		findAndReplace(DecodeUtf8(i),'<img src="'+UrlEncode(DecodeUtf8(obj[i]))+'" height="30" width="30">'); //za svaki ključ u odgovoru zamjeni ključ(tekst) sa pripadajućim simbolom
	}
}

function findAndReplace(searchText, replacement, searchNode) {
    if (!searchText || typeof replacement === 'undefined') {
        return;
    }
    var regex = typeof searchText === 'string' ? //ako je searchText oblika string pretvara se u regex, g - globalno, i - neovisno o veličini slova  (velika/mala slova)
                new RegExp(searchText, 'gi') : searchText,
        childNodes = (searchNode || document.body).childNodes, //ako je zadan početni čvor uzimaju se njegova djeca, a ako nije uzimaju se djeca od document.body
        cnLength = childNodes.length,
        excludes = 'html,head,style,title,link,meta,script,object,iframe';
    while (cnLength--) { //petlja koja prolazi kroz svu djecu
        var currentNode = childNodes[cnLength];
        if (currentNode.nodeType === 1 &&
            (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
            arguments.callee(searchText, replacement, currentNode); //ako je element onda se poziva funkcija nad tim elementom
        }
        if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) { //ako nije tekst ili ako nema tekstualnog podudaranja nastavlja se sa sljedećim djetetom
            continue;
        }
        var parent = currentNode.parentNode,
            frag = (function(){ //stvara se fragment koji sadrži zamjenjeni dio teksta
                var html = currentNode.data.replace(regex, replacement),
                    wrap = document.createElement('div'),
                    frag = document.createDocumentFragment();
                wrap.innerHTML = html;
                while (wrap.firstChild) {
                    frag.appendChild(wrap.firstChild);
                }
                return frag;
            })();
        parent.insertBefore(frag, currentNode); //fragment se stavlja ispred trenutnog djeteta
        parent.removeChild(currentNode); //trenutno djete se briše te je zamjena gotova, nastavlja se sa sljedećim djetetom
    }
}

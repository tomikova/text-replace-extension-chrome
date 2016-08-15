function GetFiles(fun)
{
    //lokacija php skripte na serveru za slanje ajax zahtjeva
    var url = "http://localhost/Service/LoopFiles.php";

    var xmlhttp;
  
    if (window.XMLHttpRequest)
    {
    	//kreiranje objekta potrebnog za slanje zahtjev
        xmlhttp=new XMLHttpRequest();
    }
	
    xmlhttp.onreadystatechange=function()
    {
    	//ukoliko dođe do promjene svojstva readyState i ako je status jednak 200 (OK) poziva se funkcija koju sadrži onreadystatechange događaj
        if (xmlhttp.readyState==4 && xmlhttp.status==200) 
        {
			fun.call(xmlhttp.responseText);
        }
    }
    //slanje GET zahtjeva na poslužitelj, asinkrono
    xmlhttp.open("GET",url,false); 
    xmlhttp.send();
}

//funkcija za ispravno dekodiranje hrvatskih dijakritičkih znakova
function DecodeUtf8(str) 
{
	var DecodedString = str.replace("\u009a","š");
	DecodedString = DecodedString.replace("\u00e8","č");
	DecodedString = DecodedString.replace("\u00e6","ć");
	DecodedString = DecodedString.replace("\u00f0","đ");
	DecodedString = DecodedString.replace("\u009e","ž");
	return DecodedString;
}

//funkcija za kreiranje ispravnog url-a
function UrlEncode(str)
{
	return str.replace(" ", "%20");
}

GetFiles(function() {lista = this;} );
//evaluacija json odgovora sa poslužitelja
var obj = eval('(' + lista + ')'); 

for(var i in obj) {
	if (i != 'Thumbs' && i!= 'null')
	{
		//za svaki ključ u odgovoru zamjeni ključ(tekst) sa pripadajućim simbolom
		findAndReplace(DecodeUtf8(i),'<img src="'+UrlEncode(DecodeUtf8(obj[i]))+'" height="30" width="30">');
	}
}

function findAndReplace(searchText, replacement, searchNode) {
    if (!searchText || typeof replacement === 'undefined') {
        return;
    }
    
    //ako je searchText oblika string pretvara se u regex, g - globalno, i - neovisno o veličini slova  (velika/mala slova)
    var regex = typeof searchText === 'string' ?
                new RegExp(searchText, 'gi') : searchText;
                
    //ako je zadan početni čvor uzimaju se njegova djeca, a ako nije uzimaju se djeca od document.body
    childNodes = (searchNode || document.body).childNodes;
    cnLength = childNodes.length;
    excludes = 'html,head,style,title,link,meta,script,object,iframe';
    
    //petlja koja prolazi kroz svu djecu
    while (cnLength--) {
        var currentNode = childNodes[cnLength];
        if (currentNode.nodeType === 1 &&
            (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
            //ako je element onda se poziva funkcija nad tim elementom
            arguments.callee(searchText, replacement, currentNode); 
        }
        
         //ako nije tekst ili ako nema tekstualnog podudaranja nastavlja se sa sljedećim djetetom
        if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
            continue;
        }
        
        var parent = currentNode.parentNode;
        //stvara se fragment koji sadrži zamjenjeni dio teksta
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
            
        //fragment se stavlja ispred trenutnog djeteta
        parent.insertBefore(frag, currentNode);
        
        //trenutno djete se briše te je zamjena gotova, nastavlja se sa sljedećim djetetom
        parent.removeChild(currentNode);
    }
}

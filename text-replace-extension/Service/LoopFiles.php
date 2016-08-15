<?php

$dir = 'simboli';

//url simbola na poslužitelju
$path = 'http://localhost/Service/simboli';

$array = array();

$array = LoopFiles($dir,$path,$array);

function LoopFiles($dir,$path,$array) {
	// čitanje svih datoteka u trenutnom direktoriju
	$files = scandir($dir);
	foreach ($files as $file) {
		if ($file!='.' && $file!='..' ) {
			// ako je direktorij onda ponovno pozovi funkciju sa novim parametrom
			if (is_dir($dir.'\\'.$file)) {	
				$array = LoopFiles($dir.'\\'.$file, $path.'/'.$file, $array);
			}
			else {
				// čitanje imena datoteka
				$filename = pathinfo($dir.'\\'.$file)['filename'];
				// kodiranje imena utf8
				$filename = utf8_encode($filename);
				// spremanje imena datoteke(simbola) i pripadajućeg url-a u asocijativno polje
				$array[' '.$filename.' '] = utf8_encode($path.'/'.$file); 
			}
		}
	}
	return $array;
}

//pretvaranje u json format
$json = json_encode($array);

print ($json);

?>


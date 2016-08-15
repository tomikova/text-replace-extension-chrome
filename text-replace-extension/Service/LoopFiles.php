<?php

$dir = 'simboli';
$path = 'http://localhost/Service/simboli'; //url simbola na poslužitelju

$array = array();

$array = LoopFiles($dir,$path,$array);

function LoopFiles($dir,$path,$array)
{
	$files = scandir($dir); // čitanje svih datoteka u trenutnom direktoriju
	foreach ($files as $file)
	{
		if ($file!='.' && $file!='..' )
		{
			if (is_dir($dir.'\\'.$file)) // ako je direktorij onda ponovno pozovi funkciju sa novim parametrom
	        {	
				$array = LoopFiles($dir.'\\'.$file, $path.'/'.$file, $array);
			}
			else
			{
				$filename = pathinfo($dir.'\\'.$file)['filename']; // čitanje imena datoteka
				$filename = utf8_encode($filename); // kodiranje imena utf8
				$array[' '.$filename.' '] = utf8_encode($path.'/'.$file); // spremanje imena datoteke(simbola) i pripadajućeg url-a u asocijativno polje
			}
		}
	}
	return $array;
}

$json = json_encode($array); //pretvaranje u json format

print ($json); //printanje rezultata

?>


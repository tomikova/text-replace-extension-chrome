<?php

$dir = '(getCurrentDir)\simboli';
$path = 'simboli';

$array = array();

$array = LoopFiles($dir,$path,$array);

function LoopFiles($dir,$path,$array)
{
	$files = scandir($dir);
	foreach ($files as $file)
	{
		if ($file!='.' && $file!='..' )
		{
			if (is_dir($dir.'\\'.$file))
	        {	
				$array = LoopFiles($dir.'\\'.$file, $path.'/'.$file, $array);
			}
			else
			{
				$filename = pathinfo($dir.'\\'.$file)['filename'];
				$filename = utf8_encode($filename);
				$array[' '.$filename.' '] = utf8_encode($path.'/'.$file);
			}
		}
	}
	return $array;
}

$json = json_encode($array);

print ($json);

?>


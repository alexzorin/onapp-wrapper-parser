<?php

declare(strict_types=1);

define('INPUT_DIR', '_scratch/OnApp-PHP-Wrapper-External');

require(__DIR__ . '/vendor/autoload.php');
ini_set('xdebug.max_nesting_level', '3000');

use PhpParser\ParserFactory;
$parser = (new ParserFactory)->create(ParserFactory::PREFER_PHP7);
$serializer = new PhpParser\Serializer\XML;

foreach (glob('{'. INPUT_DIR . '/**/*.php' . ',' . INPUT_DIR . '/*.php}', GLOB_BRACE) as $file) {
	try {
		$code = file_get_contents($file);
		$as_json = json_encode($parser->parse($code));
		file_put_contents($file . ".json", $as_json);
	} catch(Error $e) {
		echo $e->getMessage();
		return;
	}
}


?>

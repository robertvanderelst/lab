<?php
    $hidden = array('.','..','index.html','index.php','shared','unfinished');
    $dir = substr($_SERVER['SCRIPT_FILENAME'], 0, -10); 
    $files = scandir($dir); 
    
    $list = '<ul>'.PHP_EOL;
    foreach($files as $ind_file){ 
        if (!in_array($ind_file, $hidden)) {
            $list.= '    <li><a href="http://lab.robertvanderelst.nl/'.$ind_file.'">'.$ind_file.'</li>'.PHP_EOL;
        }
    } 
    $list.= '</ul>'.PHP_EOL;

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
            "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <title>Lab: Index</title>
		<link href='http://fonts.googleapis.com/css?family=Coustard' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Quattrocento' rel='stylesheet' type='text/css'>
        <style type="text/css">
		/*GENERAL*/
		body{color:#505050;font-family:'Quattrocento', Georgia, Times New Roman, serif;font-size:100%;line-height:1.5em;margin:0;padding:3em;background:url(bg.png) center center;}
		div.base{margin:0 auto;width:32em;padding:3em 4em;background:#FFF;}

		/*TYPOGRAPHY*/
		h1{font-family:'Coustard';font-weight:normal;font-size:2em;line-height:1.5em;margin:0 0 .75em;padding:0;}
		p,ul,ol{margin:0 0 1.5em;padding:0;}
		ul,ol{margin-left:2em;padding:0;}
		a{display:inline-block;padding:0 .25em;margin:0 -.25em;color:#900;border-radius:.25em;-webkit-transition: all .5s ease-in-out;-moz-transition: all .5s ease-in-out;-o-transition: all .5s ease-in-out;-ms-transition: all .5s ease-in-out;transition: all .5s ease-in-out;}
		a:hover,a:active{color:#FFF;background:#900;}
		</style>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
    </head>
    <body>
        <div class="base">
		<h1>Front-End Lab</h1>
		<p>A small collection of tests and experiments in HTML, CSS and jQuery. Some are done, some are not.</p>
		<?php echo $list; ?>
		</div>
	</body>
</html>

<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Proforma 2.0 - POST</title>
		<link href="proforma2.css" rel="stylesheet">
	</head>
	<body>
		<div class="container">
			<h1>Proforma 2.0 - POST</h1>
			<p>Below you'll see what has been posted, for testing purposes</p>
			<pre>
			<?
				var_dump($_POST);
			?>
			<hr>
			<?
				var_dump($_FILES);
			?>
		  </pre>
		</div>
	</body>
</html>
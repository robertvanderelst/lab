<!DOCTYPE html>
<html lang="nl">
    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8">
        <title>Proforma</title>
		<link href="proforma.css" rel="stylesheet" type="text/css">
    </head>
    <body>
		<h1>Proforma</h1>
        <div id="post">
            <h2>The Post</h2>
            <? print_r($_POST); ?>
        </div>
		<form id="proforma" action="index.php" method="post" enctype="multipart/form-data">
            <fieldset class="mandatory">
				<legend><span>Textarea</span></legend>
                <div class="wrapper">
					<div class="row">
						<label for="comment" class="before">Textarea</label>
						<textarea name="comment" class="req"></textarea>
                    </div>
                </div>
            </fieldset>
            <fieldset class="mandatory">
				<legend><span>Radio's and Checkboxes</span></legend>
                <div class="wrapper">
                    <div class="row">
						<label for="radio" class="before">Radio</label>
						<div class="multiple">
                            <label><input name="radiovalues" type="radio" value="1" checked="checked"> Radio 1</label>
                            <label><input name="radiovalues" type="radio" value="2"> Radio 2</label>
                            <label><input name="radiovalues" type="radio" value="3"> Radio 3</label>
                            <label><input name="radiovalues" type="radio" value="4"> Radio 4</label>
                            <label><input name="radiovalues" type="radio" value="5"> Radio 5</label>
                        </div>
                    </div>
                    <div class="row">
						<label for="checkbox" class="before">Checkbox</label>
						<div class="multiple">
                            <label><input name="checkbox1" type="checkbox" checked="checked"> Checkbox 1</label>
                            <label><input name="checkbox2" type="checkbox"> Checkbox 2</label>
                            <label><input name="checkbox3" type="checkbox"> Checkbox 3</label>
                            <label><input name="checkbox4" type="checkbox" checked="checked"> Checkbox 4</label>
                            <label><input name="checkbox5" type="checkbox"> Checkbox 5</label>
                        </div>
                    </div>
                </div>
            </fieldset>
            <fieldset class="mandatory">
				<legend><span>Selectboxes</span></legend>
                <div class="wrapper">
                    <div class="row">
						<label for="select" class="before">Select</label>
						<select id="select" name="select" class="req">
                            <option value="">Select a value</option>
                            <optgroup label="Group 1">
                                <option value="item1.1" selected="selected">Item 1.1</option>
                                <option value="item1.2">Item 1.2</option>
                                <option value="item1.3">Item 1.3</option>
                                <option value="item1.4">Item 1.4</option>
                            </optgroup>
                            <optgroup label="Group 2">
                                <option value="item2.1">Item 2.1</option>
                                <option value="item2.2">Item 2.2</option>
                                <option value="item2.3">Item 2.3</option>
                                <option value="item2.4">Item 2.4</option>
                            </optgroup>
                            <option value="item3">Item 3</option>
                            <option value="item4">Item 4</option>
                            <option value="item5">Item 5</option>
                        </select>
					</div>
                    <!-- Next up: Multiple selects! -->
					<!--<div class="row">
						<label for="select" class="before">Select multiple</label>
						<select id="select" name="select" multiple="multiple" class="req">
                            <optgroup label="Group 1">
                                <option value="item1.1">Item 1.1</option>
                                <option value="item1.2">Item 1.2</option>
                                <option value="item1.3">Item 1.3</option>
                                <option value="item1.4">Item 1.4</option>
                            </optgroup>
                            <optgroup label="Group 2">
                                <option value="item2.1">Item 2.1</option>
                                <option value="item2.2">Item 2.2</option>
                                <option value="item2.3">Item 2.3</option>
                                <option value="item2.4">Item 2.4</option>
                            </optgroup>
							<option value="item3" selected="selected">Item 3</option>
                            <option value="item4">Item 4</option>
                            <option value="item5">Item 5</option>
                        </select>
					</div>-->
                </div>
            </fieldset>
            <fieldset class="mandatory">
				<legend><span>File selection</span></legend>
                <div class="wrapper">                    
					<div class="row">
						<label for="addfile" class="before">File</label>
						<input type="file" name="addfile">
                    </div>
				</div>
            </fieldset>
			<fieldset>
				<legend><span><label><input name="optional" type="checkbox" value=""> Optional fields</label></span></legend>
				<div class="wrapper">                    
					<p>Optional fields</p>
				</div>
			</fieldset>
            <input type="submit" value="Send">
		</form>
		<script src="http://code.jquery.com/jquery.min.js"></script>
		<script src="proforma.min.js" type="text/javascript"></script>
        <script type="text/javascript">
            $(document).ready(function() {
                $("input:not(':submit'), textarea, select").proforma(
                    {
                        fileValueDefaultText: 'No file selected?',
                        fileButtonText: 'Choose a file'
                    }
                );
            });
		</script>
    </body>
</html>
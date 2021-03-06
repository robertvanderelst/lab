﻿<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
            "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <title>Lab: Using typographic baselines in HTML</title>
		<link href='http://fonts.googleapis.com/css?family=Coustard' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Quattrocento' rel='stylesheet' type='text/css'>
        <link href="type.css" rel="stylesheet" type="text/css">
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <script src="http://code.jquery.com/jquery.min.js" type="text/javascript"></script>
        <script type="text/javascript">
            jQuery('document').ready(function() {
                jQuery('#show').click(function() {
                    if (jQuery(this).attr("checked")) {
                        jQuery("body").addClass("baseline");
                    } else {
                        jQuery("body").removeClass("baseline");
                    }
                });
            });
        </script>
    </head>
    <body>
        <div class="container">
            <form>
                <fieldset>
                    <label for="show"><input type="checkbox" id="show" name="show"> Show baselines</label>
                </fieldset>
            </form>
            <div class="base">
                <h1>Using typographic baselines in HTML</h1>
                <div class="articledata">Published on <?php echo date("l, F jS Y", filemtime(__FILE__)); ?> by Robert van der Elst</div>
                <div class="hr"></div>
                <p>
                <span class="dropcap">T</span>ypography for the web can be hard to do when you don't know the basics. Therefore, I've tried to make a single page to do just that.
                
                </p>
                <h2>Baselines &amp; leading</h2>
                <p><span class="dropcap">A</span>ccording to <a href="http://en.wikipedia.org/wiki/Baseline_(typography)">Wikipedia</a>, the baseline is the line upon which most letters "sit" and below which descenders extend. To get into a vertical rhythm, the baselines need to be at exactly the same distance, or multiples of that distance, each time to make it easy on the eyes. That is where <a href="http://en.wikipedia.org/wiki/Leading">leading</a> (in CSS: <em>line-height</em>) comes into play. Setting the line-height for text can make the text easier to read.
                </p>
                <p><span class="dropcap">Y</span>ou might have noticed the radio button at the top. Click it. Now you can see how the baselines work. As you can see, I've given the textual elements a background color to show how the browser interprets line-heights.  The red lines don't follow the baselines, but follow the line heights. The baseline is different for each font.</p>
                <h2>Unordered lists</h2>
                <p>For unordered lists, the easiest way to keep things readable is to keep a bottom margin equal to the line-height. This will maintain vertical flow.
                <ul>
                    <li><a href="#">List item 1</a></li>
                    <li>List item 1</li>
                    <li>List item 1</li>
                    <li>List item 1</li>
                </ul>
                <h2>Ordered lists</h2>
				<p>Obviously, the same goes for ordered lists. Notice that both unordered and ordered lists have the same indentation, again to make it easier for the eyes.
                <ol>
                    <li><a href="#">List item 1</a></li>
                    <li>List item 1</li>
                    <li>List item 1</li>
                    <li>List item 1</li>
                </ol>
                <h3>This is a level 3 header (&lt;h3&gt;) which is a bit smaller, but still follows the baseline.</h3>
                <div class="hr"></div>
                <p>
					Notice the line above. It's a horizontal rule but doesn't use the &lt;hr&gt; element, simply because it's not easy to get it to follow the baseline.
                </p>
                <h4>This is a level 4 header (&lt;h4&gt;), oh and definition lists below.</h4>
                <dl>
                    <dt>This is a term, which is in italic.</dt>
                    <dd>This is the definition of above term, which is indented so that you can scan the terms more easily. The terms itself could be bold for example to make it stand out.</dd>
                    <dt>Another term</dt>
                    <dd>Another definition of above term. Here too, a small bottom margin does the trick.</dd>                
                </dl>
				<h4>Blockquotes</h4>
				<p>Blockquotes tend to be in italics and have a &lsquo;hanging&rsquo; quote to keep the text flow easy on the eyes.</p>
                <blockquote>
                    <p>&ldquo;When, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees.&rdquo;</p>
                    <p class="cite">&mdash; Werther</p>
                </blockquote>
                <div class="hr"></div>
                <table>
                    <caption>Table caption, can be left-aligned.</caption>
                    <tr>
                        <th scope="row">Row headers are center-aligned!</th>
                        <td>Row content</td>
                    </tr>
                    <tr>
                        <th scope="row">Row header</th>
                        <td>Row content</td>
                    </tr>
                </table>
                <div class="hr"></div>
            </div>
            <div class="aside">
                <h2>Smaller type</h2>
                <p>When using smaller type, do not try to follow the baseline of the main content. It's best to define a baseline for every size you use.</p>
                <ul>
                    <li><a href="#">List item 1</a></li>
                    <li>List item 1</li>
                    <li>List item 1</li>
                    <li>List item 1</li>
                </ul>
                <div class="hr"></div>
            </div>
        </div>
    </body>
</html>
<?php
require_once('../php/include/config.php');

$url = ROOT.'/v3/js/rietveld.min.js';

if(!file_exists($url)) exit;


$units = '';
if(isset($oTranslation->aText['article']['[UNITS]']))                           $units = $oTranslation->aText['article']['[UNITS]'];

$in_stock_alert_not_identical = '';
if(isset($oTranslation->aText['article']['[IN_STOCK_ALERT_NOT_IDENTICAL]']))    $in_stock_alert_not_identical = $oTranslation->aText['article']['[IN_STOCK_ALERT_NOT_IDENTICAL]'];

$confirm_delete_list = '';
if(isset($oTranslation->aText['my_rietveld']['[CONFIRM_DELETE_LIST]']))         $confirm_delete_list = $oTranslation->aText['my_rietveld']['[CONFIRM_DELETE_LIST]'];

$minimal_characters = '';
if(isset($oTranslation->aText['search']['[MINIMAL_CHARACTERS]']))               $minimal_characters = $oTranslation->aText['search']['[MINIMAL_CHARACTERS]'];

$error_invalid_email = '';
if(isset($oTranslation->aText['form']['[ERROR_INVALID_EMAIL]']))                $error_invalid_email = $oTranslation->aText['form']['[ERROR_INVALID_EMAIL]'];

$error_missing_fields = '';
if(isset($oTranslation->aText['form']['[ERROR_MISSING_FIELDS]']))               $error_missing_fields = $oTranslation->aText['form']['[ERROR_MISSING_FIELDS]'];

$product_added = '';
if(isset($oTranslation->aText['mobile']['[PRODUCT_ADDED]']))                    $product_added = $oTranslation->aText['mobile']['[PRODUCT_ADDED]'];


$file = file_get_contents($url);
$file = str_replace('[DOMAIN_ROOT]',DOMAIN_ROOT,$file);
$file = str_replace('[ROOT]',ROOT,$file);
$file = str_replace('[HTTP]',HTTP,$file);
$file = str_replace('[HTTP_HOST]',HTTP_HOST,$file);
$file = str_replace('[SEARCH_BOX_TEXT]',HTTP_HOST,$file);
$file = str_replace('[UNITS]', $units, $file);
$file = str_replace('[IN_STOCK_ALERT_NOT_IDENTICAL]', $in_stock_alert_not_identical, $file);
$file = str_replace('[CONFIRM_DELETE_LIST]', $confirm_delete_list, $file);
$file = str_replace('[MINIMAL_CHARACTERS]', $minimal_characters, $file);
$file = str_replace('[MAIL_INVALID]', $error_invalid_email, $file);
$file = str_replace('[ERROR_MISSING_FIELDS]', $error_missing_fields, $file);
$file = str_replace('[PRODUCT_ADDED]', $product_added, $file);
$file = str_replace('[CURRENCY_SYMBOL]', CURRENCY_SYMBOL, $file);

// V3
$searchclose = '';
$filtershow = '';
$filterhide = '';
$filterclose = '';
$filtershowextended = '';
$filterhideextended = '';
$carrouselprev = '';
$carrouselnext = '';

if(isset($oTranslation->aText['v3']['javascript']['searchclose']))              $searchclose = $oTranslation->aText['v3']['javascript']['searchclose'];
if(isset($oTranslation->aText['v3']['javascript']['filtershow']))               $filtershow = $oTranslation->aText['v3']['javascript']['filtershow'];
if(isset($oTranslation->aText['v3']['javascript']['filterhide']))               $filterhide = $oTranslation->aText['v3']['javascript']['filterhide'];
if(isset($oTranslation->aText['v3']['javascript']['filterclose']))              $filterclose = $oTranslation->aText['v3']['javascript']['filterclose'];
if(isset($oTranslation->aText['v3']['javascript']['filtershowextended']))       $filtershowextended = $oTranslation->aText['v3']['javascript']['filtershowextended'];
if(isset($oTranslation->aText['v3']['javascript']['filterhideextended']))       $filterhideextended = $oTranslation->aText['v3']['javascript']['filterhideextended'];
if(isset($oTranslation->aText['v3']['javascript']['carrouselprev']))            $carrouselprev = $oTranslation->aText['search']['v3']['javascript']['carrouselprev'];
if(isset($oTranslation->aText['v3']['javascript']['carrouselnext']))            $carrouselnext = $oTranslation->aText['search']['v3']['javascript']['carrouselnext'];

$file = str_replace('[SEARCHCLOSE]', $searchclose, $file);
$file = str_replace('[FILTERSHOW]', $filtershow, $file);
$file = str_replace('[FILTERHIDE]', $filterhide, $file);
$file = str_replace('[FILTERCLOSE]', $filterclose, $file);
$file = str_replace('[FILTERSHOWEXTENDED]', $filtershowextended, $file);
$file = str_replace('[FILTERHIDEEXTENDED]', $filterhideextended, $file);
$file = str_replace('[CARROUSELPREV]', $carrouselprev, $file);
$file = str_replace('[CARROUSELNEXT]', $carrouselnext ,$file);

echo $file;

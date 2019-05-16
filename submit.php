<?php
var_dump($_POST);
if(isset($_POST) && array_key_exists('fullData',$_POST))
{
    //process PHP Code
    echo $_POST['fullData'];
}
   
?>
<?php
class dataConnection
{
    public $conn;
    
    public function data_connection()
    {
        //$this->conn=new mysqli("localhost", "root", "Vb5YDh4m00!*^", "dots2");
        $this->conn=new mysqli("localhost", "root", "", "dots");
        if ($this->conn->connect_errno) {
            echo "Dalton sucks...";
            exit;
        }
    }
    
    
    // used just to pass safe data to database
    protected function safe_data_entry($_val, $_type)
    {
        switch ($_type) {
            case "text":
                $_val=(!empty($_val)) ? "'".$this->format_data_text($_val)."'" : "NULL";
                break;
            case "html_text":
                $_val=(!empty($_val)) ? "'".$this->format_html_text($_val)."'" : "NULL";
                break;
            case "int":
                $_val=((!empty($_val)) && (is_numeric($_val))) ? intval($_val) : "0";
                break;
            case "double":
                $_val=(!empty($_val)) ? "'".doubleval($_val)."'" : "0";
                break;
            case "date":
                $_val = ($_val != "") ? "'" . $_val . "'" : "NULL";
                break;
        }
        
        return $_val;
    }
    // used just to pass clean data to database
    protected function format_data_text($_val)
    {
        $_val=str_replace("\'", "&#39;", $_val);
        $_val=str_replace('\"', "&quot;", $_val);
        $_val=str_replace("'", "&#39;", $_val);
        $_val=str_replace('"', "&quot;", $_val);
        
        $search=array('@<script[^>]*?>.*?</script>@si','@<style[^>]*?>.*?</style>@siU','@<[\/\!]*?[^<>]*?>@si','@<![\s\S]*?--[ \t\n\r]*>@');
        $_val=preg_replace($search, '', $_val);
        $_val=str_replace('<', '&lt', $_val);
        $_val=str_replace('>', '&gt', $_val);
        
        $_val=$this->format_html_text($_val);
        
        return $_val;
    }
    // used just to pass clean data to database
    /*protected function format_html_text($_val)
    {
        $_val=str_replace("'", "&#39;", $_val);
        $_val=str_replace(''', "&lsquo;", $_val);
                                $_val=str_replace(''', "&rsquo;", $_val);
        $_val=str_replace('-', "&ndash;", $_val);
        $_val=str_replace('"', "&ldquo;", $_val);
        $_val=str_replace('"', "&rdquo;", $_val);
        
        return $_val;
    }*/
    
    public function close_connection()
    {
        $this->conn->close();
    }
}

if(isset($_POST['function'])) {
    if($_POST['function'] == 'getDependencies') {
        getDependencies($_POST['ID']);
    }
}


function getfromcodebank($cID, $sectionID) {
    $dc = new dataConnection;
    $dc->data_connection();
    $query = "SELECT * FROM roca_code_bank WHERE cID=" . $cID;
//    $subMenuQuery = "SELECT * FROM roca_code_bank WHERE cID = -1";
    
    $result = mysqli_query($dc->conn, $query) or die(mysqli_error($dc->conn));
//    $subMenuResult = mysqli_query($dc->conn, $subMenuQuery) or die(mysqli_error($dc->conn));

    if($cID == 4){
        echo "<table style='width:auto; height:auto;'>
                       <caption style='font-size: 40%; padding-top: 2%'>" . $sectionID . "</caption>
                       <tr>
                       <td rowspan='3'><span class='ti-user' style='vertical-align: -2px; font-size: 50%;'></span></td>
                       <td><button class='circularButton2' title='Increment Students' type='button' id='more_students' onclick='updateStudentNum(this," . $sectionID . ")' style='font-weight: bold; font-size: 70%;'>+</button></td>
                       <td rowspan='3'>";
        
        while($row = mysqli_fetch_array($result)){
            echo "<button class='button2 event " . $row['dC'] . "' id='popupButton' style='width:100%' onclick='dataToFeed(event,this," . $sectionID . ")'>" . $row['dN'] . "</button>";
        }
        
        echo " </td>
                        </tr>
                        <tr>
                        <td id='numStudentLabel" . $sectionID . "' style='font-size: small;'>0</td>
                        </tr>
                        <tr>
                        <td><button class='circularButton2' title='Decrement Students' type='button' id='less_students' onclick='updateStudentNum(this," . $sectionID . ")' style='font-weight: bold; font-size: 70%;'>-</button></td>
                        </tr>
                        </table>";
    }
    else{
        while($row = mysqli_fetch_array($result)){
            /*echo "<option value='".$row['dName']."'</option>";*/
    
            //if($cID < 5){
                /*if(subMenuExists($row['ID'], $subMenuResult)){
                    echo "<div class='dropdownInsideDropdown'>";
                    echo "<div class='firstMenuItem'>";
    				echo "<a onclick='showSubmenu(\"submenu" . $row['ID'] . "\")'>" . $row['dN'] . "</a>";
    				echo "</div>";
                    echo "<div class='dropdown2-content' id = 'submenu" . $row['ID'] . "'>";
                    mysqli_data_seek($subMenuResult, 0);
                    getSubMenu($row['ID'], $subMenuResult);
                    echo "</div></div>";
                   
                }
                else{*/
                if($cID ==1 || $cID==2){
                    echo "<a class='code activity' id = ". $row['dC']
                            . " onclick='dataToFeed(event, this, null);'>" 
                            . $row['dN'] . "</a>";
                }
                else if($cID==3){
                    echo "<a class='event' id = ". $row['dC']
                    . " onclick='dataToFeed(event, this, null);'>"
                        . $row['dN'] . "</a>";
                }
                
                
               
               //mysqli_data_seek($subMenuResult, 0);
            //}
            else {
    
                echo "<label class='container' title='" . $row['dN'] . "'>
    								<input type='checkbox' id='" . $row['dC'] . "'onclick='dataToFeed(event, this, null)'>" . $row['dC'] .
    								"</input><span class='checkmark'></span></label>";
            }
            /*echo json_encode($row['dName']);*/
            /* style ='color:#cccccc' */
        }
    }
    
    $dc->close_connection();

}

function getDependencies($ID){
    $dc = new dataConnection;
    $dc->data_connection();
    
    /*$query = "SELECT T.ID, T.cID, T.bID, T.dID, (C.ID), (C.dC) 
              FROM
	               (SELECT A.ID, A.cID, A.dC, B.bID, B.dID
                    FROM (`roca_code_bank` AS A) INNER JOIN (`roca_code_dependencies` AS B)
                    ON A.ID = B.bID
                    WHERE A.dC = '" . $ID . "') AS T
              INNER JOIN (`roca_code_bank` AS C)
              ON T.dID = C.ID";
    $result = mysqli_query($dc->conn, $query) or die(mysqli_error($dc->conn));
    
    $dArray = [];
    while($row = mysqli_fetch_array($result)){
        array_push($dArray, $row['dC']);
    }
    
    $obj = (object) [
        'active' => $ID,
        'anArray' => $dArray
    ];
    
    $dc->close_connection();
    echo json_encode($obj);*/
    
    $query="SELECT C.dC FROM roca_code_bank C WHERE C.cID IN (3,4,5,6) AND C.isVS=1";
    
    $result = mysqli_query($dc->conn, $query) or die(mysqli_error($dc->conn));
    
    $dArray = [];
    
    while($row = mysqli_fetch_array($result)){
        
        array_push($dArray, $row['dC']);
        
    }
    
    
    
    $query = "SELECT T.ID, T.cID, T.bID, T.dID, (C.ID), (C.dC)
        
              FROM
        
                               (SELECT A.ID, A.cID, A.dC, B.bID, B.dID
        
                    FROM (`roca_code_bank` AS A) INNER JOIN (`roca_code_dependencies` AS B)
        
                    ON A.ID = B.bID
        
                    WHERE A.dC = '".$ID."') AS T
                        
              INNER JOIN (`roca_code_bank` AS C)
                        
              ON T.dID = C.ID";
    
    $result = mysqli_query($dc->conn, $query) or die(mysqli_error($dc->conn));
    
    while($row = mysqli_fetch_array($result)){
        
        if (($key = array_search($row['dC'], $dArray)) != false) unset($dArray[$key]);
        
    }
    
    $trueArray = array_values($dArray);
    
    
    
    $obj = (object) [
        
        'active' => $ID,
        
        'anArray' => $trueArray
        
    ];
    
    
    
    $dc->close_connection();
    
    echo json_encode($obj);
}







// Check if a sub menu exists for a main menu component
function subMenuExists($ID, $result){
    /*while($row = mysqli_fetch_array($result)){
        if($row['eXT'] == $ID){
            return True;
        }
    }*/
    return False;
}
// Get the components of the sub menu
function getSubMenu($ID, $result){
    while($row = mysqli_fetch_array($result)){
        if($row['eXT'] == $ID){
            echo "<a onclick='dataToFeed(event, this);hideSubmenu(\"submenu" . $ID . "\");'>" . $row['dN'] . "</a>";
        } 
    }
    
}
 ?>
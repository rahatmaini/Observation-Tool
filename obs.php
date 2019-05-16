<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset="ISO-8859-1">
	<title>ROCA Observation Tool</title>
	<link rel="stylesheet" href="obs.css">
	<link rel="stylesheet" href="popupCSS.css">
    <style>
	<!-- NEEDS: Pull From Database --> 
	#classroom_mapping {
		background-image: url("RICE-130.jpg"); 
	}
	</style>
	<link rel="stylesheet" href="themify-icons.css">
	<link rel="stylesheet" href="fonts/stylesheet.css">
    <!-- NEEDS: Pull From Database -->
	<script>
		function createBoxes() {
			shadeGrid(2,6,9,7, 1);
			shadeGrid(2,1,9,6, 2);
			shadeGrid(9,1,13,7, 3);
			shadeGrid(13,1,18,7, 4);
			shadeGrid(18,1,26,6, 5);
			shadeGrid(18,6,26,8, 6);
		}
		</script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script type="text/javascript" src="obs.js"></script>
	
</head>
<?php include 'db.php'; ?>
<body onload="setAllDefaultValues()">

	<!-- Data from forms set to invisible iframe: WILL NEED TO CHANGE THIS LATER -->
	<iframe name="dump_data_frame" id="dump_data_frame"></iframe>
	
	<div class="body_content">
		<!-- BEGIN: left_side div -->
		<!-- Contains classroom pic and majority of inputs -->
		<div id="left_side">
			<!-- BEGIN: top_left div -->
			<!-- Contains back button and room name -->
			<!-- <form autocomplete="off" id="student_events_form" target="dump_data_frame"></form> -->
			<div id="top_left">
				<div><a onclick="reload()" style=" vertical-align: middle"><span id="back_arrow" class="ti-arrow-left" ></span></a>&nbsp;&nbsp;&nbsp;Rice Hall 130</div>
				
				
				
    				<div class="class_section_input" id="s1"><?php getfromcodebank(4, 1) ?></div>
    				<div class="class_section_input" id="s2"><?php getfromcodebank(4, 2) ?></div>
    				<div class="class_section_input" id="s3"><?php getfromcodebank(4, 3) ?></div>
    				<div class="class_section_input" id="s4"><?php getfromcodebank(4, 4) ?></div>
    				<div class="class_section_input" id="s5"><?php getfromcodebank(4, 5) ?></div>
    				<div class="class_section_input" id="s6"><?php getfromcodebank(4, 6) ?></div>
    				
				
			</div>
			<!-- BEGIN: classroom mapping -->
			<div id="classroom_mapping"></div>
			<!-- END: classroom mapping -->
			
			<!-- BEGIN: bottom_left div -->
			<div id="bottom_left">

			
        		<!--<button class="pulse-button" title="Start" type="button" onclick="start_or_stop()" id="start_button"><span class="ti-control-play" style="vertical-align: -2px"></span></button>-->
        		<div class="pen-wrapper" style="display: inline-block">

                    <div class="buton-cover button-slide-out" >
                        <span class="button-slide-out__above" style="text-align: center;" id="areYouSure">are you sure?</span>
                    
                        <div class="button-slide-out__middle">
                          <button class="btn2" id="start_button" onclick="start_or_stop()" style="-webkit-animation: pulse 1.8s infinite;" title="Start"><span class="ti-control-play" style="vertical-align: -2px"></span></button>
                        </div>
                    
                        <div class="button-slide-out__below">
                          <button class="btn2" id="cancelStop" onclick="full_stop()" style="display:none">cancel</button>
                    	</div>
                		
                	</div>
                </div>

				<div class="pen-wrapper" style="display: inline-block">

                    <div class="buton-cover button-slide-out">
                    	<span class="button-slide-out__above" style="text-align: center">are you sure?</span>
                
                        <div class="button-slide-out__middle">
                        	<button class="btn" id="initiallyReset" onclick="resetButtonMixup()" onmouseover="rotateIcon()" onmouseout="rotateIcon()"><div id="icon"><span class="ti-reload" style="vertical-align: -2px"></span></div></button>
                        </div>
                
                        <div class="button-slide-out__below">
                        	<button class="btn" id="initiallyCancel" onclick="reload()">cancel</button>
                    	</div>
                		
                	</div>
                </div>


			

				<div class="dropdown" onmouseover="reactivateDropdowns()">
					<button class="button">student activities</button>
					<div class="dropdown-content">
						<?php getfromcodebank(2, null) ?>
					</div>
				</div>

				<div class="dropdown" onmouseover="reactivateDropdowns()">
					<button class="button">instructor activities</button>
					<div class="dropdown-content">
							<?php getfromcodebank(1, null) ?>
					</div>
				</div>

				<div class="dropdown" onmouseover="reactivateDropdowns()">
					<button class="button">instructor events</button>
					<div class="dropdown-content">
							<?php getfromcodebank(3, null) ?>
					</div>
				</div>
						
				
				<button class="circularButton" title="Feed" type="button" id="feed_button" onclick="openFeed(event)"><span class="ti-list-ol" style="vertical-align: -2px"></span></button>
				<div id="commentPopup" class="commentPopupStyle"></div>
				<button class="circularButton" title="Comment" type="button" id="comment_button" onclick="showCommentPopup(event)"><span class="ti-pencil" style="vertical-align: -2px" onclick="showCommentPopup(event)"></span></button>
					
				
				<br /><br />
				<div style="text-align:center;">
					<div id="persistingFeed" style="display: inline-block;"></div><br /><br/>
					<div class="fadingFeed" style="display: inline-block;"></div>
				</div>	

				<div id="feed" class="modal" style="text-align: left">
					<!-- Modal content -->
					<div class="modal-content">
					  <div class="modal-header">
						<span class="close"></span>
						Feedback
					  </div>
						  
					  <div class="modal-body"></div>  
					  
					</div>
			    </div>



			</div>
			<!-- END: bottom_left div -->


		</div>
		<!-- END: left_side div -->
		
		<!-- BEGIN: right_side div -->
		<!-- Contains interval reading form -->
		<div id="right_side">
			<form id="interval_readings_form" target="dump_data_frame">
				<!-- Interval form category 1: Pedagogical Strategies -->
				<div id="Pedagogical_Strategies">

					<div id="timer" style="text-align: center;">Timer</div><br /><br />
					
					<div class="subheader">What's the instructor doing</div>
						<div class="checkbox-grid">
						  	<?php getfromcodebank(5, null) ?> 	 		
						</div>
				</div>
				<!-- Interval form category 2: Instructional Technologies -->
				<div id="Instructional Technologies">
					<div class="subheader">What's the instructor using</div>
					<div class="checkbox-grid">
						<?php getfromcodebank(7, null) ?>
					</div>
				</div>
				<!-- Interval form category 3: Student Engagement -->
				<div id="Student Engagement">
					<div class="subheader">What're students doing</div>
					<div class="checkbox-grid">
						<?php getfromcodebank(6, null) ?>
					</div>
				</div>
			</form>
		</div>
		<!-- END: right_side div -->
	</div>
	
	<form id="finalSubmit" style = "display:none" action="submit.php" method="post">
  		<input type="hidden" name="fullData" id="fullData" value="">
	</form>

</body>

<script>
        ; (function ($) {

            function clickHandler() {
                $(this).parents('.buton-cover').toggleClass('is_active');
            }

            $('.btn').on('click', clickHandler);

				}(jQuery));</script>
				
</html>
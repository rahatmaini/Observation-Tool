/* GLOBAL VARIABLES */

var hasStarted = false;	/* Boolean checking whether or not obs has already started*/
var itimer = 120; /* Interval timer usually set to 2 min*/
var myInterval; /* Interval timer object; instantiated in function start_or_stop() */
var delay;	/* Open feed delay time for animation */
var delay2;	/* Fading feed delay time for animation */
var intervalNum = 0;	/* Counts number of intervals that have passed */
var checkboxActivities = [];	/* Keeps track of interval form inputs that were checked per interval */
var allActivities = [];

/* Number of students in each section */
var SN1, SN2, SN3, SN4, SN5, SN6;
SN1 = SN2 = SN3 = SN4 = SN5 = SN6 = 0;

var currentActive;	/* Currently active event */
var currentDisabledDep;	/* Current disabled dependencies based on the active event */

/* HTML for comment pop up */
var commentHTML = `
<table style="width:auto; height:auto;">
<caption style="padding-top: 5%; font-weight:bold"> Comment </caption>
<tr>
<td><input type="text" id="theComment" name="theComment" placeholder="Comment here"></td>
</tr>
<tr>
<td style="padding-top:0"><button class="circularButton2" id="submitComment" style="font-size:initial" onclick="fetchComment()"><span class='ti-check' style='font-size: 70%;'></span></button></td>
</tr>
</table>
`;

/* Dimensions for grid in classroom display */
const NUM_ROWS = 10;
const NUM_COLUMNS = 30;






/* FUNCTIONS */
function fetchComment(){
	dataToFeed(event, document.getElementById('theComment').value, "INPUT")
	document.getElementById("commentPopup").style.display="none";
}

// "Shades" individual sections on the classroom div as a darker box
function shadeGrid(x1, y1, x2, y2, bid){
	
	var frame = document.getElementById('classroom_mapping');
	
	var height = y2 - y1;
	var width = x2 - x1;
	var x = x1+2;
	var y = NUM_ROWS - (height + y1);
	
	var box = document.createElement('div');
	
	box.id = bid;
	box.className = "classroom_box"
	box.style.backgroundColor = "rgba(98,86, 80, 0.5)";
	box.style.gridRow= y + " / span " + height;
	box.style.gridColumn = x + " / span " + width;
	box.style.border = "solid";

	box.onclick= function(){openClassInputs(bid,event)};
	frame.appendChild(box);
	
	console.log("(" + x + "," + y+"); height: " + height + "; width: " + width);
}

// Updates the feed everytime the student number of a section changes after the interval has started
function studentNumToFeed(num, option, option2){
	if(hasStarted){
		console.log("interval num: " + intervalNum);
		console.log(option);
		var content;
		if(option == 'keypress'){
			content = document.createTextNode("Section " + num + ": " + option2);
		}
		else if (option && intervalNum != 0) {
			content = document.createTextNode("Section " + num + " one added.");
			
		}
		else if (!option && intervalNum != 0) {
			content = document.createTextNode("Section " + num + " one removed.");
		}
		
		var modal = document.getElementsByClassName("modal-body");
		var br = document.createElement("br");
		date = new Date();
		var timeStamp = document.createTextNode("[" + twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes()) + ":" + twoDigits(date.getSeconds()) + "] ");
		modal[0].appendChild(timeStamp);
		modal[0].appendChild(content);
		modal[0].appendChild(br);
	}
}

// Enter number of students in a section via text field
function updateSNText(e, num){
	if(event.keyCode == 13){
		switch(num) {
			case 1:
				SN1 = e.value;
				studentNumToFeed(num,"keypress", SN1);
				break;
			case 2:
				SN2 = e.value;
				studentNumToFeed(num,"keypress", SN2);
				break;
			case 3:
				SN3 = e.value;
				studentNumToFeed(num,"keypress", SN3);
				break;
			case 4:
				SN4 = e.value;
				studentNumToFeed(num,"keypress", SN4);
				break;
			case 5:
				SN5 = e.value;
				studentNumToFeed(num,"keypress", SN5);
				break;
			case 6:
				SN6 = e.value;
				studentNumToFeed(num,"keypress", SN6);
				break;
		}
	}
}

// Increments or decrements number of students in a section
function updateStudentNum(obj, num){
	var id = "numStudentText" + num;
	var label = document.getElementById(id);
	if(obj.id == "more_students"){
		switch (num) {
		  case 1:
		    SN1++;
			label.value = SN1;
			console.log(label.value);
			studentNumToFeed(num, true, null);
		    break;
		  case 2:
			SN2++;
			label.value = SN2;
			studentNumToFeed(num, true, null);
			break;
		  case 3:
			SN3++;
			label.value = SN3;
			studentNumToFeed(num, true, null);
		    break;
		  case 4:
			SN4++;
			label.value = SN4;
			studentNumToFeed(num, true, null);
		    break;
		  case 5:
			SN5++;
			label.value = SN5;
			studentNumToFeed(num, true, null);
		    break;
		  case 6:
			SN6++;
			label.value = SN6;
			studentNumToFeed(num, true, null);
		}
	}else {
		switch (num) {
		  case 1:
		    if(SN1 > 0)SN1--;
			label.value = SN1;
			studentNumToFeed(num, false, null);
		    break;
		  case 2:
			if(SN2 > 0)SN2--;
			label.value = SN2;
			studentNumToFeed(num, false, null);
			break;
		  case 3:
			if(SN3 > 0)SN3--;
			label.value = SN3;
			studentNumToFeed(num, false, null);
			break;
		  case 4:
			if(SN4 > 0)SN4--;
			label.value = SN4;
			studentNumToFeed(num, false, null);
			break;
		  case 5:
			if(SN5 > 0)SN5--;
			label.value = SN5;
			studentNumToFeed(num, false, null);
			break;
		  case 6:
			if(SN6 > 0)SN6--;
			label.value = SN6;
			studentNumToFeed(num, false, null);
		}
	}
}

// Opens the input options for a classroom section
function openClassInputs(bid,event) {
	var sn;
	var snumstudents;
	switch (bid) {
	  case 1:
	    sn = SN1;
	    snumstudents = "numStudentLabel1";
	    break;
	  case 2:
		 sn = SN2;
		 snumstudents = "numStudentLabel2";
	    break;
	  case 3:
		 sn = SN3;
		 snumstudents = "numStudentLabel3";
	    break;
	  case 4:
		 sn = SN4;
		 snumstudents = "numStudentLabel4";
	    break;
	  case 5:
		 sn = SN5;
		 snumstudents = "numStudentLabel5";
	    break;
	  case 6:
		 sn = SN6;
		 snumstudents = "numStudentLabel6";
	}
	
	hideAll();
	ID = 's' + bid;
	//document.getElementById(snumstudents).innerHTML = sn;
	document.getElementById(snumstudents).childNodes[0].value = sn;
	
	var section = document.getElementById(ID);
	if(section.style.display == "none")
	{
		x=event.screenX-120;
		y=event.screenY-100;
        
		section.style.left=x+"px";
		section.style.top=y+"px";
		// section.style.bottom = window.innerHeight + 400;
		// section.style.left = window.innerWidth;
		section.style.display = "block";
		//section.innerHTML = htmlEdited; 
		var boxToUnhighlight=document.getElementsByClassName("classroom_box");
		for (var i = 0; i < boxToUnhighlight.length; i++) {
			boxToUnhighlight[i].style.borderColor = "#000";
		}
		var boxToHighlight=document.getElementById(bid);
		boxToHighlight.style.borderColor="#33b5e5";
	  
		
	}
	else
	{
		section.style.display = "none";
	}
		
}

// Displays comment pop up
function showCommentPopup(event)
{
	var commentPopup=document.getElementById("commentPopup")
	x = event.screenX-0;
	y = event.screenY-220;
	commentPopup.style.left = x + "px";
	commentPopup.style.top = y + "px";
	commentPopup.style.display="block"
	commentPopup.innerHTML=commentHTML;
}

// Close classroom section inputs
function hideAll() {
	var inputs = document.getElementsByClassName("class_section_input");
	for(var i = 0; i < inputs.length; i++){
		inputs[i].style.display = "none";
	}
}




// Set default values when tool loads
function setAllDefaultValues() {
	
	var allLabels = document.getElementsByTagName("label");
	for (var i = 0; i < allLabels.length; i++) {
		console.log(allLabels[i].className);
		allLabels[i].classList.add("disabled");
	}
	
	hasStarted = false;
	intervalNum = 0;
	SN1 = SN2 = SN3 = SN4 = SN5 = SN6 = 0;
	var inputs = document.getElementsByClassName("class_section_input");
	for (var i = 0; i < inputs.length; i++) {
	    inputs[i].style.display = "none";
	}
	
	// Reset forms
	inputs = document.getElementsByTagName("FORM");
	for (var i = 0; i < inputs.length; i++) {
	    inputs[i].reset();
	}
	// Disable checkboxes and other inputs other than the increment buttons
	inputs = document.getElementsByTagName("INPUT");
	for (var i = 0; i < inputs.length; i++) {
		if(/*inputs[i].className != "inS" && inputs[i].className != "inS_text" && */inputs[i].className !="studNumTextField")
			inputs[i].disabled = true;
	}
	
	inputs = document.getElementsByClassName("increment_stud");
	for (var i = 0; i < inputs.length; i++) {
	    inputs[i].style.display = "grid";
	}
	
	inputs = document.getElementById("timer");
	inputs.innerHTML = "&nbsp;";
	
	var startButton = document.getElementById("start_button");
	startButton.innerHTML = "<span class='ti-control-play' style='vertical-align: -2px'></span>";
	//startButton.className="pulse-button"
	startButton.style.backgroundColor = "";
	
	createBoxes();
}

// Stop button display shenanigans
function stopButtonMixup() {

	var nowCancelButton = document.getElementById("start_button");
	if (nowCancelButton.innerHTML != "cancel") {
		nowCancelButton.style.backgroundColor = "#f1f1f1";
		nowCancelButton.style.color = "#000";
		nowCancelButton.innerHTML = "cancel";

		var nowResetButton = document.getElementById("cancelStop");
		nowResetButton.style.backgroundColor = "#ff0000";
		nowResetButton.style.color = "#fff";
		nowResetButton.innerHTML = "<span class='ti-control-stop' style='vertical-align:-2px'></span>";
	}
	else {
		nowCancelButton.style.backgroundColor = "#ff0000";
		nowCancelButton.style.color = "#fff";
		nowCancelButton.innerHTML = "<span class='ti-control-stop' style='vertical-align:-2px'></span>";

		var nowResetButton = document.getElementById("cancelStop");
		nowResetButton.style.backgroundColor = "#f1f1f1";
		nowResetButton.style.color = "#000";
		nowResetButton.innerHTML = "cancel";
	}

}

// Button either functions as start or stop based on whether tool has already started
function start_or_stop() {
	if(!hasStarted){
		hasStarted = true;

		document.getElementById("start_button").setAttribute("title","Stop");
		document.getElementById("start_button").setAttribute("style", "");


		// If this is the very first time starting, submit number of students in each section to Feed
		var allLabels=document.getElementsByTagName("label");
		for (var i=0; i<allLabels.length; i++)
		{
			allLabels[i].classList.remove("disabled");
		}
		if (intervalNum === 0) {
			intervalNum += 1;
			var modal = document.getElementsByClassName("modal-body");
			var content = document.createTextNode("Section 1: " + SN1 + ", Section 2: " + SN2 + ", Section 3: " + SN3+ ", Section 4: " + SN4 + ", Section 5: " + SN5 + ", Section 6: " + SN6);
			var br = document.createElement("br");
			date = new Date();
			var timeStamp = document.createTextNode("[" + twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes()) + ":" + twoDigits(date.getSeconds()) + "] ");
			modal[0].appendChild(timeStamp);
			modal[0].appendChild(content);
			modal[0].appendChild(br);
		}

		var modal = document.getElementsByClassName("modal-body");
		var content = document.createTextNode("Observation Started.");
		var br = document.createElement("br");
		date = new Date();
		var timeStamp = document.createTextNode("[" + twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes()) + ":" + twoDigits(date.getSeconds()) + "] ");
		modal[0].appendChild(timeStamp);
		modal[0].appendChild(content);
		modal[0].appendChild(br);
		
		var inputs = document.getElementsByTagName("INPUT");
		for (var i = 0; i < inputs.length; i++) {
			//if(inputs[i].className != "inS" && inputs[i].className != "inS_text")
				inputs[i].disabled = false;
		}
		
		var startButton = document.getElementById("start_button");
		if (startButton.className=="pulse-button") startButton.className="circularButton";
		startButton.innerHTML = "<span class='ti-control-stop' style='vertical-align: -2px'></span>";
		startButton.style.backgroundColor = "red";
		myInterval = setInterval(runIntervalTimer, 1000);
	}
	else {
		document.getElementById("start_button").setAttribute("title", "Start");
		$('.btn2').parents('.buton-cover').toggleClass('is_active');
		document.getElementById("cancelStop").setAttribute("style", "");
		stopButtonMixup();
	}
	
}

function full_stop() {
	var theFrame=document.getElementById("classroom_mapping");
	while (theFrame.hasChildNodes()) {
		theFrame.removeChild(theFrame.firstChild);
	}

	var nowCancelButton = document.getElementById("initiallyReset");
	nowCancelButton.style.backgroundColor = "#232323";
	nowCancelButton.style.color = "#fff";
	nowCancelButton.innerHTML = "<span class='ti-reload' style='vertical-align:-2px'></span>";

	var nowResetButton = document.getElementById("initiallyCancel");
	nowResetButton.style.backgroundColor = "#f1f1f1";
	nowResetButton.style.color = "#000";
	nowResetButton.innerHTML = "cancel";

	nowCancelButton=document.getElementById("start_button");
	nowCancelButton.style.backgroundColor = "#ff0000";
	nowCancelButton.style.color = "#fff";
	nowCancelButton.innerHTML = "<span class='ti-control-stop' style='vertical-align:-2px'></span>";

	nowResetButton = document.getElementById("cancelStop");
	nowResetButton.style.backgroundColor = "#f1f1f1";
	nowResetButton.style.color = "#000";
	nowResetButton.innerHTML = "cancel";
	nowResetButton.setAttribute("onclick","full_stop()");
	nowCancelButton.setAttribute("onclick", "start_or_stop()");

	$('.btn2').parents('.buton-cover').toggleClass('is_active');



	setAllDefaultValues();
	var myNode = document.getElementsByClassName("modal-body");
	
	/* Put all text content in feed into hidden form */
	var data = document.getElementById("fullData");
	data.disabled = false;
	
	while (myNode[0].firstChild) {
		data.value += myNode[0].firstChild.textContent;
	    myNode[0].removeChild(myNode[0].firstChild);
	}
	
	clearInterval(myInterval);
	itimer = 120;
	
	document.getElementById("finalSubmit").submit();
}

function reload() {
	/*var theFrame=document.getElementById("classroom_mapping");
	while (theFrame.hasChildNodes()) {
		theFrame.removeChild(theFrame.firstChild);
	}

	var nowCancelButton = document.getElementById("initiallyReset");
	nowCancelButton.style.backgroundColor = "#232323";
	nowCancelButton.style.color = "#fff";
	nowCancelButton.innerHTML = "<span class='ti-reload' style='vertical-align:-2px'></span>";

	var nowResetButton = document.getElementById("initiallyCancel");
	nowResetButton.style.backgroundColor = "#f1f1f1";
	nowResetButton.style.color = "#000";
	nowResetButton.innerHTML = "cancel";
	setAllDefaultValues();
	var myNode = document.getElementsByClassName("modal-body");
	while (myNode[0].firstChild) {
	    myNode[0].removeChild(myNode[0].firstChild);
	}
	var persistingFeed = document.getElementById("persistingFeed").innerHTML="";
	clearInterval(myInterval);
	itimer = 120;*/
	location.reload();
}

function reactivateDropdowns() {
	var dropdowns = document.getElementsByClassName('dropdown-content');
	for (var i = 0; i < dropdowns.length; i++) {
		dropdowns[i].style.display = "";
	}
	var inputs = document.getElementsByClassName('class_section_input');
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].style.display = "none";
			}


}
var rotated = false;
function rotateIcon() {

	

	var icon = document.getElementById('icon'),
	deg = rotated ? 0 : 180;

	icon.style.webkitTransform = 'rotate(' + deg + 'deg)';
	icon.style.mozTransform = 'rotate(' + deg + 'deg)';
	icon.style.msTransform = 'rotate(' + deg + 'deg)';
	icon.style.oTransform = 'rotate(' + deg + 'deg)';
	icon.style.transform = 'rotate(' + deg + 'deg)';

	rotated = !rotated;

}


function dataToFeed(event, obj, extra1) {
	if(hasStarted){
		var dropdowns = document.getElementsByClassName('dropdown-content');
		for (var i = 0; i < dropdowns.length; i++) {
			dropdowns[i].style.display = "none";
		}
		if (event.target.id == 'popupButton') {
			var inputs = document.getElementsByClassName('class_section_input');
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].style.display = "none";
			}
			console.log(event.target);

		}
		var myNode = document.getElementsByClassName("fadingFeed");
		var nodeName = obj.nodeName;

		while (myNode[0].firstChild) {
			myNode[0].removeChild(myNode[0].firstChild);
		}

	    var fullTextContent = '';
		if(extra1 != null){
			fullTextContent += ("Section " + extra1 + ": ");
		}
		fullTextContent += obj.textContent;


		
		var modal = document.getElementsByClassName("modal-body");
		var notification = document.getElementsByClassName("fadingFeed");
		
		if (extra1=="INPUT")
		{
			var content = document.createTextNode("Observer Comment: " + document.getElementById('theComment').value);
		}
		else
		{
			var content = document.createTextNode(fullTextContent);
		}
		
		var notificationContent = document.createTextNode(obj.textContent);
		
		var br = document.createElement("br");
		date = new Date();
		var timeStamp = document.createTextNode("[" + twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes()) + ":" + twoDigits(date.getSeconds()) + "] ");
		
		
		if (nodeName === "INPUT") {
			if (obj.checked) {
				checkboxActivities.push(obj.getAttribute('id'));
				allActivities.push(obj.getAttribute('id').toString());
				// modal[0].appendChild(timeStamp);
				// modal[0].appendChild(document.createTextNode(obj.getAttribute('id')));
				// modal[0].appendChild(br);
				// notification[0].appendChild(checkNotification);
			}
			else { 
				checkboxActivities.splice(checkboxActivities.indexOf(obj.getAttribute('id')), 1);
				allActivities.splice(allActivities.indexOf(obj.getAttribute('id')), 1);
			// 	var uncheckNotification = document.createTextNode("Unchecked " + obj.getAttribute('id'));
			// 	modal[0].appendChild(timeStamp);
			// 	modal[0].appendChild(document.createTextNode("Unchecked " + obj.getAttribute('id')));
			// 	modal[0].appendChild(br);
			// 	notification[0].appendChild(uncheckNotification);
			}
		}	
		else {
			modal[0].appendChild(timeStamp);
			modal[0].appendChild(content);
			modal[0].appendChild(br);
			
			/* Feed that shows current activity */
			if(event.target.classList.contains("event"))
				notification[0].appendChild(notificationContent);
			
			/* Feed that shows event */
			if(event.target.classList.contains("activity"))
				document.getElementById("persistingFeed").innerHTML=String(obj.textContent);
			
			allActivities.push(notificationContent.wholeText);
		}
		
		
		//openFeed(event);
		fadeFeedHandler(event);
	}
}

// Fading feed
function fadeFeedHandler(event) {
	clearTimeout(delay2);
	$(".fadingFeed").fadeIn()
	delay2 = setTimeout(function(){ $(".fadingFeed").fadeOut(); }, 2000);
	event.stopPropagation();
}

// Open feed modal
function openFeed(event) 
{
	// Get the modal
	clearTimeout(delay);
	var modal = document.getElementById('feed');
	// Get the button that opens the modal
	var btn = document.getElementById("feed_button");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	var displaySetting = modal.style.display;
	// When the user clicks the button, open the modal 
	//btn.onclick = function() {
		modal.style.display = "block";
	//}
	// When the user clicks on <span> (x), close the modal
	//span.onclick = function() {
		//modal.style.display = "none";
	//}

	// When the user clicks anywhere outside of the modal, close it
	/*if(displaySetting == "block"){
		window.onclick = function(event) {
		//if (event.target == modal) {
			modal.style.display = "none";
		//}
		}
	}
	else {
		modal.style.display = "block";
	}*/
	updateScroll();
	console.log(event.toElement.tagName);
	if(event.toElement.tagName != "SPAN" && event.toElement.tagName != "BUTTON")
		delay = setTimeout(function(){ modal.style.display = "none"; }, 3000);
	event.stopPropagation();
	
}

// Run the interval timer 
function runIntervalTimer() {
	if(hasStarted){
		var min = Math.floor(itimer / 60);
		var sec = twoDigits(itimer % 60);
		document.getElementById("timer").innerHTML = "";
		if (itimer <= 30 && itimer > 0){
			document.getElementById("timer").setAttribute("style","text-align: center; -webkit-animation: pulseText 1.8s infinite")
		}
		else{
			document.getElementById("timer").setAttribute("style", "text-align: center")
		}
		//if(itimer <= 120 && itimer != 0)
			document.getElementById("timer").innerHTML = "Next in: " + min + ":" + sec;
		if(itimer == 0){
			/* Submit interval readings every time timer reaches 0*/
			intervalSubmit();
			document.getElementById("timer").innerHTML = "Interval submitted!";
			itimer = 120;
		}
		else {
			itimer = itimer -1;
		}
	}
}

// Whenever anything on screen is clicked, close certain inputs */
window.onclick = function(event) {
	
	var modal = document.getElementById('feed');
	modal.style.display = "none";
		
	if (event.target.className != 'classroom_box' && event.target.className != 'studNumTextField' && event.target.id != 'comment_button' && event.target.id != 'more_students' && event.target.id != 'less_students' && event.target.id != 'theComment'){
		var boxToUnhighlight = document.getElementsByClassName("classroom_box");
		for (var i = 0; i < boxToUnhighlight.length; i++) {
			boxToUnhighlight[i].style.borderColor = "#000";
		}
			var inputs = document.getElementsByClassName('class_section_input');
			for (var i = 0; i < inputs.length; i++) {
			    inputs[i].style.display = "none";
			}
			document.getElementById("commentPopup").style.display="none"
			console.log(event.target);
		}

		
	
}

// Feed modal is always scrolled down to the latest print statement
function updateScroll(){
    var element = document.getElementsByClassName("modal-body");
    element[0].scrollTop = element[0].scrollHeight;
}

// Get two digits from time variable
function twoDigits(x) {
	return ("0" + x).slice(-2);
}

// Reset button display shenanigans
function resetButtonMixup() {

	var nowCancelButton=document.getElementById("initiallyReset");
	if (nowCancelButton.innerHTML!="cancel")
	{
		nowCancelButton.style.backgroundColor = "#f1f1f1";
		nowCancelButton.style.color = "#000";
		nowCancelButton.innerHTML = "cancel";

		var nowResetButton = document.getElementById("initiallyCancel");
		nowResetButton.style.backgroundColor = "#232323";
		nowResetButton.style.color = "#fff";
		nowResetButton.innerHTML = '<span class="ti-reload" style="vertical-align: -2px"></span>';
	}
	else{
		nowCancelButton.style.color = "#fff";
		nowCancelButton.style.backgroundColor = "#232323";
		nowCancelButton.innerHTML = '<div id="icon"><span class="ti-reload" style="vertical-align: -2px"></span></div>';
		var nowResetButton = document.getElementById("initiallyCancel");
		nowResetButton.style.backgroundColor = "#f1f1f1";
		nowResetButton.style.color = "#000";
		nowResetButton.innerHTML = "cancel";
	}
	
}

/* Submit interval form and reset it */
function intervalSubmit() {
	var intForm = document.getElementById("interval_readings_form");
	intForm.submit();
	intForm.reset();
	
	// Print interval data into feed
	var modal = document.getElementsByClassName("modal-body");
	var content = document.createTextNode("Interval submitted. " + checkboxActivities.toString());
	var br = document.createElement("br");
	date = new Date();
	var timeStamp = document.createTextNode("[" + twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes()) + ":" + twoDigits(date.getSeconds()) + "] ");
	modal[0].appendChild(timeStamp);
	modal[0].appendChild(content);
	modal[0].appendChild(br);

	checkboxActivities = [];
	console.log(allActivities.toString());
}


/* Check dependencies whenever activity is active (clicked) */
$(document).ready(function(){
	
	  $('.code').on('click', function() {
		 checkDependencies(this.id);
		 return false;
	  });
	
});

/* Actual check dependencies function with ajax call */
function checkDependencies(ID){
	if(hasStarted){
	console.log("inside check dependencies 2.0");
	/* Make post request to database to check dependencies of activity */
	$.ajax({
	    type: "POST",
	    url: 'db.php',
	    /*dataType: 'json',*/
	    data: "function=getDependencies&ID=" + ID,

	    success: function (result) {
	    			
	    			jBody = JSON.parse(result);
	    			
	    			if(true){
		    			/* Renable previously disabled dependencies before disabling new ones */
		    			if(currentActive != null){
		    				currentActive.style.backgroundColor = "";
		    				currentActive.style.color = "";
		    			}
		    			if(currentDisabledDep != null){
		    				for(var i = 0; i < currentDisabledDep.length; i++){
		    					var item = document.getElementById(currentDisabledDep[i]);
		    					var classItem = document.getElementsByClassName(currentDisabledDep[i]);
		    					
		    					if(classItem != null && classItem.length >  0){
		    						for(var j = 0; j < classItem.length; j++){
			    						classItem[j].disabled = false;
			    					}
		    					}
		    					else if(item != null){
			    					if(item.tagName == "INPUT"){
											item.disabled = false;
										  	item.parentNode.classList.remove("disabled");
			    					}
			    					else if(item.tagName == "A"){
			    						   item.style.backgroundColor = "";
											item.style.color = "";
											item.style.cursor = "pointer";
											item.setAttribute('onclick', 'dataToFeed(event, this, null)'); item.style.backgroundColor = "";
			    					}
			    				}
			    					
		    				}
		    			}
		    			currentDisabledDep = [];
		    			console.log(jBody.depArray);
	    			
		    			// Active item indicator
		    			var active_item = document.getElementById(jBody.active);
		    			active_item.style.backgroundColor = "blue";
		    			active_item.style.color = "white";
		    			currentActive = active_item;
		    			
		    			for(var i=0; i < jBody.depArray.length; i++){
		    				
		    				var item = document.getElementById(jBody.depArray[i]);
		    				var classItem = document.getElementsByClassName(jBody.depArray[i]);
		    				
		    				if(classItem != null && classItem.length >  0){
		    					for(var j = 0; j < classItem.length; j++){
		    						classItem[j].disabled = true;
		    					}
		    					//console.log("class: " + jBody.depArray[i] + "; length: " + classItem.length);
		    					currentDisabledDep.push(jBody.depArray[i]);
		    				}
		    				else if(item != null){
		    					//console.log(item.tagName);
		    					if(item.tagName == "INPUT"){
										item.disabled = true;
									  	item.parentNode.classList.add("disabled");
		    					}
		    					else if(item.tagName == "A"){
		    							
		    							item.style.backgroundColor = "#f1f1f1";
										item.style.color = "#b0b0b0";
										item.style.cursor = "default";
										item.setAttribute('onclick', '');

		    						//item.style.visibility = "hidden";
		    					}
		    					currentDisabledDep.push(jBody.depArray[i]);
		    				}
		    			}
	    			}
	    			//console.log(currentDisabledDep);
	            },
		error: function (){
			console.log("Check dependencies request has failed.");
		}
	});
	}
}



/* TBD: submenus (currently not in use) */
function showSubmenu(menuID) {
	//document.getElementsByClassName("dropdown2-content")[0].style.display = "inline-block";
	//console.log("done")
	document.getElementById(menuID).style.display = "inline-block";
	//alert(menuID);
}

function hideSubmenu(menuID) {
	document.getElementById(menuID).style.display = "none";
	//console.log("done")
}
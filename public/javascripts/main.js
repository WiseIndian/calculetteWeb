/*
* taken from 
* https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric/1830844#1830844
* Used to test whether a value contains a numeric value or not.
*/
function isNumeric(n) { 
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/*
*this function sends the number in the input fields to the server
* and puts the result back into the result field.
*/
function sendNumbers() {
		var xVal = 
			document
			.getElementById("x")
			.value;
		var yVal =
			document
			.getElementById("y")
			.value;
		if (xVal && yVal && isNumeric(xVal) && isNumeric(yVal)) {
			var xmlReq = createPOSTRequest();
			var str_json = JSON.stringify(
				{x: parseFloat(xVal), y: parseFloat(yVal)}
			);
			xmlReq.send(str_json);
		} else if (xVal && yVal) { /*the case where one of x or y is not a number but none of the inputs are empty.*/
			setWrongInputInfo();
		} else { /*else x or y are empty*/
			document
			.getElementById("resultContainer")
			.innerHTML = '';
		}
}

function setWrongInputInfo() {
	document
	.getElementById("resultContainer")
	.innerHTML = "wrong input: use numbers";
}

/*
* returns a preconfigured new XML POST request that can be sent to the remote restful server.  
* The user of the XML POST request still needs to specify the numbers in a json object
* that are supposed to added by the remote server.
*/
function createPOSTRequest() {
	var req = new XMLHttpRequest();
	req.open("POST", window.location.href+"result", true);
	req.setRequestHeader("Content-type", "application/json");
	req.onreadystatechange = function() {
		if (this.readyState == XMLHttpRequest.DONE 
			&& this.status == 200) { /*OK*/
			var result = this.response;

			document
			.getElementById("resultContainer")
			.innerHTML = result;
		} else if (this.readyState == XMLHttpRequest.DONE
				&& this.status == 400) { /*BAD REQUEST*/
			setWrongInputInfo();
			/*
			* this could happen if the wrong character is used to create
			* decimal numbers like for example: 17.57 if the server is using
			* the french local characters.
			*/
		} 
	};

	return req;
}


var fieldsName = ["x", "y"];

/*
 * the basic idea is that everytime the user changes a value in the input
 * fields, we call a function that sends the number to the remote server.
 * Which explains the addEventListener("input",...)
 */
document.addEventListener("DOMContentLoaded", function(event) { 
	fieldsName.forEach(function(id) {
		document
		.getElementById(id)
		.addEventListener("input", sendNumbers);
	});
	
});

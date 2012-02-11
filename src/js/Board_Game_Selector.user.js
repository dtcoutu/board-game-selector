// ==UserScript==
// @name           Board Game Selector
// @namespace      http://userscripts.org/
// @description    Provide a view ontop of the Board Game Geek xmlapi for selecting a game from a users collection.
// @include        http://boardgamegeek.com/collection/user/*
// ==/UserScript==
/*
     Copyright 2012 David T. Coutu
     
     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at
     
     	http://www.apache.org/licenses/LICENSE-2.0
     
     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License. 
 */

 /*
 * Add a style tag to the page.
 */
function addStyle(css)
{
	var head, style;
	head = document.getElementsByTagName("head")[0];
	if (!head) { return; }
	style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = css;
	head.appendChild(style);
}

/*
 * This is to create a checkbox that displays the board game selector form and data.
 */
function createEnablingCheckbox(elementToAppendTo) {
	var enableDiv = document.createElement("div");
	enableDiv.id = "bgsEnable";
	var enableSelectorCheckbox = document.createElement("input");
	enableSelectorCheckbox.type = "checkbox";
	enableSelectorCheckbox.addEventListener("click", toggleBGS, false);
	enableDiv.appendChild(enableSelectorCheckbox);
	
	var enableSelectorText = document.createTextNode("Enable Game Selector");
	enableDiv.appendChild(enableSelectorText);
	
	elementToAppendTo.appendChild(enableDiv);
	//TODO: Need javascript for checkbox
}

function toggleBGS() {
	var element = document.getElementById("bggUser");
	if (element.style.display == 'none') {
		element.style.display = '';
	} else {
		element.style.display = 'none';
	}
}

function createBGGUserText(elementToAppendTo) {
	var bggUserDiv = document.createElement("div");
	bggUserDiv.id = "bggUser";
//	bggUserDiv.style.display = "none";
	
	bggUserDiv.appendChild(document.createTextNode("BGG Username"));
	
	var bggUsername = document.createElement("input");
	bggUsername.id = "bggUsername";
	bggUsername.type = "text";
	bggUserDiv.appendChild(bggUsername);
	
	var bggUsernameSubmit = document.createElement("input");
	bggUsernameSubmit.id = "bggUsernameSubmit";
	bggUsernameSubmit.type = "submit";
	bggUsernameSubmit.value = "Get User Collection";
	bggUsernameSubmit.addEventListener("click", getUserCollection, false);
	bggUserDiv.appendChild(bggUsernameSubmit);
	
	elementToAppendTo.appendChild(bggUserDiv);
}

function getUserCollection() {
	alert("bggUsername = " + document.getElementById("bggUsername").value);
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://boardgamegeek.com/xmlapi/collection/' + document.getElementById("bggUsername").value + "?own=1",
		headers: {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey/0.3',
			'Accept': 'application/atom+xml,application/xml,text/xml',
		},
		onload: function(responseDetails) {
			var parser = new DOMParser();
			var dom = parser.parseFromString(responseDetails.responseText,
				"application/xml");
			var entries = dom.getElementsByTagName('item');
			var title;
			for (var i = 0; i < entries.length; i++) {
				title = entries[i].getElementsByTagName('name')[0].textContent;
				alert(title);
			}
		}
	});
}

function createGameDisplay(gameItems) {
}

var bgsDiv = document.createElement("div");
createEnablingCheckbox(bgsDiv);
createBGGUserText(bgsDiv);


var mainContent = document.getElementById("maincontent");
var tables = mainContent.getElementsByTagName("table");

mainContent.insertBefore(bgsDiv, tables[1]);


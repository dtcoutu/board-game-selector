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
// commenting out to make testing easier.
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
			createGameDisplay(entries);
		}
	});
}

function createGameDisplay(gameItems) {
	var gameDiv = document.createElement("div");
	gameDiv.id = "games";
	
	var gameTable = document.createElement("table");
	gameDiv.appendChild(gameTable);
	
	// Create Headers
	var gameRow = document.createElement("tr");
	gameRow.appendChild(createGameDisplayColumnHeader("Name"));
	gameRow.appendChild(createGameDisplayColumnHeader("Players"));
	gameRow.appendChild(createGameDisplayColumnHeader("Playing Time"));
	gameRow.appendChild(createGameDisplayColumnHeader("User Rating"));
	gameRow.appendChild(createGameDisplayColumnHeader("BGG Rating"));
	
	gameTable.appendChild(gameRow);
	var gameDataText;
	var gameStatTag;
	var gameRatingTag;
	for (var i=0; i<gameItems.length; i++) {
		gameRow = document.createElement("tr");
		gameRow.appendChild(createGameDisplayColumnData(gameItems[i].getElementsByTagName("name")[0].textContent));
		
		gameStatTag = gameItems[i].getElementsByTagName("stats")[0];
		gameDataText = gameStatTag.getAttribute("minplayers") + "-" + gameStatTag.getAttribute("maxplayers");
		gameRow.appendChild(createGameDisplayColumnData(gameDataText));
		
		gameRow.appendChild(createGameDisplayColumnData(gameStatTag.getAttribute("playingtime")));
		
		gameRatingTag = gameStatTag.getElementsByTagName("rating")[0];
		gameRow.appendChild(createGameDisplayColumnData(gameRatingTag.getAttribute("value")));
		
		gameRow.appendChild(createGameDisplayColumnData(gameRatingTag.getElementsByTagName("average")[0].getAttribute("value")));
		
		gameTable.appendChild(gameRow);
	}
	
	var selectorDiv = document.getElementById("boardGameSelector");
	selectorDiv.appendChild(gameDiv);
}

function createGameDisplayColumnData(columnDataText) {
	var columnData = document.createElement("td");
	columnData.appendChild(document.createTextNode(columnDataText));
	
	return columnData;
}

function createGameDisplayColumnHeader(columnName) {
	var columnHeader = document.createElement("th");
	columnHeader.appendChild(document.createTextNode(columnName));
	
	return columnHeader;
}

var bgsDiv = document.createElement("div");
bgsDiv.id = "boardGameSelector";
createEnablingCheckbox(bgsDiv);
createBGGUserText(bgsDiv);


var mainContent = document.getElementById("maincontent");
var tables = mainContent.getElementsByTagName("table");

mainContent.insertBefore(bgsDiv, tables[1]);


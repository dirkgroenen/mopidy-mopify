/*
	Mopify is a Mopify webclient based on Spotify's web player design.
    Copyright (C) 2013 - Dirk Groenen [Bitlabs Development]
	
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var mopidy = new Mopidy();  // Connect to server
var consoleError = console.error.bind(console);
var mopifyversion = '1.0';

// Global vars
var coreArray = new Array();
var browserLang;

// Echonest
var echonest = new EchoNest("UVUDDM7M0S5MWNQFV");

// Setup the listeners and coreArray vars. This function runs at the start so we also include some functions here that need to run at the start
var setupVars = function(){
	// Get the users playlists
	mopidy.playlists.getPlaylists().then(function(lists){
		coreArray['playlists'] = lists;
	}, consoleError);
	
	// Check current track and TlTrack every second
	setInterval(function(){
		mopidy.playback.getCurrentTrack().then(function (track) {
			coreArray['currentTrack'] = track;
		}, consoleError);
	},1000);
	
	// Check the current time position of a track every second
	setInterval(function(){
		mopidy.playback.getTimePosition().then(function (pos) {
			coreArray['currentTrackPos'] = pos;
		}, consoleError);
	},1000);

	// On track resumed (gets the TL track)
	mopidy.on("event:trackPlaybackResumed" ,function(track){
		initNewTlTrack(track.tl_track);
	});
	
	// On start of a new track (gets the TL track)
	mopidy.on("event:trackPlaybackStarted" ,function(track){
		initNewTlTrack(track.tl_track);
	});
	
	// Volume changed
	mopidy.on("event:volumeChanged" ,function(vol){
		coreArray['volume'] = vol;
		checkPlayerVolume();
	});
	
	// Store the state on a playback state change
	mopidy.on("event:playbackStateChanged" ,function(obj){
		var state = obj.new_state;
		
		coreArray['state'] = state;
			
		// Do a direct check on the player        
		if(state != "playing"){
			$("#playerwrap #controls #playpause").html('play');
		} 
		else{
			$("#playerwrap #controls #playpause").html('pause');
			
			// If its playing and a meta page is open, make sure that page is aligned to the left so the player is visible
			var pageurl = window.location.hash.split('/');
			if(pageurl[0] == "#meta"){
				$("#metapage").css({right: $("#currentsong").width()});
				$("#pagewrapoverlay").css({width: 'calc(100% - '+($("#currentsong").width()+$("#sidebar").width())+'px)'});
			}
		}
	});
	
	// Manually ask the playback state, since we only get the new state on a change with the above listener.
	mopidy.playback.getState().then(function (state) {
		coreArray['state'] = state;
		
		// Do a direct check on the player        
		if(state != "playing"){
			$("#playerwrap #controls #playpause").html('play');
		}
		else{
			$("#playerwrap #controls #playpause").html('pause');
			
			// If its playing and a meta page is open, make sure that page is aligned to the left so the player is visible
			var pageurl = window.location.hash.split('/');
			if(pageurl[0] == "#meta"){
				$("#metapage").css({right: $("#currentsong").width()});
				$("#pagewrapoverlay").css({width: 'calc(100% - '+($("#currentsong").width()+$("#sidebar").width())+'px)'});
			}
		}
	}, consoleError);
	
	// On change of options like shuffle and random
	mopidy.on("event:optionsChanged", function(){
		mopidy.tracklist.getRepeat().then(function(val){
			coreArray['repeat'] = val;
		}, consoleError);
		mopidy.tracklist.getRandom().then(function(val){
			coreArray['random'] = val;
		}, consoleError);
		
		checkRepeatShuffle();
	});
}

// Below we add the functions that need to run on the start of the client, these functions need information from the coreArray[currentTrack].
function startupData(){
	// The above function only gets the track on a change. We also want the track at the start so let's call that function here
	mopidy.playback.getCurrentTlTrack().then(function (track) {
		coreArray['currentTLTrack'] = track;
	}, consoleError);

	// Get volume
	mopidy.playback.getVolume().then(function(vol){
		coreArray['volume'] = vol;
		checkPlayerVolume();
	},consoleError);

	if(coreArray['currentTrack'] != undefined){
		mopidy.tracklist.getRepeat().then(function(val){
			coreArray['repeat'] = val;
			checkRepeatShuffle();
		}, consoleError);
		mopidy.tracklist.getRandom().then(function(val){
			coreArray['random'] = val;
			checkRepeatShuffle();
		}, consoleError);
	
		changePageTitle();
		placeCurrentSongInfo();
		
		// Get artwork for the current playing or selected track
		getAlbumCoverByDom($("#currentsong img.art"),coreArray['currentTrack'].uri);
	}
	else{
		setTimeout(startupData,500);
	}
}

// Get the cover of an album or song async. Functions requires two elements: spotify URI and the dom of the IMG element.
function getAlbumCoverByDom(dom,spotifyUri){
	// Check cache
	var img = null;
	if(spotifyUri.search("spotify") != -1){
		if(localStorage.getItem(spotifyUri)){
			dom.attr('src',localStorage.getItem(spotifyUri));
		}
		else{
			$.getJSON("https://embed.spotify.com/oembed/?url="+spotifyUri+"&callback=?", function(data){
				//localStorage.setItem(spotifyUri, data.thumbnail_url);
				dom.attr('src',data.thumbnail_url);
			});
		}
	}
	else{
		dom.attr('src',"/mopify/images/no-album-art.jpg");
	}
}

// Get a picture of the artist from LastFM. Like AlbumCoverByDom this functions also requires the dom element so it can place the image async
function getLastFMImage(dom,artistname){
	var url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+ artistname.replace(' ','+')+"&api_key=c57585a2e7b83892aad0cdca5296c46c&format=json";
	if(localStorage.getItem(artistname)){
		var object = JSON.parse(localStorage.getItem(artistname));
		dom.attr('src',object.image[4]['#text']);
	}
	else{
		$.getJSON(url, function(data){
			localStorage.setItem(artistname, data.artist.image[4]['#text']);
			dom.attr('src',data.artist.image[4]['#text']);
			
			localStorage.setItem(artistname, JSON.stringify(data.artist));
		});
	}
}

// Join the array of artists with a ', '
function joinArtists(artists){
	return artists.map(function(elem){return elem.name;}).join(', ');
}

// Change the value of the page title into the current playing song
function changePageTitle(){
	var currentTrack = coreArray['currentTLTrack'].track;
	var playSymbol = (coreArray['state'] == "playing") ? '\u25B6 ' : '';
	
	document.title = (currentTrack.artists != undefined) ? playSymbol+currentTrack.name+' - '+currentTrack.artists[0].name : "Mopify";
}

// Place the artist name in the currentrack within the player
function placeCurrentSongInfo(){
	var currentTrack = coreArray['currentTLTrack'].track;
	$("#currentsong #meta .title").html(currentTrack.name);
	if(currentTrack.artists != undefined) $("#currentsong #meta .artist").html(currentTrack.artists[0].name);
}

// Core function, will run on the start of the client
var seeked = false;
function core(){	
	if(coreArray['currentTrack'] != null && coreArray['currentTLTrack'] != null){
		currentTrack = coreArray['currentTLTrack'].track;
		
		// Fill timebar
		var seekBarTimeout = null;		
		var songLength = currentTrack.length;
		var curLength = coreArray['currentTrackPos'];
		var songTimePerc = (seeked) ? songTimePerc : Number(Number((curLength/songLength)*100).toFixed(2));
		
		// Bind the slider and seek function
		$( "#timebarwrap").slider({
			value: songTimePerc,
			orientation: "horizontal",
			range: "min",
			animate: false,
			slide: function(event, ui) { 	
				seeked = true;
				clearTimeout(seekBarTimeout);
				seekBarTimeout = setTimeout(function(){
					mopidy.playback.seek(songLength*(ui.value/100)).then(function(val){
						seeked = (val) ? false : true;
					});
					currentTrack.trackPosition = songLength*(ui.value/100);
				},1000);
			}
		});	
	}
	
	// Repeat this core function every second to update values
	setTimeout(core,1000);
}

// Set options (shuffle and repeat) in player
function checkRepeatShuffle(){
	(coreArray['random'] == true) ? $("#options #shuffle").addClass('active') : $("#options #shuffle").removeClass('active');
	(coreArray['repeat'] == true) ? $("#options #repeat").addClass('active') : $("#options #repeat").removeClass('active');
}

function checkPlayerVolume(){
	// Set the volume icon on the correct value
	if(coreArray['volume'] == 0){
		$("#currentsong #options #volume").html("volume");
	}
	else if(coreArray['volume'] < 50){
		$("#currentsong #options #volume").html("lowvolume");
	}
	else{
		$("#currentsong #options #volume").html("highvolume");
	}
}

// Take care of the paging system
function paging(){	
	// Open the correct page when a menu item is clicked
	$(".menu li.openpage").click(function(){
		showPage($(this).find('a').attr('href'));
	});
	
	// Open the search window on Search click
	$(".menu li.opensearch a").click(function(e){
		$("#searchwindow").toggleClass('open');
		$(this).toggleClass('active');
		$("#searchwindow input").focus();
		e.preventDefault();
	});
	
	// Check the page URL
	var pageurl = window.location.hash.split('/');
	if(pageurl[0] == "#meta"){
		if(pageurl[1] == 'track'){
			openMetapage(pageurl[1],pageurl[2],pageurl[3]);
		}
		else{
			openMetapage(pageurl[1],pageurl[2]);
		}
	}
	else{
		showPage(pageurl[0]);
	}
}

// Show the correct page
function showPage(page){
	page = page.replace('#','');
	$("#pagecontent .singlepage").hide();
	$("#pagecontent .singlepage[data-page='"+page+"']").show();
	
	$(".menu li a").removeClass('active');
	$(".menu li a[href='#"+page+"']").addClass('active');
}

// Open the metapage (artists and albums). The functions are placed in the metapagebuilder.js file
function openMetapage(type,uri,trackuri){
	$("#searchwindow").removeClass('open');
	$(".menu .opensearch a").removeClass('active');
	$("#metapage,#pagewrapoverlay").addClass('open');
	$("#metapage").addClass('loading');
	
	$("#metapage #albumpage,#metapage #artistpage").hide();
	
	// Remove old tracks before we append the new one
	$("#metapage #albumpage #tracks table tr.track").remove();
	
	// Change the url
	window.location.hash = (trackuri == undefined) ? "#meta/"+type+"/"+uri : "#meta/"+type+"/"+uri+"/"+trackuri;
	
	switch(type){
		case "album":
			$("#metapage #albumpage").show();
			getMetaAlbums(type,uri,trackuri);
			break;
		case "artist":
			$("#metapage #artistpage").show();
			getMetaArtists(uri);
			break;
		case "track":
			$("#metapage #albumpage").show();
			getMetaAlbums(type,uri,trackuri);
			break;
	}
	
	
	// Check elements that should close the metapage
	$("#sidebar,#pagewrapoverlay").click(function(){
		hideMetapage();
	});
}

// Convert MS to Seconds
function secondsToString(seconds){
	var seconds = seconds/1000;
	var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
	var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;	
	numseconds = (numseconds.toString().length < 2) ? '0'+numseconds : numseconds;
	
	return numminutes+':'+numseconds;
}

// Ask the user for his country in a prompt
function askBrowserLanguage(){
	browserLang = localStorage.getItem('browserLanguage');
	if(browserLang == undefined || browserLang == 'null'){
		var promptQuestion = prompt("It looks like you haven't set your country. To provice better search results we need your 2 letter (ISO_3166-1_alpha-2) country code.","For example: GB,NL,AU etc.");
		while(promptQuestion.length != 2){
			promptQuestion = prompt("A country code should by 2 letters. More information can be found on http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2.","For example: GB,NL,AU etc.");
		}
		
		localStorage.setItem('browserLanguage', promptQuestion.toUpperCase().trim());
		browserLang = promptQuestion.toUpperCase().trim();
		showNotification("Language set on: "+browserLang);
	}
}

// Show a notification 
function showNotification(msg){
	$("#notification").addClass('active');
	$("#notification").html(msg);
	setTimeout(function(){
		$("#notification").removeClass('active');
	},5000);
}

// Function that replaces the current tracklist with new ones
function replaceAndPlay(newTracks,trackID){
	mopidy.tracklist.clear().then(function(){
		mopidy.tracklist.add(newTracks).then(function(){
			mopidy.tracklist.getTlTracks().then(function(tracks){
				mopidy.playback.play();
				mopidy.playback.changeTrack(tracks[trackID]);
			});
			fillTracklist();
		},consoleError);
	});
}

// This is the most important part. Here we start all the functions
mopidy.on("state:online", function () {
	setupVars();
	core();
	paging();
	startupData();
	
	// Ask/check browser language
	askBrowserLanguage();
	
	// Show that we are connected with the mopidy server
	showNotification("Connected with Mopidy server");
});

// On reconnecting
mopidy.on("reconnecting", function(){
	showNotification("Reconnecting to server");
});

// On state offline
mopidy.on("state:offline", function(){
	showNotification("Hmm, it looks like we have no connection to the sever");
});
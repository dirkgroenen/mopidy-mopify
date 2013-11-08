var mopidy = new Mopidy();  // Connect to server
var consoleError = console.error.bind(console);
var mopifyversion = '1.0';

// Global vars
var coreArray = new Array();
var browserLang;

var setupVars = function(){
	//Setup playlists
	mopidy.playlists.getPlaylists().then(function(lists){
		coreArray['playlists'] = lists;
	}, consoleError);
	
	setInterval(function(){
		mopidy.playback.getCurrentTrack().then(function (track) {
			coreArray['currentTrack'] = track;
		}, consoleError);
	},1000);
	
	setInterval(function(){
		mopidy.playback.getCurrentTlTrack().then(function (track) {
			coreArray['currentTLTrack'] = track;
		}, consoleError);
	},1000);
	
	setInterval(function(){
		mopidy.playback.getTimePosition().then(function (pos) {
			coreArray['currentTrackPos'] = pos;
		}, consoleError);
	},1000);
	
	setInterval(function(){
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
	},1000);
	
	setInterval(function(){
		mopidy.playback.getVolume().then(function (vol) {
			coreArray['volume'] = vol;
		}, consoleError);
	},1000);
	
	setInterval(function(){
		mopidy.playback.getRandom().then(function(val){
			coreArray['random'] = val;
		}, consoleError);
	},1000);
	
	setInterval(function(){
		mopidy.playback.getRepeat().then(function(val){
			coreArray['repeat'] = val;
		}, consoleError);
	},1000);
}

function getAlbumCover(spotifyUri){
	// Check cache
	if(spotifyUri.search("spotify") != -1){
		if(localStorage.getItem(spotifyUri)){
			return localStorage.getItem(spotifyUri);
		}
		else{
			$.getJSON("https://embed.spotify.com/oembed/?url="+spotifyUri+"&callback=?", function(data){
				localStorage.setItem(spotifyUri, data.thumbnail_url);
				return data.thumbnail_url;
			});
		}
	}
	else{
		return "/images/no-album-art.jpg";
	}
}

function getAlbumCoverByDom(dom,spotifyUri){
	// Check cache
	var img = null;
	if(spotifyUri.search("spotify") != -1){
		if(localStorage.getItem(spotifyUri)){
			dom.attr('src',localStorage.getItem(spotifyUri));
		}
		else{
			$.getJSON("https://embed.spotify.com/oembed/?url="+spotifyUri+"&callback=?", function(data){
				localStorage.setItem(spotifyUri, data.thumbnail_url);
				dom.attr('src',data.thumbnail_url);
			});
		}
	}
	else{
		dom.attr('src',"/images/no-album-art.jpg");
	}
}

function getLastFMImage(dom,artistname){
	var url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artistname.replace(' ','+')+"&api_key=c57585a2e7b83892aad0cdca5296c46c&format=json";
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

function joinArtists(artists){
	return artists.map(function(elem){return elem.name;}).join(', ');
}

var seeked = false;

function core(){	
	if(coreArray['currentTrack'] != null && coreArray['currentTLTrack'] != null){
		currentTrack = coreArray['currentTrack'];
		// Place title and artist in player and page title
		$("#currentsong #meta .title").html(currentTrack.name);
		var playSymbol = (coreArray['state'] == "playing") ? '\u25B6 ' : '';
		
		document.title = (currentTrack.artists != undefined) ? playSymbol+currentTrack.name+' - '+currentTrack.artists[0].name : "Mopify";
		
		if(currentTrack.artists != undefined) $("#currentsong #meta .artist").html(currentTrack.artists[0].name);
		
		// Fill timebar
		var seekBarTimeout = null;		
		var songLength = currentTrack.length;
		var curLength = coreArray['currentTrackPos'];
		var songTimePerc = (seeked) ? songTimePerc : Number(Number((curLength/songLength)*100).toFixed(2));
		
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
		
		// Get artwork
		$("#currentsong img.art").attr('src',getAlbumCover(currentTrack.uri));
		
		// Set options in player
		(coreArray['random'] == true) ? $("#options #shuffle").addClass('active') : $("#options #shuffle").removeClass('active');
		(coreArray['repeat'] == true) ? $("#options #repeat").addClass('active') : $("#options #repeat").removeClass('active');
		// Volume icon
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
	
	setTimeout(core,500);
};

// Take care of the paging system
function paging(){
	$(".menu li.openpage").click(function(){
		showPage($(this).find('a').attr('href'));
	});
	
	$(".menu li.opensearch a").click(function(e){
		$("#searchwindow").toggleClass('open');
		$(this).toggleClass('active');
		$("#searchwindow input").focus();
		e.preventDefault();
	});
	
	var pageurl = window.location.hash.split('/');
	console.log(pageurl);
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

function showPage(page){
	page = page.replace('#','');
	$("#pagecontent .singlepage").hide();
	$("#pagecontent .singlepage[data-page='"+page+"']").show();
	
	$(".menu li a").removeClass('active');
	$(".menu li a[href='#"+page+"']").addClass('active');
}

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

function hideMetapage(){
	$("#metapage,#pagewrapoverlay").removeClass('open');
	
	// Reset css
	$("#metapage").css({right: 0});
	$("#pagewrapoverlay").css({width: '100%'});
	
	// Reset url
	window.location.hash = "";
}

function getMetaAlbums(type,uri,trackuri){
	mopidy.library.lookup(uri).then(function(result){
		// Remove the loader
		$("#metapage").removeClass('loading');
		
		for(var x = 0;x < result.length;x++){
			var track = result[x];
			// Set album information _ only once
			if(x == 0){
				var album = result[x]['album'];
				var artist = result[x]['artists'][0];
			
				getAlbumCoverByDom($("#metapage #albumpage #details .art img"),album.uri); // Set album art
				getLastFMImage($("#metapage #albumpage #details #artistart img"),artist.name); // Set artist art
				$("#metapage #albumpage #details #albumtitle").html(album.name); // Set title
				$("#metapage #albumpage #details #albumyear").html(album.date); // Set title
				$("#metapage #albumpage #details #albumartist .dynamic").html(artist.name); // Set title
				$("#metapage #albumpage #details #albumartist .dynamic").attr('href',artist.uri); // Set artist url
			}
			// Place tracks
			$("#metapage #albumpage #tracks table").append("<tr class='track' data-id='"+ x +"' data-uri='"+track.uri+"'><td class='num'><span class='number'>"+ (x+1) +"</span><span class='button'><i class='ss-icon'>play</i></span></td> <td class='title'>"+track.name+" - "+joinArtists(track.artists)+"</td> <td class='length'>"+secondsToString(track.length)+"</td></tr>");
		}
		
		// Make artist url clickable
		$("#metapage #albumpage #details #albumartist .dynamic").click(function(e){
			openMetapage('artist',$(this).attr('href'));
			e.preventDefault();
		});
	
		$("#metapage #albumpage #tracks table tr.track").click(function(){
			$("#metapage #albumpage #tracks table tr.track").removeClass('highlight');
			$(this).addClass('highlight');
		});
		
		$("#metapage #albumpage #tracks table tr.track").hover(function(){
			$(this).find('.button,.number').toggle();
		});
		
		$("#metapage #albumpage #tracks table tr.track").dblclick(function(){
			var id = $(this).data('id');
			var track = result[id];
			
			mopidy.tracklist.clear();
			mopidy.tracklist.add(result).then(function(){
				mopidy.playback.play();
			},consoleError);
			
			mopidy.tracklist.getTlTracks().then(function(tracks){
				mopidy.playback.changeTrack(tracks[id]);
			});
			
			fillTracklist();
			
			// Move the left according by the width of the player
			$("#metapage").css({right: $("#currentsong").width()});
			$("#pagewrapoverlay").css({width: 'calc(100% - '+($("#currentsong").width()+$("#sidebar").width())+'px)'});
			
		});
		
		// highlight track uri if set
		if(trackuri != undefined){
			$("#metapage #albumpage #tracks table tr.track[data-uri='"+trackuri+"']").addClass('highlight');
		}
	},consoleError);
}

function getMetaArtists(uri){
	var artistName,artistUri;
	var artistObject = {};
	
	// Clear previous tracks and albums
	$("#metapage #artistpage #populartracks table tr,#metapage #artistpage .albumscontainer .albumwrap").remove();
	
	mopidy.library.lookup(uri).then(function(result){
		artistName = result[0].artists[0].name;
		artistUri = result[0].artists[0].uri;
		
		// Search tracks
		$.ajax({
			url: "http://ws.spotify.com/search/1/track.json?q="+artistName,
			type: "GET",
			dataType: "json",
			timeout: 5000,
			success: function(result){
				addArtistResult('tracks',result);
				console.log(result);
			},
			error: function(x,t,m){
				console.log(x+" - "+t+" - "+m);
			}
		});
		
		// Search albums
		$.ajax({
			url: "http://ws.spotify.com/lookup/1/.json?uri="+artistUri+"&extras=albumdetail",
			type: "GET",
			dataType: "json",
			timeout: 5000,
			success: function(result){
				addArtistResult('albums',result.artist.albums);
			},
			error: function(x,t,m){
				console.log(x+" - "+t+" - "+m);
			}
		});
	},consoleError);
	
	
	function addArtistResult(type,result){
		artistObject[type] = result;
		artistObject['mopidytracks'] = [];
		artistObject['albumtracks'] = [];
		
		if(artistObject['tracks'] != undefined && artistObject['albums'] != undefined){					
			// Remove the loader
			$("#metapage").removeClass('loading');
		
			// Edit data on page
			getLastFMImage($("#metapage #artistpage #topcover img#bgimage"),artistName); // Get cover
			$("#metapage #artistpage #topcover h1.name").html(artistName); // Edit artist title
			
			// Add populair tracks
			for(var i = 0;i < 10;i++){
				var track = artistObject['tracks'].tracks[i];
				mopidy.library.lookup(track.href).then(function(result){
					artistObject['mopidytracks'].push(result[0]);
				});
			}
			
			// Check if the results are back
			var checkInterval = setInterval(function(){
				if(artistObject['mopidytracks'].length == 10){
					clearInterval(checkInterval);
					
					for(var i = 0;i < 10;i++){
						var track = artistObject['mopidytracks'][i];
						var tablePos = (i < 5) ? 'left' : 'right' ;
						$("#metapage #artistpage #populartracks table."+tablePos).append("<tr class='track' data-id='"+i+"' data-uri='"+track.uri+"'><td class='num'>"+ (i+1) +"</td> <td class='title'>"+ track.name +"</td></tr>");					
					}
					
					// Add dblclick events for populair tracks
					$("#metapage #artistpage #populartracks tr.track").dblclick(function(){
						var id = $(this).data('id');
						
						mopidy.tracklist.clear();
						
						console.log(artistObject['mopidytracks']);
						
						mopidy.tracklist.add(artistObject['mopidytracks']).then(function(){
							mopidy.tracklist.getTlTracks().then(function(tracks){
								console.log(tracks);
								mopidy.playback.changeTrack(tracks[id]);
								mopidy.playback.play();
							});
						},consoleError);
						
			
						fillTracklist();
						
						
						// Move the left according by the width of the player
						$("#metapage").css({right: $("#currentsong").width()});
						$("#pagewrapoverlay").css({width: 'calc(100% - '+($("#currentsong").width()+$("#sidebar").width())+'px)'});
					});

				}
			},500);
				
			
			
			// Add the albums 
			for(var i = 0;i < artistObject['albums'].length;i++){
				var album = artistObject['albums'][i].album;
				var countryAvail = album.availability.territories;
						
				if(countryAvail.indexOf(browserLang) > -1 && album.artist == artistName){	
					var dombuild = "<li class='albumwrap' data-id='"+i+"' data-uri='"+album.href+"'>";
					dombuild += "<div id='artwrap'><img src='/images/no-album-art.jpg' class='art'/></div>";
					dombuild += "<div id='trackwrap'>";
					dombuild += "<h2 class='albumname'><div class='dynamic'>"+album.name+"</span><span class='year'>"+album.released+"</span></h2>";
					dombuild += "<table class='tracks'>";
					dombuild += "</table>";
					dombuild += "</div>";
					dombuild += "<div class='clear'></div>";
					dombuild += "</li>";
					$("#metapage #artistpage .albumscontainer").append(dombuild);
				
					getAlbumCoverByDom($("#metapage #artistpage #albums li.albumwrap[data-id='"+i+"'] #artwrap img"),album.href); // Album cover
				}
			}
			
			// Add the tracks to the albums
			$("#metapage #artistpage #albums li.albumwrap").each(function(){
				var uri = $(this).data('uri');
				var albumid = $(this).data('id');
				var $dom = $(this);
				
				mopidy.library.lookup(uri).then(function(result){	
					// Cache save
					artistObject['albumtracks'][albumid] = result;
					
					for(var i = 0;i < result.length;i++){
						var track = result[i];
						$dom.find("table.tracks").append("<tr class='track' data-albumid='"+albumid+"' data-id='"+ i +"' data-uri='"+track.uri+"'><td class='num'><span class='number'>"+ (i+1) +"</span><span class='button'><i class='ss-icon'>play</i></span></td> <td class='title'>"+track.name+" - "+joinArtists(track.artists)+"</td> <td class='length'>"+secondsToString(track.length)+"</td></tr>");
					}
					
					// all the click actions
					$("#metapage #artistpage #albums li.albumwrap tr.track,#metapage #artistpage #populartracks tr.track").hover(function(){
						$(this).find('td:first-child .button').show();
						$(this).find('td:first-child .number').hide();
					},function(){
						$(this).find('td:first-child .button').hide();
						$(this).find('td:first-child .number').show();
					});
					
					$("#metapage #artistpage #albums li.albumwrap tr.track,#metapage #artistpage #populartracks tr.track").click(function(){
						$('tr.track').removeClass('highlight');
						$(this).addClass('highlight');
					});
					
					$("#metapage #artistpage #albums li.albumwrap tr.track").dblclick(function(){
						var id = $(this).data('id');
						var albumid = $(this).data('albumid');
						var track = artistObject['albumtracks'][albumid][id];
						
						mopidy.tracklist.clear();
					
						mopidy.tracklist.add(artistObject['albumtracks'][albumid]).then(function(){
							mopidy.playback.play();
						},consoleError);
						
						mopidy.tracklist.getTlTracks().then(function(tracks){
							mopidy.playback.changeTrack(tracks[id]);
						});
						
						fillTracklist();
						
						// Move the left according by the width of the player
						$("#metapage").css({right: $("#currentsong").width()});
						$("#pagewrapoverlay").css({width: 'calc(100% - '+($("#currentsong").width()+$("#sidebar").width())+'px)'});
					});
					
					// Save the artist object
					localStorage.setItem(artistName+'Object',JSON.stringify(artistObject));
				},consoleError);
				
			});
		}
	}
}

function secondsToString(seconds){
	var seconds = seconds/1000;
	var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
	var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;	
	numseconds = (numseconds.toString().length < 2) ? '0'+numseconds : numseconds;
	
	return numminutes+':'+numseconds;
}

function askBrowserLanguage(){
	browserLang = localStorage.getItem('browserLanguage');
	if(browserLang == undefined || browserLang == 'null'){
		var promptQuestion = prompt("It looks like you haven't set your country. To provice better search results we need your 2 letter (ISO_3166-1_alpha-2) country code.","For example: GB,NL,AU etc.");
		while(promptQuestion.length != 2){
			promptQuestion = prompt("A country code should by 2 letters. More information can be found on http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2.","For example: GB,NL,AU etc.");
		}
		
		localStorage.setItem('browserLanguage', promptQuestion.toUpperCase().trim());
		browserLang = promptQuestion.toUpperCase().trim();
	}
}

mopidy.on("state:online", function () {
	setupVars();
	core();
	paging();
	
	// Ask/check browser language
	askBrowserLanguage();
	
	// Set consume mode to false
	mopidy.playback.setConsume(false);
});
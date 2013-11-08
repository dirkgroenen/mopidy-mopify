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

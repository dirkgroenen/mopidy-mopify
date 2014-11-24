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

var metaalbumtracks = null;
function getMetaAlbums(type,uri,trackuri){
	var albumname = null;
	
	mopidy.library.lookup(uri).then(function(result){
		metaalbumtracks = result;
		// Remove the loader
		$("#metapage").removeClass('loading');
		
		// Clear table tracks
		$("#metapage #albumpage #tracks table tr.track").remove();
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
				
				albumname = album.name;
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
			
			replaceAndPlay(result,id);
			
			// Move the left according by the width of the player
			$("#metapage").css({right: $("#currentsong").width()});
			$("#pagewrapoverlay").css({width: 'calc(100% - '+($("#currentsong").width()+$("#sidebar").width())+'px)'});
			
		});
		
		// highlight track uri if set
		if(trackuri != undefined){
			$("#metapage #albumpage #tracks table tr.track[data-uri='"+trackuri+"']").addClass('highlight');
		}
		
		// Add actions to the buttons
		$("#metapage #albumpage #buttons .saveasplaylist").click(function(){
			var newplaylist = createNewPlaylist(albumname);
		});
	},consoleError);
}


var artistObject = {};
function getMetaArtists(uri){
	var artistName,artistUri;
	
	// Clear previous tracks, artists and albums
	$("#metapage #artistpage #populartracks table tr,#metapage #artistpage .albumscontainer .albumwrap,#metapage #artistpage #similar table.similarartists tr.artist").remove();
	
	mopidy.library.lookup(uri).then(function(result){
		artistName = result[0].artists[0].name;
		artistUri = result[0].artists[0].uri;
		
		// Search tracks and albums
		mopidy.library.findExact({'artist': [artistName]}).then(function(result){
			addArtistResult(result[0].tracks,result[0].albums);
		},consoleError);
		
		// Get similar artists
		echonest.artist(artistName).similar( function(similarCollection) {
			artistObject['similarartists'] = similarCollection.data.artists;
			
			// Add similar artists
			for(var x = 0; x < 5; x++){
				var simArtist = artistObject['similarartists'][x];
				$("#metapage #artistpage #similar table.similarartists").append("<tr class='artist' data-artist='"+simArtist.name+"' data-artistid='"+simArtist.id+"'><td><div class='image'><img src='/mopify/images/artist-placeholder.png'/></div></td><td>"+simArtist.name+"</td></tr>");				
				// Set artist art
				getLastFMImage($("#metapage #artistpage #similar table.similarartists tr.artist[data-artistid='"+simArtist.id+"'] img"),simArtist.name); 				
			}
			// Loop through the artists and get the Spotify URI
			$("#metapage #artistpage #similar table.similarartists tr.artist").each(function(){
				var $elem = $(this);
				$.ajax({
					url: "http://ws.spotify.com/search/1/artist.json?q="+ encodeURIComponent($elem.data('artist')),
				}).done(function(result) {
					$elem.attr('data-uri',result.artists[0].href);
				});
			});
				
			// Add click event to similar artists
			$("#metapage #artistpage #similar table.similarartists tr.artist").click(function(){
				openMetapage('artist',$(this).data('uri'));
			});
		});
	},consoleError);
	
	// add results to the metapage
	function addArtistResult(tracks,albums){
		artistObject["tracks"] = tracks;
		artistObject["albums"] = albums;
		artistObject['mopidytracks'] = [];
		artistObject['albumtracks'] = [];
		
		if(artistObject['tracks'] != undefined && artistObject['albums'] != undefined){					
			// Remove the loader
			$("#metapage").removeClass('loading');
		
			// Edit data on page
			getLastFMImage($("#metapage #artistpage #topcover img#bgimage"),encodeURIComponent(artistName)); // Get cover
			$("#metapage #artistpage #topcover h1.name").html(artistName); // Edit artist title
			
			// Remove previous data (if there)
			$("#metapage #artistpage #populartracks table tr").remove();
			
			// Add populair tracks
			for(var i = 0;i < 10;i++){
				var track = artistObject['tracks'][i];
				artistObject['mopidytracks'].push(track);
				
				var tablePos = (i < 5) ? 'left' : 'right' ;
				$("#metapage #artistpage #populartracks table."+tablePos).append("<tr class='track' data-id='"+i+"' data-uri='"+track.uri+"' data-type='populair'><td class='num'>"+ (i+1) +"</td> <td class='image'><div class='imagewrap'><img src=''/></div></td><td class='title'>"+ track.name +"</td></tr>");					
				
				// Add album art to populair track
				getAlbumCoverByDom($("#metapage #artistpage #populartracks table."+tablePos+" tr.track[data-id='"+i+"'] .imagewrap img"),track.uri);
				
				// Remove previous binded dblclick to prevent from executing 'x' times
				$("#metapage #artistpage #populartracks tr.track").unbind('dblclick');
				$("#metapage #artistpage #populartracks tr.track").dblclick(function(){
					var id = $(this).data('id');
					
					replaceAndPlay(artistObject['mopidytracks'],id);
					
					// Move the left according by the width of the player
					$("#metapage").css({right: $("#currentsong").width()});
					$("#pagewrapoverlay").css({width: 'calc(100% - '+($("#currentsong").width()+$("#sidebar").width())+'px)'});
				});
			}
			
			// Remove previous albums
			$("#metapage #artistpage .albumscontainer .albumwrap").remove();
			
			// Add the albums 
			for(var i = 0;i < artistObject['albums'].length;i++){
				var album = artistObject['albums'][i];
				
				var dombuild = "<li class='albumwrap' data-id='"+i+"' data-uri='"+album.uri+"'>";
				dombuild += "<div id='artwrap'><img src='/mopify/images/no-album-art.jpg' class='art'/><div class='playbutton'></div></div>";
				dombuild += "<div id='trackwrap'>";
				dombuild += "<h2 class='albumname'><div class='dynamic'><a href='"+album.uri+"' class='openmeta'>"+album.name+"</a></span><span class='year'>"+album.date+"</span></h2>";
				dombuild += "<table class='tracks'>";
				dombuild += "</table>";
				dombuild += "</div>";
				dombuild += "<div class='clear'></div>";
				dombuild += "</li>";
				
				$("#metapage #artistpage .albumscontainer").append(dombuild);
				getAlbumCoverByDom($("#metapage #artistpage #albums li.albumwrap[data-id='"+i+"'] #artwrap img"),album.uri); // Album cover
			}
			
			// Open an album/artist meta page when clicked on the track's artist or album
			$("#metapage #artistpage .albumscontainer .albumname a.openmeta").click(function(e){
				openMetapage('album',$(this).attr('href'));
				e.preventDefault();
			});
			
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
						$dom.find("table.tracks").append("<tr class='track' data-albumid='"+albumid+"' data-id='"+ i +"' data-uri='"+track.uri+"' data-type='album'><td class='num'><span class='number'>"+ (i+1) +"</span><span class='button'><i class='ss-icon'>play</i></span></td> <td class='title'>"+track.name+" - "+joinArtists(track.artists)+"</td> <td class='length'>"+secondsToString(track.length)+"</td></tr>");
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
					
					// Remove previous binded dblclick to prevent from executing 'x' times
					$("#metapage #artistpage #albums li.albumwrap tr.track").unbind('dblclick');
					$("#metapage #artistpage #albums li.albumwrap tr.track").dblclick(function(){
						var id = $(this).data('id');
						var albumid = $(this).data('albumid');
						var track = artistObject['albumtracks'][albumid][id];
						
						replaceAndPlay(artistObject['albumtracks'][albumid],id);
						
						// Move the left according by the width of the player
						$("#metapage").css({right: $("#currentsong").width()});
						$("#pagewrapoverlay").css({width: 'calc(100% - '+($("#currentsong").width()+$("#sidebar").width())+'px)'});
					});
					
					// Save the artist object
					//localStorage.setItem(artistName+'Object',JSON.stringify(artistObject));
				},consoleError);
				
				
				// Show the playbutton in the art on a album art hover
				$dom.find("#artwrap").hover(function(){
					$(this).find('.playbutton').stop().fadeTo(10,0.8);
				},function(){
					$(this).find('.playbutton').stop().fadeTo(10,0.0);
				});
				
				
				// Play album on playbutton click
				$dom.find("#artwrap .playbutton").click(function(){
					var albumid = $(this).closest('li.albumwrap').data('id');
					replaceAndPlay(artistObject['albumtracks'][albumid],0);
				});
			});
		}
	}
}

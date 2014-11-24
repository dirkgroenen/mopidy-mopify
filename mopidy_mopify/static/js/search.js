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
mopidy.on("state:online", function () {
	var spotifyAPI = {
		artist: "http://ws.spotify.com/search/1/artist.json?q=",
		track: "http://ws.spotify.com/search/1/track.json?q=",
		album: "http://ws.spotify.com/search/1/album.json?q="
	};

	var keypressTimeout = null;
	var resultObject = {};
	
	$("#searchwindow #bar input").keyup(function(event){
		$('#searchwindow #bar #loader').fadeIn(200);
		var searchVal = $(this).val();
		
		// Clear prev timeout and run again, if a user doesn't type for a fixed seconds we start the search. This to prevent to many requests.
		clearTimeout(keypressTimeout);
		keypressTimeout = setTimeout(function(){
			// Clear prev search object
			resultObject = {};
		
			// Search tracks
			$.ajax({
				url: spotifyAPI.track+searchVal,
				type: "GET",
				dataType: "json",
				timeout: 5000,
				success: function(result){
					addSearchResults('track',result.tracks);
				},
				error: function(x,t,m){
					console.log(x+" - "+t+" - "+m);
				}
			});
			
			// Search albums
			$.ajax({
				url: spotifyAPI.album+searchVal,
				type: "GET",
				dataType: "json",
				timeout: 5000,
				success: function(result){
					addSearchResults('album',result.albums);
				},
				error: function(x,t,m){
					console.log(x+" - "+t+" - "+m);
				}
			});
			
			// Search artists
			$.ajax({
				url: spotifyAPI.artist+searchVal,
				type: "GET",
				dataType: "json",
				timeout: 5000,
				success: function(result){
					addSearchResults('artist',result.artists);
				},
				error: function(x,t,m){
					console.log(x+" - "+t+" - "+m);
				}
			});
		},1500);
	});
	
	function addSearchResults(type,results){
		resultObject[type] = results
		
		if(resultObject['artist'] != undefined && resultObject['track'] != undefined && resultObject['album'] != undefined){
			$('#searchwindow #bar #loader').fadeOut(200);			
			// Remove old ones
			$("#searchwindow #results table tr").remove();
			
			// Add the artists
			$("#searchwindow #results table").append("<tr id='artists'><td class='type'><i class='ss-icon'>&#x1F464;</i></td> <td class='result typename'>Artists</td></tr>");
			if(resultObject['artist'].length == 0){
				$("#searchwindow #results table").append("<tr class='clickable'><td class='type'></td> <td class='result'>No results</td></tr>");
			}
			else{
				var counter = 0;
				for(var i = 0;i < resultObject['artist'].length;i++){
					var result = resultObject['artist'][i];
					if(counter < 5){
						$("#searchwindow #results table").append("<tr class='clickable' data-type='artist' data-uri='"+result.href+"'><td class='type'></td> <td class='result'><img class='art' src='/images/no-album-art.jpg'/> "+result.name+"</td></tr>");
						getAlbumCoverByDom($("#searchwindow #results table tr[data-uri='"+result.href+"'] img.art"),result.href);
						counter++;
					}
				}
			}
				
			// Add the tracks
			$("#searchwindow #results table").append("<tr id='tracks'><td class='type'><i class='ss-icon'>&#x266B;</i></td> <td class='result typename'>Tracks</td></tr>");
			if(resultObject['track'].length == 0){
				$("#searchwindow #results table").append("<tr class='clickable'><td class='type'></td> <td class='result'>No results</td></tr>");
			}
			else{
				var counter = 0;
				for(var i = 0;i < resultObject['track'].length;i++){
					var result = resultObject['track'][i];
					var countryAvail = result.album.availability.territories;
					
					if(countryAvail.indexOf(browserLang) > -1){
						if(counter < 5){
							$("#searchwindow #results table").append("<tr class='clickable' data-type='track' data-albumuri='"+result.album.href+"' data-uri='"+result.href+"'><td class='type'></td> <td class='result'><img class='art' src='/images/no-album-art.jpg'/> "+result.name+ " - " +result.artists.map(function(elem){return elem.name;}).join(', ')+ "</td></tr>");
							getAlbumCoverByDom($("#searchwindow #results table tr[data-uri='"+result.href+"'] img.art"),result.href);
							counter++;
						}
					}
				}
			}
				
			// Add the albums
			$("#searchwindow #results table").append("<tr id='albums'><td class='type'><i class='ss-icon'>&#x25CE;</i></td> <td class='result typename'>Albums</td></tr>");
			if(resultObject['album'].length == 0){
				$("#searchwindow #results table").append("<tr class='clickable'><td class='type'></td> <td class='result'>No results</td></tr>");
			}
			else{
				var counter = 0;
				for(var i = 0;i < resultObject['album'].length;i++){
					var result = resultObject['album'][i];
					var countryAvail = result.availability.territories;
					
					if(countryAvail.indexOf(browserLang) > -1){
						if(counter < 5){
							$("#searchwindow #results table").append("<tr class='clickable' data-type='album' data-uri='"+result.href+"'><td class='type'></td> <td class='result'><img class='art' src='/images/no-album-art.jpg'/> "+result.name+"</td></tr>");
							getAlbumCoverByDom($("#searchwindow #results table tr[data-uri='"+result.href+"'] img.art"),result.href);
							counter++;
						}
					}
				}
			}
			
			// Open track from search
			$("#searchwindow #results table tr.clickable").click(function(){
				var uri = $(this).data('uri');
				var type = $(this).data('type');
				if(type == "track"){
					var album = $(this).data('albumuri');
					// Parse the results to the openMetaPage
					openMetapage(type,album,uri);
				}
				else{
					// Parse the results to the openMetaPage
					openMetapage(type,uri);
				}				
			});
		}
	}
});
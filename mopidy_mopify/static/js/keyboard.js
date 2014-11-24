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
$(document).ready(function(){
	// Register keyboard press events
	$(document).keydown(function(e){
		var $highlighted = $("body").find('tr.track.highlight');
		
		// Arrow up: 38
		if(e.keyCode == 38){
			if($highlighted.prev().length > 0){
				$highlighted.removeClass('highlight'); 
				$highlighted.prev().addClass('highlight');
			}
		}
		
		// Arrow down: 40
		if(e.keyCode == 40){
			if($highlighted.next().length > 0){
				$highlighted.removeClass('highlight'); 
				$highlighted.next().addClass('highlight');
			}
		}
		
		// Enter key: 13
		if(e.keyCode == 13){
			// Get the page url and check on which page we are
			var pageurl = window.location.hash.split('/');
			if(pageurl[0] == "#meta"){
				if(pageurl[1] == 'artist'){
					// Check if the selected track is from the populair list or album list
					if($highlighted.data('type') == 'populair'){
						// Replace curent tracklist
						var id = $highlighted.data('id');
						
						replaceAndPlay(artistObject['mopidytracks'],id);

						// Move the left according by the width of the player
						$("#metapage").css({right: $("#currentsong").width()});
						$("#pagewrapoverlay").css({width: 'calc(100% - '+($("#currentsong").width()+$("#sidebar").width())+'px)'});
					}
					if($highlighted.data('type') == 'album'){
						// Replace curent tracklist
						var id = $highlighted.data('id');
						var albumid = $highlighted.data('albumid');

						replaceAndPlay(artistObject['albumtracks'][albumid],id);
						
						// Move the left according by the width of the player
						$("#metapage").css({right: $("#currentsong").width()});
						$("#pagewrapoverlay").css({width: 'calc(100% - '+($("#currentsong").width()+$("#sidebar").width())+'px)'});
					}
				}
				if(pageurl[1] == 'album'){
					var id = $highlighted.data('id');
					var track = metaalbumtracks[id];
					
					replaceAndPlay(metaalbumtracks,id);
					
					// Move the left according by the width of the player
					$("#metapage").css({right: $("#currentsong").width()});
					$("#pagewrapoverlay").css({width: 'calc(100% - '+($("#currentsong").width()+$("#sidebar").width())+'px)'});
				}
			}
			else if(pageurl[0] == "#playlists"){
				var result = $.grep(playlists, function(e){ return e.uri == pageurl[1]; });
				var playlist = result[0];
				
				var id = $highlighted.data('id');
				var track = playlist.tracks[id];
			
				// Check if the tracks playlist is already in the Mopidy tracklist. 
				//If not; change the tracklist with the new playlist and play the track. If it is; just change the track;
				if(coreArray['playingPlaylistURI'] == playlist.uri){
					mopidy.playback.changeTrack(coreArray['tracklist'][id]).then(function(){
						mopidy.playback.play();
					});
				}	
				else{
					replaceAndPlay(playlist.tracks,id);
				}
				
				// Save the playlist in the corearray
				coreArray['playingPlaylistURI'] = playlist.uri;
			}
		}
		
		if((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 13){
			e.preventDefault();
		}	
	});

});
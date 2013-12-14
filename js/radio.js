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

function mopifyRadio(){
	var obj = this;
	obj.apikey = echonest.apiKey;
	obj.apiurl = "http://developer.echonest.com/api/v4/playlist/dynamic";
	obj.sessionID = 0;
	obj.currentSong = {};
	obj.nextSong = [];
	obj.nextMopidySong = [];
	obj.playlistName = "";

	
	this.createFromArtist = function(artist,callback){
		obj.playlistName = artist;
		$.ajax({
			url: obj.apiurl+"/create?api_key="+obj.apikey+"&artist="+encodeURIComponent(artist)+"&type=artist-radio&format=jsonp&bucket=id:spotify-WW&bucket=tracks&results=1&limit=true",
			crossDomain: true,
			dataType: 'jsonp',
		}).done(function(result){
			obj.sessionID = result.response.session_id;
			sessionStorage.setItem('radioID',obj.sessionID);
			
			// Place the playlistname on the page
			$("#radio #topbar #toparea #radioname .dynamic").html(artist);
			
			// Set the first song from the playlist
			obj.currentSong = result.response.songs[0];
			obj.initMetaData();
			obj.mopidySetSong();
		});
	};
	
	this.nextTrack = function(callback){
		$.ajax({
			url: obj.apiurl+"/next?api_key="+obj.apikey+"&session_id="+obj.sessionID+"&format=jsonp&results=1&lookahead=1",
			crossDomain: true,
			dataType: 'jsonp',
		}).done(function(result){
			obj.currentSong = result.response.songs[0];
			obj.nextSong = result.response.lookahead;
			
			// Set the first song from the playlist
			obj.initMetaData();
			obj.mopidySetSong();

		});
	};
	
	this.currentPlaylist = function(){
		if(obj.sessionID == 0 && (sessionStorage.getItem('radioID') == null || sessionStorage.getItem('radioID') == 'undefined')){
			return false;
		}
		else{
			if(obj.sessionID == 0){
				obj.sessionID = sessionStorage.getItem('radioID');
			}			
			return obj.sessionID;
		}
	}
	
	this.rateCurrentTrack = function(rate,callback){
		var ratevalue = (rate == 'positive') ? 10 : 0;
		$.ajax({
			url: obj.apiurl+"/feedback?api_key="+obj.apikey+"&session_id="+obj.sessionID+"&format=jsonp&rate_song=last^"+ratevalue,
			crossDomain: true,
			dataType: 'jsonp',
		}).done(function(result){
			callback(result);
		});
	}
	
	this.mopidySetSong = function(){
		mopidy.tracklist.clear().then(function(){
			mopidy.tracklist.add(null,9999,obj.currentSong.tracks[0].foreign_id.replace('-WW','')).then(function(list){
				fillTracklist();
				mopidy.playback.play();
			},consoleError);
		},consoleError);
	}
	
	this.initMetaData = function(){
		// Replace the current playing meta data (title, artist, art) with new track meta
		getAlbumCoverByDom($("#radio #topbar #controls .currenttrack img"), obj.currentSong.tracks[0].foreign_id.replace('-WW',''));
		$("#radio #topbar #controls #metainfo .title").html(obj.currentSong.title);
		$("#radio #topbar #controls #metainfo .artist").html(obj.currentSong.artist_name);
	}
}

mopidy.on("state:online",function(){
	// Build the radio object
	var radio = new mopifyRadio();
	
	//radio.createFromArtist('Coldplay');
	
	// Add listeners to buttons
	$("#radio #topbar #controls #nexttrack").click(function(){
		// Get the next track from the playlist
		radio.nextTrack();
	});
	
	$("#radio #topbar #controls #thumbwrap .thumb").click(function(){
		// Rate the current track
		radio.rateCurrentTrack($(this).data('rate'), function(){
			radio.nextTrack();
		});
	});
	
	// Handle the end of a track
	mopidy.on("event:trackPlaybackEnded",function(){
		console.log('playbackended');
		radio.nextTrack();
	});
	
	// Show warning message on page close
/*
	window.onbeforeunload = function() {
		return "Your current radio playlist will get lost.";
	}
*/
});
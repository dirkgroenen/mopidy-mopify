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
	obj.nextSong = {};

	
	this.createFromArtist = function(artist,callback){
		$.ajax({
			url: obj.apiurl+"/create?api_key="+obj.apikey+"&artist="+encodeURIComponent(artist)+"&type=artist-radio&format=jsonp&bucket=id:spotify-WW&bucket=tracks&limit=true",
			crossDomain: true,
			dataType: 'jsonp',
		}).done(function(result){
			obj.sessionID = result.response.session_id;
			callback(result);
		});
	};
	
	this.nextTrack = function(callback){
		if(obj.sessionID == 0){
			return false;
		}
		else{
			$.ajax({
				url: obj.apiurl+"/next?api_key="+obj.apikey+"&session_id="+obj.sessionID+"&format=jsonp&results=1",
				crossDomain: true,
				dataType: 'jsonp',
			}).done(function(result){
				obj.nextSong = result.response.songs[0];
				callback(result.response.songs[0]);
			});
		}
	};
	
}

mopidy.on("state:online",function(){
	// Build the radio object
	var radio = new mopifyRadio();
	
	// Create a playlist from artist name
	radio.createFromArtist('Weezer',function(radioResult){
	
		// Get the next track from the playlist
		radio.nextTrack(function(track){
			console.log(track);
		
			// Check mopidy for the track
			mopidy.library.findExact({'any': [track.title], 'artist': [track.artist_name]}).then(function(result){
				// Add the result to the tracklist and play
				replaceAndPlay(result[0].tracks.splice(0,1),0);
			},consoleError);
		});
	});
});

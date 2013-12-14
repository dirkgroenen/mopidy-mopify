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
var playlists = null;

mopidy.on("state:online", function () {		
	var firstLoad = true;
	var $page = $(".singlepage[data-page='playlists']");

	// Get the users playlists and place them in the client
	mopidy.playlists.getPlaylists().then(function(lists){
		playlists = lists;
		
		var groupedLists = {},splitList = [];
		
		// All the playlists are build on the following way: [...Playlist name... / ...Playlist folder (if sorted)...]
		// We split this structure so we can place the playlists in the right folder in the client. 
		for(var x = 0;x < playlists.length;x++){
			var list = playlists[x];
			var splitName = list.name.split('/');
			var groups = [];
			
			
			if(splitName.length == 2){
				splitList.push(splitName);
			}
			else if(splitName.length > 2 ){
				splitList.push([splitName.shift(), splitName.join('/')]);
			}
			else{
				splitList.push(["unlisted",splitName[0]]);
			}
		}
		
		// We now know which playlist has which parent folder. We now need to place these in the right subarray.
		var groupname;
		for(var x = 0;x < splitList.length;x++){
			var groupname = splitList[x][0];
			if (!(groupname in groupedLists))
				groupedLists[groupname] = [];

			groupedLists[groupname].push([splitList[x][1],x,playlists[x].uri]);
		}
		
		
		// List through the playlists which we ordered in the above functions and place them in the client
		var domlist = "";
		for(var group in groupedLists){
			var lists = groupedLists[group];
			var groupName = group;
			domlist += (groupName != "unlisted") ? "<li class='groupname active'><div class='title'>"+groupName+"</div><div class='openclose'><i class='ss-icon'>&#xF501;</i></div><ul>" : "<li class='groupname active'><ul>";
			
			for(var x = 0;x < lists.length;x++){
				var listname = lists[x][0];
				var listid = lists[x][1];
				var listuri = lists[x][2];
				
				domlist += "<li class='playlist' data-id='"+listid+"' data-uri='"+listuri+"'><div class='image'><div class='playbutton big'></div><img src='/images/no-album-art.jpg'/></div><div class='title'>"+listname+"</div></li>";
			}
			
			domlist += "</ul></li>";
		}
		$page.find("#playlistswrap ul#playlists").append(domlist);
		
		// After the list is ready and placed on the page we run it again and add the albumcovers async
		$("#playlistswrap ul#playlists li.playlist").each(function(){
			getAlbumCoverByDom($("li.playlist[data-id='"+$(this).data('id')+"'] img"), $(this).data('uri'));
		});
		
		// Create the open/close toggle on each folder
		$page.find("#playlistswrap ul#playlists li.groupname > .title,#playlistswrap ul#playlists li.groupname > .openclose").click(function(){
			$(this).closest("li.groupname").toggleClass('active');
		});
		
		// Bind the click function that will change the current Tracklist to the new playlist.
		$page.find("#playlistswrap ul#playlists li.playlist .playbutton").click(function(){
			replaceAndPlay(playlists[$(this).closest('li').data('id')].tracks,0);
		});
		
		// Show the playlist's tracks on click
		$page.find("#playlistswrap ul#playlists li.playlist").click(function(){
			$("#playlistswrap ul#playlists li.playlist").removeClass('highlight');
			$(this).addClass('highlight');
			
			showPlaylist(playlists[$(this).data('id')]);
		});
		
		// Show the playbutton in the art on a playlist hover
		$page.find("#playlistswrap ul#playlists li.playlist").hover(function(){
			$(this).find('.playbutton').stop().fadeTo(10,0.8);
		},function(){
			$(this).find('.playbutton').stop().fadeTo(10,0.0);
		});
		
		// Fade the showed play button to full Opacity on hover
		$page.find("#playlistswrap ul#playlists li.playlist .playbutton").hover(function(){
			$(this).stop().fadeTo(50,1);
		},function(){
			$(this).stop().fadeTo(50,0.8);
		});
		
		// Hide loader after all of the above is done
		$("#playlistswrap,#playlisttracks").removeClass('loading');
		
		// Open playlist by url if set
		var url = window.location.hash.split('/');
		if(url.length > 1){
			showPlayListByURL(url[1]);
		}
	});
	
	// Show the playlist's tracks.
	function showPlaylist(playlist){
		// Slide the tracklist from the right to the left on a firstload
		if(firstLoad){
			$page.find("#playlisttracks").transition({x:'0%'});
			firstLoad = false;
		}
		
		// Change the current URL to the opened playlist
		window.location.hash = "#playlists/"+playlist.uri;
		
		// Remove the old tracks from the previously showed playlist
		$page.find("#playlisttracks table.tracks tr.track").remove();
		
		// Change the title and album art
		$page.find("#playlisttracks .title").html(playlist.name);
		getAlbumCoverByDom($page.find("#playlisttracks #art img.image"),playlist.uri);
		
		// Add a hover listener to the playlist art
		$page.find("#playlisttracks #art").hover(function(){
			$(this).find('.play').stop().fadeTo(50,0.8);
		},function(){
			$(this).find('.play').stop().fadeTo(50,0);
		});
		
		$page.find("#playlisttracks #art .play").hover(function(){
			$(this).fadeTo(50,1);
		},function(){
			$(this).fadeTo(50,0.8);
		});
		
		// Add playlist to the mopidy tracklist on albumart click
		$page.find("#playlisttracks #art .play").click(function(){
			replaceAndPlay(playlist.tracks,0);
		});
		
		// Add the tracks to the playlist
		for(var x = 0;x < playlist.tracks.length;x++){
			var track = playlist.tracks[x];
			if(track.name != '[loading...]'){
				$page.find("#playlisttracks table.tracks tbody").append("<tr class='track' data-id='"+x+"'><td class='num'><span class='number'>"+x+"</span><span class='button'><i class='ss-icon'>play</i></span></td><td class='title'>"+track.name+"</td><td class='artist'><a href='"+track.artists[0].uri+"' class='openmeta' data-type='artist'>"+track.artists[0].name+"</a></td><td class='length'>"+secondsToString(track.length)+"</td><td><a href='"+track.album.uri+"' class='openmeta' data-type='album'>"+track.album.name+"</a></td></tr>");
			}
		}
		
		// Make the playlist resizable
		$page.find("#playlisttracks table.tracks").resizableColumns({
			store: store
		});
		
		// Make the playlist sortable
		$page.find("#playlisttracks table.tracks").tablesorter({
			headers: {
			  0: { sorter: "digit" }
			}
		}); 
		
		// Show the tracknumber on a hover
		$page.find("#playlisttracks table.tracks tr.track").hover(function(){
			$(this).find('td:first-child .button,td:first-child .number').toggle();
		});
		
		// Change the highlight status on a track click
		$page.find("#playlisttracks table.tracks tr.track").click(function(){
			$("#playlisttracks table.tracks tr.track").removeClass('highlight');
			$(this).addClass('highlight');
		});
		
		// Open an album/artist meta page when clicked on the track's artist or album
		$page.find("#playlisttracks table.tracks tr.track td a.openmeta").click(function(e){
			openMetapage($(this).data('type'),$(this).attr('href'));
			e.preventDefault();
		});
		
		// Place the playlist in the Mopidy tracklist and play the clicked song (Fires on a double click)
		$page.find("#playlisttracks table.tracks tr.track").dblclick(function(){
			var id = $(this).data('id');
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
		});
	}
	
	// Check which playlists belongs to the given url and open it
	function showPlayListByURL(url){
		for(var x = 0;x < playlists.length;x++){
			var uri = playlists[x].uri;
			if(url == uri){
				showPlaylist(playlists[x]);
				// Highlight
				$("#playlistswrap ul#playlists li.playlist").removeClass('highlight');
				$("#playlistswrap ul#playlists li.playlist:nth-child("+(x+1)+")").addClass('highlight');
			}
		}
	}

	// Hide playlist track block
	$(".singlepage[data-page='playlists']").find("#playlisttracks").css({x:'100%'});
	
	/* Search tracks in playlist */
	$("#search #query").keyup(function(e){
		// Remove filter input on ESC
		if(e.keyCode == 27){
			$(this).val("");
		}
		
		// When value of the input is not blank
		if( $(this).val() != "")
		{
			// Show only matching TR, hide rest of them
			$page.find("#playlisttracks table.tracks tbody>tr").hide();
			$page.find("#playlisttracks table.tracks td:contains-ci('" + $(this).val() + "')").parent("tr").show();
		}
		else
		{
			// When there is no input or clean again, show everything back
			$page.find("#playlisttracks table.tracks tbody>tr").show();
		}
	});

	// jQuery expression for case-insensitive filter
	$.extend($.expr[":"],{
		"contains-ci": function(elem, i, match, array){
			return (elem.textContent || elem.innerText || $(elem).text() || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
		}
	});
});
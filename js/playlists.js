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
	var firstLoad = true;
	var playlists = null;
	var $page = $(".singlepage[data-page='playlists']");
	
	mopidy.playlists.getPlaylists().then(function(lists){
		
		playlists = lists;
		
		var groupedLists = {},splitList = [];
		
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
		
		var groupname;
		for(var x = 0;x < splitList.length;x++){
			var groupname = splitList[x][0];
			if (!(groupname in groupedLists))
				groupedLists[groupname] = [];

			groupedLists[groupname].push([splitList[x][1],x,playlists[x].uri]);
		}
		
		console.log(groupedLists);
		
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
			
			//list = playlists[x];
			//$page.find("#playlistswrap ul#playlists").append("<li class='playlist' data-id='"+x+"'><div class='image'><div class='playbutton big'></div><img src='"+getAlbumCover(list.uri)+"'/></div><div class='title'>"+list.name+"</div></li>");
		}
		$page.find("#playlistswrap ul#playlists").append(domlist);
		
		// After the list is ready and placed on the page we run it again and add the albumcovers async
		$("#playlistswrap ul#playlists li.playlist").each(function(){
			getAlbumCoverByDom($("li.playlist[data-id='"+$(this).data('id')+"'] img"), $(this).data('uri'));
		});
		
		$page.find("#playlistswrap ul#playlists li.groupname > .title,#playlistswrap ul#playlists li.groupname > .openclose").click(function(){
			$(this).closest("li.groupname").toggleClass('active');
		});
		
		$page.find("#playlistswrap ul#playlists li.playlist .playbutton").click(function(){
			mopidy.tracklist.clear();
			mopidy.tracklist.add(playlists[$(this).closest('li').data('id')].tracks).then(function(){
				mopidy.playback.play();
				fillTracklist();
			},consoleError);
		});
		
		$page.find("#playlistswrap ul#playlists li.playlist").click(function(){
			$("#playlistswrap ul#playlists li.playlist").removeClass('highlight');
			$(this).addClass('highlight');
			
			showPlaylist(playlists[$(this).data('id')]);
		});
		
		$page.find("#playlistswrap ul#playlists li.playlist").hover(function(){
			$(this).find('.playbutton').stop().fadeTo(10,0.8);
		},function(){
			$(this).find('.playbutton').stop().fadeTo(10,0.0);
		});
		
		$page.find("#playlistswrap ul#playlists li.playlist .playbutton").hover(function(){
			$(this).stop().fadeTo(50,1);
		},function(){
			$(this).stop().fadeTo(50,0.8);
		});
		
		// Hide loader
		$("#playlistswrap,#playlisttracks").removeClass('loading');
		
		// Open playlist by url
		var url = window.location.hash.split('/');
		if(url.length > 1){
			showPlayListByURL(url[1]);
		}
	});
	
	function showPlaylist(playlist){
		if(firstLoad){
			$page.find("#playlisttracks").transition({x:'0%'});
			firstLoad = false;
		}
		
		window.location.hash = "#playlists/"+playlist.uri;
		
		$page.find("#playlisttracks table.tracks tr.track").remove();
		
		$page.find("#playlisttracks .title").html(playlist.name);
		$page.find("#playlisttracks #art img.image").attr('src',getAlbumCover(playlist.uri));
		
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
		
		$page.find("#playlisttracks #art .play").click(function(){
			mopidy.tracklist.clear();
			mopidy.tracklist.add(playlist.tracks).then(function(){
				mopidy.playback.play();
			},consoleError);
			fillTracklist();
		});
		
		for(var x = 0;x < playlist.tracks.length;x++){
			var track = playlist.tracks[x];
			if(track.name != '[loading...]'){
				$page.find("#playlisttracks table.tracks tbody").append("<tr class='track' data-id='"+x+"'><td class='num'><span class='number'>"+x+"</span><span class='button'><i class='ss-icon'>play</i></span></td><td class='title'>"+track.name+"</td><td class='artist'><a href='"+track.artists[0].uri+"' class='openmeta' data-type='artist'>"+track.artists[0].name+"</a></td><td class='length'>"+secondsToString(track.length)+"</td><td><a href='"+track.album.uri+"' class='openmeta' data-type='album'>"+track.album.name+"</a></td></tr>");
			}
		}
		
		$page.find("#playlisttracks table.tracks").resizableColumns({
			store: store
		});
		
		$page.find("#playlisttracks table.tracks").tablesorter({
			headers: {
			  0: { sorter: "digit" }
			}
		}); 
		
		var trackcache;
		$page.find("#playlisttracks table.tracks tr.track").hover(function(){
			$(this).find('td:first-child .button,td:first-child .number').toggle();
		});
		
		$page.find("#playlisttracks table.tracks tr.track").click(function(){
			$("#playlisttracks table.tracks tr.track").removeClass('highlight');
			$(this).addClass('highlight');
		});
		
		$page.find("#playlisttracks table.tracks tr.track td a.openmeta").click(function(e){
			openMetapage($(this).data('type'),$(this).attr('href'));
			e.preventDefault();
		});
		
		$page.find("#playlisttracks table.tracks tr.track").dblclick(function(){
			var id = $(this).data('id');
			var track = playlist.tracks[id];
			
			mopidy.tracklist.clear();
		
			mopidy.tracklist.add(playlist.tracks).then(function(){
				mopidy.playback.play();
			},consoleError);
			
			mopidy.tracklist.getTlTracks().then(function(tracks){
				mopidy.playback.changeTrack(tracks[id]);
			});
			
			fillTracklist();
		});
	}
	
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
		// When value of the input is not blank
		if(e.keyCode == 27){
			$(this).val("");
		}
		
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
	$.extend($.expr[":"], 
	{
		"contains-ci": function(elem, i, match, array) 
		{
			return (elem.textContent || elem.innerText || $(elem).text() || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
		}
	});
});
$(document).ready(function(){
	// Show loader
	$("#pageloader").fadeIn();
});

mopidy.on("state:online", function () {		
	var firstLoad = true;
	var playlists = null;
	var $page = $(".singlepage[data-page='playlists']");
	
	mopidy.playlists.getPlaylists().then(function(lists){
		
		playlists = lists;
		
		for(var x = 0;x < playlists.length;x++){
			list = playlists[x];
			$page.find("#playlistswrap ul#playlists").append("<li class='playlist' data-id='"+x+"'><div class='image'><div class='playbutton big'></div><img src='"+getAlbumCover(list.uri)+"'/></div><div class='title'>"+list.name+"</div></li>");
		}
		
		$page.find("#playlistswrap ul#playlists li.playlist .playbutton").click(function(){
			mopidy.tracklist.clear();
			mopidy.tracklist.add(playlists[$(this).closest('li').data('id')].tracks);
			mopidy.playback.play();
			
			//fillTracklist();
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
		$("#pageloader").fadeOut();
		
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
			mopidy.tracklist.add(playlist.tracks);
			mopidy.playback.play();
		});
		
		for(var x = 0;x < playlist.tracks.length;x++){
			var track = playlist.tracks[x];
			if(track.name != '[loading...]'){
				$page.find("#playlisttracks table.tracks").append("<tr class='track' data-id='"+x+"'><td class='num'><span class='number'>"+x+"</span><span class='button'><i class='ss-icon'>play</i></span></td><td class='title'>"+track.name+"</td><td class='artist'>"+track.artists[0].name+"</td><td class='length'>"+secondsToString(track.length)+"</td><td>"+track.album.name+"</td></tr>");
			}
		}
		
		var trackcache;
		$page.find("#playlisttracks table.tracks tr.track").hover(function(){
			$(this).find('td:first-child .button,td:first-child .number').toggle();
		});
		
		$page.find("#playlisttracks table.tracks tr.track").click(function(){
			$("#playlisttracks table.tracks tr.track").removeClass('highlight');
			$(this).addClass('highlight');
		});
		
		$page.find("#playlisttracks table.tracks tr.track").dblclick(function(){
			var id = $(this).data('id');
			var track = playlist.tracks[id];
			
			mopidy.tracklist.clear();
			mopidy.tracklist.add(playlist.tracks);
			mopidy.playback.play();
			
			mopidy.tracklist.getTlTracks().then(function(tracks){
				mopidy.playback.changeTrack(tracks[id]);
			});
			
			//fillTracklist();
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
});
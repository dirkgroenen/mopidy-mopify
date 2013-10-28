mopidy.on("state:online", function () {
	var playlists = null;
	var $page = $(".singlepage[data-page='playlists']");

	mopidy.playlists.getPlaylists().then(function(lists){
		playlists = lists;
		
		for(var x = 0;x < playlists.length;x++){
			list = playlists[x];
			$page.find("#playlistswrap ul#playlists").append("<li class='playlist' data-id='"+x+"'><div class='image'><img src='"+getAlbumCover(list.uri)+"'/></div><div class='title'>"+list.name+"</div></li>");
		}
		
		$page.find("#playlistswrap ul#playlists li.playlist").click(function(){
			mopidy.tracklist.clear();
			mopidy.tracklist.add(playlists[$(this).data('id')].tracks);
			mopidy.playback.play();
			
			fillTracklist();
		});
	});
});
var mopidy = new Mopidy();  // Connect to server
var consoleError = console.error.bind(console);

// Global vars
var coreArray = new Array();

var setupVars = function(){
	//Setup playlists
	mopidy.playlists.getPlaylists().then(function(lists){
		coreArray['playlists'] = lists;
	}, consoleError);
	
	setInterval(function(){
		mopidy.playback.getCurrentTrack().then(function (track) {
			coreArray['currentTrack'] = track;
		}, consoleError);
	},1000);
	
	setInterval(function(){
		mopidy.playback.getTimePosition().then(function (pos) {
			coreArray['currentTrack']['trackPosition'] = pos;
		}, consoleError);
	},1000);
	
	setInterval(function(){
		mopidy.playback.getState().then(function (state) {
			coreArray['state'] = state;
		}, consoleError);
	},1000);
	
	setInterval(function(){
		mopidy.playback.getVolume().then(function (vol) {
			coreArray['volume'] = vol;
		}, consoleError);
	},1000);
	
	setInterval(function(){
		mopidy.playback.getRandom().then(function(val){
			coreArray['random'] = val;
		}, consoleError);
	},1000);
	
	setInterval(function(){
		mopidy.playback.getRepeat().then(function(val){
			coreArray['repeat'] = val;
		}, consoleError);
	},1000);
}

function getAlbumCover(spotifyUri){
	// Check cache
	if(localStorage.getItem(spotifyUri)){
		return localStorage.getItem(spotifyUri);
	}
	else{
		$.getJSON("https://embed.spotify.com/oembed/?url="+spotifyUri+"&callback=?", function(data){
			localStorage.setItem(spotifyUri, data.thumbnail_url);
			return data.thumbnail_url;
		});
	}
}

var seeked = false;

function core(){	
	if(coreArray['currentTrack'] != null){
		currentTrack = coreArray['currentTrack'];
		// Place title and artist
		$("#currentsong #meta .title").html(currentTrack.name);
		$("#currentsong #meta .artist").html(currentTrack.artists[0].name);
		
		// Fill timebar
		var seekBarTimeout = null;		
		var songLength = currentTrack.length;
		var curLength = currentTrack.trackPosition;
		var songTimePerc = (seeked) ? songTimePerc : (curLength/songLength)*100;
		$( "#timebarwrap").slider({
			value: songTimePerc,
			orientation: "horizontal",
			range: "min",
			animate: true,
			slide: function(event, ui) { 	
				seeked = true;
				clearTimeout(seekBarTimeout);
				seekBarTimeout = setTimeout(function(){
					mopidy.playback.seek(songLength*(ui.value/100)).then(function(val){
						seeked = (val) ? false : true;
					});
					currentTrack.trackPosition = songLength*(ui.value/100);
				},1000);
			}
		});
		
		// Get artwork
		$("#currentsong img.art").attr('src',getAlbumCover(currentTrack.uri));
		
		// Set options in player
		(coreArray['random'] == true) ? $("#options #shuffle").addClass('active') : $("#options #shuffle").removeClass('active');
		(coreArray['repeat'] == true) ? $("#options #repeat").addClass('active') : $("#options #repeat").removeClass('active');
		// Volume icon
		if(coreArray['volume'] == 0){
			$("#currentsong #options #volume").html("volume");
		}
		else if(coreArray['volume'] < 50){
			$("#currentsong #options #volume").html("lowvolume");
		}
		else{
			$("#currentsong #options #volume").html("highvolume");
		}
	}
	
	setTimeout(core,500);
};

// Take care of the paging system
function paging(){
	$(".menu li").click(function(){
		showPage($(this).find('a').attr('href'));
	});
	
	function showPage(page){
		page = page.replace('#','');
		$("#pagecontent .singlepage").hide();
		$("#pagecontent .singlepage[data-page='"+page+"']").show();
	}
	
	showPage(window.location.hash);
}

mopidy.on("state:online", function () {
	setupVars();
	core();
	paging();
});
mopidy.on("state:online", function () {
	$("#skipnext").click(function(){
		mopidy.playback.next();
	});
	
	$("#skipback").click(function(){
		mopidy.playback.previous();
	});
	
	$("#playpause").click(function(){
		if(coreArray['state'] == "playing"){
			mopidy.playback.pause();
			$(this).html('play');
		}
		else{
			mopidy.playback.resume();
			$(this).html('pause');
		}
	});
	
	// Check state for the playing or pause button
	if(coreArray['state'] == "playing"){
		$("#playpause").html('play');
	}
	else{
		$("#playpause").html('pause');
	}
	
	// Show options on player hover
	$("#currentsong").hover(function(){
		$(this).find("#options").stop().animate({top: '0px'},500);
	},function(){
		$(this).find("#options").stop().animate({top: '-'+($(this).find("#options").height()*1.5)+'px'},500);
	});
	
	var volumeControlFade = null;;
	$("#currentsong #options #volume").hover(function(){
		$("#volumecontrolwrap").stop().fadeIn();
		clearTimeout(volumeControlFade);
	},function(){
		volumeControlFade = setTimeout(function(){
			$("#volumecontrolwrap").stop().fadeOut();
		},1500);
	});
	
	$("#volumecontrolwrap").hover(function(){
		clearTimeout(volumeControlFade);
	},function(){
		$("#volumecontrolwrap").stop().fadeOut();
	});
	
	// Set volume control
	setTimeout(initVolumeControl, 250);
	function initVolumeControl(){	
		if(coreArray['volume'] != null){
			$( "#volumecontrol").slider({
				value: coreArray['volume'],
				orientation: "horizontal",
				range: "min",
				animate: true,
				slide: function(event, ui) { 
					mopidy.playback.setVolume(ui.value);
				}
			});
		}
		else{
			setTimeout(initVolumeControl,250);
		}
	}	
	
	// Set shuffle and repeat options
	$("#options #shuffle").click(function(){
		$("#options #shuffle").toggleClass('active');
		var toggleVal = (coreArray['random']) ? false: true;
		coreArray['random'] = toggleVal;
		mopidy.playback.setRandom(toggleVal);
	});
	
	$("#options #repeat").click(function(){
		$("#options #shuffle").toggleClass('active');	
		var toggleVal = (coreArray['repeat']) ? false: true;
		coreArray['repeat'] = toggleVal;
		mopidy.playback.setRepeat(toggleVal);
	});
	
	// fill the tracklist
	fillTracklist();
});

function fillTracklist(){
	// Fill tracklist
	mopidy.tracklist.getTlTracks().then(function(tracks){
		coreArray["tracklist"] = tracks;
		
		console.log(coreArray); //debug
		
		$("#tracklist").css('height',$(document).height()-$("#playerwrap").height()+'px');
		var $tracklist = $("#tracklist .tracks");
		
		// Clear tracklist
		$tracklist.find('li').remove();
		
		for(var x = 0; x < tracks.length;x++){
			var track = tracks[x].track;
		
			$tracklist.append("<li class='track' data-trackid='"+x+"'>"+track.name+"<span class='title'></span> - <span class='artist'>"+track.artists[0].name+"</span></li>");
		}	
		
		$("#tracklist .track").click(function(){
			console.log(coreArray["tracklist"][$(this).data('trackid')]);
			mopidy.playback.play(coreArray["tracklist"][$(this).data('trackid')]);
		});
		
		/* Not for now, but at some moment this will make the playlist sortable
		$( "#tracklist .tracks" ).sortable({
			axis: "y",
			update: function(event,ui){	
				$("#tracklist .tracks li").each(function(index){
					var prevPos = $(this).data('trackid');
					var newPos = index;
					
					if(prevPos != newPos){
						mopidy.tracklist.move(prevPos,prevPos,newPos).then(function(){
							mopidy.tracklist.getTlTracks().then(function(tracks){
								console.log(tracks);
							});
						});
					}
				});
			}
		});*/
		
	
	},consoleError);
}
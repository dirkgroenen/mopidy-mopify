angular.module("mopify.services.searchservice", [
    'spotify',
    'mopify.services.mopidy',
    'mopify.services.spotifylogin',
    'mopify.services.settings'
])

.factory("SearchService", function($q, Spotify, mopidyservice, SpotifyLogin, Settings){
    "use strict";

    function SearchService(){
        var that = this;

    }

    /**
     * Perform a new search action
     * 
     * @param  {string}     query
     * @return {Promise}
     */
    SearchService.prototype.search = function(query) {
        var deferred = $q.defer();

        // Clear results
        var results = {
            artists: [],
            albums: [],
            playlists: [],
            tracks: []
        };

        // Setup the search actions
        var searches = {
            spotify: searchSpotify(query),
            mopidy: searchMopidy(query)
        };

        // Run all searches and wait for them to resolve
        $q.all(searches).then(function(responses){
            // Set all responses
            results.artists = responses.spotify.artists;
            results.albums = responses.spotify.albums;
            results.playlists = (responses.spotify.playlists !== undefined) ? responses.spotify.playlists : [];
            results.tracks = responses.mopidy.tracks;

            // Search for the best matching result
            results.bestmatch = getTopMatchingResult(query, results);

            // Resolve
            deferred.resolve(results);
        });

        return deferred.promise;
    };

    /**
     * Search in Spotify
     * 
     * @param  {string} query
     * @return {Promise}
     */
    function searchSpotify(query) {
        var deferred = $q.defer();
        var searchableItems = (!SpotifyLogin.connected) ? "album,artist" : "album,artist,playlist";

        Spotify.search(query, searchableItems, {
            market: Settings.get("country", "US"),
            limit: "50"
        }).then(function(data){
            var results = data;

            // The search request only returns limited information about an album
            // so lets get some more information
            Spotify.getAlbums(_.map(data.albums.items.slice(0,20), function(album){
                return album.id;
            })).then(function(response){
                angular.extend(results.albums.items, response.albums);
            }, function(err){
                deferred.reject(err);
            });

            deferred.resolve(results);
        }, function(err){
            deferred.reject(err);
        });

        return deferred.promise;
    }

    /**
     * Search in Mopidy
     *
     * @param  {string} query
     * @return {Promise}
     */
    function searchMopidy(query) {
        var deferred = $q.defer();

        mopidyservice.search(query).then(function(data){
            var tracks = [];
            var tracksources = [];

            // Go through each data source
            _.each(data, function(source){
                // Add source
                tracksources.push({
                    uri: source.uri,
                    name: source.uri.split(':')[0],
                    checked: (source.tracks !== undefined)
                });

                if(source.tracks !== undefined)
                    tracks = tracks.concat(source.tracks);
            });
            
            deferred.resolve({
                tracks: {
                    sources: tracksources,
                    items: tracks
                }
            });
        }, function(err){
            deferred.reject(err);
        });

        return deferred.promise;
    }

    /**
     * Get the top matching resutls from the given batch
     * 
     * @param  {string} search  The search string to check against
     * @param  {object} results All the results from spotify and mopidy
     */
    function getTopMatchingResult(search, results){
        var bestmatch = null;
        var resultitem = {};
        var items = [];
        
        // Override results with angular copy of results 
        results = angular.copy(results);

        // Loop through all results and create an array with all items
        _.each(results, function(result, key){
            if(result !== undefined){
                // Get correct items array
                if(result.items){
                    items.push({
                        type: key,
                        items: result.items
                    });
                }
                else{
                    items.push({
                        type: key,
                        items: result
                    });
                }
            }
        });

        // Check each item with the query using the levenshtein algorithme
        _.each(items, function(collection){
            _.each(collection.items, function(item){
                var stringtocheck = item.name.toLowerCase();

                var distance = levenshteinDistance(search, stringtocheck);
                
                // Check with previous bestmatch and update if needed
                if(bestmatch === null || bestmatch > distance){
                    bestmatch = distance;
                    resultitem = { item: item, type: collection.type };
                }
            });
        });

        if(resultitem.item !== undefined){
            // Genereate the link
            if(resultitem.type === "artists")
                resultitem.link = "#/music/artist/" + resultitem.item.uri;
            else
                resultitem.link = "#/music/tracklist/" + resultitem.item.uri;
        }
        
        return resultitem;
    }

    /**
     * Compute the edit distance between the two given strings
     * @param  {string} a 
     * @param  {string} b 
     * @return {int}   the number that represents the distance
     */
    function levenshteinDistance(a, b) {
        if(a.length === 0) return b.length; 
        if(b.length === 0) return a.length; 

        var matrix = [];

        // increment along the first column of each row
        var i;
        for(i = 0; i <= b.length; i++){
            matrix[i] = [i];
        }

        // increment each column in the first row
        var j;
        for(j = 0; j <= a.length; j++){
            matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for(i = 1; i <= b.length; i++){
            for(j = 1; j <= a.length; j++){
                if(b.charAt(i-1) == a.charAt(j-1)){
                    matrix[i][j] = matrix[i-1][j-1];
                } 
                else {
                    matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                   Math.min(matrix[i][j-1] + 1, // insertion
                                   matrix[i-1][j] + 1)); // deletion
                }
            }
        }

        return matrix[b.length][a.length];
    }

    return new SearchService();
});
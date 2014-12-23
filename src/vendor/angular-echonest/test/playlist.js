'use strict';
 
describe('Playlist', function() {
    var echonest, httpBackend;
    var apiUrl = 'http://developer.echonest.com/api/v4/';

    var playlistApiResponse = {
        response: {
            songs: [
                {
                    artist_id: '456',
                    id: '74574',
                    artist_name: 'motorhead',
                    title: 'foo bar'
                },
                {
                    artist_id: '678',
                    id: '6546546',
                    artist_name: 'nirvana',
                    title: 'bar'
                },
                {
                    artist_id: '5453',
                    id: '321312',
                    artist_name: 'acdc',
                    title: 'foo'
                }
            ],
            status: {
                code: 0,
                message: 'Success',
                version: '4.2'
            }
        }
    };

    beforeEach(angular.mock.module('angular-echonest'));

    beforeEach(inject(function($injector) {
        echonest = $injector.get('Echonest');
        httpBackend = $injector.get("$httpBackend");

        httpBackend.whenJSONP(apiUrl + 'playlist/static?api_key=&callback=JSON_CALLBACK&format=jsonp&artist=Weezer&results=3&type=artist').respond(playlistApiResponse);
    }));
        
    //  
    // Songs
    //
    it('Playlist create method should create a response with 20 songs', function() {
        echonest.playlist.static({
            artist: 'Weezer',
            results: 3
        }).then(function(playlist, status) {
            expect(playlist.songs.length).toBe(3);
        });

        httpBackend.flush();
    });

});

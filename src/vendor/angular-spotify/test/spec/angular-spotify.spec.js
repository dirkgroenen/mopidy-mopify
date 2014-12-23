'use strict';
/* global getJSONFixture */
describe('angular-spotify', function () {

  //For the config
  describe('SpotifyProvider', function () {

    var spotifyProvider;

    beforeEach(function () {
      // Initialize the service provider by injecting it to a fake module's config block
      angular.module('testApp', function () {})
        .config(function (SpotifyProvider) {
        spotifyProvider = SpotifyProvider;
      });
      // Initialize angular-spotify injector
      module('spotify', 'testApp');

      // Kickstart the injectors previously registered with calls to angular.mock.module
      inject(function () {});
    });

    it('should be defined', function () {
      expect(spotifyProvider).toBeDefined();
    });

    it('should have a method setClientId()', function () {
      expect(spotifyProvider.setClientId).toBeDefined();
    });

    it('should have a method getClientId()', function () {
      expect(spotifyProvider.getClientId).toBeDefined();
    });

    it('should have a method setRedirectUri()', function () {
      expect(spotifyProvider.setRedirectUri).toBeDefined();
    });

    it('should have a method getRedirectUri()', function () {
      expect(spotifyProvider.getRedirectUri).toBeDefined();
    });

    it('should have a method setScope()', function () {
      expect(spotifyProvider.setScope).toBeDefined();
    });

    it('should have a method setScope()', function () {
      expect(spotifyProvider.setScope).toBeDefined();
    });

    it('should set the client id', function () {
      expect(spotifyProvider.setClientId('ABCDEFGHIJKLMNOP')).toBe('ABCDEFGHIJKLMNOP');
    });

    it('should get the client id', function () {
      spotifyProvider.setClientId('ABCDEFGHIJKLMNOP');
      expect(spotifyProvider.getClientId()).toBe('ABCDEFGHIJKLMNOP');
    });

    it('should set the Redirect Uri', function () {
      expect(spotifyProvider.setRedirectUri('http://example.com/callback.html')).toBe('http://example.com/callback.html');
    });

    it('should get the Redirect Uri', function () {
      spotifyProvider.setRedirectUri('http://example.com/callback.html');
      expect(spotifyProvider.getRedirectUri()).toBe('http://example.com/callback.html');
    });

    it('should set the scope', function () {
      expect(spotifyProvider.setScope('user-read-private playlist-read-private')).toBe('user-read-private playlist-read-private');
    });

  });

  //For injecting into controllers
  describe('Spotify', function () {

    beforeEach(module('spotify'));

    var Spotify;

    beforeEach(inject(function (_Spotify_) {
      Spotify = _Spotify_;
    }));

    it('should be defined', function () {
      expect(Spotify).toBeDefined();
    });

    it('should be an object', function () {
      expect(typeof Spotify).toBe('object');
    });

    it('should have a method api()', function () {
      expect(Spotify.api).toBeDefined();
    });

    it('should have a method search()', function () {
      expect(Spotify.search).toBeDefined();
    });

    it('should have a method getAlbum()', function () {
      expect(Spotify.getAlbum).toBeDefined();
    });

    it('should have a method getAlbums()', function () {
      expect(Spotify.getAlbums).toBeDefined();
    });

    it('should have a method getAlbumTracks()', function () {
      expect(Spotify.getAlbumTracks).toBeDefined();
    });

    it('should have a method getArtist()', function () {
      expect(Spotify.getArtist).toBeDefined();
    });

    it('should have a method getArtists()', function () {
      expect(Spotify.getArtists).toBeDefined();
    });

    it('should have a method getArtistAlbums()', function () {
      expect(Spotify.getArtistAlbums).toBeDefined();
    });

    it('should have a method getArtistTopTracks()', function () {
      expect(Spotify.getArtistTopTracks).toBeDefined();
    });

    it('should have a method getRelatedArtists()', function () {
      expect(Spotify.getRelatedArtists).toBeDefined();
    });

    it('should have a method getTrack()', function () {
      expect(Spotify.getTrack).toBeDefined();
    });

    it('should have a method getTracks()', function () {
      expect(Spotify.getTracks).toBeDefined();
    });

    it('should have a method getUserPlaylists()', function () {
      expect(Spotify.getUserPlaylists).toBeDefined();
    });

    it('should have a method getPlaylist()', function () {
      expect(Spotify.getPlaylist).toBeDefined();
    });

    it('should have a method getPlaylistTracks()', function () {
      expect(Spotify.getPlaylistTracks).toBeDefined();
    });

    it('should have a method createPlaylist()', function () {
      expect(Spotify.createPlaylist).toBeDefined();
    });

    it('should have a method addPlaylistTracks()', function () {
      expect(Spotify.addPlaylistTracks).toBeDefined();
    });

    it('should have a method removePlaylistTracks()', function () {
      expect(Spotify.removePlaylistTracks).toBeDefined();
    });

    it('should have a method replacePlaylistTracks()', function () {
      expect(Spotify.replacePlaylistTracks).toBeDefined();
    });

    it('should have a method updatePlaylistDetails()', function () {
      expect(Spotify.updatePlaylistDetails).toBeDefined();
    });

    it('should have a method getUser()', function () {
      expect(Spotify.getUser).toBeDefined();
    });

    it('should have a method getCurrentUser()', function () {
      expect(Spotify.getCurrentUser).toBeDefined();
    });

    it('should have a method getSavedUserTracks()', function () {
      expect(Spotify.getSavedUserTracks).toBeDefined();
    });

    it('should have a method userTracksContains()', function () {
      expect(Spotify.userTracksContains).toBeDefined();
    });

    it('should have a method saveUserTracks()', function () {
      expect(Spotify.saveUserTracks).toBeDefined();
    });

    it('should have a method removeUserTracks()', function () {
      expect(Spotify.removeUserTracks).toBeDefined();
    });

    it('should have a method setAuthToken()', function () {
      expect(Spotify.setAuthToken).toBeDefined();
    });

    it('should have a method login()', function () {
      expect(Spotify.login).toBeDefined();
    });

    it('should set the AuthToken', function () {
      expect(Spotify.setAuthToken('ABCDEFGHIJKLMNOP')).toBe('ABCDEFGHIJKLMNOP');
    });

    it('should turn an object into a query string', function () {
      expect(Spotify.toQueryString({a: 't', b: 4, c: 'q'})).toBe('a=t&b=4&c=q');
    });

    it('should have a method getFeaturedPlaylists()', function () {
      expect(Spotify.getFeaturedPlaylists).toBeDefined();
    });

    it('should have a method getNewReleases()', function () {
      expect(Spotify.getNewReleases).toBeDefined();
    });


    describe('Spotify.api', function () {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
        jasmine.getJSONFixtures().fixturesPath='base/test/mock';
      }));

      afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should call the api with params', function () {
        $httpBackend.when('GET', api + '/search?q=Nirvana&type=artist').respond(
          getJSONFixture('search.artist.json')
        );

        var result;
        Spotify.api('/search', 'GET', {
          q: 'Nirvana',
          type: 'artist'
        }).then(function (data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
      });

      it('should call the api with data', function () {
        $httpBackend.when('POST', api + '/users/wizzler/playlists', {
          name: 'TESTING',
          public: false
        }).respond({});

        var result;
        Spotify.api('/users/wizzler/playlists', 'POST', null, {
          name: 'TESTING',
          public: false
        }).then(function (data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
      });

      it('should call the api with headers', function () {
        $httpBackend.when('POST', api + '/users/wizzler/playlists', {
          name: 'TESTING',
          public: false
        }, function (headers) {
          return headers.Authorization === 'Bearer TESTING';
        }).respond({});

        var result;
        Spotify.api('/users/wizzler/playlists', 'POST', null, {
          name: 'TESTING',
          public: false
        }, {
          'Authorization': 'Bearer TESTING'
        }).then(function (data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
      });
    });

    describe('Spotify.search', function () {

      var $httpBackend;
      var $rootScope;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_, _$rootScope_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        jasmine.getJSONFixtures().fixturesPath='base/test/mock';
      }));

      it('should make an ajax call to https://api.spotify.com/v1/search', function () {

        spyOn(Spotify, 'api');

        Spotify.search('Nirvana', 'artist');

        expect(Spotify.api).toHaveBeenCalledWith('/search', 'GET', {
          q: 'Nirvana',
          type: 'artist'
        });
      });

      it('should return an array of artists', function () {
        $httpBackend.when('GET', api + '/search?q=Nirvana&type=artist').respond(
          getJSONFixture('search.artist.json')
        );

        Spotify.search('Nirvana', 'artist').then(function (data) {
          expect(data).toBeDefined();
          expect(data.artists.items.length).toBe(20);
        });

        $httpBackend.flush();
      });

      it('should reject the promise and respond with error', function () {
        $httpBackend.when('GET', api + '/search?q=Nirvana').respond(400, getJSONFixture('search.missing-type.json'));

        var result;
        Spotify.search('Nirvana').then(function () {
        }, function (reason) {
          result = reason;
        });

        $httpBackend.flush();
        expect(result).toBeDefined();
        expect(result instanceof Object).toBeTruthy();
        expect(result.error.status).toBe(400);
      });

    });

    //Albums
    describe('Albums', function () {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      describe('Spotify.getAlbum', function () {

        it('should make an ajax call to https://api.spotify.com/v1/albums', function () {

          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj').respond(getJSONFixture('album.json'));

          expect(Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {
          spyOn(Spotify, 'api');

          Spotify.getAlbum('spotify:album:0sNOF9WDwhWunNAHPD3Baj');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/albums/0sNOF9WDwhWunNAHPD3Baj');
        });

        it('should resolve to an object of an album', function () {
          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj').respond(200, getJSONFixture('album.json'));

          var result;
          Spotify
            .getAlbum('0sNOF9WDwhWunNAHPD3Baj')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/albums/ABCDEFGHIJKLMNOP').respond(404, getJSONFixture('album.error.json'));

          var result;
          Spotify.getAlbum('ABCDEFGHIJKLMNOP').then(function () {
          }, function (reason) {
            result = reason;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(404);
        });
      });

      describe('Spotify.getAlbums', function () {

        it('should make an ajax call to https://api.spotify.com/v1/albums?ids={ids}', function () {

          $httpBackend.when('GET', api + '/albums?ids=41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').respond(getJSONFixture('albums.json'));

          expect(Spotify.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37')).toBeDefined();
        });

        it('should resolve to an array of albums', function () {
          $httpBackend.when('GET', api + '/albums?ids=41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').respond(200, getJSONFixture('albums.json'));

          var result;
          Spotify
            .getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.albums instanceof Array).toBeTruthy();
          expect(result.albums.length).toBe(3);
        });

        it('should convert spotify uris to ids', function () {
          spyOn(Spotify, 'api');

          Spotify.getAlbums('spotify:album:41MnTivkwTO3UUJ8DrqEJJ,spotify:album:6JWc4iAiJ9FjyK0B59ABb4,spotify:album:6UXCm6bOO4gFlDQZV5yL37');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/albums', 'GET', {
            ids: '41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37'
          });
        });

        it('should resolve to an array of albums when sending an array', function () {
          $httpBackend.when('GET', api + '/albums?ids=41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').respond(200, getJSONFixture('albums.json'));

          var result;
          Spotify
            .getAlbums(['41MnTivkwTO3UUJ8DrqEJJ','6JWc4iAiJ9FjyK0B59ABb4','6UXCm6bOO4gFlDQZV5yL37'])
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.albums instanceof Array).toBeTruthy();
          expect(result.albums.length).toBe(3);
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/albums?ids=').respond(400, getJSONFixture('albums.invalid-id.json'));

          var result;
          Spotify.getAlbums().then(function () {
          }, function (reason) {
            result = reason;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getAlbumTracks', function () {

        it('should make an ajax call to https://api.spotify.com/v1/albums/{id}/tracks', function () {

          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj/tracks').respond(getJSONFixture('albums.tracks.json'));

          expect(Spotify.getAlbumTracks('0sNOF9WDwhWunNAHPD3Baj')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {
          spyOn(Spotify, 'api');
          Spotify.getAlbumTracks('spotify:album:0sNOF9WDwhWunNAHPD3Baj');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/albums/0sNOF9WDwhWunNAHPD3Baj/tracks', 'GET', undefined);
        });

        it('should resolve to an object of album tracks', function () {
          $httpBackend.when('GET', api + '/albums/0sNOF9WDwhWunNAHPD3Baj/tracks').respond(200, getJSONFixture('albums.tracks.json'));

          var result;
          Spotify
            .getAlbumTracks('0sNOF9WDwhWunNAHPD3Baj')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.items.length).toBe(13);
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/albums/ABCDEFGHIJKLMNOP/tracks').respond(404, getJSONFixture('album.error.json'));

          var result;
          Spotify
            .getAlbumTracks('ABCDEFGHIJKLMNOP')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(404);
        });
      });
    });

    describe('Artists', function () {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      describe('Spotify.getArtist', function () {

        it('should make an ajax call to https://api.spotify.com/v1/artists/{id}', function () {
          expect(Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {
          spyOn(Spotify, 'api');

          Spotify.getArtist('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/artists/0LcJLqbBmaGUft1e9Mm8HV');
        });

        it('should resolve to an object of an artist', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV').respond(200, { 'external_urls': {} });

          var result;
          Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/artists/ABCDEFGHIJKLMNOP').respond(404, {
            'error': {
              'status': 404,
              'message': 'non existing id'
            }
          });

          var result;
          Spotify.getArtist('ABCDEFGHIJKLMNOP').then(function () {
          }, function (reason) {
            result = reason;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(404);
        });
      });

      describe('Spotify.getArtists', function () {

        it('should make an ajax call to https://api.spotify.com/v1/artists?ids={id}', function () {
          expect(Spotify.getArtists('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin')).toBeDefined();
        });

        it('should resolve to an object of an artist', function () {
          $httpBackend.when('GET', api + '/artists/?ids=0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin').respond(200, { 'artists': [] });

          var result;
          Spotify
            .getArtists('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should convert spotify uris to ids', function () {
          spyOn(Spotify, 'api');

          Spotify.getArtists('spotify:artist:0oSGxfWSnnOXhD2fKuz2Gy,spotify:artist:3dBVyJ7JuOMt4GE9607Qin');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/artists/', 'GET', {
            ids: '0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin'
          });
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/artists/?ids=').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getArtists()
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getArtistAlbums', function() {
        it('should make an ajax call to https://api.spotify.com/v1/artists/{id}/albums', function () {
          expect(Spotify.getArtistAlbums('0LcJLqbBmaGUft1e9Mm8HV')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {
          spyOn(Spotify, 'api');

          Spotify.getArtistAlbums('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV');
          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/artists/0LcJLqbBmaGUft1e9Mm8HV/albums', 'GET', undefined);
        });

        it('should resolve to an array of artist albums', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/albums').respond(200, { 'albums': [] });

          var result;
          Spotify.getArtistAlbums('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/artists/ABCDEFGHIJKLMNOP/albums').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getArtistAlbums('ABCDEFGHIJKLMNOP')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getArtistTopTracks', function() {
        it('should make an ajax call to https://api.spotify.com/v1/artists/{id}/top-tracks', function () {
          expect(Spotify.getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV', 'AU')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {

          spyOn(Spotify, 'api');

          Spotify.getArtistTopTracks('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV', 'AU');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/artists/0LcJLqbBmaGUft1e9Mm8HV/top-tracks', 'GET', {
            country: 'AU'
          });
        });

        it('should resolve to an array of artist albums', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/top-tracks?country=AU').respond(200, { 'albums': [] });

          var result;
          Spotify
            .getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV', 'AU')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise if the id is incorrect', function () {
          $httpBackend.when('GET', api + '/artists/ABCDEFGHIJKLMNOP/top-tracks?country=AU').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getArtistTopTracks('ABCDEFGHIJKLMNOP', 'AU')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });

        it('should reject if the country is not defined', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/top-tracks').respond(400, {
            'error': {
              'status': 400,
              'message': 'missing country parameter'
            }
          });

          var result;
          Spotify
            .getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getRelatedArtists', function() {
        it('should make an ajax call to https://api.spotify.com/v1/artists/{id}/related-artists', function () {
          expect(Spotify.getRelatedArtists('0LcJLqbBmaGUft1e9Mm8HV')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {
          spyOn(Spotify, 'api');

          Spotify.getRelatedArtists('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/artists/0LcJLqbBmaGUft1e9Mm8HV/related-artists');
        });

        it('should resolve to an array of artists', function () {
          $httpBackend.when('GET', api + '/artists/0LcJLqbBmaGUft1e9Mm8HV/related-artists').respond(200, { 'albums': [] });

          var result;
          Spotify
            .getRelatedArtists('0LcJLqbBmaGUft1e9Mm8HV')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/artists/ABCDEFGHIJKLMNOP/related-artists').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getRelatedArtists('ABCDEFGHIJKLMNOP')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });
    });

    describe('Tracks', function () {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      describe('Spotify.getTrack', function() {

        it('should make an ajax call to https://api.spotify.com/v1/tracks/{id}', function () {
          expect(Spotify.getTrack('0eGsygTp906u18L0Oimnem')).toBeDefined();
        });

        it('should convert spotify uri to just an id', function () {

          spyOn(Spotify, 'api');

          Spotify.getTrack('spotify:artist:0eGsygTp906u18L0Oimnem');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/tracks/0eGsygTp906u18L0Oimnem');
        });

        it('should resolve to an object of a track', function () {
          $httpBackend.when('GET', api + '/tracks/0eGsygTp906u18L0Oimnem').respond(200, { 'albums': [] });

          var result;
          Spotify
            .getTrack('0eGsygTp906u18L0Oimnem')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/tracks/ABCDEFGHIJKLMNOP').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getTrack('ABCDEFGHIJKLMNOP')
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

      describe('Spotify.getTracks', function() {
        it('should make an ajax call to https://api.spotify.com/v1/tracks?ids={id}', function () {
          expect(Spotify.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G')).toBeDefined();
        });

        it('should resolve to an array of tracks', function () {
          $httpBackend.when('GET', api + '/tracks/?ids=0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').respond(200, { 'tracks': [] });

          var result;
          Spotify
            .getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G')
            .then(function (data) {
              result = data;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should convert spotify uris to Ids', function () {
          spyOn(Spotify, 'api');

          Spotify.getTracks('spotify:track:0eGsygTp906u18L0Oimnem,spotify:track:1lDWb6b6ieDQ2xT7ewTC3G');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/tracks/', 'GET', {
            ids: '0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G'
          });
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/tracks/?ids=').respond(400, {
            'error': {
              'status': 400,
              'message': 'invalid id'
            }
          });

          var result;
          Spotify
            .getTracks()
            .then(function () {
            }, function (reason) {
              result = reason;
            });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(400);
        });
      });

    });

    describe('Playlists', function () {

      describe('Spotify.getUserPlaylists', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.getUserPlaylists('wizzler');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/wizzler/playlists', 'GET', undefined, null, {
            'Authorization': 'Bearer TESTING'
          });
        });

      });

      describe('Spotify.getPlaylist', function() {

        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.getPlaylist('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb', 'GET', undefined, null, {
            'Authorization': 'Bearer TESTING'
          });
        });

      });

      describe('Spotify.getPlaylistTracks', function() {

        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.getPlaylistTracks('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb');

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', 'GET', undefined, null, {
            'Authorization': 'Bearer TESTING'
          });
        });

      });

      describe('Spotify.createPlaylist', function() {

        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.createPlaylist('1176458919', {
            name: 'Awesome Mix Vol. 1'
          });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/1176458919/playlists', 'POST', null, {
            name: 'Awesome Mix Vol. 1'
          }, {
            'Authorization': 'Bearer TESTING',
            'Content-Type': 'application/json'
          });
        });

      });

      describe('Spotify.addPlaylistTracks', function() {

        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.addPlaylistTracks('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            'spotify:track:5LwukQO2fCx35GUUN6d6NW',
            'spotify:track:4w8CsAnzn0lXJxYlAuCtCW',
            'spotify:track:2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', 'POST', {
            uris: 'spotify:track:5LwukQO2fCx35GUUN6d6NW,spotify:track:4w8CsAnzn0lXJxYlAuCtCW,spotify:track:2Foc5Q5nqNiosCNqttzHof',
            position: null
          }, null, {
            'Authorization': 'Bearer TESTING',
            'Content-Type': 'application/json'
          });
        });

        it('should be able to pass Track IDs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.addPlaylistTracks('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            '5LwukQO2fCx35GUUN6d6NW',
            '4w8CsAnzn0lXJxYlAuCtCW',
            '2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', 'POST', {
            uris: 'spotify:track:5LwukQO2fCx35GUUN6d6NW,spotify:track:4w8CsAnzn0lXJxYlAuCtCW,spotify:track:2Foc5Q5nqNiosCNqttzHof',
            position: null
          }, null, {
            'Authorization': 'Bearer TESTING',
            'Content-Type': 'application/json'
          });
        });

      });

      describe('Spotify.removePlaylistTracks', function() {
        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.removePlaylistTracks('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            'spotify:track:5LwukQO2fCx35GUUN6d6NW',
            'spotify:track:4w8CsAnzn0lXJxYlAuCtCW',
            'spotify:track:2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', 'DELETE', null, {
            tracks: [
              {uri: 'spotify:track:5LwukQO2fCx35GUUN6d6NW'},
              {uri: 'spotify:track:4w8CsAnzn0lXJxYlAuCtCW'},
              {uri: 'spotify:track:2Foc5Q5nqNiosCNqttzHof'}
            ]
          }, {
            'Authorization': 'Bearer TESTING',
            'Content-Type': 'application/json'
          });
        });

        it('should be able to pass track IDs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.removePlaylistTracks('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            '5LwukQO2fCx35GUUN6d6NW',
            '4w8CsAnzn0lXJxYlAuCtCW',
            '2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', 'DELETE', null, {
            tracks: [
              {uri: 'spotify:track:5LwukQO2fCx35GUUN6d6NW'},
              {uri: 'spotify:track:4w8CsAnzn0lXJxYlAuCtCW'},
              {uri: 'spotify:track:2Foc5Q5nqNiosCNqttzHof'}
            ]
          }, {
            'Authorization': 'Bearer TESTING',
            'Content-Type': 'application/json'
          });
        });
      });

      describe('Spotify.replacePlaylistTracks', function() {
        it('should call the correct url', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.replacePlaylistTracks('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            'spotify:track:5LwukQO2fCx35GUUN6d6NW',
            'spotify:track:4w8CsAnzn0lXJxYlAuCtCW',
            'spotify:track:2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', 'PUT', {
            uris: 'spotify:track:5LwukQO2fCx35GUUN6d6NW,spotify:track:4w8CsAnzn0lXJxYlAuCtCW,spotify:track:2Foc5Q5nqNiosCNqttzHof'
          }, null, {
            'Authorization': 'Bearer TESTING',
            'Content-Type': 'application/json'
          });
        });

        it('should be able to pass track IDs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.replacePlaylistTracks('triple.j.abc', '73ppZmbaAS2aW9hmDTTDcb', [
            '5LwukQO2fCx35GUUN6d6NW',
            '4w8CsAnzn0lXJxYlAuCtCW',
            '2Foc5Q5nqNiosCNqttzHof'
          ]);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/triple.j.abc/playlists/73ppZmbaAS2aW9hmDTTDcb/tracks', 'PUT', {
            uris: 'spotify:track:5LwukQO2fCx35GUUN6d6NW,spotify:track:4w8CsAnzn0lXJxYlAuCtCW,spotify:track:2Foc5Q5nqNiosCNqttzHof'
          }, null, {
            'Authorization': 'Bearer TESTING',
            'Content-Type': 'application/json'
          });
        });
      });

      describe('Spotify.updatePlaylistDetails', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.updatePlaylistDetails('1176458919', '3ygKiRcD8ed3i2g8P7jlXr', {
            name: 'Awesome Mix Vol. 2'
          });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/users/1176458919/playlists/3ygKiRcD8ed3i2g8P7jlXr', 'PUT', null, {
            name: 'Awesome Mix Vol. 2'
          }, {
            'Authorization': 'Bearer TESTING',
            'Content-Type': 'application/json'
          });
        });

      });

    });

    describe('User Profiles', function() {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      describe('Spotify.getUser', function() {
        it('should make an ajax call to https://api.spotify.com/v1/users/{id}', function () {
          expect(Spotify.getUser('wizzler')).toBeDefined();
        });

        it('should resolve to an object of a user', function () {
          $httpBackend.when('GET', api + '/users/wizzler').respond(200, { });

          var result;
          Spotify.getUser('wizzler').then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
        });

        it('should reject the promise and respond with error', function () {
          $httpBackend.when('GET', api + '/users/:":ADSAD').respond(404, {
            'error': {
              'status': 404,
              'message': 'No such user'
            }
          });

          var result;
          Spotify.getUser(':":ADSAD').then(function () {
          }, function (reason) {
            result = reason;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.error.status).toBe(404);
        });
      });

      describe('Spotify.getCurrentUser', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.getCurrentUser();

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me', 'GET', null, null, {
            'Authorization': 'Bearer TESTING'
          });
        });

      });

    });

    describe('User Library', function () {

      describe('Spotify.getSavedUserTracks', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.getSavedUserTracks();

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks', 'GET', undefined, null, {
            'Authorization': 'Bearer TESTING'
          });
        });

      });

      describe('Spotify.userTracksContains', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.userTracksContains(['0udZHhCi7p1YzMlvI4fXoK','3SF5puV5eb6bgRSxBeMOk9']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks/contains', 'GET', {
            ids: '0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9'
          }, null, {
            'Authorization': 'Bearer TESTING'
          });
        });

        it('should be able to pass Spotify URIs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.userTracksContains(['spotify:track:0udZHhCi7p1YzMlvI4fXoK','spotify:track:3SF5puV5eb6bgRSxBeMOk9']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks/contains', 'GET', {
            ids: '0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9'
          }, null, {
            'Authorization': 'Bearer TESTING'
          });
        });

      });

      describe('Spotify.saveUserTracks', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.saveUserTracks(['4iV5W9uYEdYUVa79Axb7Rh','1301WleyT98MSxVHPZCA6M']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks', 'PUT', {
            ids: '4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M'
          }, null, {
            'Authorization': 'Bearer TESTING'
          });
        });

        it('should be able to pass Spotify URIs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.saveUserTracks(['spotify:track:0udZHhCi7p1YzMlvI4fXoK','spotify:track:3SF5puV5eb6bgRSxBeMOk9']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks', 'PUT', {
            ids: '0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9'
          }, null, {
            'Authorization': 'Bearer TESTING'
          });
        });

      });

      describe('Spotify.removeUserTracks', function () {

        it('should call the correct URL', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.removeUserTracks(['4iV5W9uYEdYUVa79Axb7Rh','1301WleyT98MSxVHPZCA6M']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks', 'DELETE', {
            ids: '4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M'
          }, null, {
            'Authorization': 'Bearer TESTING',
            'Content-Type': 'application/json'
          });
        });

        it('should be able to pass Spotify URIs', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.removeUserTracks(['spotify:track:0udZHhCi7p1YzMlvI4fXoK','spotify:track:3SF5puV5eb6bgRSxBeMOk9']);

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/me/tracks', 'DELETE', {
            ids: '0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9'
          }, null, {
            'Authorization': 'Bearer TESTING',
            'Content-Type': 'application/json'
          });
        });

      });

    });

    describe('Browse', function() {
      var $httpBackend;
      var Spotify;
      var api = 'https://api.spotify.com/v1';

      beforeEach(inject(function(_Spotify_, _$httpBackend_) {
        Spotify = _Spotify_;
        $httpBackend = _$httpBackend_;
      }));

      describe('Browse.getFeaturedPlaylists', function() {

        it('should call the correct URL with authentication and options', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.getFeaturedPlaylists({ country: 'NL', locale: 'nl_NL' });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/browse/featured-playlists', 'GET', {
            country: 'NL', locale: 'nl_NL'
          }, null, {
            'Authorization': 'Bearer TESTING'
          });
        });

        it('should resolve to an object with a message and playlists', function () {
          $httpBackend.when('GET', api + '/browse/featured-playlists').respond(200, getJSONFixture('featured-playlists.json'));

          var result;
          Spotify.getFeaturedPlaylists().then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.message).toBeDefined();
          expect(result.playlists).toBeDefined();
        });

      });

      describe('Browse.getNewReleases', function() {

        it('should call the correct URL with authentication and options', function () {
          spyOn(Spotify, 'api');

          Spotify.setAuthToken('TESTING');

          Spotify.getNewReleases({ country: 'NL' });

          expect(Spotify.api).toHaveBeenCalled();
          expect(Spotify.api).toHaveBeenCalledWith('/browse/new-releases', 'GET', {
            country: 'NL'
          }, null, {
            'Authorization': 'Bearer TESTING'
          });
        });

        it('should resolve to an object with albums', function () {
          $httpBackend.when('GET', api + '/browse/new-releases').respond(200, getJSONFixture('new-releases.json'));

          var result;
          Spotify.getNewReleases().then(function (data) {
            result = data;
          });

          $httpBackend.flush();
          expect(result).toBeDefined();
          expect(result instanceof Object).toBeTruthy();
          expect(result.albums).toBeDefined();
        });

      });
    });

  });

});

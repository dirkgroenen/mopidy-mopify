'use strict';
 
describe('Artists', function() {
  var echonest, httpBackend;
  var apiUrl = 'http://developer.echonest.com/api/v4/';

  var songsApiResponse = {
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

  var songApiResponse = {
    response: {
      songs: [
        {
          artist_id: '456',
          id: '74574',
          artist_name: 'motorhead',
          title: 'foo bar'
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

    httpBackend.when('JSONP', apiUrl + 'song/profile?api_key=&callback=JSON_CALLBACK&format=jsonp&id=SOCZMFK12AC468668F').respond(songApiResponse);
    httpBackend.when('JSONP', apiUrl + 'song/search?api_key=&callback=JSON_CALLBACK&format=jsonp&name=foo+bar').respond(songsApiResponse);
    httpBackend.when('JSONP', apiUrl + 'song/identify?api_key=&artist=Michael+Jackson&callback=JSON_CALLBACK&code=eJxVlIuNwzAMQ1fxC&format=jsonp&title=Billie+Jean').respond(songsApiResponse);
  }));
    
  //  
  // Songs
  //
  it('get method should return song object', function() {
    echonest.songs.get({
      id: 'SOCZMFK12AC468668F'
    }).then(function(song, status) {
      expect(song.artist_id).toBe('456');
      expect(song.id).toBe('74574');
      expect(song.artist_name).toBe('motorhead');
      expect(song.title).toBe('foo bar');
    });

    httpBackend.flush();
  });

  it('search method should return array of song objects', function() {
    echonest.songs.search({
      name: 'foo bar'
    }).then(function(songs, status) {
      expect(songs.constructor.name).toBe('Array');
      expect(songs[0].constructor.name).toBe('Object');
      expect(songs[0].artist_id).toBe('456');
      expect(songs[0].id).toBe('74574');
      expect(songs[0].artist_name).toBe('motorhead');
      expect(songs[0].title).toBe('foo bar');
    });

    httpBackend.flush();
  });

  it('identify method should return array of song objects', function() {
    echonest.songs.identify({
      artist: 'Michael Jackson',
      title: 'Billie Jean',
      code: 'eJxVlIuNwzAMQ1fxC'
    }).then(function(songs, status) {
      expect(songs.constructor.name).toBe('Array');
      expect(songs[0].constructor.name).toBe('Object');
      expect(songs[0].artist_id).toBe('456');
      expect(songs[0].id).toBe('74574');
      expect(songs[0].artist_name).toBe('motorhead');
      expect(songs[0].title).toBe('foo bar');
    });

    httpBackend.flush();
  });
});

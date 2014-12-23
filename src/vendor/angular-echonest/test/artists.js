'use strict';
 
describe('Artists', function() {
  var echonest, httpBackend;
  var apiUrl = 'http://developer.echonest.com/api/v4/';
  var artistApiMethods = ['biographies', 'blogs', 'images', 'news', 'reviews', 'songs', 'familiarity', 'hotttnesss', 'similar', 'terms', 'twitter', 'urls'];

  var artistsApiResponse = {
    response: {
      artists: [
        {
          id: 'AR212SC1187FB4A4F9',
          name: 'nirvana'
        },
        {
          id: 'ARTSYYD1369F266E57',
          name: 'acdc'
        },
        {
          id: 'AR6ZH2F1187FB4FB84',
          name: 'motorhead'
        }
      ],
      status: {
        code: 0,
        message: 'Success',
        version: '4.2'
      }
    }
  };

  var artistApiResponse = {
    response: {
      artist: {
        id: 'AR212SC1187FB4A4F9',
        name: 'motorhead'
      },
      status: {
        code: 0,
        message: 'Success',
        version: '4.2'
      }
    }
  };

  var artistApiMethodsResponse = function(name) {
    var obj = {response: {}};

    obj.response[name] = [];

    return obj;
  };

  var getSingleArtist = function() {
    var result;

    echonest.artists.get({
      name: 'motorhead'
    }).then(function(artist, status) {
      result = artist;
    });

    httpBackend.flush();

    return result;
  };

  beforeEach(angular.mock.module('angular-echonest'));

  beforeEach(inject(function($injector) {
    echonest = $injector.get('Echonest');
    httpBackend = $injector.get("$httpBackend");

    httpBackend.when('JSONP', apiUrl + 'artist/profile?api_key=&callback=JSON_CALLBACK&format=jsonp&name=motorhead').respond(artistApiResponse);

    httpBackend.when('JSONP', apiUrl + 'artist/search?api_key=&callback=JSON_CALLBACK&format=jsonp&name=motorhead').respond(artistsApiResponse);
    httpBackend.when('JSONP', apiUrl + 'artist/top_hottt?api_key=&callback=JSON_CALLBACK&format=jsonp&results=3').respond(artistsApiResponse);
    httpBackend.when('JSONP', apiUrl + 'artist/suggest?api_key=&callback=JSON_CALLBACK&format=jsonp&name=motorhead').respond(artistsApiResponse);
    httpBackend.when('JSONP', apiUrl + 'artist/extract?api_key=&callback=JSON_CALLBACK&format=jsonp&text=abc+motorhead+abc').respond(artistsApiResponse);

    for (var i in artistApiMethods) {
      httpBackend.when('JSONP', apiUrl + 'artist/' + artistApiMethods[i] + '?api_key=&callback=JSON_CALLBACK&format=jsonp&id=AR212SC1187FB4A4F9').respond(artistApiMethodsResponse(artistApiMethods[i]));
    }
  }));
    
  //  
  // Artists
  //
  it('get method should return artist object', function() {
    echonest.artists.get({
      name: 'motorhead'
    }).then(function(artist) {
      expect(artist.constructor.name).toBe('Object');
      expect(artist.id).toBe('AR212SC1187FB4A4F9');
      expect(artist.name).toBe('motorhead');
    });

    httpBackend.flush();
  });

  it('search method should return array of artist objects', function() {
    echonest.artists.search({
      name: 'motorhead'
    }).then(function(artists, status) {
      expect(artists.constructor.name).toBe('Array');
      expect(artists[0].constructor.name).toBe('Object');
      expect(artists[0].id).toBe('AR212SC1187FB4A4F9');
      expect(artists[0].name).toBe('nirvana');
    });

    httpBackend.flush();
  });

  it('topHot method should return array of artist objects', function() {
    echonest.artists.topHot({
      results: 3
    }).then(function(artists, status) {
      expect(artists.constructor.name).toBe('Array');
      expect(artists[0].constructor.name).toBe('Object');
      expect(artists[0].id).toBe('AR212SC1187FB4A4F9');
      expect(artists[0].name).toBe('nirvana');
    });

    httpBackend.flush();
  });

  it('suggest method should return array of artist objects', function() {
    echonest.artists.suggest({
      name: 'motorhead'
    }).then(function(artists, status) {
      expect(artists.constructor.name).toBe('Array');
      expect(artists[0].constructor.name).toBe('Object');
      expect(artists[0].id).toBe('AR212SC1187FB4A4F9');
      expect(artists[0].name).toBe('nirvana');
    });

    httpBackend.flush();
  });

  it('extract method should return array of artist objects', function() {
    echonest.artists.extract({
      text: 'abc motorhead abc'
    }).then(function(artists, status) {
      expect(artists.constructor.name).toBe('Array');
      expect(artists[0].constructor.name).toBe('Object');
      expect(artists[0].id).toBe('AR212SC1187FB4A4F9');
      expect(artists[0].name).toBe('nirvana');
    });

    httpBackend.flush();
  });

  it('getBiographies method should insert biographies array into artist object', function() {
    var artist = getSingleArtist();

    artist.getBiographies().then(function(artist) {
      expect(artist.biographies instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });

  it('getBlogs method should insert blogs array into artist object', function() {
    var artist = getSingleArtist();

    artist.getBlogs().then(function(artist) {
      expect(artist.blogs instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });

  it('getImages method should insert images array into artist object', function() {
    var artist = getSingleArtist();

    artist.getImages().then(function(artist) {
      expect(artist.images instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });

  it('getNews method should insert news array into artist object', function() {
    var artist = getSingleArtist();

    artist.getNews().then(function(artist) {
      expect(artist.news instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });

  it('getReviews method should insert reviews array into artist object', function() {
    var artist = getSingleArtist();

    artist.getReviews().then(function(artist) {
      expect(artist.reviews instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });

  it('getSongs method should insert songs array into artist object', function() {
    var artist = getSingleArtist();

    artist.getSongs().then(function(artist) {
      expect(artist.songs instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });

  it('getFamiliarity method should insert familiarity array into artist object', function() {
    var artist = getSingleArtist();

    artist.getFamiliarity().then(function(artist) {
      expect(artist.familiarity instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });

  it('getHotnes method should insert hotttnesss array into artist object', function() {
    var artist = getSingleArtist();

    artist.getHotnes().then(function(artist) {
      expect(artist.hotttnesss instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });

  it('getSimilar method should insert similar array into artist object', function() {
    var artist = getSingleArtist();

    artist.getSimilar().then(function(artist) {
      expect(artist.similar instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });

  it('getTerms method should insert terms array into artist object', function() {
    var artist = getSingleArtist();

    artist.getTerms().then(function(artist) {
      expect(artist.terms instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });

  it('getTwitter method should insert twitter array into artist object', function() {
    var artist = getSingleArtist();

    artist.getTwitter().then(function(artist) {
      expect(artist.twitter instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });

  it('getUrls method should insert urls array into artist object', function() {
    var artist = getSingleArtist();

    artist.getUrls().then(function(artist) {
      expect(artist.urls instanceof Array).toBe(true);
    });

    httpBackend.flush();
  });
});

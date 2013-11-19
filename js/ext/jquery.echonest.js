(function(window, $) {
	
	/**
	 * Root class. This can be invoked multiple times if you want to connect to the API with different options / keys.
	 */
	function EchoNest(apiKey, options) {
		var that = this;
		
		function hasJQueryTemplates() {
			return (typeof $ === "function" && typeof $.tmpl === "function");
		}
		
		function hasUnderscoreTemplates() {
			return (typeof _ === "function");
		}
		
		function isInteger(s) {
			return (s%(parseInt(s)/Number(s)))===0;
		}
		
		// Determines the templating engine and memoizes the function used to find it.
		that.getTemplatingEngine = function() {
			var name, engine;
			if( hasJQueryTemplates() ) {
				name = "jQuery";
				engine = $.tmpl;
			} else if( hasUnderscoreTemplates() ) {
				name = "Underscore";
				engine = _.template;
			} else {
				throw new Error('Either the jQuery template or Underscore template engines must be installed to convert a collection to html')
			}
			return {
				name: name,
				engine: engine
			}
		}
		
		// TODO: This should use proxy objects, implement once more templating engines are implemented
		function toTemplate(template, data, options) {
			console.log(data);
			var engineDetails = that.getTemplatingEngine(), html;
			
			options = $.extend({},{start: 0}, options);
			if( options.end ) {
				data = data.slice(options.start, options.end);
			} else {
				data = data.slice(options.start);
			}
			
			if( engineDetails.name === "jQuery" ) {
				
				html = engineDetails.engine( template, data );
				
			} else if ( engineDetails.name === "Underscore" ) {

				// underscore templates don't support arrays, we must manually loop over the array and construct html
				var compiled = engineDetails.engine(template);
				$.each(data, function(count, item) {
					html += compiled(item);
				});
				html = html.replace(/undefined/, ''); // TODO, why is this being inserted!?
				
			} else {
				throw new Error('Could not determine engine type.');
			}
			
			return html;
		}
		
		// used to flatten nested json and preserve structure via keyname, this allows easy access to nested JSON values in jQuery templates
		function flatten_json(obj, includePrototype, into, prefix) {
			into = into || {};
			prefix = prefix || "";

			for (var k in obj) {
				if (includePrototype || obj.hasOwnProperty(k)) {
					var prop = obj[k];
					if (prop && typeof prop === "object" &&
						!(prop instanceof Date || prop instanceof RegExp)) {
						flatten_json(prop, includePrototype, into, prefix + k + "_");
					}
					else {
						into[prefix + k] = prop;
					}
				}
			}
			return into;
		}

		
		if( !apiKey ) { throw new Error('You must supply an API key to use the API!'); }
		
		var _en = this;
		this.apiKey = apiKey;
		
		// constants
		this.constants = {
			endPoint: "http://developer.echonest.com/api/",
			endPointVersion: 'v4',
			format: 'jsonp'
		};
		
		// user settable options
		this.options = {
			// none yet
		};
		$.extend(this.options, options);

		// interface to the EchoNest object
		this.artist = function(name) {
			return new Artist(name);
		};
		
		/**
		 * Used to handle a response back from the api. Will throw errors if a problem is detected.
		 */
		var Response = function(data) {
			this.data = data;
			if(this.data.response.status.code != 0) {
				throw new Error(this.data.response.status.message);
			}
		};
		
			Response.prototype.getData = function() {
				return this.data.response;
			}
		
		/**
		 * Used to build a request to the API
		 */
		var Request = function() {

			// merge any extended api details together
			this.extendedDetails = $.extend.apply(true, arguments);
			
			function url() {
				return _en.constants.endPoint + _en.constants.endPointVersion + "/";
			}
			
			function format() {
				return _en.constants.format
			}
			
			function apiKey() {
				return _en.apiKey;
			}
			
			// returns a settings object for use with jQuery ajax requests
			this.settings = function(options) {
				var data = {
					format: format(),
					api_key: apiKey()
				};
				
				$.extend(data, this.extendedDetails); // merge in extended details, this allows customised calls
				
				return {
					url: url() + options.endPoint,
					dataType: 'jsonp',
					type: options.type,
					data: data,
					cache: true,
					success: function(data, textStatus, XMLHttpRequest) {
						if (options.success) { options.success(new Response(data)) }
					}
				}
			}
			
		};
		
			Request.prototype.get = function(endPoint, callbackSuccess) {
				$.ajax( this.settings({endPoint: endPoint, success: callbackSuccess, type: 'GET'}) );
			}

		/**
		 * Artist class. Created by passing in a string name of the artist.
		 */
		var Artist = function(name) {
			this.name = name;
			this.endPoint = 'artist/'
		};

			/**
			 * Get all audio associated with this artist.
			 * @returns A collection object.
			 */
			Artist.prototype.audio = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'audio', function(response) {
					callback( new AudioCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get all biographies associated with this artist.
			 * @returns A collection object.
			 */
			Artist.prototype.biographies = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'biographies', function(response) {
					callback( new BiographyCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get all blogs associated with this artist.
			 * @returns A collection object.
			 */
			Artist.prototype.blogs = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'blogs', function(response) {
					callback( new BlogCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get the familiarity of this artist.
			 * @returns AA collection object.
			 */
			Artist.prototype.familiarity = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'familiarity', function(response) {
					callback( new Familiarity( response.getData() ) );
				});
			}
			
			/**
			 * Get the hotttnesss of this artist
			 * @returns A collection object.
			 */
			Artist.prototype.hotttnesss = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'hotttnesss', function(response) {
					callback( new Hotttnesss( response.getData() ) );
				});
			}
			
			/**
			 * Get all images associated with this artist.
			 * @returns A collection object.
			 */
			Artist.prototype.images = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'images', function(response) {
					callback( new ImageCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get the new about an artist
			 * @returns A collection object.
			 */
			Artist.prototype.news = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'news', function(response) {
					callback( new NewsCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get the new about an artist
			 * @returns A collection object.
			 */
			Artist.prototype.profile = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'profile', function(response) {
					callback( new Profile( response.getData() ) );
				});
			}
			
			/**
			 * Get reviews about an artist
			 * @returns A collection object.
			 */
			Artist.prototype.reviews = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'reviews', function(response) {
					callback( new ReviewsCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get search results about an artist
			 * @returns A collection object.
			 */
			Artist.prototype.search = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'search', function(response) {
					callback( new SearchResultsCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get songs written by an artist
			 * @returns A collection object.
			 */
			Artist.prototype.songs = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'songs', function(response) {
					callback( new SongsCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get similar artists to the one specified
			 * @returns A collection object.
			 */
			Artist.prototype.similar = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'similar', function(response) {
					callback( new SimilarCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get terms used to describe an artist
			 * @returns A collection object.
			 */
			Artist.prototype.terms = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'terms', function(response) {
					callback( new TermsCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get top "hottt" artists
			 * @returns A collection object.
			 */
			Artist.prototype.top_hottt = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'top_hottt', function(response) {
					callback( new TopHotttCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get top terms
			 * @returns A collection object.
			 */
			Artist.prototype.top_terms = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'top_terms', function(response) {
					callback( new TopTermsCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get top terms
			 * @returns A collection object.
			 */
			Artist.prototype.urls = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'urls', function(response) {
					callback( new UrlsCollection( response.getData() ) );
				});
			}
			
			/**
			 * Get videos for artist
			 * @returns A collection object.
			 */
			Artist.prototype.video = function(callback, options) {
				var request = new Request(options, {name: this.name});
				request.get(this.endPoint + 'video', function(response) {
					callback( new VideoCollection( response.getData() ) );
				});
			}
		
		/**
		 * Base class used for singular items returned from the API.
		 */
		var Singular = function() {
		}
		
			/**
			 * Getter for the data stored in the singular.
			 * @returns Array Hash of data
			 */
			Singular.prototype.getData = function() {
				return this.data[this.name]
			}
		
			Singular.prototype.to_html = function(template, options) {
				return toTemplate( template, this.getData(), options )
			}
		
		/**
		 * Base class used for collections returned from the API.
		 */
		var Collection = function() {
			this.workingWith = null; // used if we want to work with a singular item out of the collection.
		};
		
			/**
			 * Getter for the data stored in the collection. If working with is set, return only that record.
			 * @returns Array Data stored on the collection.
			 */
			Collection.prototype.getData = function() {
				return ( this.getWorkingWith() ) ? this.data[this.name][this.getWorkingWith()] : this.data[this.name]
			}
			
			Collection.prototype.setWorkingWith = function(count) {
				this.workingWith = count;
				return this.workingWith;
			}
			
			Collection.prototype.getWorkingWith = function(count) {
				return this.workingWith;
			}
			
			/**
			 * Returns where results recieved from the server started from.
			 * @returns Integer Start point
			 */
			Collection.prototype.start = function(count) {
				return parseInt(this.data.start, 10);
			}
			
			/**
			 * Returns a total count for the collection on the server
			 * @returns Integer Total results available on the server
			 */
			Collection.prototype.total = function(count) {
				return parseInt(this.data.total, 10);
			}
			
			/**
			 * Returns the size of the collection
			 * @returns Integer Number of items in the collection
			 */
			Collection.prototype.size = function(count) {
				return this.getData().length;
			}
		
			/**
			 * Used to interact with a collection of images
			 * @returns String Formatted according to the template passed in.
			 */
			Collection.prototype.to_html = function(template, options) {
				if( this.size() < 1 ) { throw new RangeError('Empty collection') }
				return toTemplate( template, this.getData(), options )
			}
			
			/**
			 * Set a specific item in the collection to work with. Setting this will make the collection always work with that item until set again.
			 * To go back to working with the full collection, set to any non integer value.
			 * @returns String Formatted according to the template passed in.
			 */
			Collection.prototype.at = function(count) {
				( isInteger(count) ) ? this.setWorkingWith(count) : this.setWorkingWith(null);
				return this;
			}
		
		/**
		 * Used to interact with a collection of audio objects
		 * Inherits from Collection
		 */
		var AudioCollection = function(data) {
			this.data = data;
			this.name = "audio";
		};
		AudioCollection.prototype = new Collection(); AudioCollection.prototype.constructor = AudioCollection;
		
		/**
		 * Used to interact with a collection of blogs
		 * Inherits from Collection
		 */
		var BlogCollection = function(data) {
			this.data = data;
			this.name = "blogs";
		};
		BlogCollection.prototype = new Collection(); BlogCollection.prototype.constructor = BlogCollection;
		
		/**
		 * Used to interact with a collection of biographies
		 * Inherits from Collection
		 */
		var BiographyCollection = function(data) {
			var that = this;
			this.data = data;
			this.name = "biographies";
			
			// flatten the json so we have access to nested items from inside the template
			$.each( this.data[this.name], function(count, item) {
				that.data[that.name][count] = flatten_json(item);
			});
			
		};
		BiographyCollection.prototype = new Collection(); BiographyCollection.prototype.constructor = BiographyCollection;
		
		/**
		 * Familiarity information about an artist
		 * Inherits from Singular
		 */
		var Familiarity = function(data) {
			this.data = data;
			this.name = "artist";
		};
		Familiarity.prototype = new Singular(); Familiarity.prototype.constructor = Familiarity;
		
		/**
		 * Hotttnesss information about an artist
		 * Inherits from Singular
		 */
		var Hotttnesss = function(data) {
			this.data = data;
			this.name = "artist";
		};
		Hotttnesss.prototype = new Singular(); Hotttnesss.prototype.constructor = Hotttnesss;
		
		/**
		 * Used to interact with a collection of images
		 * Inherits from Collection
		 */
		var ImageCollection = function(data) {
			this.data = data;
			this.name = "images";
		};
		ImageCollection.prototype = new Collection(); ImageCollection.prototype.constructor = ImageCollection;
		
		/**
		 * Used to interact with a collection of news
		 * Inherits from Collection
		 */
		var NewsCollection = function(data) {
			this.data = data;
			this.name = "news";
		};
		NewsCollection.prototype = new Collection(); NewsCollection.prototype.constructor = NewsCollection;
		
		/**
		 * Profile information about an artist
		 * Inherits from Singular
		 */
		var Profile = function(data) {
			this.data = data;
			this.name = "artist";
			//this.data[this.name] = flatten_json(this.data[this.name]); // this should need flattening but endpoint doesn't seem to be returning all results??
		};
		Profile.prototype = new Singular(); Profile.prototype.constructor = Profile;
		
		/**
		 * Used to interact with a collection of reviews
		 * Inherits from Collection
		 */
		var ReviewsCollection = function(data) {
			this.data = data;
			this.name = "reviews";
		};
		ReviewsCollection.prototype = new Collection(); ReviewsCollection.prototype.constructor = ReviewsCollection;
		
		/**
		 * Used to interact with a collection of reviews
		 * Inherits from Collection
		 */
		var SearchResultsCollection = function(data) {
			var that = this;
			this.data = data;
			this.name = "artists";
			
			// flatten the json so we have access to nested items from inside the template
			$.each( this.data[this.name], function(count, item) {
				that.data[that.name][count] = flatten_json(item);
			});
			
		};
		SearchResultsCollection.prototype = new Collection(); SearchResultsCollection.prototype.constructor = SearchResultsCollection;
		
		/**
		 * Used to interact with a collection of songs
		 * Inherits from Collection
		 */
		var SongsCollection = function(data) {
			this.data = data;
			this.name = "songs";
		};
		SongsCollection.prototype = new Collection(); SongsCollection.prototype.constructor = SongsCollection;
		
		/**
		 * Used to interact with a collection of artist similar to the one specified
		 * Inherits from Collection
		 */
		var SimilarCollection = function(data) {
			var that = this;
			this.data = data;
			this.name = "artists";
			
			// flatten the json so we have access to nested items from inside the template
			$.each( this.data[this.name], function(count, item) {
				that.data[that.name][count] = flatten_json(item);
			});
			
		};
		SimilarCollection.prototype = new Collection(); SimilarCollection.prototype.constructor = SimilarCollection;
		
		/**
		 * Used to interact with a collection of terms
		 * Inherits from Collection
		 */
		var TermsCollection = function(data) {
			this.data = data;
			this.name = "terms";
		};
		TermsCollection.prototype = new Collection(); TermsCollection.prototype.constructor = TermsCollection;
		
		/**
		 * Used to interact with a collection of hottt artists
		 * Inherits from Collection
		 */
		var TopHotttCollection = function(data) {
			this.data = data;
			this.name = "artists";
		};
		TopHotttCollection.prototype = new Collection(); TopHotttCollection.prototype.constructor = TopHotttCollection;
		
		/**
		 * Used to interact with a collection of top terms
		 * Inherits from Collection
		 */
		var TopTermsCollection = function(data) {
			this.data = data;
			this.name = "terms";
		};
		TopTermsCollection.prototype = new Collection(); TopTermsCollection.prototype.constructor = TopTermsCollection;
		
		/**
		 * Used to interact with a collection of URLs for an artist
		 * Inherits from Collection
		 */
		var UrlsCollection = function(data) {
			this.data = data;
			this.name = "urls";
		};
		UrlsCollection.prototype = new Collection(); UrlsCollection.prototype.constructor = UrlsCollection;
		
		/**
		 * Used to interact with a collection of videos for an artist
		 * Inherits from Collection
		 */
		var VideoCollection = function(data) {
			this.data = data;
			this.name = "video";
		};
		VideoCollection.prototype = new Collection(); VideoCollection.prototype.constructor = VideoCollection;
		
	}
	
	// setup interfaces
	window.EchoNest = EchoNest;
	
})(window, jQuery);
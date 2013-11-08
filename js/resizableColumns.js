var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

(function($, window) {
  var ResizableColumns, parseWidth, pointerX, setWidth;
  parseWidth = function(node) {
    return parseFloat(node.style.width.replace('%', ''));
  };
  setWidth = function(node, width) {
    width = width.toFixed(2);
    return node.style.width = "" + width + "%";
  };
  pointerX = function(e) {
    if (e.type.indexOf('touch') === 0) {
      return (e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]).pageX;
    }
    return e.pageX;
  };
  ResizableColumns = (function() {
    ResizableColumns.prototype.defaults = {
      store: window.store,
      rigidSizing: false,
      resizeFromBody: true
    };

    function ResizableColumns($table, options) {
      this.pointerdown = __bind(this.pointerdown, this);
      var _this = this;
      this.options = $.extend({}, this.defaults, options);
      this.$table = $table;
      this.setHeaders();
      this.restoreColumnWidths();
      this.syncHandleWidths();
      $(window).on('resize.rc', (function() {
        return _this.syncHandleWidths();
      }));
    }

    ResizableColumns.prototype.getColumnId = function($el) {
      return this.$table.data('resizable-columns-id') + '-' + $el.data('resizable-column-id');
    };

    ResizableColumns.prototype.setHeaders = function() {
      this.$tableHeaders = this.$table.find('tr th:visible');
      this.assignPercentageWidths();
      return this.createHandles();
    };

    ResizableColumns.prototype.destroy = function() {
      this.$handleContainer.remove();
      this.$table.removeData('resizableColumns');
      return $(window).off('.rc');
    };

    ResizableColumns.prototype.assignPercentageWidths = function() {
      var _this = this;
      return this.$tableHeaders.each(function(_, el) {
        var $el;
        $el = $(el);
        return setWidth($el[0], $el.outerWidth() / _this.$table.width() * 100);
      });
    };

    ResizableColumns.prototype.createHandles = function() {
      var _ref,
        _this = this;
      if ((_ref = this.$handleContainer) != null) {
        _ref.remove();
      }
      this.$table.before((this.$handleContainer = $("<div class='rc-handle-container' />")));
      this.$tableHeaders.each(function(i, el) {
        var $handle;
        if (_this.$tableHeaders.eq(i + 1).length === 0 || (_this.$tableHeaders.eq(i).attr('data-noresize') != null) || (_this.$tableHeaders.eq(i + 1).attr('data-noresize') != null)) {
          return;
        }
        $handle = $("<div class='rc-handle' />");
        $handle.data('th', $(el));
        return $handle.appendTo(_this.$handleContainer);
      });
      return this.$handleContainer.on('mousedown touchstart', '.rc-handle', this.pointerdown);
    };

    ResizableColumns.prototype.syncHandleWidths = function() {
      var _this = this;
      this.setHeaders();
      return this.$handleContainer.width(this.$table.width()).find('.rc-handle').each(function(_, el) {
        var $el;
        $el = $(el);
        return $el.css({
          left: $el.data('th').outerWidth() + ($el.data('th').offset().left - _this.$handleContainer.offset().left),
          height: _this.options.resizeFromBody ? _this.$table.height() : _this.$table.find('thead').height()
        });
      });
    };

    ResizableColumns.prototype.saveColumnWidths = function() {
      var _this = this;
      return this.$tableHeaders.each(function(_, el) {
        var $el;
        $el = $(el);
        if ($el.attr('data-noresize') == null) {
          if (_this.options.store != null) {
            return _this.options.store.set(_this.getColumnId($el), parseWidth($el[0]));
          }
        }
      });
    };

    ResizableColumns.prototype.restoreColumnWidths = function() {
      var _this = this;
      return this.$tableHeaders.each(function(_, el) {
        var $el, width;
        $el = $(el);
        if ((_this.options.store != null) && (width = _this.options.store.get(_this.getColumnId($el)))) {
          return setWidth($el[0], width);
        }
      });
    };

    ResizableColumns.prototype.totalColumnWidths = function() {
      var total,
        _this = this;
      total = 0;
      this.$tableHeaders.each(function(_, el) {
        return total += parseFloat($(el)[0].style.width.replace('%', ''));
      });
      return total;
    };

    ResizableColumns.prototype.pointerdown = function(e) {
      var $currentGrip, $leftColumn, $rightColumn, startPosition, widths,
        _this = this;
      e.preventDefault();
      startPosition = pointerX(e);
      $currentGrip = $(e.currentTarget);
      $leftColumn = $currentGrip.data('th');
      $rightColumn = this.$tableHeaders.eq(this.$tableHeaders.index($leftColumn) + 1);
      widths = {
        left: parseWidth($leftColumn[0]),
        right: parseWidth($rightColumn[0])
      };
      this.$table.addClass('rc-table-resizing');
      $(document).on('mousemove.rc touchmove.rc', function(e) {
        var difference;
        difference = (pointerX(e) - startPosition) / _this.$table.width() * 100;
        setWidth($rightColumn[0], widths.right - difference);
        return setWidth($leftColumn[0], widths.left + difference);
      });
      return $(document).one('mouseup touchend', function() {
        $(document).off('mousemove.rc touchmove.rc');
        _this.$table.removeClass('rc-table-resizing');
        _this.syncHandleWidths();
        return _this.saveColumnWidths();
      });
    };

    return ResizableColumns;

  })();
  return $.fn.extend({
    resizableColumns: function() {
      var args, option;
      option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.each(function() {
        var $table, data;
        $table = $(this);
        data = $table.data('resizableColumns');
        if (!data) {
          $table.data('resizableColumns', (data = new ResizableColumns($table, option)));
        }
        if (typeof option === 'string') {
          return data[option].apply(data, args);
        }
      });
    }
  });
})(window.jQuery, window);

;(function(){
  var store = {},
    win = window,
    doc = win.document,
    localStorageName = 'localStorage',
    namespace = '__storejs__',
    storage

  store.disabled = false
  store.set = function(key, value) {}
  store.get = function(key) {}
  store.remove = function(key) {}
  store.clear = function() {}
  store.transact = function(key, defaultVal, transactionFn) {
    var val = store.get(key)
    if (transactionFn == null) {
      transactionFn = defaultVal
      defaultVal = null
    }
    if (typeof val == 'undefined') { val = defaultVal || {} }
    transactionFn(val)
    store.set(key, val)
  }
  store.getAll = function() {}

  store.serialize = function(value) {
    return JSON.stringify(value)
  }
  store.deserialize = function(value) {
    if (typeof value != 'string') { return undefined }
    try { return JSON.parse(value) }
    catch(e) { return value || undefined }
  }

  // Functions to encapsulate questionable FireFox 3.6.13 behavior
  // when about.config::dom.storage.enabled === false
  // See https://github.com/marcuswestin/store.js/issues#issue/13
  function isLocalStorageNameSupported() {
    try { return (localStorageName in win && win[localStorageName]) }
    catch(err) { return false }
  }

  if (isLocalStorageNameSupported()) {
    storage = win[localStorageName]
    store.set = function(key, val) {
      if (val === undefined) { return store.remove(key) }
      storage.setItem(key, store.serialize(val))
      return val
    }
    store.get = function(key) { return store.deserialize(storage.getItem(key)) }
    store.remove = function(key) { storage.removeItem(key) }
    store.clear = function() { storage.clear() }
    store.getAll = function() {
      var ret = {}
      for (var i=0; i<storage.length; ++i) {
        var key = storage.key(i)
        ret[key] = store.get(key)
      }
      return ret
    }
  } else if (doc.documentElement.addBehavior) {
    var storageOwner,
      storageContainer
    // Since #userData storage applies only to specific paths, we need to
    // somehow link our data to a specific path.  We choose /favicon.ico
    // as a pretty safe option, since all browsers already make a request to
    // this URL anyway and being a 404 will not hurt us here.  We wrap an
    // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
    // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
    // since the iframe access rules appear to allow direct access and
    // manipulation of the document element, even for a 404 page.  This
    // document can be used instead of the current document (which would
    // have been limited to the current path) to perform #userData storage.
    try {
      storageContainer = new ActiveXObject('htmlfile')
      storageContainer.open()
      storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></iframe>')
      storageContainer.close()
      storageOwner = storageContainer.w.frames[0].document
      storage = storageOwner.createElement('div')
    } catch(e) {
      // somehow ActiveXObject instantiation failed (perhaps some special
      // security settings or otherwse), fall back to per-path storage
      storage = doc.createElement('div')
      storageOwner = doc.body
    }
    function withIEStorage(storeFunction) {
      return function() {
        var args = Array.prototype.slice.call(arguments, 0)
        args.unshift(storage)
        // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
        // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
        storageOwner.appendChild(storage)
        storage.addBehavior('#default#userData')
        storage.load(localStorageName)
        var result = storeFunction.apply(store, args)
        storageOwner.removeChild(storage)
        return result
      }
    }

    // In IE7, keys may not contain special chars. See all of https://github.com/marcuswestin/store.js/issues/40
    var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
    function ieKeyFix(key) {
      return key.replace(forbiddenCharsRegex, '___')
    }
    store.set = withIEStorage(function(storage, key, val) {
      key = ieKeyFix(key)
      if (val === undefined) { return store.remove(key) }
      storage.setAttribute(key, store.serialize(val))
      storage.save(localStorageName)
      return val
    })
    store.get = withIEStorage(function(storage, key) {
      key = ieKeyFix(key)
      return store.deserialize(storage.getAttribute(key))
    })
    store.remove = withIEStorage(function(storage, key) {
      key = ieKeyFix(key)
      storage.removeAttribute(key)
      storage.save(localStorageName)
    })
    store.clear = withIEStorage(function(storage) {
      var attributes = storage.XMLDocument.documentElement.attributes
      storage.load(localStorageName)
      for (var i=0, attr; attr=attributes[i]; i++) {
        storage.removeAttribute(attr.name)
      }
      storage.save(localStorageName)
    })
    store.getAll = withIEStorage(function(storage) {
      var attributes = storage.XMLDocument.documentElement.attributes
      var ret = {}
      for (var i=0, attr; attr=attributes[i]; ++i) {
        var key = ieKeyFix(attr.name)
        ret[attr.name] = store.deserialize(storage.getAttribute(key))
      }
      return ret
    })
  }

  try {
    store.set(namespace, namespace)
    if (store.get(namespace) != namespace) { store.disabled = true }
    store.remove(namespace)
  } catch(e) {
    store.disabled = true
  }
  store.enabled = !store.disabled
  if (typeof module != 'undefined' && module.exports) { module.exports = store }
  else if (typeof define === 'function' && define.amd) { define(store) }
  else { this.store = store }
})();
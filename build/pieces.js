(function() {
  var __slice = [].slice;

  window.Pieces = (function() {

    function Pieces() {}

    Pieces.pieces = [];

    Pieces.activePieces = [];

    Pieces.modules = {};

    Pieces.bindEvents = function(parent, object) {
      var callback, eventName, method, methodRegExp, methodRegExpSelf, result, selector, _ref, _results;
      methodRegExp = /on\s+([:]|[^\s]+)\s+(?:on|at|of|over|for)\s+(.*)/;
      methodRegExpSelf = /on\s+([:]|[^\s]+)/;
      _results = [];
      for (method in object) {
        callback = object[method];
        if (result = methodRegExp.exec(method)) {
          _ref = [result[1], result[2]], eventName = _ref[0], selector = _ref[1];
          _results.push((function(eventName, selector, callback) {
            var _this = this;
            return jQuery(parent).off(eventName, selector).on(eventName, selector, function() {
              return callback.apply(object, arguments);
            });
          })(eventName, selector, callback));
        } else if (result = methodRegExpSelf.exec(method)) {
          eventName = result[1];
          _results.push((function(eventName, callback) {
            var _this = this;
            return jQuery(parent).off(eventName).on(eventName, function() {
              return callback.apply(object, arguments);
            });
          })(eventName, callback));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Pieces.registerPiece = function(selector, object) {
      return this.pieces.push({
        selector: selector,
        object: object
      });
    };

    Pieces.initializePiece = function(piece) {
      var element, object, _i, _len, _ref, _ref1, _results,
        _this = this;
      _ref = jQuery(piece.selector).get();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        element = jQuery(element);
        if (!element.data("__piece+" + piece.selector)) {
          object = {
            el: element,
            $: function(selector) {
              return jQuery(selector, this.el);
            }
          };
          object.include = function() {
            var initializer, moduleName, moduleObject, options;
            moduleName = arguments[0], options = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            moduleObject = _this.modules[moduleName];
            if (jQuery.isFunction(moduleObject)) {
              moduleObject = moduleObject.apply(object);
            }
            initializer = moduleObject.initialize;
            delete moduleObject.initialize;
            jQuery.extend(object, moduleObject);
            if (initializer != null) {
              initializer.apply(object, options);
            }
            return _this.bindEvents(element, object);
          };
          object = jQuery.extend(object, jQuery.isFunction(piece.object) ? piece.object.apply(object) : piece.object);
          element.data("__piece+" + piece.selector, object);
          this.bindEvents(element, object);
          this.activePieces.push({
            selector: piece.selector,
            object: object
          });
          _results.push((_ref1 = object.initialize) != null ? _ref1.apply(object) : void 0);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Pieces.update = function() {
      var piece, _i, _len, _ref, _results;
      _ref = this.pieces;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        piece = _ref[_i];
        if (jQuery(piece.selector).size() > 0) {
          _results.push(this.initializePiece(piece));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Pieces.Module = function(name, object) {
      return this.modules[name] = object;
    };

    return Pieces;

  })();

  window.Piece = function() {
    var _ref;
    return (_ref = window.Pieces).registerPiece.apply(_ref, arguments);
  };

}).call(this);

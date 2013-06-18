(function() {
  var window;

  if (typeof window === "undefined" || window === null) {
    window = exports;
  }

  window.Pieces = (function() {

    function Pieces() {}

    Pieces.pieces = [];

    Pieces.activePieces = [];

    Pieces.bindEvents = function(parent, object) {
      var callback, method, methodRegExp, methodRegExpSelf, result, _results;
      methodRegExp = /on\s+([:]|[^\s]+)\s+(?:on|at|of|over|for)\s+(.*)/;
      methodRegExpSelf = /on\s+([:]|[^\s]+)/;
      _results = [];
      for (method in object) {
        callback = object[method];
        if (result = methodRegExp.exec(method)) {
          _results.push((function(result, callback) {
            var _this = this;
            return window.jQuery(parent).on(result[1], result[2], function() {
              return callback.apply(object, arguments);
            });
          })(result, callback));
        } else if (result = methodRegExpSelf.exec(method)) {
          _results.push((function(result, callback) {
            var _this = this;
            return window.jQuery(parent).on(result[1], function() {
              return callback.apply(object, arguments);
            });
          })(result, callback));
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
      var element, elements, object, _i, _len, _ref, _results;
      elements = window.jQuery(piece.selector);
      if (!elements.size()) {
        return;
      }
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        element = window.jQuery(element);
        if (!element.data("__piece+" + piece.selector)) {
          object = {
            $: function(selector) {
              return window.jQuery(selector, this.el);
            }
          };
          if (typeof piece.object === 'function') {
            object = window.jQuery.extend(object, piece.object.apply(object));
          } else {
            object = window.jQuery.extend(object, piece.object);
          }
          object.el = element;
          element.data("__piece+" + piece.selector, object);
          this.bindEvents(element, object);
          this.activePieces.push({
            selector: piece.selector,
            object: object
          });
          _results.push((_ref = object.initialize) != null ? _ref.apply(object) : void 0);
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
        if (window.jQuery(piece.selector).size() > 0) {
          _results.push(this.initializePiece(piece));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Pieces;

  })();

  window.Piece = function() {
    var _ref;
    return (_ref = window.Pieces).registerPiece.apply(_ref, arguments);
  };

}).call(this);

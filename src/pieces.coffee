class window.Pieces
  @pieces = []
  @activePieces = []
  @modules = {}

  @bindEvents: (parent, object) ->
    methodRegExp = /on\s+([:]|[^\s]+)\s+(?:on|at|of|over|for)\s+(.*)/
    methodRegExpSelf = /on\s+([:]|[^\s]+)/

    for method, callback of object

      if result = methodRegExp.exec(method)
        [ eventName, selector ] = [ result[1], result[2] ]
        do (eventName, selector, callback) ->
          jQuery(parent)
            .off(eventName, selector)
            .on eventName, selector, =>
              callback.apply(object, arguments)

      else if result = methodRegExpSelf.exec(method)
        eventName = result[1]
        do (eventName, callback) ->
          jQuery(parent)
            .off(eventName)
            .on eventName, =>
              callback.apply(object, arguments)

  @registerPiece: (selector, object) ->
    @pieces.push({ selector, object })

  @initializePiece: (piece) ->
    for element in jQuery(piece.selector).get()
      element = jQuery(element)
      unless element.data("__piece+#{piece.selector}")
        object =
          el: element
          $: (selector) -> jQuery(selector, @el)

        object.include = (moduleName, options...) =>
          moduleObject = @modules[moduleName]
          if jQuery.isFunction(moduleObject)
            moduleObject = moduleObject.apply(object)

          initializer = moduleObject.initialize
          delete moduleObject.initialize
          jQuery.extend(object, moduleObject)

          initializer?.apply(object, options)
          @bindEvents(element, object)


        object = jQuery.extend(object,
          if jQuery.isFunction(piece.object) then piece.object.apply(object) else piece.object)

        element.data("__piece+#{piece.selector}", object)

        @bindEvents(element, object)

        @activePieces.push { selector: piece.selector, object }

        object.initialize?.apply(object)

  @update: ->
    for piece in @pieces
      if jQuery(piece.selector).size() > 0
        @initializePiece(piece)

  @Module: (name, object) ->
    @modules[name] = object

window.Piece = -> window.Pieces.registerPiece(arguments...)
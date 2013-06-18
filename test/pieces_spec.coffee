describe 'Pieces', ->
  beforeEach ->
    for piece in window.Pieces.activePieces
      $(piece.selector).removeData("__piece+#{piece.selector}")
    window.Pieces.pieces = []
    window.Pieces.activePieces = []


  it 'should be defined', ->
    window.Piece.should.exist


  it 'should be able to define piece', ->
    window.Piece '.selector', {}
    window.Pieces.pieces[0].selector.should.be.equal '.selector'


  it 'should init all existed pieces on page', ->
    num = 0
    executed = false
    runs ->
      window.Piece '.selector-twice',
        initialize: ->
          num += parseInt(@el.text())
          executed = true
      window.Pieces.update()

    waitsFor ->
      executed

    runs ->
      num.should.be.equal 7


  it 'should not init not existed pieces on page', ->
    pieceInitialized = false
    executed = false
    runs ->
      window.Piece '.not-real-selector1',
        initialize: ->
          pieceInitialized = true
      window.Pieces.update()

      setTimeout((-> executed = true), 1000)

    waitsFor ->
      executed

    runs ->
      pieceInitialized.should.be.equal false


  it 'should create a new instance for every piece', ->
    num = 0
    executed = false
    runs ->
      window.Piece '.selector-twice',
        'on test': ->
          num += parseInt(@el.text())
          executed = true
      window.Pieces.update()
      $('.selector-twice').trigger('test')

    waitsFor ->
      executed

    runs ->
      num.should.be.equal 7


  it 'should be able to initialize piece with object as second parameter', ->
    executed = false
    runs ->
      window.Piece '.real-selector1',
        initialize: ->
          executed = true
      window.Pieces.update()

    waitsFor ->
      executed

    runs ->
      executed.should.be.equal true


  it 'should be able to initialize to piece with function as second parameter', ->
    executed = false
    runs ->
      window.Piece '.real-selector1', ->
        initialize: ->
          executed = true
      window.Pieces.update()

    waitsFor ->
      executed

    runs ->
      executed.should.be.equal true


  it 'should allow user to bind events to child elements', ->
    executed = false
    runs ->
      window.Piece '.child-event-test',
        'on test on .child': ->
          executed = true
      window.Pieces.update()
      $('.child-event-test .child').trigger('test')

    waitsFor ->
      executed

    runs ->
      executed.should.be.equal true


  it 'should allow user to bind events to root element', ->
    executed = false
    runs ->
      window.Piece '.event-test',
        'on test': ->
          executed = true
      window.Pieces.update()
      $('.event-test').trigger('test')

    waitsFor ->
      executed

    runs ->
      executed.should.be.equal true


  it 'should trigger events with Piece object as context', ->
    num = 0
    executed = false
    runs ->
      window.Piece '.event-context-test',
        initialize: ->
          @n = parseInt(@el.text())

        'on test': ->
          num = @n
          executed  = true
      window.Pieces.update()
      $('.event-context-test').trigger('test')

    waitsFor ->
      executed

    runs ->
      num.should.be.equal 55


  it 'should run methods defined with fat arrow with Piece object as context', ->
    num = 0
    executed = false
    runs ->
      window.Piece '.event-context-test', ->
        initialize: ->
          @n = 10
          setTimeout(@testMethod, 1)
        testMethod: =>
          num = @n
          executed = true

      window.Pieces.update()
      $('.event-context-test').trigger('test')

    waitsFor ->
      executed

    runs ->
      num.should.be.equal 10

  it 'should can be extended by Piece.Module', ->
    num = 0
    executed = false
    runs ->
      window.Pieces.Module 'test_module', ->
        initialize: (a, b, c) ->
          num += a + b + c + @magicNumber
          @testMethod2()

        testMethod: ->
          num += 3

        testMethod2: ->
          num += 7

        'on test': ->
          num += 10

      window.Piece '.event-context-test', ->
        magicNumber: 4

        initialize: ->
          @include('test_module', 1, 2, 3)
          @testMethod()
          executed = true

        'on test2': ->
          num += 5

      window.Pieces.update()
      $('.event-context-test').trigger('test')
      $('.event-context-test').trigger('test2')

    waitsFor ->
      executed

    runs ->
      num.should.be.equal 35

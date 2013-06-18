fs     = require('fs')
exec   = require('child_process').exec
path   = require('path')
print  = require('util').print
coffee = require('coffee-script')
uglify = require('uglify-js')
http   = require('http')

compileLib = ->
  coffeeSource = fs.readFileSync('src/pieces.coffee') + ''
  coffee.compile(coffeeSource)

compileTest = ->
  coffeeSource = fs.readFileSync('test/pieces_spec.coffee') + ''
  coffee.compile(coffeeSource)


build = (minify = false) ->
  jsSource = compileLib()

  fs.writeFileSync("build/pieces.js", jsSource)

  ast = uglify.parser.parse(jsSource)
  ast = uglify.uglify.ast_mangle(ast)
  ast = uglify.uglify.ast_squeeze(ast)
  jsMin = uglify.uglify.gen_code(ast)

  fs.writeFileSync("build/pieces.min.js", jsMin)

task 'build', 'Builds pieces.js file', ->
  print "Building...\n"
  build()
  print "Done.\n"


task 'test', 'Start test application', ->
  print "Starting web server...\n"

  server = http.createServer (req, res) ->
    url = /^(.*?)(\?.*)?$/.exec(req.url)[1]
    if url == '/'
      res.writeHead 200, { 'Content-Type': 'text/html' }
      res.write fs.readFileSync('test/index.html')

    else if url == '/pieces.js'
      res.writeHead 200, {'Content-Type': 'text/javascript'}
      try
        res.write compileLib()
      catch e
        res.write "console.error('pieces.coffee compile error: #{e.message}');"

    else if url == '/spec.js'
      res.writeHead 200, {'Content-Type': 'text/javascript'}
      try
        res.write compileTest()
      catch e
        res.write "console.error('spec compile error: #{e.message}');"
    else
      fileName = '.' + url
      if fs.existsSync(fileName)
        res.writeHead 200
        res.write fs.readFileSync(fileName)
      else
        res.writeHead 404, {'Content-Type': 'text/plain'}
        res.write 'Not Found'

    res.end()
  server.listen 3300
  print "Started (http://127.0.0.1:3300).\n"
  exec "open http://127.0.0.1:3300"

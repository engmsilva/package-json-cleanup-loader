const test = require('tape')
const path = require('path')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')

test('should strip keys that start from _', (t) => {
  const config = {
    entry: path.join(__dirname, 'main.js'),
    mode: 'production',
    module: {
      rules: [
        {
          test: /package\.json$/,
          loader: '../package-json-remove-key'
        }
      ]
    }
  }

  const compiler = webpack(config)

  const memfs = new MemoryFS()
  compiler.outputFileSystem = memfs

  compiler.run((err, stats) => {
    t.error(err)
    t.error(stats.hasErrors())

    const output = memfs.readFileSync(path.join(__dirname, '..', 'dist', 'main.js'), 'utf8')
    t.equal(output.match(/_where/), null)

    t.end()
  })
})

test('use option `only`', (t) => {
  const config = {
    entry: path.join(__dirname, 'main.js'),
    mode: 'development',
    module: {
      rules: [
        {
          test: /package\.json$/,
          use: {
            loader: '../package-json-remove-key',
            options: {
              only: ['version']
            }
          }
        }
      ]
    }
  }

  const compiler = webpack(config)

  const memfs = new MemoryFS()

  compiler.outputFileSystem = memfs

  compiler.run((err, stats) => {
    t.error(err)
    t.error(stats.hasErrors())
    const output = memfs.readFileSync(path.join(__dirname, '..', 'dist', 'main.js'), 'utf8')
    const clearOutput = output.replace(/[\\]/gi, "")
    t.equal(clearOutput.indexOf('"name":"standard"'), -1)
    t.end()
  })
})

test('use option `except`', (t) => {
  const config = {
    entry: path.join(__dirname, 'main.js'),
    mode: 'development',
    module: {
      rules: [
        {
          test: /package\.json$/,
          use: {
            loader: '../package-json-remove-key',
            options: {
              except: ['_location']
            }
          }
        }
      ]
    }
  }

  const compiler = webpack(config)

  const memfs = new MemoryFS()

  compiler.outputFileSystem = memfs

  compiler.run((err, stats) => {
    t.error(err)
    t.error(stats.hasErrors())
    const output = memfs.readFileSync(path.join(__dirname, '..', 'dist', 'main.js'), 'utf8')
    const clearOutput = output.replace(/[\\]/gi, "")
    t.equal(clearOutput.indexOf('"_location":"/standard"'), -1)
    t.end()
  })
})

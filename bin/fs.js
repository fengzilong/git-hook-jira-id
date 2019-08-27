const fs = require( 'fs' )

function read( file ) {
  let fd
  let source

  try {
    fd = fs.openSync( file, 'r' )
    source = fs.readFileSync( fd, 'utf8' )
  } catch ( e ) {
  } finally {
    fs.closeSync( fd )
  }

  return source || ''
}

function write( file, source ) {
  try {
    const fd = fs.openSync( file, 'w' )

    try {
      fs.writeFileSync( fd, source, 'utf8' )
    } catch ( e ) {
    } finally {
      fs.closeSync( fd )
    }
  } catch ( e ) {
    try {
      const fd = fs.openSync( file, 'r+' )

      try {
        fs.writeFileSync( fd, source, 'utf8' )
      } catch ( e ) {
      } finally {
        fs.closeSync( fd )
      }
    } catch ( e ) {
    }
  }
}

exports.read = read
exports.write = write

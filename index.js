const
	gulp        = require( 'gulp' ),
	browserSync = require( 'browser-sync' ),
	express     = require( 'express' ),
	pug         = require( 'pug' ),
	sass        = require( 'sass' ),
	path        = require( 'path' ),
	fs          = require( 'fs' );


/**
 * Search file by name
 * @param {string} name - file name (with extension)
 * @param {string} base - initial search path
 * @return {string} - full path to the found file
 */
function search ( name, base ) {
	let result = null;

	( function exec ( base ) {
		let list = fs.readdirSync( base );

		for ( let i = 0; i < list.length; i++ ) {
			let item = path.resolve( base, list[i] );

			if ( fs.statSync( item ).isDirectory() && exec( item ) ) {
				return true;
			} else if ( path.basename( item ) === name ) {
				result = item;
				return true;
			}
		}
	})( base );

	return result;
}

/**
 * Getting the object tag (to determine the exact type)
 * @param {*} data - any data type
 * @returns {string} - object tag
 */
function objectTag ( data ) {
	return Object.prototype.toString.call( data ).slice( 8, -1 );
}

/**
 * Objects merging, modifies the original object
 * @param {object} source - the source object
 * @param {object} merged - the object to be merged
 * @return {object} - the final object
 */
function merge( source, merged ) {
	for ( let key in merged ) {
		if ( objectTag( merged[ key ] ) === 'Object' ) {
			if ( typeof( source[ key ] ) !== 'object' ) source[ key ] = {};
			source[ key ] = merge( source[ key ], merged[ key ] );
		} else {
			source[ key ] = merged[ key ];
		}
	}

	return source;
}

/**
 * Start express
 * @param {object} opts - server parameters
 */
function expressServer ( opts ) {
	const app = express();

	// Default parameters
	let params = {
		express: {
			root: './dev/',
			port: 3000,
			static: [
				[ 'dev' ]
			]
		},
		browserSync: {
			enable: false,
			port: 8000,
			proxy: 'localhost:3000',
			open: false,
			notify: true,
			reloadDelay: 0,
			ui: false,
			ghostMode: {
				clicks: false,
				forms: false,
				scroll: false
			}
		},
		watcher: {
			enable: false,
			globs: [ 'dev/**/*.js' ]
		},
		pug: {
			enable: false,
			index: 'index',
			root: 'dev/components/page',
			globs: [ 'dev/**/*.pug' ],
			options: {
				doctype: 'html',
				pretty: true,
				self: true
			}
		},
		sass: {
			enable: false,
			root: 'dev/components',
			globs: [ 'dev/**/*.scss' ],
			options: {
				outputStyle: 'expanded'
			}
		},
		cb: null
	};

	// Merging default and derived parameters
	if ( opts instanceof Object ) merge( params, opts );

	// Sets directory name
	app.set( 'views', params.express.root );

	// Html handler
	if ( params.pug && params.pug.enable ) {
		app.get( '/', function ( req, res ) {
			let
				src = search( params.pug.index +'.pug', params.pug.root ),
				content = pug.renderFile( src, params.pug.options );

			console.log( '[req] html: root <<', src );
			res.writeHead( 200, { 'Content-Type': 'text/html' } );
			res.end( content, 'utf8' );
		});

		app.get( /.+\.html$/, function ( req, res ) {
			let
				tmp = path.parse( req.url.replace( /\?.*$/, '' ) ),
				src = search( tmp.name +'.pug', params.pug.root ),
				content = pug.renderFile( src, params.pug.options );

			console.log( '[req] html:', req.url, '<<', src );
			res.writeHead( 200, { 'Content-Type': 'text/html' } );
			res.end( content, 'utf8' );
		});
	}

	// Css handler
	if ( params.sass && params.sass.enable ) {
		app.get( /.+\.css$/, function ( req, res ) {
			let
				tmp = path.parse( req.url.replace( /\?.*$/, '' ) ),
				src = search( tmp.name +'.scss', params.sass.root ),
				content = sass.renderSync( merge( { file: src }, params.sass.options ) ).css;

			console.log( '[req] css:', req.url, '<<', src );
			res.writeHead( 200, { 'Content-Type': 'text/css' } );
			res.end( content, 'binary' );
		});
	}

	// Custom handlers and other
	if ( params.cb instanceof Function ) params.cb( app );

	// Static files
	if ( params.express && params.express.static && params.express.static.length ) {
		params.express.static.forEach( ( value ) => {
			if ( value.length ) {
				if ( value.length > 1 ) {
					app.use( value[0], express.static( value[1] ) );
				} else {
					app.use( express.static( value[0] ) );
				}
			}
		});
	}

	// Listens to server
	app.listen( params.express.port, function () {
		console.log( `[Express] Server listening on port ${params.express.port}` );
		if ( params.browserSync && params.browserSync.enable ) browserSync( params.browserSync );
	});

	// Pug watcher
	if ( params.browserSync && params.browserSync.enable && params.pug && params.pug.enable && params.pug.globs && params.pug.globs.length ) {
		gulp.watch( params.pug.globs ).on( 'change', function() {
			browserSync.reload();
		});
	}

	// Sass watcher
	if ( params.browserSync && params.browserSync.enable && params.sass && params.sass.enable && params.sass.globs && params.sass.globs.length ) {
		gulp.watch( params.sass.globs ).on( 'change', function() {
			browserSync.reload( '*.css' );
		});
	}

	// Other files watcher
	if ( params.browserSync && params.browserSync.enable && params.watcher && params.watcher.enable && params.watcher.globs && params.watcher.globs.length ) {
		gulp.watch( params.watcher.globs ).on( 'change', function() {
			browserSync.reload();
		});
	}
}


module.exports = expressServer;

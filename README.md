# Oxyz Express
Express server for simple HTML projects.

## Usage
Simple step-by-step guide:
- Create a _*.js_ file in the project’s root folder (e.g. _server.js_).
- Import the _oxyz-express_ module.
- Call the function with the required parameters.
- Launch the file from the console (`node server.js`)

Here’s an example:
```js
let server = require( 'oxyz-express' );
server({
  // Your parameters
});
```

## Parameters
Below you can find the default parameter object.
```js
{
  express: {                      // Settings of express
    root: './dev/',               // Root folder
    port: 3000,                   // The port of express server
    static: [                     // Static path list
      [ 'dev' ]                   // Request path and project folder path
    ]
  },
  browserSync: {                  // browsersync settings (see. https://browsersync.io/docs/options)
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
  watcher: {                      // gulp-watcher settings to track the file changes
    enable: true,                 // Enabled or disabled
    globs: [ 'dev/**/*.js' ]      // File selection array for tracking (see. https://www.npmjs.com/package/glob)
  },
  pug: {                          // Settings of pug template engine
    enable: true,                 // Enabled or disabled
    index: 'index',               // Index page title (without extension)
    root: 'dev/components/page',  // Root folder for the page search
    globs: [ 'dev/**/*.pug' ],    // File selection array for tracking (see. https://www.npmjs.com/package/glob)
    options: {                    // Template engine parameters, not all options can be applied (see. https://pugjs.org/api/reference.html)
      doctype: 'html',
      pretty: true,
      self: true
    }
  },
  sass: {                         // Sass preprocessor settings
    enable: true,                 // Enabled or disabled
    root: 'dev/components',       // Root folder for the stylesheet search
    globs: [ 'dev/**/*.scss' ],   // File selection array for tracking (see. https://www.npmjs.com/package/glob)
    options: {                    // Preprocessor parameters, not all options can be applied (see. https://github.com/sass/node-sass#options)
      outputStyle: 'expanded'
    }
  },
  cb: null                        // Callback for additional request handler, gets the `app` parameter, no need to return anything (see. http://expressjs.com/en/4x/api.html#app.get.method)
}
```

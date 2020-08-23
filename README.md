# Oxyz Express
Express сервер для простых Html проектов.

## Использование
Простая пошаговая инструкция:
- Создайте в корневой папке проекта _js_ файл (например _server.js_).
- Импортируйте модуль _oxyz-express_.
- Вызовите функцию с нужными параметрами.
- Запустите файл из консоли (`node server.js`)

Например:
```js
let server = require( 'oxyz-express' );
server({
  // Ваши параметры
});
```

## Параметры
Ниже приведен обьект параметров по умолчанию.
```js
{
  express: {                      // Настройки express
    root: './dev/',               // Корневая папка
    port: 3000,                   // Порт express сервера
    static: [                     // Список статических путей
      [ 'dev' ]                   // Путь запроса и путь к папке проекта
    ]
  },
  browserSync: {                  // Настройки browsersync (см. npmjs.com/package/browser-sync)
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
  watcher: {                      // Настройки gulp-обозревателя для слежения за изменениями файлов
    enable: true,                 // Включен или выключен
    globs: [ 'dev/**/*.js' ]      // Массив выборки файлов для слежения (см. npmjs.com/package/glob)
  },
  pug: {                          // Настройки шаблонизатора pug
    enable: true,                 // Включен или выключен
    index: 'index',               // Имя (без расширения) начальнаой страницы
    root: 'dev/components/page',  // Корневая папка для поиска файлов страниц
    globs: [ 'dev/**/*.pug' ],    // Массив выборки файлов для слежения (см. npmjs.com/package/glob)
    options: {                    // Параметры шаблонизатора, не все параметры применимы (см. pugjs.org/api/reference.html)
      doctype: 'html',
      pretty: true,
      self: true
    }
  },
  sass: {                         // Настройки препроцессора sass
    enable: true,                 // Включен или выключен
    root: 'dev/components',       // Корневая папка для поиска файлов стилей
    globs: [ 'dev/**/*.scss' ],   // Массив выборки файлов для слежения (см. npmjs.com/package/glob)
    options: {                    // Параметры препроцессора, не все параметры применимы (см. github.com/sass/node-sass)
      outputStyle: 'expanded'
    }
  }
}
```

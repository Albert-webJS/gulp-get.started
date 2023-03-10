"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const rigger = require("gulp-rigger");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const panini = require("panini");
const imagemin = require("gulp-imagemin");
const del = require("del");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();
const favicons = require("gulp-favicons");
const filter = require("gulp-filter");

// TODO created paths to build the project
const srcFolder = "src";
const buildFolder = "docs";

const path = {
  root: `${buildFolder}/`,
  build: {
    html: `${buildFolder}/`,
    css: `${buildFolder}/app/css/`,
    js: `${buildFolder}/app/js/`,
    images: `${buildFolder}/app/images/`,
    fonts: `${buildFolder}/app/fonts/`,
    favicon: `${buildFolder}/favicons/`,
  },
  src: {
    html: `${srcFolder}/*.html`,
    css: `${srcFolder}/app/scss/*.scss`,
    js: `${srcFolder}/app/js/**/*.js`,
    images: `${srcFolder}/app/images/**/*.{jpeg,png,svg,gif,ico}`,
    fonts: `${srcFolder}/app/fonts/**/*.{eot,woff,woff2,ttf,svg}`,
    favicon: `${srcFolder}/app/images/favicon/favicon.svg`,
  },
  watch: {
    html: `${srcFolder}/**/*.html`,
    css: `${srcFolder}/app/scss/**/*.scss`,
    js: `${srcFolder}/app/js/**/*.js`,
    images: `${srcFolder}/app/images/**/*.{jpeg,png,svg,gif,ico}`,
    fonts: `${srcFolder}/app/fonts/**/*.{eot,woff,woff2,ttf,svg}`,
    favicon: `${srcFolder}/app/images/favicon/favicon.svg`,
  },
  clean: `./${buildFolder}/`,
};

// TODO created main TASK for gulp
function html() {
  panini.refresh();
  return src(path.src.html, { base: `${srcFolder}/` })
    .pipe(plumber())
    .pipe(
      panini({
        root: `${srcFolder}/`,
        layouts: `${srcFolder}/app/templates/layouts/`,
        partials: `${srcFolder}/app/templates/partials/`,
      })
    )
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
  const onError = function (error) {
    notify.onError({
      title: "Gulp",
      subtitle: "Failure!",
      message: "Error: <%= error.message %>",
      sound: "Beep",
    })(error);

    this.emit("end");
  };

  return src(path.src.css, { base: `${srcFolder}/app/scss/` })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(
      cssnano({
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      })
    )
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));
}

function js() {
  const onError = function (error) {
    notify.onError({
      title: "Gulp",
      subtitle: "Failure!",
      message: "Error: <%= error.message %>",
      sound: "Beep",
    })(error);

    this.emit("end");
  };

  return src(path.src.js, { base: `${srcFolder}/app/js/` })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(rigger())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".js",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return src(path.src.images, { base: `${srcFolder}/app/images/` })
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 90, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

function favicon() {
  return src(path.src.favicon, { base: `${srcFolder}/app/images/favicon/` })
    .pipe(
      favicons({
        icons: {
          favicons: true,
          appleIcon: true,
          android: true,
          windows: false,
          yandex: false,
          coast: false,
          firefox: false,
          appleStatrup: false,
        },
      })
    )
    .pipe(dest(path.build.favicon))
    .pipe(filter(["favicon.ico", "apple-touch-icon.png", "manifest.json"]))
    .pipe(dest(path.root));
}

function fonts() {
  return src(path.src.fonts, { base: `${srcFolder}/app/fonts/` }).pipe(
    dest(path.build.fonts)
  );
}

function clean() {
  return del(path.clean);
}

function server() {
  browserSync.init({
    server: {
      baseDir: `./${buildFolder}/`,
    },
  });
}

function watchFile() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.fonts], fonts);
  gulp.watch([path.watch.favicon], favicon);
}

const build = gulp.series(
  clean,
  gulp.parallel(html, css, js, images, fonts, favicon)
);
const watch = gulp.parallel(build, watchFile, server);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.favicon = favicon;

exports.default = watch;

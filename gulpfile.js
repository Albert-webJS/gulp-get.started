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

// TODO created paths to build the project

const srcPath = "src";
const dist = "dist";

const path = {
  build: {
    html: `${dist}/`,
    css: `${dist}/app/css/`,
    js: `${dist}/app/js/`,
    images: `${dist}/app/images/`,
    fonts: `${dist}/app/fonts/`,
  },
  src: {
    html: `${srcPath}/*.html`,
    css: `${srcPath}/app/scss/*.scss`,
    js: `${srcPath}/app/js/**/*.js`,
    images: `${srcPath}/app/images/**/*.{jpeg,png,svg,gif,ico}`,
    fonts: `${srcPath}/app/fonts/**/*.{eot,woff,woff2,ttf,svg}`,
  },
  watch: {
    html: `${srcPath}/**/*.html`,
    css: `${srcPath}/app/scss/**/*.scss`,
    js: `${srcPath}/app/js/**/*.js`,
    images: `${srcPath}/app/images/**/*.{jpeg,png,svg,gif,ico}`,
    fonts: `${srcPath}/app/fonts/**/*.{eot,woff,woff2,ttf,svg}`,
  },
  clean: `./${dist}/`,
};

function html() {
  return src(path.src.html, { base: `${srcPath}/` })
    .pipe(plumber())
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

  return src(path.src.css, { base: `${srcPath}/app/scss/` })
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

  return src(path.src.js, { base: `${srcPath}/app/js/` })
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
  return src(path.src.images, { base: `${srcPath}/app/images/` })
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

function fonts() {
  return src(path.src.fonts, { base: `${srcPath}/app/fonts/` }).pipe(
    dest(path.build.fonts)
  );
}

function clean() {
  return del(path.clean);
}

function server() {
  browserSync.init({
    server: {
      baseDir: `./${dist}/`,
    },
  });
}

function watchFile() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.fonts], fonts);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, watchFile, server);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;

exports.default = watch;

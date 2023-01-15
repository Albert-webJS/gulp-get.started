"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-gulpcssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const panini = require("panini");
const imagemin = require("gulp-imagemin");
const del = require("del");
const browserSync = require("browser-sync").create();

// TODO created paths to build the project

const src = "src";
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
    html: `${src}/*.html`,
    css: `${src}/app/scss/*.scss`,
    js: `${src}/app/js/*.js`,
    images: `${src}/app/images/**/*.{jpeg, png, svg, gif, ico}`,
    fonts: `${src}/app/fonts/**/*.{eot, woff, woff2, ttf, svg}`,
  },
  watch: {
    html: `${src}/**/*.html`,
    css: `${src}/app/scss/**/*.scss`,
    js: `${src}/app/js/**/*.js`,
    images: `${src}/app/images/**/*.{jpeg, png, svg, gif, ico}`,
    fonts: `${src}/app/fonts/**/*.{eot, woff, woff2, ttf, svg}`,
  },
  clean: `./${dist}/`,
};

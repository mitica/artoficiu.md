"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const config = require("./lib/config").default;
const rename = require("gulp-rename");
const rev = require("gulp-rev-all");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");

// const ico = require('gulp-to-ico');
// const sourcemaps = require('gulp-sourcemaps');

const mainSassFiles = [
  "./assets/scss/main.scss",
  "./assets/scss/error-page.scss",
  "./assets/scss/invoice.scss",
  "./assets/scss/item.scss"
];

const cssDist = "./public/static/css";

gulp.task("sass-dev", function () {
  return gulp
    .src(mainSassFiles)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(cssDist));
});

gulp.task("sass", function () {
  return (
    gulp
      .src(mainSassFiles)
      .pipe(sass().on("error", sass.logError))
      .pipe(gulp.dest(cssDist))
      // .pipe(sourcemaps.init())
      .pipe(cleanCSS())
      .pipe(rev.revision())
      .pipe(gulp.dest(cssDist))
      .pipe(rev.manifestFile())
      // .pipe(sourcemaps.write())
      // .pipe(rename({ basename: config.css.main }))
      .pipe(gulp.dest(cssDist))
  );
});

gulp.task("sass:watch", function () {
  gulp.watch("./assets/scss/*.scss", ["sass-dev"]);
});

const mainJsFiles = [
  "./assets/js/jquery-3.2.1.slim.js",
  "./node_modules/bootstrap/js/dist/util.js",
  "./node_modules/bootstrap/js/dist/carousel.js",
  "./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js",
  "./node_modules/vanilla-lazyload/dist/lazyload.js",
  "./node_modules/sticky-sidebar/dist/sticky-sidebar.js",
  "./assets/js/cart.js",
  "./assets/js/checkout.js",
  "./assets/js/image-gallery.js",
  "./assets/js/main.js"
];
const jsDist = "./public/static/js";

gulp.task("js-dev", function () {
  return gulp.src(mainJsFiles).pipe(concat("main.js")).pipe(gulp.dest(jsDist));
});

gulp.task("js", function () {
  return (
    gulp
      .src(mainJsFiles)
      .pipe(concat("main.js"))
      .pipe(gulp.dest(jsDist))
      .pipe(uglify())
      // .pipe(cleanCSS())
      .pipe(rev.revision())
      .pipe(gulp.dest(jsDist))
      .pipe(rev.manifestFile())
      // .pipe(sourcemaps.write())
      // .pipe(rename({ basename: config.css.main }))
      .pipe(gulp.dest(jsDist))
  );
});

gulp.task("js:watch", function () {
  gulp.watch("./assets/js/*.js", ["js-dev"]);
});

gulp.task("imagemin", () =>
  gulp
    .src("./assets/img/**/*.png")
    .pipe(imagemin())
    .pipe(gulp.dest("./public/static/img/"))
);

// gulp.task('favicon', function () {
//   return gulp.src('./public/favicon.png')
//     .pipe(ico('favicon.ico', { resize: false, sizes: [32] }))
//     .pipe(gulp.dest('./public/'));
// });

gulp.task("img", gulp.series(["imagemin"]));

gulp.task("prod", gulp.series(["sass", "js", "img"]));
gulp.task(
  "default",
  gulp.series(["img", "sass-dev", "js-dev", "sass:watch", "js:watch"])
);

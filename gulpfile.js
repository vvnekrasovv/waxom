var gulp 		 = require('gulp'),
	sass 		 = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat		 = require('gulp-concat'),
	uglify		 = require('gulp-uglifyjs'),
	cssnano		 = require('gulp-cssnano'),
	rename		 = require('gulp-rename'),
	del			 = require('del'),
	imagemin	 = require('gulp-imagemin'),
	pngquant 	 = require('imagemin-pngquant'),
	autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.+[sass|scss]')
		.pipe(sass())
		.pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		.pipe(gulp.dest('app/css'));
});

gulp.task('css-min', ['sass'], function(){
	return gulp.src('app/css/main.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts-libs', function(){
	return gulp.src('app/libs/jquery/dist/jquery.min.js')
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('scripts', function(){
	return gulp.src('app/js/main.js')
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('watch', ['browser-sync', 'css-min', 'scripts'], function(){
	gulp.watch('app/sass/**/*.+[sass|scss]', ['css-min']);
	gulp.watch('app/js/**/*.js', ['scripts']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('css-concat', ['css-min'], function(){
	return gulp.src('app/css/*.min.css')
		.pipe(concat('styles.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('scripts-concat', ['scripts-libs', 'scripts'], function(){
	return gulp.src('app/js/*.min.js')
		.pipe(concat('scripts.min.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('build', ['clean', 'img', 'css-concat', 'scripts-concat'], function(){

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));

});

gulp.task('default', ['watch']);
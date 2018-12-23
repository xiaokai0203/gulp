const gulp = require('gulp');
const shelljs = require('shelljs');
const fs = require('fs');
const browserify = require('browserify');
const sequence = require('run-sequence');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const watchify = require('watchify');
const gif = require('gulp-if');
var babel = require('gulp-babel');
var webserver =require('gulp-webserver');

gulp.task('babel', () => {
    return gulp.src('assets/js/es6.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('build'));
});
gulp.task('babelTask', () => {
    gulp.watch('assets/js/es6.js', gulp.series(gulp.parallel('babel')))
});
gulp.task('webservers',function(){
    gulp.src('./')
    .pipe(webserver({
         host:'localhost',
         port:8080,
         livereload:true, //自动刷新
         directoryListing:{
              enable: true,
              path:'./index.html'
         },
    }));
});
gulp.task('default', gulp.series(gulp.parallel(mainjs, 'babel', 'babelTask', 'webservers')))
const isProduction = process.env.ENV === 'prod'
function mainjs(done) {
    let b = browserify({
        entries: ['assets/js/index.js'],
        cache:{},
        packageCache: {},
        plugin: [watchify]
    });
    function bundle(){
        b.bundle()
        .pipe(source("main.js"))
        .pipe(buffer())
        .pipe(gif(isProduction,uglify()))
        .pipe(gulp.dest('./js/'))
    }
    bundle()
    b.on('update', function() {
        bundle()
    })
    done()
}

// bundle 捆绑文件 createWriteStream 输出写作文件流
// sequence 调用task 3.9+
// watch 监听文件变化 
// watchify 优化watch 单个js修改
// gulp 4 https://www.jianshu.com/p/b025fd80acf9
// UglifyJs 丑化jS 难以阅读 删除空格换行
// bower 管理第三方类库 随时升级下载的类库 bower install **** bower update ****
// browserify-shim   解决不符合commonJs规范的类库无法require引用的问题
// vinyl-source-stream 返回一个可以被uglifyjs识别的流
// vinyl-buffer 转换为uglifyjs可以识别的buffer
// dest 输入生成路径

// gulp-clean-css 压缩css
// gulp-concat 合并css
// gulp-sass 编译sass
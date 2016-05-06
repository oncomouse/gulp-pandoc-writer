# gulp-pandoc-writer

`gulp` plugin that generates static files using `pandoc`.

Ported directly from [gulp-pandoc-pdf](https://github.com/brightsparklabs/gulp-pandoc-pdf), just changed to work with more file formats (gulp-pandoc-pdf only produces PDF files).

## Installation

```shell
npm install gulp-pandoc-writer --save-dev 
```

## Usage

```javascript
var pandocWriter = require('gulp-pandoc-writer');

gulp.task('build', function() {
    gulp.src('src/markdown/**/*.md')
        .pipe(pandocWriter({
			outputDir: 'dist/docx',
			inputFileType:'.md',
			outputFileType: '.docx',
			args: [
				'--smart'
			]
        })) 
        .pipe(gulp.dest('build/html'));
});
```

## API

### pandocWriter(options)

#### options.outputDir

**Type:** String

The directory to which output will be written by the plugin. The plugin will also generate HTML files for streaming purposes.


#### options.inputFileType

This can be any filetype supported by pandoc. Defaults to .md when no filetype is specified.

#### options.outputFileType

**Type:** String

Can be any file type, but the major focus of this plugin are files such as `.docx`, `.odt`, `.epub` that `pandoc` can create but will not write to `STDOUT` for streaming purposes in Gulp.

#### options.args

**Type:** Array

Additional arguments that might need to be passed to pandoc, e.g. `['--smart']`.
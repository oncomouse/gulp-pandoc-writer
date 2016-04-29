/*
 * Ported from code by brightSPARK Labs
 * www.brightsparklabs.com
 *
 * Andrew Pilsch updated this to work with ODT, DOCX, and other files
 * that gulp-pandoc-pdf doesn't work with.
 */

'use strict';

// -----------------------------------------------------------------------------
// MODULES
// -----------------------------------------------------------------------------

var pdc     = require('pdc');
var through = require('through2');
var gutil   = require('gulp-util');
var mkdirp  = require('mkdirp');

// -----------------------------------------------------------------------------
// PLUGIN
// -----------------------------------------------------------------------------

var PluginError = gutil.PluginError;
var pluginName  = 'gulp-pandoc-writer';

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

module.exports = function(opts) {
    var args = opts.args || [];
    var outputDir = opts.outputDir;
	var fileType = opts.fileType || '.docx';

    return through.obj(function (file, enc, cb) {
        var input = file.contents.toString();
        if (file.isNull())  {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(pluginName, 'Streaming not supported'));
            return cb();
        }

        // pandoc cannot output certain file types to STDOUT (such as epub, docx,
		// and odt). Here we need to write the file to the output destination
		// specified via the configuration object. Once these are created 
		// we need to ensure we send something through the pipelineto gulp,
        // so we call pandoc again and have it stream across HTML content back
        // to the pipeline.

        var outputFile = outputDir + '/' + file.relative;
        outputFile = outputFile.replace('.md', fileType);

        // create directory for pdf
        var oDir = outputFile.replace(/[^\/]+$/, '');
        mkdirp(oDir, function(err) {
            if (err) {
                this.emit('error', err.toString());
                return cb();
            }
        });

        // create output file
        var outputArgs = args.slice();
        outputArgs.push('--output=' + outputFile);
        pdc(input, 'markdown', fileType.replace(/^\./,''), outputArgs, function(err, output) {
            if (err) {
                this.emit('error', new PluginError(pluginName, err.toString()));
                return cb();
            }
        });

        // create html
        var htmlArgs = args.slice();
        htmlArgs.push('--standalone');
        pdc(input, 'markdown', 'html5', htmlArgs, function(err, output) {
            if (err) {
                this.emit('error', new PluginError(pluginName, err.toString()));
                return cb();
            }
            file.contents = new Buffer(output);
            file.path = gutil.replaceExtension(file.path, '.html');
            this.push(file);
            return cb();
        }.bind(this));
    });
};

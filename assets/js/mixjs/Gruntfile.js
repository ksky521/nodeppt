var concatArr = [
	'src/intro.js',
	'src/getCurrentScript.js',
	'src/vars.js',
	'src/typeof.js',
	'src/browser.js',
	'src/Module.js',
	'src/Promise.js',
	'src/getPath.js',
	'src/loadjs.js',
	'src/loadcss-img.js',
	'src/core.js',
	'src/outro.js'];
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				noarg: true,
				noempty: true,
				curly: true,
				asi: true,
				expr: true,
				browser: true,
				strict: true,
				unused: true,
				undef: true,
				loopfunc: false,
				sub: true,
				boss: true,
				eqnull: true
			},
			files: ['tmp/<%= pkg.name %>.js']
		},
		watch: {
			files: ['src/*.js'],
			tasks: 'dev'
		},
		concat: {
			MixJS: {
				options: {
					separator: '\n'
				},
				src: concatArr,
				dest: 'lib/<%= pkg.name %>.<%= pkg.version %>.js'
			},
			dev: {
				options: {
					separator: '\n'
				},
				src: concatArr,
				dest: 'tmp/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				sourceMap: 'lib/<%= pkg.name %>.<%= pkg.version %>.map',
				banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> by <%= pkg.author %> */\n'
			},
			dist: {
				src: '<%= concat.MixJS.dest %>',
				dest: 'lib/<%= pkg.name %>.<%= pkg.version %>.min.js'
			}
		},
		compress: {
			main: {
				options: {
					archive: '<%= pkg.name %>.zip'
				},
				files: [{
					expand: true,
					cwd: 'lib',
					src: ['**'],
					filter: 'isFile'
				}]
			}
		}
	});

	// grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compress');
	
	grunt.registerTask('build', ['concat:MixJS', 'uglify']);
	grunt.registerTask('dev', ['concat:dev', 'jshint']);
	
};
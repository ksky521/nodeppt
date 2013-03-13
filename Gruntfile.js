module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				// more options here if you want to override JSHint defaults
				globals: {
					console: true,
					module: true
				}
			},
			files: ['src/js/nodeppt.js']
		},
		compass: {
			dist: {
				options: {
					config: 'config.rb'
				}
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				// the files to concatenate
				src: ['src/js/*.js'],
				// the location of the resulting JS file
				dest: 'build/js/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				src: 'src/js/*.js',
				dest: 'build/js/<%= pkg.name %>.js'
			}
		},
		watch: {
			files: ['src/scss/*.scss'],
			tasks: ['compass']
		}

	});


	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat', 'uglify']);

};
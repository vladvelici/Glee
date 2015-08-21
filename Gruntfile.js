module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				files: {
					'build/style.css' : 'sass/style.sass'
				}
			}
		},
        concat: {
            dist: {
                src: [
                    "js/lib/jquery.min.js",
                    "js/lib/flight.min.js",
                    "js/*.js"
                ],
                dest: "build/app.js"
            }
        },

        uglify: {
            build: {
                src: "build/app.js",
                dest: "build/app.min.js"
            }
        },


		autoprefixer: {
			dist: {
				files: {
					'build/styles.css': 'build/styles.css' 
				}
			}
		},

		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'img/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'build/img/'
				}]
			}
		},

        connect: {
            server: {
                options: {
                    livereload: false,
                    base: "build/",
                    port: 8000
                }
            }
        },

        copy: {
            main: {
                files: [{
                    src: ["*.html", "*.ico", "*.png", "*.txt"],
                    dest: "build/"
                }],
            },
        },

		watch: {
			css: {
				files: '**/*.s*ss',
				tasks: ['sass', 'autoprefixer']
			},
            scripts: {
                files: ["js/*.js", "js/lib/*.js"],
                tasks: ["concat", "uglify"]
            },
            html: {
                files: ["*.html", "*.ico", "*.png", "*.txt"],
                tasks: ["copy"]
            }
		},
	});


	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-devtools');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['concat', 'uglify', 'sass', 'imagemin', 'copy']);

    grunt.registerTask('dev', ['default', 'connect:server', 'watch']);

};

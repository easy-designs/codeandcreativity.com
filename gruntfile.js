module.exports = function(grunt){

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks); 
	
	grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		// minify all css
		cssmin: {
			global: {
		        files: [{
					expand: true,
					cwd: 'assets/css/',
					src: ['*.css'],
					filter: function( src )
					{
						return src.indexOf('.gz') == -1;
					},
					dest: 'assets/css/',
					ext: '.css'
				}]
		    },
		    grunticon: {
		        files: [{
					expand: true,
					cwd: 'assets/css/icons/',
					src: ['*.css'],
					filter: function( src )
					{
						return src.indexOf('.gz') == -1;
					},
					dest: 'assets/css/icons/',
					ext: '.css'
				}]
		    }
		},
		
		// shrink & move SVGs to production folder
		svgmin: {
		    css: {
		        files: [{
					expand: true,
					cwd: 'assets/source/css_images/',
					src: ['*.svg'],
					dest: 'assets/css/i/',
					ext: '.svg'
				}]
		    },
		    sponsors: {
		        files: [{
					expand: true,
					cwd: 'assets/source/sponsors/',
					src: ['*.svg'],
					dest: 'assets/sponsors/',
					ext: '.svg'
				}]
		    }
		},
		
		// Compass compilation
		compass: {
			// Dev config
			dev: {
				options: {
					config: 'config.rb'
				}
			},
			// Production config
			prod: {
				options: {
					config: 'config.rb',
					outputStyle: 'compressed',
					environment: 'production',
					noLineComments: true
				}
			},
			// clean up the folder so we start fresh
			clean: {
				options: {
					config: 'config.rb',
					clean: true
				}
			}
		},
		
		// Merge JS files
		concat: {
			options: {
				separator: ';'
			},
			jquery: {
				src: ['assets/source/javascript/jquery.js'],
				dest: 'assets/js/jquery.js'
			},
			main: {
				src: [
					'assets/source/javascript/main.js',
					'assets/source/javascript/jquery.easy.validation.js',
					'assets/source/javascript/font-face-detection.js'
				],
				dest: 'assets/js/main.js'
			}
		},
		
		// minify JS
		uglify: {
			prod: {
		        files: {
		            'assets/js/jquery.js': ['assets/source/javascript/jquery.js'],
		            'assets/js/main.js': [
						'assets/source/javascript/main.js',
						'assets/source/javascript/jquery.easy.validation.js',
						'assets/source/javascript/font-face-detection.js'
					]
		        }
		    }
		},
		
		// optimize images
		imageoptim: {
		  	min: {
				options: {
					jpegMini: false,
					imageAlpha: true,
					quitAfter: true
				},
				src: ['assets/**/*.{jpg,gif,png}'],
				filter: function( src )
				{
					return src.indexOf('/source/') == -1;
				}
		  	}
		},
		
		// SVG icons & fallbacks
		grunticon: {
			ccIcons: {
				files: [{
					expand: true,
					cwd: 'assets/source/icons/',
					src: ['*.svg', '*.png'],
					dest: "assets/css/icons/"
			    }],
			    options: {
					datasvgcss: 'svg.css',
					datapngcss: 'png.css',
					urlpngcss: 'fallback.css'
				}
			}
		},
		
		// GZipping
		compress: {
			js: {
				options: {
					mode: 'gzip'
				},
				files: [
					{
						expand: true,
						cwd: 'assets/gzip/js',
						src: ['**/*.js'],
						dest: 'assets/js',
						ext: '.gz.js'
					}
				]
			},
			css: {
				options: {
					mode: 'gzip'
				},
				files: [
					{
						expand: true,
						cwd: 'assets/gzip/css',
						src: ['**/*.css'],
						dest: 'assets/css',
						ext: '.gz.css'
					}
				]
			},
			svg: {
				options: {
					mode: 'gzip'
				},
				files: [
					{
						expand: true,
						cwd: 'assets/',
						src: ['css/**/*.svg','fonts/*.svg','images/*.svg','sponsors/*.svg'],
						dest: 'assets/',
						ext: '.svgz'
					}
				]
			}
		},
		
		// Copying files over
		copy: {
			css: {
				expand: true,
				cwd: 'assets/css',
				src: ['**/*.css'],
				filter: function( src )
				{
					return src.indexOf('.gz') == -1;
				},
				dest: 'assets/gzip/css',
				ext: '.css'
			},
			js: {
				expand: true,
				cwd: 'assets/js',
				src: ['*.js'],
				filter: function( src )
				{
					return src.indexOf('.gz') == -1;
				},
				dest: 'assets/gzip/js',
				ext: '.js'
			}
		},
		
		// Insert .svgz into CSS files (in prep for GZipping)
		replace: {
			gzip_css_assets: {
				options: {
					patterns: [
						{
							match: /(\.svg)/g,
							replacement: '$1z'
						}
					],
					usePrefix: false
				},
				files: [
					{
						expand: true,
						cwd: 'assets/gzip/css',
						src: ['**/*.css'],
						dest: 'assets/gzip/css'
					}
				]
			}
		},
		
		// Cleanup temp folder
		clean: {
			temp: ["assets/gzip"]
		},
		
		// Watch config
		watch: {
		
			// SASS files
		    sass: {
		        files: ['assets/source/sass/*.scss'],
		        tasks: ['compass:dev']
		    },
		
			// JS files
			concat: {
				files: ['assets/source/javascript/*.js'],
		        tasks: ['concat']
			},
			
			// Images
			images: {
				files: ['assets/**/*.svg'],
				tasks: ['svgmin']
			},
			
			// Grunticon
			icons: {
				files: ['assets/icons/*.svg'],
				tasks: ['grunticon']
			}
			
		}
    });

    grunt.registerTask( 'build', [
		'uglify',
		'compass:clean', 'compass:prod',
		'cssmin',
		'copy:css','copy:js',
		'replace:gzip_css_assets',
		'compress',
		'clean:temp'
	]);
	grunt.registerTask( 'images', ['imageoptim']);
	grunt.registerTask('default', []);

};
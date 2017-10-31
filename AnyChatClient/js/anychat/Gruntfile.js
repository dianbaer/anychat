module.exports = function (grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n\r'
            },
            dist: {
                src: [
                    'src/ByteUtil.js',
					'src/FileConfig.js',
					'src/NotificationExt.js',
					'src/PostfixUtil.js',
					'src/UploadEventType.js',
					'src/FileSystemStatus.js',
					'src/UploadFileProxy.js',
					'src/UploadFileObj.js',
					'src/FileMediator.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            build: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    // 默认任务
    grunt.registerTask('default', ['concat', 'uglify']);
};
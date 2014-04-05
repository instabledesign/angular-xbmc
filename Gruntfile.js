module.exports = function (grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        builddir: 'dist',
        srcdir: 'src',
        files_order: [
            '<%= srcdir %>/angular-xbmc.js',
            '<%= srcdir %>/angular-xbmc-cache.js',
            '<%= srcdir %>/angular-xbmc-introspection.js',
            '<%= srcdir %>/angular-xbmc-orm.js',
            '<%= srcdir %>/angular-xbmc-request.js',
            '<%= srcdir %>/Entity/*.js',
            '<%= srcdir %>/Repository/*.js'
        ],
        pkg: grunt.file.readJSON('package.json'),
        buildDate: grunt.template.today('yyyy-mm-dd HH:MM:ss Z'),
        meta: {
            banner: '/**\n' +
                ' * <%= pkg.description %>\n' +
                ' *\n' +
                ' * @version v<%= pkg.version %>\n' +
                ' * @date <%= buildDate %>\n' +
                ' * @link <%= pkg.homepage %>\n' +
                ' * @license <%= pkg.license %>\n' +
                ' */'
        },
        clean: [ '<%= builddir %>' ],
        concat: {
            options: {
                banner: '<%= meta.banner %>\n'
            },
            dist: {
                src: [
                    '<banner:meta.banner>',
                    '<%= files_order%>'
                ],
                dest: '<%= builddir %>/angular-xbmc.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>\n'
            },
            dist: {
                src : [
                    '<banner:meta.banner>',
                    '<%= files_order%>'
                ],
                dest: '<%= builddir %>/angular-xbmc.min.js'
            }
        },
        karma: {
            unit: {
                configFile: 'test/Validation/karma.conf.js',
                singleRun: true
            }
        }
    });
    grunt.registerTask('build', ['clean', 'concat', 'uglify']);

    grunt.registerTask('test', ['karma']);
};
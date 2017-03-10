/**
 * Created by ABocharov on 12/18/2015.
 */

module.exports = function (grunt) {

    grunt.initConfig(
        {
            package: grunt.file.readJSON("package.json"),
            less: {
                dev: {
                    options: {
                        paths: ["css/"],
                    },
                    files: {
                        "css/s.css": "css/s.less"
                    }
                },
            },
            concat: {
                flot: {
                    src: [
                        "js/src/flot/jquery.flot.plot.js",
                        "js/src/flot/jquery.flot.navigate.js",
                        "js/src/flot/jquery.flot.fillbetween.js",
                        "js/src/flot/jquery.flot.time.js",
                        "js/src/flot/jquery.flot.crosshair.js",
                        "js/src/flot/jquery.flot.multiple.threshold.js",

                    ],
                    dest: "js/concat/chart.full.js"
                },
                common: {
                    src: [

                        "js/jquery-1.12.0.min.js",
                        "js/jquery-migrate-1.2.1.min.js",
                        "js/jquery.easing.1.3.js",
                        "js/jquery.transit.min.js",
                        "js/jquery.slimscroll.min.js",
                        "js/jquery.simpleTip.js",
                        "js/underscore-min.js",
                        "js/backbone-min.js",
                        "js/mustache.min.js",
                        "js/swfobject.min.js",
                        "js/web_socket.min.js",
                        "js/jquery.animateNumber.js",
                        "js/src/l100n.js",
                        "js/jquery.colorhelpers.js",
                        "js/phpdate.js",

                    ],
                    dest: "js/concat/common.full.js"
                },
                bs:{
                    src:[
                        "js/src/common.js",
                        "js/src/binarystation.js"
                    ],
                    dest: "js/concat/binarystation.full.js"
                },

                full:{
                    src:[
                    "js/jquery-1.12.0.min.js",
                    "js/jquery-migrate-1.2.1.min.js",
                    "js/jquery.easing.1.3.js",
                    "js/jquery.transit.min.js",
                    "js/jquery.slimscroll.min.js",
                    "js/jquery.simpleTip.js",
                    "js/underscore-min.js",
                    "js/backbone-min.js",
                    "js/mustache.min.js",
                    "js/swfobject.min.js",
                    "js/web_socket.min.js",
                    "js/jquery.animateNumber.js",
                    "js/src/l100n.js",
                    "js/jquery.colorhelpers.js",
                    "js/phpdate.js",

                    "js/src/flot/jquery.flot.plot.js",
                    "js/src/flot/jquery.flot.navigate.js",
                    "js/src/flot/jquery.flot.fillbetween.js",
                    "js/src/flot/jquery.flot.time.js",
                    "js/src/flot/jquery.flot.crosshair.js",
                    "js/src/flot/jquery.flot.multiple.threshold.js",

                    "js/src/common.js",
                    "js/src/binarystation.js"
                        ],
                    dest:"js/concat/binarystation.all.js"
                }

            },

            uglify: {
                main: {
                    files: {
                        //"js/min/common.min.js": "<%= concat.common.dest %>",
                        //"js/min/chart.min.js": "<%= concat.flot.dest %>",
                        //"js/min/binarystation.min.js": "<%= concat.bs.dest %>",
                        "js/min/binarystation.min.js": "<%= concat.full.dest %>",
                    }
                }
            },
            processhtml: {
                options: {
                    data: {
                        name: "<%= package.name %>",
                        ver: "<%= package.version %>",
                        description: "<%= package.description %>"
                    }
                },
                dev: {
                    files: {
                        "index.html": ["index_dev.html"]
                    }
                },
                dist: {
                    files: {
                        "index.html": ["index_dev.html"]
                    }
                }

            },
            copy: {
                // option: {
                //     nonull:true
                // },
                main: {
                    files: [
                        {expand: true, src: ["index.html"], dest: "build/web/", filter: "isFile"},
                        {expand: true, src: ["favicon.ico"], dest: "build/web/", filter: "isFile"},
                        {expand: true, src: ["css/*.css"], dest: "build/web/", filter: "isFile"},
                        {expand: true, src: ["fonts/**"], dest: "build/web/", filter: "isFile"},
                        {expand: true, src: ["i/*"], dest: "build/web/", filter: "isFile"},
                        {expand: true, src: "js/*.js", dest: "build/web/", filter: "isFile"},
                        {expand: true, src: "js/*.swf", dest: "build/web/", filter: "isFile"},
                        {expand: true, src: ["js/min/index.js"], dest: "build/web/", filter: "isFile"},
                        {expand: true, src: ["js/lang.json"], dest: "build/web/", filter: "isFile"},
                        {
                            flatten: true,
                            src:"js/min/binarystation.min.js",
                            dest: "build/web/js/binarystation.min.js",
                            filter: "isFile"
                        },
                        {
                            flatten: true,
                            src: ["js/config.prod"],
                            dest: "build/web/js/config.example.json",
                            filter: "isFile"
                        }
                    ]
                }
            },
            clean: [
                'build/web/css',
                'build/web/fonts',
                'build/web/i',
                'build/web/js',
                'build/web/index.html',
                'build/web/favicon.ico',
            ],
            githash: {
                options: {},
                main: {}
            },
            compress: {
                main: {
                    options: {
                        archive: "build/release/<%= package.name %>-<%= package.version %>-<%= githash.main.branch %>-<%= githash.main.short %>.zip"
                    },
                    files: [
                        {expand:true, cwd: 'build/web/', src: ['**'], dest:'widget/', filter: "isFile"}
                    ]
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-githash');
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-processhtml");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('dev', ['less']);
    grunt.registerTask('default', ['concat']);
    grunt.registerTask('release', ['less', 'concat', 'uglify', 'processhtml:dist',"clean", "copy"]);
};

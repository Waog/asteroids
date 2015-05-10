module.exports = function(grunt) {

    grunt.initConfig({
        clean : [ "node_modules/phaser/typescript/phaser.d.ts",
                "node_modules/phaser/typescript/pixi.d.ts" ]
    });

    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', [ 'clean' ]);

};
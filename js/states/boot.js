'use strict';

var DudeFootball = {};

DudeFootball.Boot = function (game) {
    
};

DudeFootball.Boot.prototype = {

	init: function () {
		/*
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        */
        this.game.scale.forceLandscape = true;
        //game.scale.setScreenSize(true);
	},
	
	preload: function() {
		this.load.image('preloader', 'assets/preloader.gif');
	},
	create: function() {
		this.game.input.maxPointers = 1;
		this.game.state.start('Preload');
		
	}
};

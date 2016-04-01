'use strict';

var DudeFootball = {};

DudeFootball.Boot = function (game) {
    
};

DudeFootball.Boot.prototype = {

	init: function () {

	},
	
	preload: function() {
		this.load.image('preloader', 'assets/preloader.gif');
	},
	create: function() {
		this.game.input.maxPointers = 1;
		this.game.state.start('Preload');
		this.game.input.addPointer();
		this.game.input.addPointer();
		this.game.input.addPointer();
		this.game.input.addPointer();
	}
};

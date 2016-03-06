'use strict';

DudeFootball.Preload = function (game) {
    
};

DudeFootball.Preload.prototype = {
    preload: function() {
        this.preloader = this.add.sprite(this.width/2,this.height/2, 'preloader');
        this.preloader.anchor.setTo(0.5, 0.5);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.preloader);
        this.load.spritesheet('jugador','assets/jugador.png',40,55);

        
        this.load.image('pelota', 'assets/pelota.png');
        this.load.image('background', 'assets/background.jpg');

        this.load.image('suelo_fake', 'assets/suelo_fake.png');

        this.load.image('cargador1', 'assets/cargador.png');

    },
    create: function() {
        this.preloader.cropEnabled = false;
    },
    update: function() {
        if(!!this.ready) {
            this.game.state.start('Play');
        }
    },
    onLoadComplete: function() {
        this.ready = true;
    }

};
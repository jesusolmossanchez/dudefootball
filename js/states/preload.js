'use strict';

DudeFootball.Preload = function (game) {
    
};

DudeFootball.Preload.prototype = {
    preload: function() {
        this.preloader = this.add.sprite(this.width/2,this.height/2, 'preloader');
        this.preloader.anchor.setTo(0.5, 0.5);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.preloader);
        this.load.spritesheet('jugador','assets/jugador.png',72,100);
        this.load.spritesheet('jugador_cpu','assets/jugador_cpu.png',72,100);
        
        this.load.spritesheet('portero','assets/portero1.png',65,100);
        this.load.spritesheet('portero_cpu','assets/portero2.png',65,100);

        
        this.load.spritesheet('pelota', 'assets/pelota.png',32,28);
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('porteria', 'assets/porteria.png',307,550);

        this.load.image('suelo_fake', 'assets/suelo_fake.png');
        this.load.image('suelo_fake_vertical', 'assets/suelo_fake_vertical.png');

        

        this.load.image('jugador_activo', 'assets/jugador_activo.png');
        this.load.image('fake_sprite', 'assets/fake_sprite.png');
        this.load.image('sombra_jugador', 'assets/sombra_jugador.png');

        this.load.image('joy_back', 'assets/joy_back.png');
        this.load.image('joy_front', 'assets/joy_front.png');
        this.load.image('botonA', 'assets/botonA.png');
        this.load.image('botonB', 'assets/botonB.png');

        this.load.image('cargador1', 'assets/cargador.png');

        this.load.audio('musica', ['assets/game_music.mp3', 'assets/game_music.ogg']);


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
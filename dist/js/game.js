(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(900, 600, Phaser.AUTO, 'dude_football');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){
'use strict';
function Play() {}

Play.prototype = {
    create: function() {
        this.add.sprite(0, 0, 'background');
        this.game.world.setBounds(0, 0, 3000, 1193);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //this.jugador = this.game.add.sprite (this.game.world.centerX, this.game.world.centerY,'jugador');
        this.jugador = this.game.add.sprite (400, 250,'jugador');
        this.jugador.animations.add('semueve', [0,1], 7, true);

        this.pelota = this.game.add.sprite (450, 300,'pelota');
        this.jugador.anchor.setTo(0.5, 0.5);
        this.pelota.anchor.setTo(0.5, 0.5);

        this.game.physics.arcade.enable(this.jugador);
        this.game.physics.arcade.enable(this.pelota);

        this.game.camera.follow(this.pelota);

        this.jugador.body.collideWorldBounds = true;
        this.pelota.body.collideWorldBounds = true;

        this.pelota.body.bounce.y = 0.9;
        this.pelota.body.bounce.x = 0.9;

        this.pelota_arriba = false;
        this.pelota_abajo = false;
        this.pelota_izquierda = false;
        this.pelota_derecha = false;

        this.together = false;
        this.chutando = false;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.disparo = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.centro = this.input.keyboard.addKey(Phaser.Keyboard.X);

        this.arriba = this.cursors.up;
        this.abajo = this.cursors.down;
        this.izquierda = this.cursors.left;
        this.derecha = this.cursors.right;

        this.game.camera.deadzone = new Phaser.Rectangle(400, 250, 100, 100);

    },
    update: function() {

        if(this.centrando){
            this.pelota.body.velocity.y += 10;
        }
        else{
            this.physics.arcade.collide(this.pelota, this.jugador, this.controla, null, this);
        }
        

        
        if(this.disparo.isDown && this.together){
            this.chuta();
        }
        if(this.centro.isDown && this.together){
            this.centra();
        }


        this.jugador.body.velocity.x = 0;
        this.jugador.body.velocity.y = 0;

        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.jugador.body.velocity.x = -200;
            this.jugador.animations.play('semueve');
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.jugador.body.velocity.x = 200;
            this.jugador.animations.play('semueve');
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            this.jugador.body.velocity.y = -200;
            this.jugador.animations.play('semueve');
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            this.jugador.body.velocity.y = 200;
            this.jugador.animations.play('semueve');
        }
        
        this.jugador.animations.stop();
            
        if(this.together){
            this.pelota.body.velocity.y = this.jugador.body.velocity.y;
            this.pelota.body.velocity.x = this.jugador.body.velocity.x;


            if(this.jugador.body.velocity.x > 0 && !this.pelota_derecha){
                this.pelota_izquierda = false;
                this.pelota_derecha = true;
                this.pelota.position.x = this.jugador.position.x + 25;
            }
            else if(this.jugador.body.velocity.x < 0 && !this.pelota_izquierda){
                this.pelota_izquierda = true;
                this.pelota_derecha = false;
                this.pelota.position.x = this.jugador.position.x - 20;
            }

            if(this.jugador.body.velocity.y > 0 && !this.pelota_abajo){
                this.pelota_arriba = false;
                this.pelota_abajo = true;
                this.pelota.position.y = this.jugador.position.y + 25;
            }
            else if(this.jugador.body.velocity.y < 0 && !this.pelota_arriba){
                this.pelota_arriba = true;
                this.pelota_abajo = false;
                this.pelota.position.y = this.jugador.position.y + 5;
            }
        }

    },

    controla: function(){
        this.together = true;   
    },

    chuta: function(){
        this.chutando = true;
        this.together = false;
        if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.body.velocity.y = -500;
            this.pelota.body.velocity.x = 0;
        }
        if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.body.velocity.y = 500;
            this.pelota.body.velocity.x = 0;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            this.pelota.body.velocity.y = 0;
            this.pelota.body.velocity.x = 500;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.body.velocity.y = 0;
            this.pelota.body.velocity.x = -500;
        }
        if(this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.body.velocity.y = -500;
            this.pelota.body.velocity.x = -500;
        }
        if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            this.pelota.body.velocity.y = -500;
            this.pelota.body.velocity.x = 500;
        }
        if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            this.pelota.body.velocity.y = 500;
            this.pelota.body.velocity.x = 500;
        }
        if(!this.arriba.isDown && this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.body.velocity.y = 500;
            this.pelota.body.velocity.x = 500;
        }
    },

    centra: function(){
        this.chutando = true;
        this.centrando = true;
        this.together = false;
        this.pelota.body.velocity.y = -450;
        this.pelota.body.velocity.x = 400;
    }
};

module.exports = Play;
},{}],6:[function(require,module,exports){

'use strict';
function Preload() {
    this.preloader = null;
    this.ready = false;
}

Preload.prototype = {
    preload: function() {
        this.preloader = this.add.sprite(this.width/2,this.height/2, 'preloader');
        this.preloader.anchor.setTo(0.5, 0.5);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.preloader);
        this.load.spritesheet('jugador','assets/jugador.png',40,55);

        
        this.load.image('pelota', 'assets/pelota.png');
        this.load.image('background', 'assets/background.jpg');

    },
    create: function() {
        this.preloader.cropEnabled = false;
    },
    update: function() {
        if(!!this.ready) {
            this.game.state.start('play');
        }
    },
    onLoadComplete: function() {
        this.ready = true;
    }

};

module.exports = Preload;

},{}]},{},[1])
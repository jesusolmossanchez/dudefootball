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
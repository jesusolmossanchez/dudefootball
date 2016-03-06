'use strict';

DudeFootball.Play = function (game) {
    
};

DudeFootball.Play.prototype = {
    create: function() {
        
        this.add.sprite(0, 0, 'background');
        this.game.world.setBounds(0, 0, 3000, 1193);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //this.jugador = this.game.add.sprite (this.game.world.centerX, this.game.world.centerY,'jugador');

        this.jugador = new Player(this.game);

        //this.jugador = this.game.add.sprite (400, 250,'jugador');
        //this.jugador.animations.add('semueve', [0,1], 7, true);
        //this.jugador.anchor.setTo(0.5, 0.5);
        //this.jugador.body.collideWorldBounds = true;
        //this.game.physics.arcade.enable(this.jugador);
        //this.jugador.saltando = false;
        //this.jugador.controlando = false;

        //PELOTA
        this.pelota = this.game.add.sprite (450, 300,'pelota');
        this.pelota.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this.pelota);
        this.game.camera.follow(this.pelota);
        this.pelota.body.collideWorldBounds = true;
        this.pelota.body.bounce.y = 0.9;
        this.pelota.body.bounce.x = 0.9;

        //SUelo fake para rebote de pelota
        this.suelo_fake = this.game.add.sprite(0, 10, "suelo_fake");
        this.suelo_fake.enableBody = true;
        this.game.physics.arcade.enable(this.suelo_fake);
        this.suelo_fake.body.immovable = true;
        this.suelo_fake.alpha = 0;


        //Cargador de disparo
        this.cargador1 = this.game.add.image(5, 5,'cargador1');
        this.cargador1.fixedToCamera = true;


        //Situación de la pelota
        this.pelota_arriba = false;
        this.pelota_abajo = false;
        this.pelota_izquierda = false;
        this.pelota_derecha = false;


        this.cursors = this.input.keyboard.createCursorKeys();

        this.disparo = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.centro = this.input.keyboard.addKey(Phaser.Keyboard.X);
        this.arriba = this.cursors.up;
        this.abajo = this.cursors.down;
        this.izquierda = this.cursors.left;
        this.derecha = this.cursors.right;

        //zona muerta de la cámara
        this.game.camera.deadzone = new Phaser.Rectangle(400, 250, 100, 100);

    },
    update: function() {

        if(this.centrando_time > this.time.now){
            this.physics.arcade.collide(this.pelota, this.suelo_fake);
            if (this.jugador.saltando || (this.centra_y -this.pelota.body.position.y < 30) ){
                this.physics.arcade.collide(this.pelota, this.jugador, this.controla, null, this);
            }
        }
        else{
            this.pelota.body.bounce.y = 0.9;
            this.pelota.scale.setTo(1, 1);
            this.pelota.body.collideWorldBounds = true;
            if (this.centra_y < this.pelota.body.position.y && this.centrando){
                this.suelo_fake.body.position.y = 3000;
                this.pelota.body.velocity.y = 0;
                this.pelota.body.gravity.y = 0;
                this.centrando = false;
            }
            this.physics.arcade.collide(this.pelota, this.jugador.sprite, this.controla, null, this);
        }

        
        if(this.pelota.body.velocity.x > 0){
            this.pelota.body.velocity.x -= 1;
        }
        if(this.pelota.body.velocity.x < 0){
            this.pelota.body.velocity.x += 1;
        }

        
        if(this.disparo.isUp && this.jugador.controlando){
            if(this.dentro){
                var super_potencia = (this.potencia > 100) ? true : false; 
                this.chuta(super_potencia);
                this.dentro = false;
            }
        }
        
        if(this.centro.isUp && this.jugador.controlando){
            if(this.dentro_centro){
                this.centra();
                this.dentro_centro = false;
            }
            
        }


        this.jugador.sprite.body.velocity.x = 0;
        this.jugador.sprite.body.velocity.y = 0;

        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.jugador.sprite.body.velocity.x = -200;
            this.jugador.sprite.animations.play('semueve');
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.jugador.sprite.body.velocity.x = 200;
            this.jugador.sprite.animations.play('semueve');
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            this.jugador.sprite.body.velocity.y = -200;
            this.jugador.sprite.animations.play('semueve');
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            this.jugador.sprite.body.velocity.y = 200;
            this.jugador.sprite.animations.play('semueve');
        }
        
            
        if (this.disparo.isUp){
            this.potencia = 0;
        }
        if (this.disparo.isDown){
            this.potencia += 1;
        }

        var corta = new Phaser.Rectangle(0, 0, this.potencia, 30);
        corta.fixedToCamera = true;
        this.cargador1.crop(corta);    

        if(this.jugador.controlando){

            if (this.disparo.isDown){
                this.dentro = true;
            }
            if (this.centro.isDown){
                this.dentro_centro = true;
            }

            this.pelota.body.velocity.y = this.jugador.sprite.body.velocity.y;
            this.pelota.body.velocity.x = this.jugador.sprite.body.velocity.x;


            if(this.jugador.sprite.body.velocity.x > 0 && !this.pelota_derecha){
                this.pelota_izquierda = false;
                this.pelota_derecha = true;
                this.pelota.position.x = this.jugador.sprite.position.x + 25;
            }
            else if(this.jugador.sprite.body.velocity.x < 0 && !this.pelota_izquierda){
                this.pelota_izquierda = true;
                this.pelota_derecha = false;
                this.pelota.position.x = this.jugador.sprite.position.x - 20;
            }

            if(this.jugador.sprite.body.velocity.y > 0 && !this.pelota_abajo){
                this.pelota_arriba = false;
                this.pelota_abajo = true;
                this.pelota.position.y = this.jugador.sprite.position.y + 25;
            }
            else if(this.jugador.sprite.body.velocity.y < 0 && !this.pelota_arriba){
                this.pelota_arriba = true;
                this.pelota_abajo = false;
                this.pelota.position.y = this.jugador.sprite.position.y + 5;
            }
        }

    },

    controla: function(){
        this.jugador.controlando = true;   
    },

    chuta: function(super_potencia){
        var potencia_disparo = super_potencia ? 1500 : 800;

        this.jugador.controlando = false;
        if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.body.velocity.y = -potencia_disparo;
            this.pelota.body.velocity.x = 0;
        }
        if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.body.velocity.y = potencia_disparo;
            this.pelota.body.velocity.x = 0;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            this.pelota.body.velocity.y = 0;
            this.pelota.body.velocity.x = potencia_disparo;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.body.velocity.y = 0;
            this.pelota.body.velocity.x = -potencia_disparo;
        }
        if(this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.body.velocity.y = -potencia_disparo;
            this.pelota.body.velocity.x = -potencia_disparo;
        }
        if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            this.pelota.body.velocity.y = -potencia_disparo;
            this.pelota.body.velocity.x = potencia_disparo;
        }
        if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            this.pelota.body.velocity.y = potencia_disparo;
            this.pelota.body.velocity.x = potencia_disparo;
        }
        if(!this.arriba.isDown && this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.body.velocity.y = potencia_disparo;
            this.pelota.body.velocity.x = -potencia_disparo;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.body.velocity.y = 0;
            this.pelota.body.velocity.x = potencia_disparo;
        }
    },

    centra: function(){
        
        this.centrando = true;
        this.centrando_time = this.time.now + 1500;
        this.jugador.controlando = false;
        this.centra_y = this.pelota.body.position.y;
        this.pelota.body.velocity.y = -600;
        if(this.izquierda.isDown){
            this.pelota.body.velocity.x = -400;
        }
        else{
            this.pelota.body.velocity.x = 400;
        }

        this.pelota.body.gravity.y = 900;
        this.suelo_fake.body.position.y = this.pelota.body.position.y + 30;
        this.pelota.body.bounce.y = 0.4;
        this.pelota.scale.setTo(1.5, 1.5);
        this.pelota.body.collideWorldBounds = false;
    }
};
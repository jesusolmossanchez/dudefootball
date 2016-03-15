'use strict';

DudeFootball.Play = function (game) {
    
};

DudeFootball.Play.prototype = {
    create: function() {
        
        //CONSTANTES!
        this.game.ancho_campo = 3000;
        this.game.alto_campo = 1193;

        this.game.inicio_pelota_x = 450;
        this.game.inicio_pelota_y = 300;

        this.game.inicio_suelo_fake_x = 0;
        this.game.inicio_suelo_fake_y = 10;

        this.compensacion_suelo_fake = 30;

        this.game.pelota_bounce_x = 0.9;
        this.game.pelota_bounce_y = 0.9;

        this.pelota_bounce_y_centrando = 0.4;

        this.game.default_anchor = 0.5;

        this.game.cargador1_x = 5;
        this.game.cargador1_y = 5;

        this.rectangulo_deadzone = new Phaser.Rectangle(400, 250, 100, 100);

        this.game.max_potencia = 100;

        this.game.velocidad_jugador = 200;

        this.posicion_pelota_controlando_x = 20;
        this.posicion_pelota_controlando_y = 15;

        this.velocidad_chute_normal = 800;
        this.velocidad_chute_super = 1500;

        this.velocidad_centro_y = 600;
        this.velocidad_centro_x = 400;

        this.tiempo_centrando = 1500;

        this.gravedad_pelota_centrando = 900;

        this.pulsacion = false;
        this.pulsacion_centro = false;

        //FIN CONSTANTES

        this.add.sprite(0, 0, 'background');
        this.game.world.setBounds(0, 0, this.game.ancho_campo, this.game.alto_campo);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.jugadores = [];
        this.jugadores.push(new Player(this.game, 400, 250));
        this.jugadores.push(new Player(this.game, 800, 450));
        this.jugadores.push(new Player(this.game, 100, 50));
        this.jugadores.push(new Player(this.game, 600, 350));

        //this.jugador_activo = new Player(this.game, 400, 250);
        this.jugador_activo = this.jugadores[0];

        //PELOTA
        this.pelota = new Pelota(this.game);
        /*
        this.pelota = this.game.add.sprite (inicio_pelota_x, inicio_pelota_y,'pelota');
        this.pelota.anchor.setTo(default_anchor, default_anchor);
        this.game.physics.arcade.enable(this.pelota);
        this.game.camera.follow(this.pelota);
        this.pelota.body.collideWorldBounds = true;
        this.pelota.body.bounce.x = pelota_bounce_x;
        this.pelota.body.bounce.y = pelota_bounce_y;
        */

        //SUelo fake para rebote de pelota
        this.suelo_fake = this.game.add.sprite(this.game.inicio_suelo_fake_x, this.game.inicio_suelo_fake_y, "suelo_fake");
        this.suelo_fake.enableBody = true;
        this.game.physics.arcade.enable(this.suelo_fake);
        this.suelo_fake.body.immovable = true;
        this.suelo_fake.alpha = 0;


        //Cargador de disparo
        this.cargador1 = this.game.add.image(this.game.cargador1_x, this.game.cargador1_y,'cargador1');
        this.cargador1.fixedToCamera = true;


        //CURSORES!!
        this.cursors = this.input.keyboard.createCursorKeys();
        this.disparo = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.centro = this.input.keyboard.addKey(Phaser.Keyboard.X);
        this.arriba = this.cursors.up;
        this.abajo = this.cursors.down;
        this.izquierda = this.cursors.left;
        this.derecha = this.cursors.right;


        //zona muerta de la cámara
        this.game.camera.deadzone = this.rectangulo_deadzone;

    },
    update: function() {

        if(this.centrando_time > this.time.now){
            this.procesa_centrando();
        }
        else{
            this.procesa_no_centrando();
        }

        //TODO: Revisar esto bien!!
        this.pelota.frena();
        //Frenado de la pelota
        /*
        if(this.pelota.body.velocity.x > 0){
            this.pelota.body.velocity.x -= 1;
        }
        if(this.pelota.body.velocity.x < 0){
            this.pelota.body.velocity.x += 1;
        }
        */

        
        //Si se suelta el disparo y el jugador controla la pelota
        if(this.disparo.isUp && this.jugador_activo.controlando){
            //Siempre que se haya soltado(isUp quiere decir que no lo está pulsando, no que lo acabe de soltar)
            if(this.pulsacion){
                //Si se llega a la superpotencia se llama al disparo con superpotencia
                var super_potencia = (this.potencia > this.game.max_potencia) ? true : false; 
                this.chuta(super_potencia);
                //reseteo la pulsacion
                this.pulsacion = false;
            }
        }
        //Si se suelta el centro y el jugador controla la pelota
        if(this.centro.isUp && this.jugador_activo.controlando){
            //Siempre que se haya soltado(isUp quiere decir que no lo está pulsando, no que lo acabe de soltar)
            if(this.pulsacion_centro){
                //centra
                this.centra();
                //reseteo la pulsacion
                this.pulsacion_centro = false;
            }
            
        }

        for (var i = 0; i < this.jugadores.length; i++) {
            this.jugadores[i].resetea_velocidad();
        }
        //Reseteo velocidad del jugador (TODO: Llevar a funcion?)
        /*
        this.jugador_activo.sprite.body.velocity.x = 0;
        this.jugador_activo.sprite.body.velocity.y = 0;
        */
       

        this.procesa_inputs();



        //Si el jugador controla la pelota
        if(this.jugador_activo.controlando){

            //Ajustar las pulsaciones, a lo que realmente pasa
            if (this.disparo.isDown){
                this.pulsacion = true;
            }
            if (this.centro.isDown){
                this.pulsacion_centro = true;
            }

            //Velocidad de la pelota ajustada a la velocidad del jugador
            this.pelota.sprite.body.velocity.y = this.jugador_activo.sprite.body.velocity.y;
            this.pelota.sprite.body.velocity.x = this.jugador_activo.sprite.body.velocity.x;

            //Resitua pelota con respecto al jugador
            
            if(this.jugador_activo.sprite.body.velocity.x > 0 && !this.pelota.derecha){
                this.pelota.izquierda = false;
                this.pelota.derecha = true;
                this.pelota.sprite.position.x = this.jugador_activo.sprite.position.x + this.posicion_pelota_controlando_x;

            }
            else if(this.jugador_activo.sprite.body.velocity.x < 0 && !this.pelota.izquierda){
                this.pelota.izquierda = true;
                this.pelota.derecha = false;
                this.pelota.sprite.position.x = this.jugador_activo.sprite.position.x - this.posicion_pelota_controlando_x;
            }

            if(this.jugador_activo.sprite.body.velocity.y > 0 && !this.pelota.abajo){
                this.pelota.arriba = false;
                this.pelota.abajo = true;
                this.pelota.sprite.position.y = this.jugador_activo.sprite.position.y + this.posicion_pelota_controlando_y;
            }
            else if(this.jugador_activo.sprite.body.velocity.y < 0 && !this.pelota.arriba){
                this.pelota.arriba = true;
                this.pelota.abajo = false;
                this.pelota.sprite.position.y = this.jugador_activo.sprite.position.y + this.posicion_pelota_controlando_y;
            }
        }

    },

    controla: function(id){
        //Seteo controlando
        this.jugador_activo = this.jugadores[id];
        this.jugador_activo.controlando = true;
    },

    procesa_inputs: function(){
        
        //Mueve al jugador
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.jugador_activo.mueve("izquierda");
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.jugador_activo.mueve("derecha");
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            this.jugador_activo.mueve("arriba");
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            this.jugador_activo.mueve("abajo");
        }

        //Reseteo la potencia
        if (this.disparo.isUp){
            this.potencia = 0;
        }
        if (this.disparo.isDown){
            this.potencia += 1;
        }
        var corta = new Phaser.Rectangle(0, 0, this.potencia, 30);
        corta.fixedToCamera = true;
        this.cargador1.crop(corta);  

    },

    procesa_centrando: function(){
        //Si está centrando, la pelota rebota con el suelo fake
        this.physics.arcade.collide(this.pelota.sprite, this.suelo_fake);

        //solo choca con el jugador si está saltando o la pelota va baja
        //Cambiar a jugador_fake_sprite
        if (this.jugador_activo.saltando || (this.centra_y - this.pelota.sprite.body.position.y < this.compensacion_suelo_fake) ){
            for (var i = 0; i < this.jugadores.length; i++) {
                this.physics.arcade.collide(this.pelota.sprite, this.jugadores[i].sprite, function(){this.controla(i);} , null, this); 
            }

            
        } 
    },

    procesa_no_centrando: function(){
        //si no centra, la pelota revota normal
        this.pelota.sprite.body.bounce.y = this.game.pelota_bounce_y;
        //Revisar... animación??
        this.pelota.sprite.scale.setTo(1, 1);
        //la pelota vuelve a chocar con las paredes
        this.pelota.sprite.body.collideWorldBounds = true;

        //Si se ha acabao el tiempo del centrado
        if (this.centra_y < this.pelota.sprite.body.position.y && this.centrando){
            //el suelo vuelve a su sitio
            this.suelo_fake.body.position.y = 0;
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.gravity.y = 0;
            //y se marca como que ya no está centrando
            this.centrando = false;
        }
        //Se vuelve a activar la colisión con el jugador
        for (var i = 0; i < this.jugadores.length; i++) {
            this.physics.arcade.collide(this.pelota.sprite, this.jugadores[i].sprite, function(){this.controla(i);} , null, this);  
        }
    },

    chuta: function(super_potencia){

        //velocidad del disparo según superpotencia
        //TODO: Animación del disparo también!
        var potencia_disparo = super_potencia ? this.velocidad_chute_super : this.velocidad_chute_normal;

        //El jugador ya no controla la pelota
        this.jugador_activo.controlando = false;

        //diferentes angulos del disparo
        if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.sprite.body.velocity.y = -potencia_disparo;
            this.pelota.sprite.body.velocity.x = 0;
        }
        if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.sprite.body.velocity.y = potencia_disparo;
            this.pelota.sprite.body.velocity.x = 0;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
        if(this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.sprite.body.velocity.y = -potencia_disparo;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
        if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            this.pelota.sprite.body.velocity.y = -potencia_disparo;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
        if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            this.pelota.sprite.body.velocity.y = potencia_disparo;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
        if(!this.arriba.isDown && this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.sprite.body.velocity.y = potencia_disparo;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
    },

    centra: function(){
        
        //Seteo que se está centrando
        this.centrando = true;
        //Y le pongo su tiempo
        this.centrando_time = this.time.now + this.tiempo_centrando;
        //El jugador ya no controla la pelota
        this.jugador_activo.controlando = false;

        //guardo en el sitio desde el que se centra
        this.centra_y = this.pelota.sprite.body.position.y;

        //cambio la velocidad y de la pelota
        this.pelota.sprite.body.velocity.y = - this.velocidad_centro_y;
        if(this.izquierda.isDown){
            this.pelota.sprite.body.velocity.x = - this.velocidad_centro_x;
        }
        else{
            this.pelota.sprite.body.velocity.x = this.velocidad_centro_x;
        }

        //cambio la gravedad del rebote
        this.pelota.sprite.body.gravity.y = this.gravedad_pelota_centrando;
        //pongo el suelo donde se centró, más una compensación
        this.suelo_fake.body.position.y = this.pelota.sprite.body.position.y + this.compensacion_suelo_fake;
        //cambio la potencia del rebote (para que rebote menos)
        this.pelota.sprite.body.bounce.y = this.pelota_bounce_y_centrando;
        //aumento la pelota
        //TODO: animación?
        this.pelota.sprite.scale.setTo(1.5, 1.5);

        //Hago que no rebote en las paredes
        this.pelota.sprite.body.collideWorldBounds = false;
    }
};

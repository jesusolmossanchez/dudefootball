'use strict';

DudeFootball.Play = function (game) {
    
};

DudeFootball.Play.prototype = {
    create: function() {
        
        //CONSTANTES!
        this.game.ancho_campo = 2400;
        this.game.alto_campo = 1000;

        this.game.inicio_pelota_x = 1200;
        this.game.inicio_pelota_y = 500;

        this.game.inicio_suelo_fake_x = 0;
        this.game.inicio_suelo_fake_y = 10;

        this.compensacion_suelo_fake = 50;

        this.game.pelota_bounce_x = 0.9;
        this.game.pelota_bounce_y = 0.9;

        this.pelota_bounce_y_centrando = 0.2;

        this.game.default_anchor = 0.5;

        this.game.cargador1_x = 5;
        this.game.cargador1_y = 5;

        this.rectangulo_deadzone = new Phaser.Rectangle(400, 250, 100, 100);

        this.game.max_potencia = 100;

        this.game.velocidad_jugador = 200;
        this.game.velocidad_jugador_con_pelota = 160;

        this.game.velocidedad_lanzado = 400;

        this.game.velocidad_salto = 400;
        this.game.gravedad_salto = 900;

        this.posicion_pelota_controlando_x = 20;
        this.posicion_pelota_controlando_y = 5;

        this.velocidad_chute_normal = 800;
        this.velocidad_chute_super = 1500;

        this.velocidad_cabezazo_normal = 300;
        this.velocidad_zabezazo_super = 500;

        this.velocidad_centro_y = 500;
        this.velocidad_centro_x = 400;

        this.velocidad_aturdir = 300;

        this.tiempo_centrando = 1200;
        this.tiempo_chutando = 300;
        this.game.tiempo_lanzandose = 250;
        this.game.tiempo_aturdido = 3000;

        this.gravedad_pelota_centrando = 900;

        this.pulsacion = false;
        this.pulsacion_centro = false;

        //FIN CONSTANTES

        this.add.sprite(0, 0, 'background');
        this.game.world.setBounds(0, 0, this.game.ancho_campo, this.game.alto_campo);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.pelota = new Pelota(this.game);


        this.jugadores_rivales = [];
        
        this.jugadores_rivales.push(new Player(this.game, 2100, 250, true));
        this.jugadores_rivales.push(new Player(this.game, 2100, 750, true));
        this.jugadores_rivales.push(new Player(this.game, 1800, 250, true));
        this.jugadores_rivales.push(new Player(this.game, 1800, 750, true));
        this.jugadores_rivales.push(new Player(this.game, 1500, 250, true));
        this.jugadores_rivales.push(new Player(this.game, 1500, 750, true));

        this.jugador_rival_activo = this.jugadores_rivales[0];

        this.jugadores = [];
        this.jugadores.push(new Player(this.game, 300, 250));
        this.jugadores.push(new Player(this.game, 300, 750));
        this.jugadores.push(new Player(this.game, 600, 250));
        this.jugadores.push(new Player(this.game, 600, 750));
        this.jugadores.push(new Player(this.game, 900, 250));
        this.jugadores.push(new Player(this.game, 900, 750));

        //this.jugador_activo = new Player(this.game, 400, 250);
        this.jugador_activo = this.jugadores[0];


        

        //PELOTA

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
        //TODO: Hacer todo con los cursores!
        this.cursors = this.input.keyboard.createCursorKeys();
        this.disparo = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.centro = this.input.keyboard.addKey(Phaser.Keyboard.X);
        this.arriba = this.cursors.up;
        this.abajo = this.cursors.down;
        this.izquierda = this.cursors.left;
        this.derecha = this.cursors.right;


        //zona muerta de la cámara
        this.game.camera.deadzone = this.rectangulo_deadzone;


        this.graphics = this.game.add.graphics(360,480);
        this.graphics.fixedToCamera = true;

    },
    update: function() {

        this.pinta_minimapa();

        this.pelota.sprite.angle += this.pelota.sprite.body.velocity.x/20;
       
        for (var i = 0; i < this.jugadores.length; i++) {
            this.jugadores[i].pelota_enlacabeza = false;
            if (this.jugadores[i].saltando){
                this.procesa_saltando(i);
                this.jugadores[i].ajusta_sombra_saltando();
                this.jugadores[i].ajusta_fake_saltando();
            }
            else{
                this.jugadores[i].ajusta_fake();
                this.jugadores[i].ajusta_sombra();
                if (this.time.now > this.jugadores[i].lanzado_time){
                    this.jugadores[i].resetea_velocidad();
                }
            }
        }       

        for (var i = 0; i < this.jugadores_rivales.length; i++) {
            this.jugadores_rivales[i].pelota_enlacabeza = false;
            if (this.jugadores_rivales[i].saltando){
                this.procesa_saltando(i);
                this.jugadores_rivales[i].ajusta_sombra_saltando();
                this.jugadores_rivales[i].ajusta_fake_saltando();
            }
            else{
                this.jugadores_rivales[i].ajusta_fake();
                this.jugadores_rivales[i].ajusta_sombra();
                if (this.time.now > this.jugadores_rivales[i].lanzado_time){
                    this.jugadores_rivales[i].resetea_velocidad();
                }
            }
        }

        if(this.centrando_time > this.time.now){
            //El balon esta en el aire...
            this.procesa_centrando();
        }
        else{
            //El balon está en el suelo
            this.procesa_no_centrando();
        }
        

        //Freno por rozamiento de la pelota
        this.pelota.frena();


        //Proceso las entradas por teclado (tambien deberia controlar con el joystick cuando este)
        this.procesa_inputs();


        if(this.jugador_activo.controlando){
            //Lógica cuando el jugador activo tiene la pelota
            this.procesa_controlando();
        }
        else{
            //Lógica cuando jugador activo NO tiene la pelota
            this.procesa_no_controlando();
        }

        if(this.jugador_rival_activo.controlando){
            //Lógica cuando el jugador activo tiene la pelota
            this.procesa_controlando_rival();
        }
        else{
            //Lógica cuando jugador activo NO tiene la pelota
            this.procesa_no_controlando_rival();
        }

        
        this.procesa_potencia();


        this.procesa_compis();


        this.procesa_rivales();


        this.jugador_activo.marca_activo.alpha = 1;
    },

    procesa_compis: function(){
        for (var i = 0; i < this.jugadores.length; i++) { 
            if (this.jugadores[i] !== this.jugador_activo){
                if (this.jugadores[i].estoy_cerca(this.pelota.sprite.body.position) && !this.jugador_activo.controlando && (this.jugadores[i].aturdido_time < this.time.now) ){
                    this.game.physics.arcade.moveToObject(this.jugadores[i].sprite, this.pelota.sprite, this.game.velocidad_jugador, 0);
                }
                else{
                    if (this.jugadores[i].aturdido_time < this.time.now){
                        var aleatorio = this.jugadores[i].posicion_inicial.x + (this.pelota.sprite.x - this.game.inicio_pelota_x) + (Math.floor(Math.random() * 300) - 150);
                        var aleatorio2 = this.jugadores[i].posicion_inicial.y + (this.pelota.sprite.y - this.game.inicio_pelota_y) + (Math.floor(Math.random() * 300) - 150);
                        if (this.game.time.now > this.jugadores[i].cambio_aleatorio_time){
                            this.jugadores[i].x_aleatorea = aleatorio;
                            this.jugadores[i].y_aleatorea = aleatorio2;
                            this.jugadores[i].cambio_aleatorio_time = this.game.time.now + 1000;
                        }
                        
                        this.game.physics.arcade.moveToXY(this.jugadores[i].sprite, this.jugadores[i].x_aleatorea, this.jugadores[i].y_aleatorea, this.game.velocidad_jugador, 0);
                    }
                    else{
                        var donde_ir = new Phaser.Point(this.jugadores[i].x_aleatorea, this.jugadores[i].y_aleatorea);
                        if (this.jugadores[i].check_distancia(donde_ir) < 10 ){
                            var aleatorio = this.jugadores[i].posicion_inicial.x + (this.pelota.sprite.x - this.game.inicio_pelota_x) + (Math.floor(Math.random() * 300) - 150);
                            var aleatorio2 = this.jugadores[i].posicion_inicial.y + (this.pelota.sprite.y - this.game.inicio_pelota_y) + (Math.floor(Math.random() * 300) - 150);
                            if (this.game.time.now > this.jugadores[i].cambio_aleatorio_time){
                                this.jugadores[i].x_aleatorea = aleatorio;
                                this.jugadores[i].y_aleatorea = aleatorio2;
                                this.jugadores[i].cambio_aleatorio_time = this.game.time.now + 1000;
                            }
                            
                            this.game.physics.arcade.moveToXY(this.jugadores[i].sprite, this.jugadores[i].x_aleatorea, this.jugadores[i].y_aleatorea, this.game.velocidad_jugador, 0);
                        }
                    }
                }
            } 
        } 
    },

    pinta_minimapa: function(){
        this.graphics.clear();
        this.graphics.lineStyle(2, 0x0000ff, 2);
        
        this.graphics.drawRect(0, 0, 240, 100);
        this.graphics.lineStyle(2, 0xff0000, 2);
        for (var i = 0; i < this.jugadores.length; i++) { 
            this.graphics.drawCircle(this.jugadores[i].sprite.position.x/10, this.jugadores[i].sprite.position.y/10, 4);
        }
        
        this.graphics.lineStyle(2, 0x00ff00, 2);
        for (var i = 0; i < this.jugadores_rivales.length; i++) { 
            this.graphics.drawCircle(this.jugadores_rivales[i].sprite.position.x/10, this.jugadores_rivales[i].sprite.position.y/10, 4);
        }

        this.graphics.lineStyle(2, 0xffffff, 2);
        this.graphics.drawCircle(this.pelota.sprite.position.x/10, this.pelota.sprite.position.y/10, 4);
        
    },

    procesa_rivales: function(){
        for (var i = 0; i < this.jugadores_rivales.length; i++) { 
            if (this.jugadores_rivales[i].estoy_cerca(this.pelota.sprite.body.position) && !this.jugador_rival_activo.controlando && (this.jugadores_rivales[i].aturdido_time < this.time.now)){
                this.game.physics.arcade.moveToObject(this.jugadores_rivales[i].sprite, this.pelota.sprite, this.game.velocidad_jugador, 0);
            }
            else{
                if (this.jugadores_rivales[i].aturdido_time < this.time.now){
                    var aleatorio = this.jugadores_rivales[i].posicion_inicial.x + (this.pelota.sprite.x - this.game.inicio_pelota_x) + (Math.floor(Math.random() * 300) - 150);
                    var aleatorio2 = this.jugadores_rivales[i].posicion_inicial.y + (this.pelota.sprite.y - this.game.inicio_pelota_y) + (Math.floor(Math.random() * 300) - 150);
                    if (this.game.time.now > this.jugadores_rivales[i].cambio_aleatorio_time){
                        this.jugadores_rivales[i].x_aleatorea = aleatorio;
                        this.jugadores_rivales[i].y_aleatorea = aleatorio2;
                        this.jugadores_rivales[i].cambio_aleatorio_time = this.game.time.now + 1000;
                    }
                    
                    this.game.physics.arcade.moveToXY(this.jugadores_rivales[i].sprite, this.jugadores_rivales[i].x_aleatorea, this.jugadores_rivales[i].y_aleatorea, this.game.velocidad_jugador, 0);
                }
                else{
                    var donde_ir = new Phaser.Point(this.jugadores_rivales[i].x_aleatorea, this.jugadores_rivales[i].y_aleatorea);
                    if (this.jugadores_rivales[i].check_distancia(donde_ir) < 10 ){
                        var aleatorio = this.jugadores_rivales[i].posicion_inicial.x + (this.pelota.sprite.x - this.game.inicio_pelota_x) + (Math.floor(Math.random() * 300) - 150);
                        var aleatorio2 = this.jugadores_rivales[i].posicion_inicial.y + (this.pelota.sprite.y - this.game.inicio_pelota_y) + (Math.floor(Math.random() * 300) - 150);
                        if (this.game.time.now > this.jugadores_rivales[i].cambio_aleatorio_time){
                            this.jugadores_rivales[i].x_aleatorea = aleatorio;
                            this.jugadores_rivales[i].y_aleatorea = aleatorio2;
                            this.jugadores_rivales[i].cambio_aleatorio_time = this.game.time.now + 1000;
                        }
                        
                        this.game.physics.arcade.moveToXY(this.jugadores_rivales[i].sprite, this.jugadores_rivales[i].x_aleatorea, this.jugadores_rivales[i].y_aleatorea, this.game.velocidad_jugador, 0);
                    }
                }
            }
        } 
    },

    controla: function(id){
        if (Math.abs(this.pelota.sprite.body.velocity.x) > this.velocidad_aturdir ||
            Math.abs(this.pelota.sprite.body.velocity.y) > this.velocidad_aturdir ){
            this.jugadores[id].aturdir();
        }
        //Seteo controlando
        this.jugador_activo = this.jugadores[id];
        this.jugador_activo.controlando = true;
        this.jugador_rival_activo.controlando = false;
    },

    controla_rival: function(id){
        if (Math.abs(this.pelota.sprite.body.velocity.x) > this.velocidad_aturdir ||
            Math.abs(this.pelota.sprite.body.velocity.y) > this.velocidad_aturdir ){
            this.jugadores_rivales[id].aturdir();
        }
        //Seteo controlando
        this.jugador_rival_activo = this.jugadores_rivales[id];
        this.jugador_rival_activo.controlando = true;
        this.jugador_activo.controlando = false;
    },


    procesa_no_controlando: function(id){


        //COMRRUEBA SI CAMBIO JUGADOR ACTIVO


        //Si se suelta el disparo y el jugador controla la pelota
        if(this.disparo.isUp){
            //Siempre que se haya soltado(isUp quiere decir que no lo está pulsando, no que lo acabe de soltar)
            if(this.pulsacion){
                //Si se llega a la superpotencia se llama al disparo con superpotencia
                var super_potencia = (this.potencia > this.game.max_potencia) ? true : false; 
                if (this.jugador_activo.saltando){
                    this.remata_cabeza(super_potencia);
                }
                else{
                    this.dispara(super_potencia);
                }
                //reseteo la pulsacion
                this.pulsacion = false;
            }
        }
        //Si se suelta el centro y el jugador no controla la pelota
        if(this.centro.isUp){
            //Siempre que se haya soltado(isUp quiere decir que no lo está pulsando, no que lo acabe de soltar)
            if(this.pulsacion_centro){
                //SALTA
                this.salta();
                //reseteo la pulsacion
                this.pulsacion_centro = false;
            } 
        }


        //Ajustar las pulsaciones, a lo que realmente pasa
        if (this.disparo.isDown){
            this.pulsacion = true;
        }
        if (this.centro.isDown){
            this.pulsacion_centro = true;
        }
    },

    procesa_controlando: function(){

        //Si se suelta el disparo y el jugador controla la pelota
        if(this.disparo.isUp){
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
        if(this.centro.isUp){
            //Siempre que se haya soltado(isUp quiere decir que no lo está pulsando, no que lo acabe de soltar)
            if(this.pulsacion_centro){
                //centra
                this.centra();
                //reseteo la pulsacion
                this.pulsacion_centro = false;
            }
        }

        //Ajustar las pulsaciones, a lo que realmente pasa
        if (this.disparo.isDown){
            this.pulsacion = true;
        }
        if (this.centro.isDown){
            this.pulsacion_centro = true;
        }

        if (this.time.now > this.jugador_activo.chute_time){
            this.pelota.sprite.body.velocity.y = this.jugador_activo.sprite.body.velocity.y;
            this.pelota.sprite.body.velocity.x = this.jugador_activo.sprite.body.velocity.x;
        }

        //Resitua pelota con respecto al jugador
        //TODO: revisar esto!!
        
        if(this.jugador_activo.sprite.body.velocity.x > 0 && !this.jugador_activo.pelota_derecha){
            this.jugador_activo.pelota_izquierda = false;
            this.pelota_derecha = true;
            this.pelota.sprite.position.x = this.jugador_activo.fake_sprite.position.x + this.posicion_pelota_controlando_x;

        }
        else if(this.jugador_activo.sprite.body.velocity.x < 0 && !this.jugador_activo.pelota_izquierda){
            this.jugador_activo.pelota_izquierda = true;
            this.jugador_activo.pelota_derecha = false;
            this.pelota.sprite.position.x = this.jugador_activo.fake_sprite.position.x - this.posicion_pelota_controlando_x;
        }

        if(this.jugador_activo.sprite.body.velocity.y > 0 && !this.jugador_activo.pelota_abajo){
            this.jugador_activo.pelota_arriba = false;
            this.jugador_activo.pelota_abajo = true;
            this.pelota.sprite.position.y = this.jugador_activo.fake_sprite.position.y + this.posicion_pelota_controlando_y+20;
        }
        else if(this.jugador_activo.sprite.body.velocity.y <= 0 && !this.pelota.arriba){
            this.jugador_activo.pelota_arriba = true;
            this.jugador_activo.pelota_abajo = false;
            this.pelota.sprite.position.y = this.jugador_activo.fake_sprite.position.y - this.posicion_pelota_controlando_y+20;
        }
        
    },

    procesa_controlando_rival: function(){
        if (this.time.now > this.jugador_rival_activo.chute_time){
            this.pelota.sprite.body.velocity.y = this.jugador_rival_activo.sprite.body.velocity.y;
            this.pelota.sprite.body.velocity.x = this.jugador_rival_activo.sprite.body.velocity.x;
        }
        var quehago = Math.floor(Math.random() * 10);
        if(quehago < 3){
            this.chuta_rival();        
        }
        if(quehago >= 3 && quehago <= 8){
            this.jugador_rival_activo.mueve("izquierda");
        }
        if(quehago >= 3 && quehago <= 8){
            this.jugador_rival_activo.mueve("arriba");
        }
        if(quehago >= 9 && quehago <= 10){
            this.jugador_rival_activo.mueve("arriba");
        }
        
    },

    procesa_no_controlando_rival: function(){

        
        
    },

    procesa_inputs: function(){
        
        if (this.time.now > this.jugador_activo.lanzado_time){
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
        }

 

    },

    procesa_potencia: function(){
        //Potencia y barrita
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
        this.pelota.sombra.position.x = this.pelota.sprite.position.x;
        this.pelota.sombra.position.y = this.centra_y+45;

        //Si está centrando, la pelota rebota con el suelo fake
        this.physics.arcade.collide(this.pelota.sprite, this.suelo_fake);

        for (var i = 0; i < this.jugadores.length; i++) {
            if (this.jugadores[i].aturdido_time < this.time.now){
                this.physics.arcade.overlap(this.pelota.sprite, this.jugadores[i].fake_sprite, function(){this.cabezazo(i);} , null, this); 
            }
        } 

        for (var i = 0; i < this.jugadores_rivales.length; i++) {
            if (this.jugadores_rivales[i].aturdido_time < this.time.now){
                this.physics.arcade.overlap(this.pelota.sprite, this.jugadores_rivales[i].fake_sprite, function(){this.cabezazo_rival(i);} , null, this); 
            }  
        }  
    
    },

    procesa_no_centrando: function(){

        this.pelota.sombra.position.x = this.pelota.sprite.position.x;
        this.pelota.sombra.position.y = this.pelota.sprite.position.y + 15;

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
            if (this.time.now > this.jugadores[i].chute_time && !this.jugadores[i].saltando){
                if (this.jugadores[i].aturdido_time < this.time.now){
                    this.physics.arcade.collide(this.pelota.sprite, this.jugadores[i].fake_sprite, function(){this.controla(i);} , null, this);  
                }
            }
        }

        for (var i = 0; i < this.jugadores_rivales.length; i++) {
            if (this.time.now > this.jugadores_rivales[i].chute_time && !this.jugadores_rivales[i].saltando){
                if (this.jugadores_rivales[i].aturdido_time < this.time.now){
                    this.physics.arcade.collide(this.pelota.sprite, this.jugadores_rivales[i].fake_sprite, function(){this.controla_rival(i);} , null, this);  
                }
            }
        }
    },

    chuta: function(super_potencia){

        //velocidad del disparo según superpotencia
        //TODO: Animación del disparo también!
        var potencia_disparo = super_potencia ? this.velocidad_chute_super : this.velocidad_chute_normal;

        //El jugador ya no controla la pelota
        this.jugador_activo.controlando = false;
        this.jugador_activo.chute_time = this.time.now + this.tiempo_chutando;

        //diferentes angulos del disparo
        ////
        //DIRECCIONES!
        //
        // 7 8 9
        // 4 5 6
        // 1 2 3
        //
        //
        if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            //donde = 8;
            this.pelota.sprite.body.velocity.y = -potencia_disparo;
            this.pelota.sprite.body.velocity.x = 0;
        }
        if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            //donde = 2;
            this.pelota.sprite.body.velocity.y = potencia_disparo;
            this.pelota.sprite.body.velocity.x = 0;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            //donde = 6;
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            //donde = 4;
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
        if(this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            //donde = 7;
            this.pelota.sprite.body.velocity.y = -potencia_disparo;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
        if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            //donde = 9;
            this.pelota.sprite.body.velocity.y = -potencia_disparo;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
        if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            //donde = 3;
            this.pelota.sprite.body.velocity.y = potencia_disparo;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
        if(!this.arriba.isDown && this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            //donde = 1;
            this.pelota.sprite.body.velocity.y = potencia_disparo;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            //donde = 5;
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
    },

    chuta_rival: function(super_potencia){

        //velocidad del disparo según superpotencia
        //TODO: Animación del disparo también!
        
        var potencia_disparo = super_potencia ? this.velocidad_chute_super : this.velocidad_chute_normal;

        //El jugador ya no controla la pelota
        this.jugador_rival_activo.controlando = false;
        this.jugador_rival_activo.chute_time = this.time.now + this.tiempo_chutando;

        var quehago = Math.floor(Math.random() * 3);
        if(quehago == 0){
            //donde = 4;
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
        if(quehago == 1){
            //donde = 7;
            this.pelota.sprite.body.velocity.y = -potencia_disparo;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
        if(quehago == 2){
            //donde = 1;
            this.pelota.sprite.body.velocity.y = potencia_disparo;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
    },

    remata_cabeza: function(super_potencia){

        //velocidad del disparo según superpotencia
        //TODO: Animación del disparo también!
        var potencia_disparo = super_potencia ? this.velocidad_cabezazo_normal : this.velocidad_zabezazo_super;

        if (this.jugador_activo.pelota_enlacabeza){
            //diferentes angulos del disparo
            ////
            //DIRECCIONES!
            //
            // 7 8 9
            // 4 5 6
            // 1 2 3
            //
            //
            if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
                //donde = 8;
                this.pelota.sprite.body.velocity.y = -potencia_disparo;
                this.pelota.sprite.body.velocity.x = 0;
            }
            if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
                //donde = 2;
                this.pelota.sprite.body.velocity.y = potencia_disparo;
                this.pelota.sprite.body.velocity.x = 0;
            }
            if(!this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
                //donde = 6;
                this.pelota.sprite.body.velocity.y = 0;
                this.pelota.sprite.body.velocity.x = potencia_disparo;
            }
            if(!this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
                //donde = 4;
                this.pelota.sprite.body.velocity.y = 0;
                this.pelota.sprite.body.velocity.x = -potencia_disparo;
            }
            if(this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
                //donde = 7;
                this.pelota.sprite.body.velocity.y = -potencia_disparo;
                this.pelota.sprite.body.velocity.x = -potencia_disparo;
            }
            if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
                //donde = 9;
                this.pelota.sprite.body.velocity.y = -potencia_disparo;
                this.pelota.sprite.body.velocity.x = potencia_disparo;
            }
            if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
                //donde = 3;
                this.pelota.sprite.body.velocity.y = potencia_disparo;
                this.pelota.sprite.body.velocity.x = potencia_disparo;
            }
            if(!this.arriba.isDown && this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
                //donde = 1;
                this.pelota.sprite.body.velocity.y = potencia_disparo;
                this.pelota.sprite.body.velocity.x = -potencia_disparo;
            }
            if(!this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
                //donde = 5;
                this.pelota.sprite.body.velocity.y = 0;
                this.pelota.sprite.body.velocity.x = potencia_disparo;
            }


        }

        
    },

    centra: function(){
        
        //DE Momento solo centro palante y patrás
        this.jugador_activo.chute_time = this.time.now + this.tiempo_chutando;

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
        this.pelota.sprite.scale.setTo(1.3, 1.3);

        //Hago que no rebote en las paredes
        this.pelota.sprite.body.collideWorldBounds = false;
    },



    dispara: function(super_potencia){
        //TODO: Lógica del disparo
        //
        //DIRECCIONES!
        //
        // 7 8 9
        // 4 5 6
        // 1 2 3
        //
        //
        var donde;
        if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            donde = 8;
        }
        if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            donde = 2;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            donde = 6;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            donde = 4;
        }
        if(this.arriba.isDown && !this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            donde = 7;
        }
        if(this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            donde = 9;
        }
        if(!this.arriba.isDown && this.abajo.isDown && !this.izquierda.isDown && this.derecha.isDown){
            donde = 3;
        }
        if(!this.arriba.isDown && this.abajo.isDown && this.izquierda.isDown && !this.derecha.isDown){
            donde = 1;
        }
        if(!this.arriba.isDown && !this.abajo.isDown && !this.izquierda.isDown && !this.derecha.isDown){
            donde = 5;
        }
        
        if (super_potencia){
            //TODO: DISPARA!
            this.jugador_activo.dispara(donde);
        } 
        else{
            //TODO: ENTRADA
            this.jugador_activo.se_lanza(donde);
        }
    },

    salta: function(){
        //TODO: Lógica del salto
        //Llamo a la funcion de salto del jugador
        if (!this.jugador_activo.saltando){
            this.jugador_activo.salta();
        }
    },

    procesa_saltando: function(i){
        //Basícamente se comprueba que el jugador a caido al suelo, cuando esto ocurre se llama a la funcion que procesa el fin del salto
        this.physics.arcade.collide(this.jugador_activo.sprite, this.jugadores[i].suelo_saltando_fake, this.jugadores[i].fin_salto.bind(this.jugadores[i]), null, this); 
    },


    cabezazo: function(i){
        this.jugadores[i].pelota_enlacabeza = true;;
    },


    cabezazo_rival: function(i){
        this.jugadores_rivales[i].pelota_enlacabeza = true;;
    }
};


'use strict';

DudeFootball.Play = function (game) {
    
};

DudeFootball.Play.prototype = {
    create: function() {
        this.game.input.maxPointers = 5;
        //CONSTANTES!
        this.game.ancho_campo = 2800;
        this.game.alto_campo = 1000;

        this.game.inicio_pelota_x = 1400;
        this.game.inicio_pelota_y = 500;

        this.game.inicio_suelo_fake_x = 0;
        this.game.inicio_suelo_fake_y = 10;

        this.compensacion_suelo_fake = 50;

        this.game.pelota_bounce_x = 0.9;
        this.game.pelota_bounce_y = 0.9;

        this.pelota_bounce_y_centrando = 0.2;

        this.game.default_anchor = 0.5;

        this.game.cargador1_x = window.innerWidth/2 - 20;
        this.game.cargador1_y = window.innerHeight - 170;

        this.rectangulo_deadzone = new Phaser.Rectangle(window.innerWidth/2 - 50, window.innerHeight/2-5, 100, 10);

        this.game.max_potencia = 100;

        this.game.velocidad_jugador = 200;
        this.game.velocidad_jugador_con_pelota = 160;

        this.game.velocidedad_lanzado = 400;

        this.game.velocidad_salto = 400;
        this.game.gravedad_salto = 900;

        this.posicion_pelota_controlando_x = 35;
        this.posicion_pelota_controlando_y = 0;

        this.velocidad_chute_normal = 600;
        this.velocidad_chute_super = 1100;

        this.velocidad_cabezazo_normal = 300;
        this.velocidad_zabezazo_super = 500;

        this.velocidad_centro_y = 500;
        this.velocidad_centro_x = 400;

        this.velocidad_aturdir = 900;

        this.tiempo_centrando = 1200;
        this.tiempo_chutando = 250;
        this.game.tiempo_lanzandose = 250;
        this.game.tiempo_aturdido = 4000;

        this.game.max_tiempo_supertiro = 2000;

        this.gravedad_pelota_centrando = 900;

        this.pulsacion = false;
        this.pulsacion_centro = false;

        this.conduce_rival_time = this.time.now;


        //Este valor es la amplitud con la se despliega el equipo en el campo [valores de 0.5 a 2]
        this.amplitud_equipo = 1.8;
        //Este valor es lo que presiona o se recoge un equipo 
        this.factor_ataque = -100;

        this.factor_bascula_y = 1.3;

        //Distancia a la que permito que cambie el jugador activo
        this.distancia_cambio_activo = 300;


        //Jugadores máximos permitidos que vayan a por la pelota
        this.game.max_a_por_pelota = 1;

        //Controla el portero
        // TODO: cambiar a cosas propias de la clase portero
        this.portero_controla = false;
        this.portero_controla_rival = false;


        //Tiempo antes de sacar
        //TODO: Mostrar tiempo, o hacer alguna animación o algo guay
        this.game.tiempo_antes_sacar = 5000;
        this.game.tiempo_gol = this.time.now + this.game.tiempo_antes_sacar;

        //MOVIL
        if (!this.game.device.desktop){
            this.joy = new Joystick(this.game, 120, this.world.height - 100);
            //TODO: Pillar el correcto (boton de accion)
            this.botonA = this.add.sprite(this.world.width - 80, this.world.height - 110, 'botonA');
            this.botonB = this.add.sprite(this.world.width - 200, this.world.height - 80, 'botonB');
            
            this.botonA.anchor.setTo(0.5, 0.5);
            this.botonA.inputEnabled = true;
            this.botonA.input.sprite.events.onInputDown.add(this.entra_botonA, this);
            this.botonA.input.sprite.events.onInputUp.add(this.sal_botonA, this);

            this.botonB.anchor.setTo(0.5, 0.5);
            this.botonB.inputEnabled = true;
            this.botonB.input.sprite.events.onInputDown.add(this.entra_botonB, this);
            this.botonB.input.sprite.events.onInputUp.add(this.sal_botonB, this);

            this.botonA.fixedToCamera = true;
            this.botonB.fixedToCamera = true;

            this.botonA.animations.add('entra', [0], 4, true);
            this.botonA.animations.add('sale', [1], 4, true);

            this.botonB.animations.add('entra', [0], 4, true);
            this.botonB.animations.add('sale', [1], 4, true);

            
        }


        //FIN CONSTANTES

        //Fondo
        //TODO: Cambiar sprite del fondo, añadiendo porterías
        this.background = this.add.sprite(0, 0, 'background');
        this.game.world.setBounds(0, 0, this.game.ancho_campo, this.game.alto_campo);

        this.game.porteria_arriba = this.game.alto_campo/2-170;
        this.game.porteria_abajo = this.game.alto_campo/2+140;

        this.porteria_izquierda = this.add.sprite(0, this.game.alto_campo/2-100, 'porteria');
        this.porteria_izquierda.anchor.setTo(0,0.5);
        this.porteria_izquierda.animations.add('gol', [1], 4, true);
        //this.porteria_izquierda.animations.play('gol');

        this.porteria_derecha = this.add.sprite(this.game.ancho_campo, this.game.alto_campo/2-100, 'porteria');
        this.porteria_derecha.anchor.setTo(0,0.5);
        this.porteria_derecha.animations.add('gol', [1], 4, true);
        this.porteria_derecha.scale.x = -1;

        //Bordes del campo
        this.borde_superior = this.game.add.sprite(0, 10, "suelo_fake");
        this.borde_superior.enableBody = true;
        this.game.physics.arcade.enable(this.borde_superior);
        this.borde_superior.body.immovable = true;
        this.borde_superior.alpha = 0;

        this.borde_inferior = this.game.add.sprite(0, this.game.alto_campo-10, "suelo_fake");
        this.borde_inferior.enableBody = true;
        this.game.physics.arcade.enable(this.borde_inferior);
        this.borde_inferior.body.immovable = true;
        this.borde_inferior.alpha = 0;

        this.borde_izq = this.game.add.sprite(270, 0, "suelo_fake_vertical");
        this.borde_izq.enableBody = true;
        this.game.physics.arcade.enable(this.borde_izq);
        this.borde_izq.body.immovable = true;
        this.borde_izq.alpha = 0;

        this.borde_der = this.game.add.sprite(this.game.ancho_campo-270, 0, "suelo_fake_vertical");
        this.borde_der.enableBody = true;
        this.game.physics.arcade.enable(this.borde_der);
        this.borde_der.body.immovable = true;
        this.borde_der.alpha = 0;


        //Empiezo el sistema de físicas arcade
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //inicializo pelota
        this.pelota = new Pelota(this.game);



        //EQUIPO RIVAL!
        this.equipo_CPU = new Equipo(this.game, true);
        this.equipo_CPU.inicializa_equipo();
        this.jugador_rival_activo = this.equipo_CPU.jugadores[0];
        this.equipo_CPU.portero = new Portero(this.game, this.game.ancho_campo-330, this.game.alto_campo/2, true);


        //EQUIPO JUGADOR
        this.equipo_jugador = new Equipo(this.game, false);
        this.equipo_jugador.inicializa_equipo();
        this.jugador_activo = this.equipo_jugador.jugadores[0];
        this.equipo_jugador.portero = new Portero(this.game, 330, this.game.alto_campo/2, false);

        //Pongo a los jugadores a que saquen de centro
        this.equipo_jugador.posiciona_saquecentro();
        

        //Suelo fake para rebote de pelota
        this.suelo_fake = this.game.add.sprite(this.game.inicio_suelo_fake_x, this.game.inicio_suelo_fake_y, "suelo_fake");
        this.suelo_fake.enableBody = true;
        this.game.physics.arcade.enable(this.suelo_fake);
        this.suelo_fake.body.immovable = true;
        this.suelo_fake.alpha = 0;


        //CARGADOR DE DISPARO
        //TODO: Mejorar sprite y animación!
        this.wrapper_cargador = this.game.add.image(this.game.cargador1_x, this.game.cargador1_y,'wrapper_cargador');
        this.cargador1 = this.game.add.image(this.game.cargador1_x, this.game.cargador1_y,'cargador1');
        this.super_potencia_sprite = this.game.add.image(this.game.cargador1_x + 140, this.game.cargador1_y+10,'super_potencia_sprite');
        

        this.super_potencia_sprite.fixedToCamera = true;
        this.super_potencia_sprite.alpha = 0;
        this.cargador1.fixedToCamera = true;
        this.wrapper_cargador.fixedToCamera = true;
        var corta = new Phaser.Rectangle(0, 0, this.potencia, 48);
        corta.fixedToCamera = true;
        this.cargador1.crop(corta); 


        // CURSORES!!
        // Para el juego en Desktop
        this.cursors = this.input.keyboard.createCursorKeys();
        this.disparo = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        var self = this;
        this.disparo.onUp.add(function() {
            self.pulsa_A = false;
        });
        this.centro = this.input.keyboard.addKey(Phaser.Keyboard.X);
        this.centro.onUp.add(function() {
            self.pulsa_B = false;
        });
        this.arriba = this.cursors.up;
        this.abajo = this.cursors.down;
        this.izquierda = this.cursors.left;
        this.derecha = this.cursors.right;


        // zona muerta de la cámara
        this.game.camera.deadzone = this.rectangulo_deadzone;

        // Cosas para el minimapa
        this.graphics = this.game.add.graphics(window.innerWidth/2-70, window.innerHeight-110);
        this.graphics.fixedToCamera = true;



        //Inicializo texto central antes de empezarar
        this.texto_previo = this.game.add.text(window.innerWidth/2, window.innerHeight/2, 'Empieza!', { font: '18vw ArcadeClassic', fill: "#eaff02", align: "center" });
        this.texto_previo.anchor.setTo(0.5, 0.5);
        this.texto_previo.fixedToCamera = true;

        //Inicializo texto central antes de empezarar
        this.texto_final = this.game.add.text(window.innerWidth/2, window.innerHeight/2, '', { font: '8vw ArcadeClassic', fill: "#eaff02", align: "center" });
        this.texto_final.anchor.setTo(0.5, 0.5);
        this.texto_final.fixedToCamera = true;

        this.music = this.add.audio('musica');
        this.music.play(null, 0, 0.2, true);

        this.tiempo_total = this.time.now + 125000
        this.tiempo = this.game.add.text(window.innerWidth/2, 30, '', { font: '4vw ArcadeClassic', fill: "#eaff02", align: "center" });
        this.tiempo.anchor.setTo(0.5, 0.5);
        this.tiempo.fixedToCamera = true;

        //TODO: Marcadores
        this.score1 = 0;
        this.score2 = 0;

        this.marcador1 = this.game.add.text(50, 30, '0', { font: '4vw ArcadeClassic', fill: "#eaff02", align: "center" });
        this.marcador1.anchor.setTo(0.5, 0.5);
        this.marcador1.fixedToCamera = true;

        this.marcador2 = this.game.add.text(window.innerWidth-50, 30, '0', { font: '4vw ArcadeClassic', fill: "#eaff02", align: "center" });
        this.marcador2.anchor.setTo(0.5, 0.5);
        this.marcador2.fixedToCamera = true;

    },
    update: function() {

        //this.game.world.bringToTop(this.botonA);
        //this.game.world.bringToTop(this.botonB);

        //Reseteo el texto central
        

         
        this.equipo_jugador.portero.ajusta_fake();
        this.equipo_CPU.portero.ajusta_fake();

        // Reseteo la velocidad de los porteros, par que no se muevan en las colisiones
        if (this.equipo_jugador.portero.lanzado_time < this.time.now){
            this.equipo_jugador.portero.resetea_velocidad();
        }
        if (this.equipo_CPU.portero.lanzado_time < this.time.now){
            this.equipo_CPU.portero.resetea_velocidad();
        }

        //Pinta el minimapa
        this.pinta_minimapa();

        //TODO: Hacer con animación?
        //Pongo angulo de la pelota según la velocidad
        this.pelota.sprite.angle += this.pelota.sprite.body.velocity.x/30;

        //Freno por rozamiento de la pelota
        //TODO: Mejorar freno?
        this.pelota.frena();

        //Proceso posiciones de sprites (fakes y no) de los jugadores
        this.procesa_sprites();
        this.procesa_sprites_rival();

        //Si estamos en tiempo de saque mostrar el tiempo que queda y salir
        //TODO: Mejorar esto
        if(this.game.tiempo_sacando > this.time.now){
            this.texto_previo.text =  "Fuera!";
            //Los jugadores vuelven al inicio
            this.equipo_jugador.volver_inicio();
            this.equipo_CPU.volver_inicio();
            return true;
        }

        if(this.game.tiempo_gol > this.time.now){
            //this.texto_previo.text = Math.floor((this.game.tiempo_gol - this.time.now)/1000);
            //Los jugadores vuelven al inicio
            return true;
        }

        var tiempo_queda = Math.floor((this.tiempo_total - this.time.now)/1000);
        if (tiempo_queda < 0){
            this.texto_previo.text = "";
            this.fin_del_partido();
            return;
        }
        if (tiempo_queda > 60){
            var segundos = tiempo_queda%60;
            var metecero = "";
            if (segundos < 10){
                metecero = "0";
            }
            this.tiempo.text = "1:"+metecero+segundos
        }
        else{
            var metecero = "";
            if (tiempo_queda < 10){
                metecero = "0";
            }
            this.tiempo.text = "0:"+metecero+tiempo_queda;
        }

        
        this.texto_previo.text = "";

        if(this.centrando_time > this.time.now){
            //El balon esta en el aire...
            this.procesa_balon_en_aire();
        }
        else{
            //El balon está en el suelo
            this.procesa_balon_suelo();
        }

        //Proceso las entradas
        this.procesa_inputs();

        //Si el portero controla la pelota
        if (this.portero_controla){
            //Llamo al metodo que procesa lo que pasa cuando la tiene el portero
            this.procesa_controlando_portero();
        }
        else{
            //Si no la controla el portero, este vuelve a su posición inicial
            this.equipo_jugador.portero.vuelve_posicion_inicial();
            //Se procesa su actividad sin el balon
            this.procesa_portero();
            if(this.jugador_activo.controlando){
                //Lógica cuando el jugador activo tiene la pelota
                this.procesa_controlando();
            }
            else{
                //Lógica cuando jugador activo NO tiene la pelota
                this.procesa_no_controlando();
            }
        }
        
        //Si el portero controla la pelota
        if(this.portero_controla_rival){
            //Llamo al metodo que procesa lo que pasa cuando la tiene el portero
            this.procesa_controlando_portero_rival();
        }
        else{
            //Si no la controla el portero, este vuelve a su posición inicial
            this.equipo_CPU.portero.vuelve_posicion_inicial();
            //Se procesa su actividad sin el balon
            this.procesa_portero_rival();
            if(this.jugador_rival_activo.controlando){
                //Lógica cuando el jugador activo tiene la pelota
                this.procesa_controlando_rival();
            }
            else{
                //Lógica cuando jugador activo NO tiene la pelota
                this.procesa_no_controlando_rival();
            }
        }

        //Procesa el cargador de potencia
        this.procesa_potencia();

        //Procesa el cambio de jugador activo si procede
        this.cambia_activo();

        //Procesa el movimiento de los compañeros de equipo que no están activos
        this.procesa_compis();

        //Procesa el movimiento de los rivales (si balón)
        this.procesa_rivales();

        this.jugador_activo.marca_activo.alpha = 1;


        for (var i = 0; i < this.equipo_jugador.jugadores.length; i++) { 
            if (this.equipo_jugador.jugadores[i].aturdido_time > this.time.now){
                this.equipo_jugador.jugadores[i].resetea_velocidad_no_angulo();
            }
        }

        for (var i = 0; i < this.equipo_CPU.jugadores.length; i++) { 
            if (this.equipo_CPU.jugadores[i].aturdido_time > this.time.now){
                this.equipo_CPU.jugadores[i].resetea_velocidad_no_angulo();
            }
        }


    },

    fin_del_partido: function(){

        this.music.stop();
        this.texto_final.text = "fin     del    partido!\n"+this.score1 + " - " + this.score2 + "\n Volver     a    jugar";

        if (this.score2 > this.score1){
            for (var i = 0; i < this.equipo_jugador.jugadores.length; i++) { 
                this.equipo_jugador.jugadores[i].aturdir();
            }
        }
        if (this.score2 < this.score1){
            for (var i = 0; i < this.equipo_CPU.jugadores.length; i++) { 
                this.equipo_CPU.jugadores[i].aturdir();
            }
        }
        if (this.score1 == this.score2){
            for (var i = 0; i < this.equipo_CPU.jugadores.length; i++) { 
                this.equipo_CPU.jugadores[i].aturdir();
                this.equipo_jugador.jugadores[i].aturdir();
            }
        }

        this.texto_final.inputEnabled = true;
        this.texto_final.input.sprite.events.onInputDown.add(this.volver_a_jugar, this);

    },

    volver_a_jugar: function(){
        this.game.state.start(this.game.state.current);
    },

    pinta_minimapa: function(){
        //Limpio lo que había
        this.graphics.clear();

        //Color de la linea del campo
        this.graphics.lineStyle(2, 0xffffff, 2);
        this.graphics.drawRect(0, 0, 115, 100);
        this.graphics.drawRect(115, 0, 115, 100);
        this.graphics.drawRect(0, 25, 25, 50);
        this.graphics.drawRect(205, 25, 25, 50);
        this.graphics.drawCircle(115, 50, 40);

        //Color de la linea de los jugadores
        this.graphics.lineStyle(2, 0xff0000, 2);
        //Pinto los jugadores en su sitio
        for (var i = 0; i < this.equipo_jugador.jugadores.length; i++) { 
            this.graphics.drawCircle(this.equipo_jugador.jugadores[i].sprite.position.x/10-25, this.equipo_jugador.jugadores[i].sprite.position.y/10, 4);
        }
        this.graphics.drawCircle(this.equipo_jugador.portero.sprite.position.x/10-25, this.equipo_jugador.portero.sprite.position.y/10, 4);
        
        //Color de la linea de los jugadores rivales
        this.graphics.lineStyle(2, 0x00ff00, 2);
        for (var i = 0; i < this.equipo_CPU.jugadores.length; i++) { 
            this.graphics.drawCircle(this.equipo_CPU.jugadores[i].sprite.position.x/10-25, this.equipo_CPU.jugadores[i].sprite.position.y/10, 4);
        }
        this.graphics.drawCircle(this.equipo_CPU.portero.sprite.position.x/10-25, this.equipo_jugador.portero.sprite.position.y/10, 4);

        //Pinto pelota
        this.graphics.lineStyle(2, 0xffffff, 2);
        this.graphics.drawCircle(this.pelota.sprite.position.x/10-25, this.pelota.sprite.position.y/10, 4);   
    },

    procesa_sprites: function(){
        //Para todos los jugadores:
        for (var i = 0; i < this.equipo_jugador.jugadores.length; i++) {
            // Dirección en el que se ve el sprite
            if (this.equipo_jugador.jugadores[i].sprite.body.velocity.x < 0){
                this.equipo_jugador.jugadores[i].sprite.scale.x = -1;
            }
            else{
                this.equipo_jugador.jugadores[i].sprite.scale.x = 1;
            }

            // 1- seteo a falso pelota_cabeza
            this.equipo_jugador.jugadores[i].pelota_enlacabeza = false;
            if (this.equipo_jugador.jugadores[i].saltando){
                // Si está saltando
                // 2- proceso salto
                this.procesa_saltando(i);
                // 3- Ajusto sombra del jugador
                this.equipo_jugador.jugadores[i].ajusta_sombra_saltando();
                // 4- Ajusta el sprite_fake y el marcador del jugador
                this.equipo_jugador.jugadores[i].ajusta_fake_saltando();
            }
            else{
                // Si no está saltando
                // Ajusta el sprite_fake y el marcador del jugador
                this.equipo_jugador.jugadores[i].ajusta_fake();
                // Ajusto sombra del jugador
                this.equipo_jugador.jugadores[i].ajusta_sombra();

                //Colision con los limites
                this.physics.arcade.collide(this.equipo_jugador.jugadores[i].sprite, this.borde_superior);
                this.physics.arcade.collide(this.equipo_jugador.jugadores[i].sprite, this.borde_inferior);

                //Si no se está lanzando, resetea la velocidad
                if (this.time.now > this.equipo_jugador.jugadores[i].lanzado_time && this.time.now > this.equipo_jugador.jugadores[i].aturdido_time){
                    this.equipo_jugador.jugadores[i].resetea_velocidad();
                    
                }
                else{
                    this.equipo_jugador.jugadores[i].ajusta_sombra_aturdido();
                }
            }
        }  
    },

    procesa_sprites_rival: function(){
        for (var i = 0; i < this.equipo_CPU.jugadores.length; i++) {
            if (this.equipo_CPU.jugadores[i].sprite.body.velocity.x <= 0){
                this.equipo_CPU.jugadores[i].sprite.scale.x = -1;
            }
            else{
                this.equipo_CPU.jugadores[i].sprite.scale.x = 1;
            }
            this.equipo_CPU.jugadores[i].pelota_enlacabeza = false;
            if (this.equipo_CPU.jugadores[i].saltando){
                this.procesa_saltando(i);
                this.equipo_CPU.jugadores[i].ajusta_sombra_saltando();
                this.equipo_CPU.jugadores[i].ajusta_fake_saltando();
            }
            else{
                this.equipo_CPU.jugadores[i].ajusta_fake();
                this.equipo_CPU.jugadores[i].ajusta_sombra();
                //Colision con los limites
                this.physics.arcade.collide(this.equipo_CPU.jugadores[i].sprite, this.borde_superior);
                this.physics.arcade.collide(this.equipo_CPU.jugadores[i].sprite, this.borde_inferior);
                //Si no se está lanzando, resetea la velocidad

                if (this.time.now > this.equipo_CPU.jugadores[i].lanzado_time && this.time.now > this.equipo_CPU.jugadores[i].aturdido_time){
                    this.equipo_CPU.jugadores[i].resetea_velocidad();
                }
                else{
                    this.equipo_CPU.jugadores[i].ajusta_sombra_aturdido();
                }
            }
        }
    },

    procesa_balon_en_aire: function(){
        //Pongo en frente la pelota para que se vea bien!
        this.game.world.bringToTop(this.pelota.sprite);

        //Ajusto la sombra
        this.pelota.sombra.position.x = this.pelota.sprite.position.x;
        this.pelota.sombra.position.y = this.centra_y+45;

        //Si está centrando, la pelota rebota con el suelo fake
        this.physics.arcade.collide(this.pelota.sprite, this.suelo_fake);

        //Colisiones (en realidad, overlap!!) saltando! (SOLO CABEZAZO!);
        for (var i = 0; i < this.equipo_jugador.jugadores.length; i++) {
            if (this.equipo_jugador.jugadores[i].aturdido_time < this.time.now){
                this.physics.arcade.overlap(this.pelota.sprite, this.equipo_jugador.jugadores[i].fake_sprite, function(){this.cabezazo(i);} , null, this); 
            }
        } 

        for (var i = 0; i < this.equipo_CPU.jugadores.length; i++) {
            if (this.equipo_CPU.jugadores[i].aturdido_time < this.time.now){
                this.physics.arcade.overlap(this.pelota.sprite, this.equipo_CPU.jugadores[i].fake_sprite, function(){this.cabezazo_rival(i);} , null, this); 
            }  
        }  
    },

    procesa_balon_suelo: function(){

        this.physics.arcade.collide(this.pelota.sprite, this.borde_superior);
        this.physics.arcade.collide(this.pelota.sprite, this.borde_inferior);

        //Supertiro de la pelota (setea el estado de la pelota)
        this.pelota.procesa_supertiro();

        //La pelota vuelve a estar detrás de los jugadores
        this.game.world.sendToBack(this.pelota.sprite);
        this.game.world.sendToBack(this.background);

        //Ajusto la sombra de la pelota
        this.pelota.sombra.position.x = this.pelota.sprite.position.x;
        this.pelota.sombra.position.y = this.pelota.sprite.position.y + 15;

        //si no centra, la pelota rebota normal
        this.pelota.sprite.body.bounce.y = this.game.pelota_bounce_y;
        //Revisar... animación??
        this.pelota.sprite.scale.setTo(1, 1);
        //la pelota vuelve a chocar con las paredes
        this.pelota.sprite.body.collideWorldBounds = false;

        //Si se ha acabao el tiempo del centrado
        if (this.centra_y < this.pelota.sprite.body.position.y && this.centrando){
            //el suelo vuelve a su sitio
            this.suelo_fake.body.position.y = 0;
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.gravity.y = 0;
            //y se marca como que ya no está centrando
            this.centrando = false;
        }

        this.physics.arcade.collide(this.pelota.sprite, this.equipo_jugador.portero.fake_sprite, this.controla_portero , null, this);
        this.physics.arcade.collide(this.pelota.sprite, this.equipo_CPU.portero.fake_sprite, this.controla_portero_rival , null, this);

        this.physics.arcade.overlap(this.pelota.sprite, this.borde_izq, this.sale_izquierda , null, this);
        this.physics.arcade.overlap(this.pelota.sprite, this.borde_der, this.sale_derecha , null, this);

        

        for (var i = 0; i < this.equipo_CPU.jugadores.length; i++) {
            //Si el jugador no está justo chutando
            //Y no está saltando
            //Y no está aturdido
            //Se checkea la colision de la pelota y el jugador
            if (this.time.now > this.equipo_CPU.jugadores[i].chute_time && !this.equipo_CPU.jugadores[i].saltando){
                if (this.equipo_CPU.jugadores[i].aturdido_time < this.time.now){
                    if (!this.jugador_activo.controlando || this.equipo_CPU.jugadores[i].voy_al_choque()){
                        // Choca con la pelota si el jugador no controla o 
                        // Si el jugador en cuestión va al chocque (hace entrada o mete_pie) TODO!!!
                        this.physics.arcade.overlap(this.pelota.sprite, this.equipo_CPU.jugadores[i].fake_sprite, function(){this.controla_rival(i);} , null, this);  
                    }
                }
            }
            
            for (var j = 0; j < this.equipo_jugador.jugadores.length; j++) {
                if (this.equipo_jugador.jugadores[j].super_lanzado_time > this.time.now){
                    this.physics.arcade.overlap(this.equipo_jugador.jugadores[j].sprite, this.equipo_CPU.jugadores[i].sprite, function(){this.me_hacen_una_entrada_rival(i);} , null, this); 
                }  
            }   
        }

        //Se vuelve a activar la colisión con el jugador
        for (var i = 0; i < this.equipo_jugador.jugadores.length; i++) {
            //Si el jugador no está justo chutando
            //Y no está saltando
            //Y no está aturdido
            //Y no hay control de la pelota
            //Se checkea la colision de la pelota y el jugador
            if (this.time.now > this.equipo_jugador.jugadores[i].chute_time && !this.equipo_jugador.jugadores[i].saltando && !this.jugador_activo.controlando){
                if (this.equipo_jugador.jugadores[i].aturdido_time < this.time.now){
                    if (!this.jugador_rival_activo.controlando || this.equipo_jugador.jugadores[i].voy_al_choque()){
                        this.physics.arcade.overlap(this.pelota.sprite, this.equipo_jugador.jugadores[i].fake_sprite, function(){this.controla(i);} , null, this);  
                    }
                }
            }

            
            for (var j = 0; j < this.equipo_CPU.jugadores.length; j++) {
                if (this.equipo_CPU.jugadores[j].super_lanzado_time > this.time.now){
                    this.physics.arcade.overlap(this.equipo_jugador.jugadores[i].fake_sprite, this.equipo_CPU.jugadores[j].fake_sprite, function(){this.me_hacen_una_entrada(i);} , null, this); 
                }  
            }   
        }

    },

    me_hacen_una_entrada: function(i){
        this.equipo_jugador.jugadores[i].aturdir();
    },

    me_hacen_una_entrada_rival: function(i){
        this.equipo_CPU.jugadores[i].aturdir();
    },

    procesa_inputs: function(){

        //Si es movil saco el joystick
        if (!this.game.device.desktop){
            this.joy.update();
            this.joy.holder.events.onMove.add(this.procesaDragg, this);
            this.joy.holder.events.onUp.add(this.paraDragg, this);
        }
        else{
            //Sino controla las teclas
            this.movimientos_teclas();
        }

        //Si el portero controla
        if (this.portero_controla){
            //Mueve al portero
            //TODO: Limite de movimientos del portero
            if(this.mueveizquierda){
                this.equipo_jugador.portero.mueve("izquierda");
            }
            if(this.muevederecha){
                this.equipo_jugador.portero.mueve("derecha");
            }
            if(this.muevearriba){
                this.equipo_jugador.portero.mueve("arriba");
            }
            if(this.mueveabajo){
                this.equipo_jugador.portero.mueve("abajo");
            }
        }
        else{
            if (this.time.now > this.jugador_activo.lanzado_time){
                //Si no se está lanzando, mueve al jugador activo
                if(this.mueveizquierda){
                    this.jugador_activo.mueve("izquierda");
                }
                if(this.muevederecha){
                    this.jugador_activo.mueve("derecha");
                }
                if(this.muevearriba){
                    this.jugador_activo.mueve("arriba");
                }
                if(this.mueveabajo){
                    this.jugador_activo.mueve("abajo");
                }
            }
        }
    },

    procesa_controlando_portero: function(){
        //Si se va a sacar no hacer nada
        if(this.game.tiempo_gol > this.time.now){
            return true;
        }

        //Los jugadores vuelven al inicio
        this.equipo_jugador.volver_inicio();
        this.equipo_CPU.volver_inicio();

        //La pelota acompaña al portero
        this.pelota.sprite.position.x = this.equipo_jugador.portero.sprite.position.x + 15;
        this.pelota.sprite.position.y = this.equipo_jugador.portero.sprite.position.y + 45;

        //Si se pasa de tiempo, saca recto
        if (this.tiempo_portero_max < this.time.now){
            this.portero_controla = false;
            this.centra_portero();
        }

        //Seteo que el jugador no la tiene
        this.jugador_activo.controlando = false;

        if(!this.pulsa_A){
            //Siempre que se haya soltado(isUp quiere decir que no lo está pulsando, no que lo acabe de soltar)
            if(this.pulsacion_chuta_portero){
                this.chuta_portero();
                //reseteo la pulsacion
                
            }
        }

        //Si se suelta el centro y el jugador controla la pelota
        if(!this.pulsa_B){
            //Siempre que se haya soltado(isUp quiere decir que no lo está pulsando, no que lo acabe de soltar)
            if(this.pulsacion_centro_portero){
                //centra
                this.portero_controla = false;
                this.centra_portero();
                //reseteo la pulsacion
                this.pulsacion_centro_portero = false;
            }
        }

        if (this.pulsa_B){
            this.pulsacion_centro_portero = true;
        }
        if (this.pulsa_A){
            this.pulsacion_chuta_portero = true;
        }
    },

    procesa_portero: function (){
        //TODO: Hacer que se mueva un poco erráticamente arriba y abajo el portero
        //TODO: Hacer que "se lance" a por la pelota
        //TODO: Hacer que "falle" al pillar la pelota


        if(this.equipo_jugador.portero.lanzado_time > this.time.now){
            this.equipo_jugador.portero.ajusta_fake_lanzadose();
        }

        if(this.game.tiempo_gol > this.time.now){
            return true;
        }
        if (this.equipo_jugador.portero.estoy_cerca(this.pelota.sprite.body.position) 
            && this.equipo_jugador.portero.dentro_area(this.pelota.sprite.body.position)
            && (this.equipo_jugador.portero.lanzado_time < this.time.now)){
            this.game.physics.arcade.moveToObject(this.equipo_jugador.portero.sprite, this.pelota.sprite, this.game.velocidad_jugador, 0);
        }
        if (this.equipo_jugador.portero.estoy_muy_cerca(this.pelota.sprite.body.position) 
            && this.equipo_jugador.portero.dentro_area(this.pelota.sprite.body.position)
            && (this.equipo_jugador.portero.lanzado_time < this.time.now)){
            
            if(this.pelota.sprite.position.y > this.equipo_jugador.portero.sprite.position.y){
                this.equipo_jugador.portero.se_lanza("arriba");
            }
            else{
                this.equipo_jugador.portero.se_lanza("abajo");
            }
            
        }
        else{
            if(this.equipo_jugador.portero.lanzado_time < this.time.now){
                this.equipo_jugador.portero.sprite.animations.play('semueve');
            }
        }
    },

    procesa_controlando: function(){
        if(this.game.tiempo_gol > this.time.now){
            return true;
        }

        //Si se suelta el disparo y el jugador controla la pelota
        if(!this.pulsa_A){
            //Siempre que se haya soltado(isUp quiere decir que no lo está pulsando, no que lo acabe de soltar)
            if(this.pulsacion){
                //Si se llega a la superpotencia se llama al disparo con superpotencia
                var super_potencia = (this.potencia > this.game.max_potencia) ? true : false; 
                this.jugador_activo.sprite.animations.play('chuta');
                this.chuta(super_potencia);
                //reseteo la pulsacion
                this.pulsacion = false;
            }
        }
        //Si se suelta el centro y el jugador controla la pelota
        if(!this.pulsa_B){
            //Siempre que se haya soltado(isUp quiere decir que no lo está pulsando, no que lo acabe de soltar)
            if(this.pulsacion_centro){
                //centra
                this.jugador_activo.sprite.animations.play('chuta');
                this.centra();
                //reseteo la pulsacion
                this.pulsacion_centro = false;
            }
        }

        //Ajustar las pulsaciones, a lo que realmente pasa
        if (this.pulsa_A){
            this.pulsacion = true;
        }
        if (this.pulsa_B){
            this.pulsacion_centro = true;
        }

        //Siempre que no sea justo cuando está chutando que la pelota acompañe el movimiento del jugador
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

    procesa_no_controlando: function(id){

        if(this.game.tiempo_gol > this.time.now){
            return true;
        }

        //Si se suelta el disparo y el jugador controla la pelota
        if(!this.pulsa_A){
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
        if(!this.pulsa_B){
            //Siempre que se haya soltado(isUp quiere decir que no lo está pulsando, no que lo acabe de soltar)
            if(this.pulsacion_centro){
                //SALTA
                this.salta();
                //reseteo la pulsacion
                this.pulsacion_centro = false;
            } 
        }


        //Ajustar las pulsaciones, a lo que realmente pasa
        if (this.pulsa_A){
            this.pulsacion = true;
        }
        if (this.pulsa_B){
            this.pulsacion_centro = true;
        }
    },

    procesa_controlando_portero_rival: function(){
        if(this.game.tiempo_gol > this.time.now){
            return true;
        }

        this.jugador_activo.controlando = false;
        this.equipo_jugador.volver_inicio();
        this.equipo_CPU.volver_inicio();
        this.pelota.sprite.position.x = this.equipo_CPU.portero.sprite.position.x - 5;
        this.pelota.sprite.position.y = this.equipo_CPU.portero.sprite.position.y + 45;

        if (this.tiempo_portero_max < this.time.now){
            this.portero_controla_rival = false;
            this.centra_portero(true);
        }
    },

    procesa_portero_rival: function (){
        //TODO: Hacer que se mueva un poco erráticamente arriba y abajo el portero
        //TODO: Hacer que "se lance" a por la pelota
        //TODO: Hacer que "falle" al pillar la pelota

        if(this.equipo_CPU.portero.lanzado_time > this.time.now){
            this.equipo_CPU.portero.ajusta_fake_lanzadose();
        }

        if(this.game.tiempo_gol > this.time.now){
            return true;
        }
        if (this.equipo_CPU.portero.estoy_cerca(this.pelota.sprite.body.position) && this.equipo_CPU.portero.dentro_area(this.pelota.sprite.body.position)){
            this.game.physics.arcade.moveToObject(this.equipo_CPU.portero.sprite, this.pelota.sprite, this.game.velocidad_jugador, 0);
        }
    },

    procesa_controlando_rival: function(){
        //TODO: Muy importante!! Mejorar el procesado de la IA de la maquina cuando controla el balón
        if(this.game.tiempo_gol > this.time.now){
            return true;
        }
        if (this.time.now > this.jugador_rival_activo.chute_time){
            this.pelota.sprite.body.velocity.y = this.jugador_rival_activo.sprite.body.velocity.y;
            this.pelota.sprite.body.velocity.x = this.jugador_rival_activo.sprite.body.velocity.x;
        }
        
        if(this.time.now > this.conduce_rival_time || this.jugador_rival_activo.check_distancia(this.equipo_jugador.portero.sprite.position) < 250){
            var super_tiro = (Math.random()>0.7) ? true : false;
            this.chuta_rival(super_tiro);        
        }
        else{
            var quehago = Math.floor(Math.random() * 10);
            if(quehago >= 0 && quehago <= 7){
                this.jugador_rival_activo.mueve("izquierda");
            }
            else if(quehago >= 4 && quehago <= 7){
                this.jugador_rival_activo.mueve("arriba");
            }
            else if(quehago >= 7 && quehago <= 10){
                this.jugador_rival_activo.mueve("abajo");
            }
        }

             

        //Resitua pelota con respecto al jugador
        //TODO: revisar esto!!
        if(this.jugador_rival_activo.sprite.body.velocity.x > 0){
            this.jugador_rival_activo.pelota_izquierda = false;
            this.pelota_derecha = true;
            this.pelota.sprite.position.x = this.jugador_rival_activo.fake_sprite.position.x + this.posicion_pelota_controlando_x;
        }
        else if(this.jugador_rival_activo.sprite.body.velocity.x < 0){
            this.jugador_rival_activo.pelota_izquierda = true;
            this.jugador_rival_activo.pelota_derecha = false;
            this.pelota.sprite.position.x = this.jugador_rival_activo.fake_sprite.position.x - this.posicion_pelota_controlando_x;
        }

        if(this.jugador_rival_activo.sprite.body.velocity.y > 0){
            this.jugador_rival_activo.pelota_arriba = false;
            this.jugador_rival_activo.pelota_abajo = true;
            this.pelota.sprite.position.y = this.jugador_rival_activo.fake_sprite.position.y + this.posicion_pelota_controlando_y+20;
        }
        else if(this.jugador_rival_activo.sprite.body.velocity.y <= 0){
            this.jugador_rival_activo.pelota_arriba = true;
            this.jugador_rival_activo.pelota_abajo = false;
            this.pelota.sprite.position.y = this.jugador_rival_activo.fake_sprite.position.y - this.posicion_pelota_controlando_y+20;
        } 
    },

    procesa_no_controlando_rival: function(){   
    },

    procesa_potencia: function(){
        //Potencia y barrita
        if (!this.pulsa_A){
            this.potencia = 0;
        }
        if (this.pulsa_A){
            this.potencia += 1;
        }

        console
        if (this.potencia > this.game.max_potencia){
            this.super_potencia_sprite.alpha = 1;
        }
        else{
            this.super_potencia_sprite.alpha = 0;
        }

        var corta = new Phaser.Rectangle(0, 0, this.potencia*1.4, 48);
        corta.fixedToCamera = true;
        this.cargador1.crop(corta); 
    },

    cambia_activo: function(){
        if(this.game.tiempo_gol > this.time.now){
            return true;
        }
        if (this.jugador_activo.controlando){
            return;
        }
        //Para todos los compis comprueba las distancias a la pelota y saco la menor
        var aux = Number.MAX_VALUE;
        var min;
        for (var i = 0; i < this.equipo_jugador.jugadores.length; i++) { 
            if (this.equipo_jugador.jugadores[i].check_distancia(this.pelota.sprite.body.position) < aux && this.equipo_jugador.jugadores[i].aturdido_time <= this.time.now){
                aux = this.equipo_jugador.jugadores[i].check_distancia(this.pelota.sprite.body.position);
                min = i;
            }
        }
        // Si el activo está mucho mas lejos que otro, cambio
        var d_min = this.equipo_jugador.jugadores[min].check_distancia(this.pelota.sprite.body.position);
        var d_activo = this.jugador_activo.check_distancia(this.pelota.sprite.body.position);
        if ((d_activo - d_min) > this.distancia_cambio_activo || this.jugador_activo.aturdido_time > this.time.now){
            this.jugador_activo = this.equipo_jugador.jugadores[min];
        }
    },

    procesa_compis: function(){
        //TODO: Mejorar IA
        if(this.game.tiempo_gol > this.time.now){
            return true;
        }
        if (this.portero_controla || this.portero_controla_rival){
            return;
        }

        //Para todos los compis
        //
        // Reseteo los que van a por la pelota, en cada buvle podran ir los que se permitan como máximo
        this.equipo_jugador.cuantos_a_por_pelota = 0;
        var jugadores_cerca = [];
        for (var i = 0; i < this.equipo_jugador.jugadores.length; i++) { 
            //Si no es el jugador activo
            if (this.equipo_jugador.jugadores[i] !== this.jugador_activo && !this.equipo_jugador.jugadores[i].saltando){
                // Si estoy cerca de la pelota
                // Y el jugador activo no tiene la pelota
                // Y no estoy aturdido ... voy a por la pelota
                if (this.equipo_jugador.jugadores[i].estoy_cerca(this.pelota.sprite.body.position) 
                    && !this.jugador_activo.controlando 
                    && (this.equipo_jugador.jugadores[i].aturdido_time < this.time.now) 
                    && this.equipo_jugador.cuantos_a_por_pelota < this.game.max_a_por_pelota){
                    //TODO: Solo uno o dos a por la pelota
                    jugadores_cerca.push(i);
                    this.equipo_jugador.jugadores[i].sprite.animations.play('semueve');
                    this.game.physics.arcade.moveToObject(this.equipo_jugador.jugadores[i].sprite, this.pelota.sprite, this.game.velocidad_jugador, 0);
                    this.equipo_jugador.cuantos_a_por_pelota++;
                }
                else{
                    if (this.equipo_jugador.jugadores[i].aturdido_time < this.time.now){
                        this.equipo_jugador.jugadores[i].sprite.animations.play('semueve');
                        var ajusta_carca_area = 1.2;
                        if (this.equipo_jugador.jugadores[i].sprite.x < this.game.ancho_campo/2){
                            ajusta_carca_area = 3.5;
                        }
                        if (this.equipo_jugador.jugadores[i].sprite.x > this.game.ancho_campo/2){
                            ajusta_carca_area = 1.5;
                        }

                        // Si no estoy aturdido
                        // Calculo donde moverme
                        // TODO: crear un metodo especifico que calcule esto 
                        var aleatorio = (this.equipo_jugador.jugadores[i].posicion_inicial.x*this.amplitud_equipo + this.factor_ataque) + (this.pelota.sprite.x - this.game.inicio_pelota_x)/ajusta_carca_area + (Math.floor(Math.random() * 400) - 200);
                        var aleatorio2 = this.equipo_jugador.jugadores[i].posicion_inicial.y + (this.pelota.sprite.y - this.game.inicio_pelota_y)/this.factor_bascula_y + (Math.floor(Math.random() * 400) - 200);
                        if (this.game.time.now > this.equipo_jugador.jugadores[i].cambio_aleatorio_time){
                            this.equipo_jugador.jugadores[i].x_aleatorea = aleatorio;
                            this.equipo_jugador.jugadores[i].y_aleatorea = aleatorio2;
                            this.equipo_jugador.jugadores[i].cambio_aleatorio_time = this.game.time.now + 1000;
                        }
                        //Y me muevo a ese punto
                        //TODO: revisar el fin del movimiento que va chungo
                        var donde_ir = new Phaser.Point(this.equipo_jugador.jugadores[i].x_aleatorea, this.equipo_jugador.jugadores[i].y_aleatorea);
                        if (this.equipo_jugador.jugadores[i].check_distancia(donde_ir) < 70 ){
                            var aleatorio = (this.equipo_jugador.jugadores[i].posicion_inicial.x*this.amplitud_equipo + this.factor_ataque) + (this.pelota.sprite.x - this.game.inicio_pelota_x)/ajusta_carca_area + (Math.floor(Math.random() * 400) - 200);
                            var aleatorio2 = this.equipo_jugador.jugadores[i].posicion_inicial.y + (this.pelota.sprite.y - this.game.inicio_pelota_y)/this.factor_bascula_y + (Math.floor(Math.random() * 400) - 200);
                            if (this.game.time.now > this.equipo_jugador.jugadores[i].cambio_aleatorio_time){
                                this.equipo_jugador.jugadores[i].x_aleatorea = aleatorio;
                                this.equipo_jugador.jugadores[i].y_aleatorea = aleatorio2;
                                this.equipo_jugador.jugadores[i].cambio_aleatorio_time = this.game.time.now + 1000;
                            }
                        }
                        else{
                            this.game.physics.arcade.moveToXY(this.equipo_jugador.jugadores[i].sprite, this.equipo_jugador.jugadores[i].x_aleatorea, this.equipo_jugador.jugadores[i].y_aleatorea, this.game.velocidad_jugador, 0);
                        }
                    }
                }
            } 
        } 
    },

    procesa_rivales: function(){
        //TODO: Mejorar IA
        if(this.game.tiempo_gol > this.time.now){
            return true;
        }
        if (this.portero_controla || this.portero_controla_rival){
            return;
        }
        // Analogo al anterior
        this.equipo_CPU.cuantos_a_por_pelota = 0;
        for (var i = 0; i < this.equipo_CPU.jugadores.length; i++) { 
            if (!this.equipo_CPU.jugadores[i].saltando && this.equipo_CPU.jugadores[i].lanzado_time < this.time.now){
                if (this.jugador_rival_activo.controlando && (this.equipo_CPU.jugadores[i] == this.jugador_rival_activo)){
                    //console.log("controlando");
                }
                else{
                    if(this.equipo_CPU.jugadores[i].check_distancia(this.pelota.sprite.body.position) < 100 
                        && this.jugador_activo.controlando
                        && this.equipo_CPU.jugadores[i].lanzado_time < this.time.now
                        && this.equipo_CPU.jugadores[i].aturdido_time < this.time.now){
                        if (Math.random()>0.4){
                            this.equipo_CPU.jugadores[i].se_lanza();
                        }
                        else{
                            this.equipo_CPU.jugadores[i].dispara(Math.floor(Math.random()*9)+1);
                        }
                        
                        //console.log("se lanza rival?")
                        //TODO: tirarse
                    }
                    else if (this.equipo_CPU.jugadores[i].estoy_cerca(this.pelota.sprite.body.position) 
                        && !this.jugador_rival_activo.controlando 
                        && (this.equipo_CPU.jugadores[i].aturdido_time < this.time.now)
                        && this.equipo_CPU.cuantos_a_por_pelota < this.game.max_a_por_pelota){

                        
                        this.equipo_CPU.jugadores[i].sprite.animations.play('semueve');
                        this.game.physics.arcade.moveToObject(this.equipo_CPU.jugadores[i].sprite, this.pelota.sprite.body, this.game.velocidad_jugador, 0);
                        this.equipo_CPU.cuantos_a_por_pelota++; 
                        
                    }
                    else{
                        if (this.jugador_activo.controlando && this.equipo_CPU.jugadores[i].sprite.position.x > this.pelota.sprite.position.x
                            && this.pelota.sprite.position.x > this.ancho_campo - 500){
                            this.equipo_CPU.jugadores[i].sprite.animations.play('semueve');
                            this.game.physics.arcade.moveToObject(this.equipo_CPU.jugadores[i].sprite, this.pelota.sprite.body, this.game.velocidad_jugador, 0);
                            
                        }
                        else{
                            this.mueve_su_posicion_rival(i);
                        }

                    }
                }
                
            }
        } 
    },

    mueve_su_posicion_rival: function(i){
        if (this.equipo_CPU.jugadores[i].aturdido_time < this.time.now){
            this.equipo_CPU.jugadores[i].sprite.animations.play('semueve');
            var ajusta_carca_area = 1.2;
            if (this.equipo_CPU.jugadores[i].sprite.x < this.game.ancho_campo/2){
                ajusta_carca_area = 1.5;
            }
            if (this.equipo_CPU.jugadores[i].sprite.x > this.game.ancho_campo/2){
                ajusta_carca_area = 3.5;
            }

            var aleatorio = (this.game.ancho_campo - (this.amplitud_equipo*(this.game.ancho_campo - this.equipo_CPU.jugadores[i].posicion_inicial.x)) - this.factor_ataque) 
                            + (this.pelota.sprite.x - this.game.inicio_pelota_x)/ajusta_carca_area + (Math.floor(Math.random() * 400) - 200);
            var aleatorio2 = this.equipo_CPU.jugadores[i].posicion_inicial.y + (this.pelota.sprite.y - this.game.inicio_pelota_y)/this.factor_bascula_y + (Math.floor(Math.random() * 300) - 150);
            if (this.game.time.now > this.equipo_CPU.jugadores[i].cambio_aleatorio_time){
                this.equipo_CPU.jugadores[i].x_aleatorea = aleatorio;
                this.equipo_CPU.jugadores[i].y_aleatorea = aleatorio2;
                this.equipo_CPU.jugadores[i].cambio_aleatorio_time = this.game.time.now + 1000;
            }
            var donde_ir = new Phaser.Point(this.equipo_CPU.jugadores[i].x_aleatorea, this.equipo_CPU.jugadores[i].y_aleatorea);
            if (this.equipo_CPU.jugadores[i].check_distancia(donde_ir) < 70 ){
                var aleatorio = (this.game.ancho_campo - (this.amplitud_equipo*(this.game.ancho_campo - this.equipo_CPU.jugadores[i].posicion_inicial.x)) - this.factor_ataque) 
                            + (this.pelota.sprite.x - this.game.inicio_pelota_x)/ajusta_carca_area + (Math.floor(Math.random() * 400) - 200);
                var aleatorio2 = this.equipo_CPU.jugadores[i].posicion_inicial.y + (this.pelota.sprite.y - this.game.inicio_pelota_y)/this.factor_bascula_y + (Math.floor(Math.random() * 300) - 150);
                if (this.game.time.now > this.equipo_CPU.jugadores[i].cambio_aleatorio_time){
                    this.equipo_CPU.jugadores[i].x_aleatorea = aleatorio;
                    this.equipo_CPU.jugadores[i].y_aleatorea = aleatorio2;
                    this.equipo_CPU.jugadores[i].cambio_aleatorio_time = this.game.time.now + 1000;
                }
            }
            else{
                this.game.physics.arcade.moveToXY(this.equipo_CPU.jugadores[i].sprite, this.equipo_CPU.jugadores[i].x_aleatorea, this.equipo_CPU.jugadores[i].y_aleatorea, this.game.velocidad_jugador, 0);
            }
        }
    },

    sacar_de_centro: function(cpu){
        
        this.game.tiempo_gol = this.time.now + this.game.tiempo_antes_sacar;

        var quien;
        if (cpu){
            quien = "cpu";
            this.score2++;
            this.marcador2.text = this.score2;
            this.texto_previo.text = this.score1 + " - " + this.score2;
        }
        else{
            quien = "jugador";
            this.score1++;
            this.marcador1.text = this.score1;
            this.texto_previo.text = this.score1 + " - " + this.score2;
        }
        this.equipo_jugador.posiciona_saquecentro(quien);
        this.equipo_CPU.posiciona_saquecentro(quien);
        
        this.pelota.sprite.position.x = this.game.inicio_pelota_x;
        this.pelota.sprite.position.y = this.game.inicio_pelota_y;
        this.pelota.sprite.body.velocity.setTo(0);
    },

    entra_botonA: function (){
        this.pulsa_A = true;
        this.botonA.animations.play("sale");
    },

    sal_botonA: function (){
        this.pulsa_A = false;
        this.botonA.animations.play("entra");
    },

    entra_botonB: function (){
        this.pulsa_B = true;
        this.botonB.animations.play("sale");
    },

    sal_botonB: function (){
        this.pulsa_B = false;
        this.botonB.animations.play("entra");
    },

    rebota_supertiro: function () {
        //Seteo que se está centrando
        this.pelota.superdisparo = false;
        this.pelota.superdisparo_time = this.game.time.now 
        this.centrando = true;
        //Y le pongo su tiempo
        this.centrando_time = this.time.now + this.tiempo_centrando/1.5;
        //El jugador ya no controla la pelota
        this.jugador_activo.controlando = false;

        //guardo en el sitio desde el que se centra
        this.centra_y = this.pelota.sprite.body.position.y;

        //cambio la velocidad y de la pelota
        this.pelota.sprite.body.velocity.y = - this.velocidad_centro_y/1.5;
        
        if(this.pelota.sprite.body.velocity.x>0){
            this.pelota.sprite.body.velocity.x = - this.velocidad_centro_x/1.5;
        }
        else{
            this.pelota.sprite.body.velocity.x = this.velocidad_centro_x/1.5;
        }

        //cambio la gravedad del rebote
        this.pelota.sprite.body.gravity.y = this.gravedad_pelota_centrando;
        //pongo el suelo donde se centró, más una compensación
        this.suelo_fake.body.position.y = this.pelota.sprite.body.position.y + this.compensacion_suelo_fake;
        //cambio la potencia del rebote (para que rebote menos)
        this.pelota.sprite.body.bounce.y = this.pelota_bounce_y_centrando;
        //aumento la pelota
        //TODO: animación?
        this.pelota.sprite.scale.setTo(1.2, 1.2);

        //Hago que no rebote en las paredes
        this.pelota.sprite.body.collideWorldBounds = false;
    },

    rebota_portero: function (cpu) {
        //Seteo que se está centrando
        this.pelota.superdisparo = false;
        this.pelota.superdisparo_time = this.game.time.now 
        this.centrando = true;
        //Y le pongo su tiempo
        this.centrando_time = this.time.now + this.tiempo_centrando;
        //El jugador ya no controla la pelota
        this.jugador_activo.controlando = false;

        //guardo en el sitio desde el que se centra
        this.centra_y = this.pelota.sprite.body.position.y;

        //cambio la velocidad y de la pelota
        this.pelota.sprite.body.velocity.y = - this.velocidad_centro_y;
        
        if(cpu){
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
        this.pelota.sprite.scale.setTo(1.2, 1.2);

        //Hago que no rebote en las paredes
        this.pelota.sprite.body.collideWorldBounds = false;
    },

    controla: function(id){
        if (this.pelota.superdisparo){
            this.equipo_jugador.jugadores[id].aturdir();
            this.rebota_supertiro();
            //this.pelota.sprite.body.velocity.x = this.pelota.sprite.body.velocity.x - (this.pelota.sprite.body.velocity.x/4);
            //this.pelota.sprite.body.velocity.y = this.pelota.sprite.body.velocity.y - (this.pelota.sprite.body.velocity.y/4);
        }
        else{
            //Seteo controlando
            this.jugador_activo = this.equipo_jugador.jugadores[id];
            this.jugador_activo.controlando = true;
            this.jugador_rival_activo.controlando = false;
        }
    },

    controla_rival: function(id){
        if (this.pelota.superdisparo){
            this.equipo_CPU.jugadores[id].aturdir();
            this.rebota_supertiro();
            //this.pelota.sprite.body.velocity.x = this.pelota.sprite.body.velocity.x - (this.pelota.sprite.body.velocity.x/4);
            //this.pelota.sprite.body.velocity.y = this.pelota.sprite.body.velocity.y - (this.pelota.sprite.body.velocity.y/4);
        }
       else{
            //Seteo controlando
            if (this.conduce_rival_time < this.time.now - 250){
                this.conduce_rival_time = this.time.now + Math.random()*3000;
            }
            


            this.jugador_rival_activo = this.equipo_CPU.jugadores[id];
            this.jugador_rival_activo.controlando = true;
            this.jugador_activo.controlando = false;
        } 
    },


    paraDragg: function (pointer) {

        this.mueveizquierda = false;
        this.muevederecha = false;
        this.muevearriba = false;
        this.mueveabajo = false;

    },

    procesaDragg: function (a, distance, radianes) {

        var angulo = radianes*180/Math.PI;

        if (distance < 30){
            this.mueveizquierda = false;
            this.muevederecha = false;
            this.muevearriba = false;
            this.mueveabajo = false;
            return;
        }

        if (angulo > -90 && angulo < 90){
            this.mueveizquierda = false;
            this.muevederecha = true;
            if (angulo > -150 && angulo < -50){
                this.muevearriba = true;
            }
            else{
                this.muevearriba = false;
            }
            if (angulo < 150 && angulo > 50){
                this.mueveabajo = true;
            }
            else{
                this.mueveabajo = false;
            }
        }
        if (angulo > 90 || angulo < -90){
            this.mueveizquierda = true;
            this.muevederecha = false;
            if (angulo > -150 && angulo < -50){
                this.muevearriba = true;
            }
            else{
                this.muevearriba = false;
            }
            if (angulo < 150 && angulo > 50){
                this.mueveabajo = true;
            }
            else{
                this.mueveabajo = false;
            }
        }
        
        if (angulo > -120 && angulo < -80){
            this.muevearriba = true;
            this.mueveizquierda = false;
            this.muevederecha = false;
        }
        
        if (angulo < 120 && angulo > 80){
            this.mueveabajo = true;
            this.mueveizquierda = false;
            this.muevederecha = false;
        }


    },

    movimientos_teclas: function(){
        this.mueveizquierda = false;
        this.muevederecha = false;
        this.muevearriba = false;
        this.mueveabajo = false;
        if (this.disparo.isDown){
            this.pulsa_A = true;
        }
        if (this.centro.isDown){
            this.pulsa_B = true;
        }
        if (this.arriba.isDown){
            this.muevearriba = true;
        }
        if (this.abajo.isDown){
            this.mueveabajo = true;
        }
        if (this.izquierda.isDown){
            this.mueveizquierda = true;
        }
        if (this.derecha.isDown){
            this.muevederecha = true;
        }
    },

    

    chuta_portero: function(super_potencia){

        //velocidad del disparo según superpotencia
        //TODO: Animación del disparo también!
        
        var potencia_disparo = 500;


        //diferentes angulos del disparo
        ////
        //DIRECCIONES!
        //
        // 7 8 9
        // 4 5 6
        // 1 2 3
        //
        //TODO: Solo para delante
        if(!this.muevearriba && !this.mueveabajo && !this.mueveizquierda && this.muevederecha){
            //donde = 6;
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
            this.portero_controla = false;  
            this.pulsacion_chuta_portero = false;
        }
        if(this.muevearriba && !this.mueveabajo && !this.mueveizquierda && this.muevederecha){
            //donde = 9;
            this.pelota.sprite.body.velocity.y = -potencia_disparo;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
            this.portero_controla = false;  
            this.pulsacion_chuta_portero = false;
        }
        if(!this.muevearriba && this.mueveabajo && !this.mueveizquierda && this.muevederecha){
            //donde = 3;
            this.pelota.sprite.body.velocity.y = potencia_disparo;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
            this.portero_controla = false;  
            this.pulsacion_chuta_portero = false;
        }
        if(!this.muevearriba && !this.mueveabajo && !this.mueveizquierda && !this.muevederecha){
            //donde = 5;
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
            this.portero_controla = false;  
            this.pulsacion_chuta_portero = false;
        }
    },
    chuta: function(super_potencia){

        //velocidad del disparo según superpotencia
        //TODO: Animación del disparo también!
        var potencia_disparo;
        if (super_potencia){
            potencia_disparo = this.velocidad_chute_super;
            this.pelota.superdisparo = true;
            this.pelota.superdisparo_time = this.game.time.now + this.game.max_tiempo_supertiro;
        }
        else{
            potencia_disparo = this.velocidad_chute_normal;
        }

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
        if(this.muevearriba && !this.mueveabajo && !this.mueveizquierda && !this.muevederecha){
            //donde = 8;
            this.pelota.sprite.body.velocity.y = -potencia_disparo;
            this.pelota.sprite.body.velocity.x = 0;
        }
        if(!this.muevearriba && this.mueveabajo && !this.mueveizquierda && !this.muevederecha){
            //donde = 2;
            this.pelota.sprite.body.velocity.y = potencia_disparo;
            this.pelota.sprite.body.velocity.x = 0;
        }
        if(!this.muevearriba && !this.mueveabajo && !this.mueveizquierda && this.muevederecha){
            //donde = 6;
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
        if(!this.muevearriba && !this.mueveabajo && this.mueveizquierda && !this.muevederecha){
            //donde = 4;
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
        if(this.muevearriba && !this.mueveabajo && this.mueveizquierda && !this.muevederecha){
            //donde = 7;
            this.pelota.sprite.body.velocity.y = -potencia_disparo;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
        if(this.muevearriba && !this.mueveabajo && !this.mueveizquierda && this.muevederecha){
            //donde = 9;
            this.pelota.sprite.body.velocity.y = -potencia_disparo;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
        if(!this.muevearriba && this.mueveabajo && !this.mueveizquierda && this.muevederecha){
            //donde = 3;
            this.pelota.sprite.body.velocity.y = potencia_disparo;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
        if(!this.muevearriba && this.mueveabajo && this.mueveizquierda && !this.muevederecha){
            //donde = 1;
            this.pelota.sprite.body.velocity.y = potencia_disparo;
            this.pelota.sprite.body.velocity.x = -potencia_disparo;
        }
        if(!this.muevearriba && !this.mueveabajo && !this.mueveizquierda && !this.muevederecha){
            //donde = 5;
            this.pelota.sprite.body.velocity.y = 0;
            this.pelota.sprite.body.velocity.x = potencia_disparo;
        }
    },

    chuta_rival: function(super_potencia){

        //velocidad del disparo según superpotencia
        //TODO: Animación del disparo también!
        
        var potencia_disparo;
        if (super_potencia){
            potencia_disparo = this.velocidad_chute_super;
            this.pelota.superdisparo = true;
            this.pelota.superdisparo_time = this.game.time.now + this.game.max_tiempo_supertiro;
        }
        else{
            potencia_disparo = this.velocidad_chute_normal;
        }

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
            if(this.muevearriba && !this.mueveabajo && !this.mueveizquierda && !this.muevederecha){
                //donde = 8;
                this.pelota.sprite.body.velocity.y = -potencia_disparo;
                this.pelota.sprite.body.velocity.x = 0;
            }
            if(!this.muevearriba && this.mueveabajo && !this.mueveizquierda && !this.muevederecha){
                //donde = 2;
                this.pelota.sprite.body.velocity.y = potencia_disparo;
                this.pelota.sprite.body.velocity.x = 0;
            }
            if(!this.muevearriba && !this.mueveabajo && !this.mueveizquierda && this.muevederecha){
                //donde = 6;
                this.pelota.sprite.body.velocity.y = 0;
                this.pelota.sprite.body.velocity.x = potencia_disparo;
            }
            if(!this.muevearriba && !this.mueveabajo && this.mueveizquierda && !this.muevederecha){
                //donde = 4;
                this.pelota.sprite.body.velocity.y = 0;
                this.pelota.sprite.body.velocity.x = -potencia_disparo;
            }
            if(this.muevearriba && !this.mueveabajo && this.mueveizquierda && !this.muevederecha){
                //donde = 7;
                this.pelota.sprite.body.velocity.y = -potencia_disparo;
                this.pelota.sprite.body.velocity.x = -potencia_disparo;
            }
            if(this.muevearriba && !this.mueveabajo && !this.mueveizquierda && this.muevederecha){
                //donde = 9;
                this.pelota.sprite.body.velocity.y = -potencia_disparo;
                this.pelota.sprite.body.velocity.x = potencia_disparo;
            }
            if(!this.muevearriba && this.mueveabajo && !this.mueveizquierda && this.muevederecha){
                //donde = 3;
                this.pelota.sprite.body.velocity.y = potencia_disparo;
                this.pelota.sprite.body.velocity.x = potencia_disparo;
            }
            if(!this.muevearriba && this.mueveabajo && this.mueveizquierda && !this.muevederecha){
                //donde = 1;
                this.pelota.sprite.body.velocity.y = potencia_disparo;
                this.pelota.sprite.body.velocity.x = -potencia_disparo;
            }
            if(!this.muevearriba && !this.mueveabajo && !this.mueveizquierda && !this.muevederecha){
                //donde = 5;
                this.pelota.sprite.body.velocity.y = 0;
                this.pelota.sprite.body.velocity.x = potencia_disparo;
            }


        }

        
    },

    centra_portero: function(rival){
        var is_rival = 1;
        if (rival){
            is_rival = -1;
        }
        //Seteo que se está centrando
        this.centrando = true;
        this.centrando_time = this.time.now + this.tiempo_centrando*1.5;
        //guardo en el sitio desde el que se centra
        this.centra_y = this.pelota.sprite.body.position.y;
        //cambio la velocidad y de la pelota
        this.pelota.sprite.body.velocity.y = - this.velocidad_centro_y*1.7;
        
        this.pelota.sprite.body.velocity.x = is_rival * this.velocidad_centro_x*1.4;
        

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
        if(this.mueveizquierda){
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
        if(this.muevearriba && !this.mueveabajo && !this.mueveizquierda && !this.muevederecha){
            donde = 8;
        }
        if(!this.muevearriba && this.mueveabajo && !this.mueveizquierda && !this.muevederecha){
            donde = 2;
        }
        if(!this.muevearriba && !this.mueveabajo && !this.mueveizquierda && this.muevederecha){
            donde = 6;
        }
        if(!this.muevearriba && !this.mueveabajo && this.mueveizquierda && !this.muevederecha){
            donde = 4;
        }
        if(this.muevearriba && !this.mueveabajo && this.mueveizquierda && !this.muevederecha){
            donde = 7;
        }
        if(this.muevearriba && !this.mueveabajo && !this.mueveizquierda && this.muevederecha){
            donde = 9;
        }
        if(!this.muevearriba && this.mueveabajo && !this.mueveizquierda && this.muevederecha){
            donde = 3;
        }
        if(!this.muevearriba && this.mueveabajo && this.mueveizquierda && !this.muevederecha){
            donde = 1;
        }
        if(!this.muevearriba && !this.mueveabajo && !this.mueveizquierda && !this.muevederecha){
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
        if (this.pulsacion){
            this.equipo_jugador.jugadores[i].sprite.animations.play('cabezazo');
        }
        else{
            this.equipo_jugador.jugadores[i].sprite.animations.play('salta');   
        }
        
        this.physics.arcade.collide(this.equipo_jugador.jugadores[i].sprite, this.equipo_jugador.jugadores[i].suelo_saltando_fake, this.equipo_jugador.jugadores[i].fin_salto.bind(this.equipo_jugador.jugadores[i]), null, this); 
    },


    cabezazo: function(i){

        this.equipo_jugador.jugadores[i].pelota_enlacabeza = true;
    },


    cabezazo_rival: function(i){
        this.equipo_CPU.jugadores[i].pelota_enlacabeza = true;
    },

    sale_izquierda: function(){
        if (this.pelota.sprite.position.y > this.game.porteria_arriba && this.pelota.sprite.position.y < this.game.porteria_abajo){
            this.sacar_de_centro(true);
        }
        else{
            this.saca_portero();
        }
    },


    sale_derecha: function(){
        if (this.pelota.sprite.position.y > this.game.porteria_arriba && this.pelota.sprite.position.y < this.game.porteria_abajo){
            this.sacar_de_centro();
        }
        else{
            this.saca_portero_rival();
        }
    },

    saca_portero: function(){
        this.game.tiempo_sacando = this.time.now + 2000;
        this.pelota.sprite.position.x = this.equipo_jugador.portero.sprite.position.x+55;
        this.pelota.sprite.position.y = this.equipo_jugador.portero.sprite.position.y+5;
        this.portero_controla = true;
        this.tiempo_portero_max = this.time.now + 5000;
        this.pelota.sprite.body.velocity.setTo(0);
    },

    saca_portero_rival: function(){
        this.game.tiempo_sacando = this.time.now + 2000;
        this.pelota.sprite.position.x = this.equipo_CPU.portero.sprite.position.x-55;
        this.pelota.sprite.position.y = this.equipo_CPU.portero.sprite.position.y+5;
        this.portero_controla_rival = true;
        this.tiempo_portero_max = this.time.now + 5000;
        this.pelota.sprite.body.velocity.setTo(0);
    },

    controla_portero: function(){
        var probabilidad_rebote;
        if (this.pelota.superdisparo){
            probabilidad_rebote = Math.random()*10;
        }
        else{
            probabilidad_rebote = Math.random()*5;
        }
        if (probabilidad_rebote > 4){
            this.rebota_portero(false);
        }
        else{
            this.equipo_jugador.portero.sprite.animations.play('coge_pelota');
            this.pelota.superdisparo = false;
            this.tiempo_portero_max = this.time.now + 3000;
            this.portero_controla = true;
            this.equipo_jugador.volver_inicio();
            this.equipo_CPU.volver_inicio();
            this.equipo_jugador.portero.sprite.body.velocity.setTo(0,0);
            this.pelota.sprite.body.velocity.setTo(0,0);
        }
    },

    

    controla_portero_rival: function(){
        var probabilidad_rebote;
        if (this.pelota.superdisparo){
            probabilidad_rebote = Math.random()*10;
        }
        else{
            probabilidad_rebote = Math.random()*5;
        }
        if (probabilidad_rebote > 4){
            this.rebota_portero(true);
        }
        else{
            this.equipo_CPU.portero.sprite.animations.play('coge_pelota');
            this.jugador_activo.controlando = false;
            this.pelota.superdisparo = false;
            this.tiempo_portero_max = this.time.now + Math.random()*3000;
            this.portero_controla_rival = true;
            this.equipo_jugador.volver_inicio();
            this.equipo_CPU.volver_inicio();
            this.equipo_CPU.portero.sprite.body.velocity.setTo(0,0);
            this.pelota.sprite.body.velocity.setTo(0,0);
        }
        
    },

    
    /*
    render: function() {
        //  Just renders out the pointer data when you touch the canvas
        this.game.debug.pointer(this.game.input.pointer1);
        this.game.debug.pointer(this.game.input.pointer2);
        this.game.debug.pointer(this.game.input.pointer3);
        this.game.debug.pointer(this.game.input.pointer4);
    }
    */
};

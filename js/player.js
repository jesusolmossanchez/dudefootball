'use strict';
function Player(juego, x, y, cpu){

    if(cpu){
        this.sprite = juego.add.sprite (x, y,'jugador_cpu');
        this.is_cpu = true;
    }
    else{
        this.sprite = juego.add.sprite (x, y,'jugador');
        this.is_cpu = false;
    }


    //Añado la imagen
    this.fake_sprite = juego.add.sprite(x, y + 70, 'fake_sprite');
    this.marca_activo = juego.add.sprite(x+35, y-25, 'jugador_activo');
    this.sombra = juego.add.sprite(x, y+35, 'sombra_jugador');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.fake_sprite.anchor.setTo(0.5, 0);
    this.marca_activo.anchor.setTo(0.5, 0.5);
    this.sombra.anchor.setTo(0.5, 0.5);
    this.fake_sprite.alpha = 0;
    this.marca_activo.alpha = 0;
    this.sombra.alpha = 0.1;

    this.posicion_inicial = new Phaser.Point(x,y);

    //Animación
    this.sprite.animations.add('semueve', [0,1], 4, true);
    this.sprite.animations.add('aturdido', [2,3], 5, true);
    this.sprite.animations.add('metepie', [4], 5, true);
    this.sprite.animations.add('salta', [5], 5, true);
    this.sprite.animations.add('cabezazo', [6], 5, true);
    this.sprite.animations.add('chuta', [7], 5, true);

    //Añado la fisica
    juego.physics.arcade.enable(this.sprite);

    //Fisica del sprite_fake
    juego.physics.arcade.enable(this.fake_sprite);

    //SUelo fake para rebote del jugador
    //TODO: Poner el suelo bien en su sitio
    this.suelo_saltando_fake = juego.add.sprite(0, 0, "suelo_fake");
    //this.suelo_saltando_fake.enableBody = true;
    juego.physics.arcade.enable(this.suelo_saltando_fake);
    this.suelo_saltando_fake.body.immovable = true;
    //TODO: La dejo visible para controlar
    this.suelo_saltando_fake.alpha = 0;

    //choca con las paredes
    this.sprite.body.collideWorldBounds = true;

    this.pelota_enlacabeza = false;


    this.saltando = false;
    this.controlando = false;

    this.chute_time = juego.time.now;
    this.lanzado_time = juego.time.now;
    this.aturdido_time = juego.time.now;

    //Situación de la pelota
    this.pelota_arriba = false;
    this.pelota_abajo = false;
    this.pelota_izquierda = false;
    this.pelota_derecha = false;

    this.cambio_aleatorio_time = juego.time.now;

    this.ajusta_fake = function(){
        this.fake_sprite.body.position.x = this.sprite.body.position.x + 5;
        this.fake_sprite.body.position.y = this.sprite.body.position.y + 60;
        this.marca_activo.position.x = this.sprite.body.position.x + 35;
        this.marca_activo.position.y = this.sprite.body.position.y - 25;
        this.marca_activo.alpha = 0;
    },

    this.ajusta_fake_saltando = function(){
        this.fake_sprite.body.position.x = this.sprite.body.position.x + 5;
        this.fake_sprite.body.position.y = this.sprite.body.position.y;
        this.marca_activo.position.x = this.sprite.body.position.x + 35;
        this.marca_activo.position.y = this.sprite.body.position.y - 25;
        this.marca_activo.alpha = 0;
    },

    this.ajusta_sombra = function(){
        this.sombra.position.x = this.sprite.position.x;
        this.sombra.position.y = this.sprite.position.y + 50;
    },

    this.ajusta_sombra_saltando = function(){
        this.sombra.position.x = this.sprite.position.x;
        this.sombra.position.y = this.suelo_saltando_fake.body.position.y;
    },

    this.ajusta_sombra_aturdido = function(){
        this.sombra.position.x = this.sprite.position.x;
        this.sombra.position.y = this.sprite.position.y + 20;
    }

    this.resetea_velocidad = function() {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.sprite.angle = 0;
        this.fake_sprite.angle = 0;
        //this.fake_sprite.body.velocity.x = 0;
        //this.fake_sprite.body.velocity.y = 0;
    }

    this.resetea_angulo = function(){

    }

    this.mueve = function(adonde) {
        if (!this.saltando && this.chute_time < juego.time.now){
            this.sprite.animations.play('semueve');
        }
        
        var mi_velocidad;
        if (this.controlando){
            mi_velocidad = juego.velocidad_jugador_con_pelota;
        }
        else{
            mi_velocidad = juego.velocidad_jugador;
        }
        

        
        if (adonde == "izquierda"){
            this.sprite.body.velocity.x = -mi_velocidad;
            //this.fake_sprite.body.velocity.x = -mi_velocidad;
        }
        else if (adonde == "derecha"){
            this.sprite.body.velocity.x = mi_velocidad;
            //this.fake_sprite.body.velocity.x = mi_velocidad;
        }
        if (!this.saltando){
            if(adonde == "arriba"){
                this.sprite.body.velocity.y = -mi_velocidad;
                //this.fake_sprite.body.velocity.y = -mi_velocidad;
            }
            else if (adonde == "abajo"){
                this.sprite.body.velocity.y = mi_velocidad;
                //this.fake_sprite.body.velocity.y = mi_velocidad;
            }
        }
    }

    this.salta = function() {
        //TODO: ANIMACIÓN DE SALTO
        //this.sprite.animations.play('salta');
        
        //Pongo el suelo del jugador en su sitio
        this.suelo_saltando_fake.body.position.y = this.sprite.body.position.y + 85;
        
        //Velocidad de salto
        this.sprite.body.velocity.y = -juego.velocidad_salto;
        //Seteo la gravedad
        this.sprite.body.gravity.y = juego.gravedad_salto;
        //digo que el jugador esta saltando
        this.saltando = true;
        
    }

    this.fin_salto = function() {
        //TODO: ANIMACIÓN DE SEMUEVE (OTRA VEZ) ¿O PARADO?
        //this.sprite.animations.play('semueve');
        
        //Pongo el suelo del jugador en su sitio
        //TODO: Poner el suelo bien en su sitio
        this.suelo_saltando_fake.body.position.y = 0;
        
        //Reseteo las cosas para que efectivamente, no salte
        this.sprite.body.velocity.y = 0;
        this.sprite.body.gravity.y = 0;
        this.saltando = false;
        
    }

    this.dispara = function(donde) {
        //TODO: LOGICA DEL DISPARO!!!
        this.lanzado_time = juego.time.now + juego.tiempo_lanzandose;
        this.sprite.animations.play('metepie');
        if (donde == 2){
            this.sprite.angle = 0;
            this.fake_sprite.angle = 0;
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = juego.velocidedad_lanzado;
        }
        if (donde == 3){
            this.sprite.angle = -45;
            this.fake_sprite.angle = -45;
            this.sprite.body.velocity.x = juego.velocidedad_lanzado;
            this.sprite.body.velocity.y = juego.velocidedad_lanzado;
        }
        if (donde == 6){
            this.sprite.angle = -90;
            this.fake_sprite.angle = -90;
            this.sprite.body.velocity.x = juego.velocidedad_lanzado;
            this.sprite.body.velocity.y = 0;
        }
        if (donde == 7){
            this.sprite.angle = 135;
            this.fake_sprite.angle = 135;
            this.sprite.body.velocity.x = -juego.velocidedad_lanzado;
            this.sprite.body.velocity.y = -juego.velocidedad_lanzado;
        }
        if (donde == 8){
            this.sprite.angle = 180;
            this.fake_sprite.angle = 180;
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = -juego.velocidedad_lanzado;
        }
        if (donde == 9){
            this.sprite.angle = -135;
            this.fake_sprite.angle = -135;
            this.sprite.body.velocity.x = juego.velocidedad_lanzado;
            this.sprite.body.velocity.y = -juego.velocidedad_lanzado;
        }
        if (donde == 4){
            this.sprite.angle = 90;
            this.fake_sprite.angle = 90;
            this.sprite.body.velocity.x = -juego.velocidedad_lanzado;
            this.sprite.body.velocity.y = 0;
        }
        if (donde == 1){
            this.sprite.angle = 45;
            this.fake_sprite.angle = 45;
            this.sprite.body.velocity.x = -juego.velocidedad_lanzado;
            this.sprite.body.velocity.y = juego.velocidedad_lanzado;
        }
    }

    this.se_lanza = function() {
        //TODO: LOGICA DEL DISPARO!!!
        this.lanzado_time = juego.time.now + juego.tiempo_lanzandose;
        //this.sprite.animations.play('metepie');
        /*
        
        */
    }

    this.estoy_cerca = function(posicion) {
        var dist = Math.sqrt( Math.pow((posicion.x-this.sprite.body.position.x), 2) + Math.pow((posicion.y-this.sprite.body.position.y), 2) );      
        if (dist < 300){
            return true;
        }
        else{
            return false;
        }
    }

    this.check_distancia = function(posicion) {
        var dist = Math.sqrt( Math.pow((posicion.x-this.sprite.body.position.x), 2) + Math.pow((posicion.y-this.sprite.body.position.y), 2) );      
        return dist;
    }

    this.aturdir = function(posicion) {
        console.log("me quedo loco!");

        this.sprite.angle = Math.random()>0.5 ? -90 : 90;
        this.sprite.animations.play('aturdido');
        this.controlando = false;
        this.aturdido_time = juego.time.now + juego.tiempo_aturdido;

    }

    this.voy_al_choque = function() {
        if (juego.time.now < this.lanzado_time){
            return true;
        }
        return false;
    }

}
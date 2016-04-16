'use strict';
function Portero(juego, x, y, cpu){

    if(cpu){
        this.sprite = juego.add.sprite (x, y,'portero_cpu');
        this.is_cpu = true;
        this.area = new Phaser.Rectangle(juego.ancho_campo-800, juego.alto_campo/2-300, 800, 600);
        this.sprite.scale.x = -1;
    }
    else{
        this.sprite = juego.add.sprite (x, y,'portero');
        this.is_cpu = false;
        this.area = new Phaser.Rectangle(0, juego.alto_campo/2-300, 800, 600);
    }

    this.sprite.anchor.setTo(0.5, 0.5);


    this.fake_sprite = juego.add.sprite(x, y + 50, 'fake_sprite');
    this.fake_sprite.anchor.setTo(0.5, 0);
    this.fake_sprite.alpha = 0;

    this.sprite.animations.add('semueve', [0,1], 7, true);
    this.sprite.animations.add('coge_pelota', [2], 5, true);
    this.sprite.animations.add('selanza1', [3], 5, true);
    this.sprite.animations.add('selanza2', [4], 5, true);

    this.posicion_inicial = new Phaser.Point(x,y);

    this.lanzado_time = juego.time.now;

    juego.physics.arcade.enable(this.sprite);
    //Fisica del sprite_fake
    juego.physics.arcade.enable(this.fake_sprite);

    this.mueve = function(adonde) {
        this.sprite.animations.play('semueve');
        var mi_velocidad = 150;
        
        if (adonde == "izquierda"){
            if (this.sprite.position.x > this.posicion_inicial.x){
                this.sprite.body.velocity.x = -mi_velocidad;
            }
        }
        else if (adonde == "derecha"){
            if (this.sprite.position.x < this.posicion_inicial.x + 300){
                this.sprite.body.velocity.x = mi_velocidad;
            }
        }
        if(adonde == "arriba"){
                this.sprite.body.velocity.y = -mi_velocidad;
            }
        else if (adonde == "abajo"){
                this.sprite.body.velocity.y = mi_velocidad;
        }
        
    }

    this.se_lanza = function(donde) {
        this.lanzado_time = juego.time.now + juego.tiempo_lanzandose;
        this.sprite.body.velocity.x = 50;
        if (donde == "arriba"){
            this.sprite.body.velocity.y = juego.velocidedad_lanzado;
            this.sprite.animations.play('selanza2');
        }
        else{
            this.sprite.body.velocity.y = -juego.velocidedad_lanzado;
            this.sprite.animations.play('selanza1');
        }
    }

    this.ajusta_fake = function(){
        this.fake_sprite.body.position.x = this.sprite.body.position.x + 5;
        this.fake_sprite.body.position.y = this.sprite.body.position.y + 50;
    },

    this.ajusta_fake_lanzadose = function(){
        this.fake_sprite.body.position.x = this.sprite.body.position.x + 5;
        this.fake_sprite.body.position.y = this.sprite.body.position.y;
    },

    this.resetea_velocidad = function(adonde) {
        this.sprite.body.velocity.setTo(0,0);
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

    this.estoy_muy_cerca = function(posicion) {
        var dist = Math.sqrt( Math.pow((posicion.x-this.sprite.body.position.x), 2) + Math.pow((posicion.y-this.sprite.body.position.y), 2) );      
        if (dist < 100){
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

    this.vuelve_posicion_inicial = function(posicion) {
        var donde_ir = new Phaser.Point(this.posicion_inicial.x, this.posicion_inicial.y);
        if (this.check_distancia(donde_ir) > 70 ){
            juego.physics.arcade.moveToXY(this.sprite, this.posicion_inicial.x, this.posicion_inicial.y, juego.velocidad_jugador/1.5, 0);
        }
    }

    this.dentro_area = function(posicion){
        return (posicion.x > this.area.left && posicion.x < this.area.right && posicion.y > this.area.top && posicion.y < this.area.bottom);
    }
}
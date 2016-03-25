'use strict';
function Portero(juego, x, y, cpu){

    if(cpu){
        this.sprite = juego.add.sprite (x, y,'portero_cpu');
        this.is_cpu = true;
    }
    else{
        this.sprite = juego.add.sprite (x, y,'portero');
        this.is_cpu = false;
    }

    this.sprite.anchor.setTo(0.5, 0.5);

    this.posicion_inicial = new Phaser.Point(x,y);

    juego.physics.arcade.enable(this.sprite);

    this.mueve = function(adonde) {
        this.sprite.animations.play('semueve');
        var mi_velocidad = 150;
        
        if (adonde == "izquierda"){
            this.sprite.body.velocity.x = -mi_velocidad;
        }
        else if (adonde == "derecha"){
            this.sprite.body.velocity.x = mi_velocidad;
        }
        if(adonde == "arriba"){
                this.sprite.body.velocity.y = -mi_velocidad;
            }
        else if (adonde == "abajo"){
                this.sprite.body.velocity.y = mi_velocidad;
        }
        
    }

    this.resetea_velocidad = function(adonde) {
        this.sprite.body.velocity.setTo(0,0);
    }
}
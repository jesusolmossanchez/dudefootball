'use strict';
function Pelota(juego){

    this.sprite = juego.add.sprite (juego.inicio_pelota_x, juego.inicio_pelota_y, 'pelota');

    this.sprite.anchor.setTo(juego.default_anchor, juego.default_anchor);
    juego.physics.arcade.enable(this.sprite);
    juego.camera.follow(this.sprite);

    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.x = juego.pelota_bounce_x;
    this.sprite.body.bounce.y = juego.pelota_bounce_y;

    //Situación de la pelota
    this.arriba = false;
    this.abajo = false;
    this.izquierda = false;
    this.derecha = false;

    this.frena = function() {
    	if(this.sprite.body.velocity.x > 0){
            this.sprite.body.velocity.x -= 1;
        }
        if(this.sprite.body.velocity.x < 0){
            this.sprite.body.velocity.x += 1;
        }
    }

}


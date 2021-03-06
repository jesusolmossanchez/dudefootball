
'use strict';
function Pelota(juego){

    this.sprite = juego.add.sprite (juego.inicio_pelota_x, juego.inicio_pelota_y, 'pelota');
    this.sombra = juego.add.sprite (juego.inicio_pelota_x, juego.inicio_pelota_y+5, 'sombra_jugador');
    this.sombra.alpha = 0.1;

    this.sprite.anchor.setTo(juego.default_anchor, juego.default_anchor);
    juego.physics.arcade.enable(this.sprite);
    juego.camera.follow(this.sprite);

    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.x = juego.pelota_bounce_x;
    this.sprite.body.bounce.y = juego.pelota_bounce_y;

    this.sprite.anchor.setTo(0.5, 0.5);
    this.sombra.anchor.setTo(0.5, 0.5);

    this.superdisparo = false;
    this.superdisparo_time = juego.time.now ;

    this.sprite.animations.add('normal', [0], 5, true);
    this.sprite.animations.add('supertiro', [1], 5, true);

    this.frena = function() {
        if(this.sprite.body.velocity.x > 0){
            this.sprite.body.velocity.x -= 3;
        }
        if(this.sprite.body.velocity.x < 0){
            this.sprite.body.velocity.x += 3;
        }
        if(this.sprite.body.velocity.y > 0){
            this.sprite.body.velocity.y -= 3;
        }
        if(this.sprite.body.velocity.y < 0){
            this.sprite.body.velocity.y += 3;
        }
    }

    this.procesa_supertiro = function() {
        if (juego.time.now < this.superdisparo_time){
            this.sprite.animations.play('supertiro');
            this.superdisparo = true;
        }
        else{
            this.sprite.animations.play('normal');
            this.superdisparo = false;
        }
    }

    
}

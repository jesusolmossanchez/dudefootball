'use strict';
function Player(juego, x, y){
	//Añado la imagen
	this.sprite = juego.add.sprite (x, y,'jugador');
	this.sprite.anchor.setTo(0.5, 0.5);
	//Animación
	this.sprite.animations.add('semueve', [0,1], 7, true);

	//Añado la fisica
	juego.physics.arcade.enable(this.sprite);

	//choca con las paredes
	this.sprite.body.collideWorldBounds = true;

	this.saltando = false;
	this.controlando = false;

	this.resetea_velocidad = function() {
		this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
    }

    this.mueve = function(adonde) {
    	this.sprite.animations.play('semueve');
    	
		if (adonde == "izquierda"){
			this.sprite.body.velocity.x = -juego.velocidad_jugador;
        }
        else if (adonde == "derecha"){
			this.sprite.body.velocity.x = juego.velocidad_jugador;
        }
        if(adonde == "arriba"){
			this.sprite.body.velocity.y = -juego.velocidad_jugador;
        }
        else if (adonde == "abajo"){
			this.sprite.body.velocity.y = juego.velocidad_jugador;
        }
    }

}
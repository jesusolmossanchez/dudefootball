'use strict';
function Player(juego){
	//Añado la imagen
	this.sprite = juego.add.sprite (400, 250,'jugador');
	this.sprite.anchor.setTo(0.5, 0.5);
	//Animación
	this.sprite.animations.add('semueve', [0,1], 7, true);

	//Añado la fisica
	juego.physics.arcade.enable(this.sprite);

	//choca con las paredes
	this.sprite.body.collideWorldBounds = true;

	this.saltando = false;
	this.controlando = false;

}
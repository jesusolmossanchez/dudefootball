'use strict';
function Equipo(juego, cpu){

    this.is_CPU = cpu;
    this.jugadores = [];
    this.portero;
    this.cuantos_a_por_pelota = 0;

    this.inicializa_equipo = function(){

        // TODO: Hacer las distancias relativas al campo
    	if (this.is_CPU){
        	this.jugadores.push(new Player(juego, 2100, 250, true));
            /*
	        this.jugadores.push(new Player(juego, 2100, 750, true));
	        this.jugadores.push(new Player(juego, 1800, 250, true));
	        this.jugadores.push(new Player(juego, 1800, 750, true));
	        this.jugadores.push(new Player(juego, 1500, 250, true));
	        this.jugadores.push(new Player(juego, 1500, 750, true));*/
    	}
    	else{
    		this.jugadores.push(new Player(juego, 300, 250));
	        this.jugadores.push(new Player(juego, 300, 750));
	        this.jugadores.push(new Player(juego, 600, 250));
	        this.jugadores.push(new Player(juego, 600, 750));
	        this.jugadores.push(new Player(juego, 900, 250));
	        this.jugadores.push(new Player(juego, 900, 750));
    	}
   	}

    this.volver_inicio = function(){
        for (var i = 0; i < this.jugadores.length; i++) {
        	var donde_ir = new Phaser.Point(this.jugadores[i].posicion_inicial.x, this.jugadores[i].posicion_inicial.y);
            if (this.jugadores[i].check_distancia(donde_ir) > 70 ){
            	juego.physics.arcade.moveToXY(this.jugadores[i].sprite, this.jugadores[i].posicion_inicial.x, this.jugadores[i].posicion_inicial.y, juego.velocidad_jugador/1.5, 0);
        	}
        }
    }


}

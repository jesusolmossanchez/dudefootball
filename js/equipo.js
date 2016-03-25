'use strict';
function Equipo(juego, cpu){

    this.is_CPU = cpu;
    this.jugadores = [];
    this.portero;
    this.cuantos_a_por_pelota = 0;

    this.volver_inicio = function(){
        for (var i = 0; i < this.jugadores.length; i++) {
        	var donde_ir = new Phaser.Point(this.jugadores[i].posicion_inicial.x, this.jugadores[i].posicion_inicial.y);
            if (this.jugadores[i].check_distancia(donde_ir) > 70 ){
            	juego.physics.arcade.moveToXY(this.jugadores[i].sprite, this.jugadores[i].posicion_inicial.x, this.jugadores[i].posicion_inicial.y, juego.velocidad_jugador/1.5, 0);
        	}
        }
    }
}

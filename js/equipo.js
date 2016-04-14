'use strict';
function Equipo(juego, cpu){

    this.is_CPU = cpu;
    this.jugadores = [];
    this.portero;
    this.cuantos_a_por_pelota = 0;

    this.inicializa_equipo = function(){

        // TODO: Hacer las distancias relativas al campo
    	if (this.is_CPU){
        	this.jugadores.push(new Player(juego, 2100, 280, true));
	        this.jugadores.push(new Player(juego, 2100, 720, true));
	        this.jugadores.push(new Player(juego, 1800, 280, true));
	        this.jugadores.push(new Player(juego, 1800, 720, true));
	        this.jugadores.push(new Player(juego, 1500, 300, true));
	        this.jugadores.push(new Player(juego, 1500, 700, true));
    	}
    	else{
    		this.jugadores.push(new Player(juego, 300, 280));
	        this.jugadores.push(new Player(juego, 300, 720));
	        this.jugadores.push(new Player(juego, 600, 280));
	        this.jugadores.push(new Player(juego, 600, 720));
	        this.jugadores.push(new Player(juego, 900, 300));
	        this.jugadores.push(new Player(juego, 900, 700));
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
    this.posiciona_saquecentro = function(quien){
        if (this.is_CPU){
            this.jugadores[0].sprite.position.x = 2100;
            this.jugadores[0].sprite.position.y = 280;
            this.jugadores[1].sprite.position.x = 2100;
            this.jugadores[1].sprite.position.y = 720;
            this.jugadores[2].sprite.position.x = 1800;
            this.jugadores[2].sprite.position.y = 280;
            this.jugadores[3].sprite.position.x = 1800;
            this.jugadores[3].sprite.position.y = 720;

            if (quien === "cpu"){
                this.jugadores[4].sprite.position.x = 1500;
                this.jugadores[4].sprite.position.y = 300;
                this.jugadores[5].sprite.position.x = 1500;
                this.jugadores[5].sprite.position.y = 700;
            }
            else{
                this.jugadores[4].sprite.position.x = (juego.ancho_campo / 2) + 50;
                this.jugadores[4].sprite.position.y = (juego.alto_campo / 2) - 120;

                this.jugadores[5].sprite.position.x = (juego.ancho_campo / 2) + 50;
                this.jugadores[5].sprite.position.y = (juego.alto_campo / 2) + 120;
            }
            
        }
        else{
            this.jugadores[0].sprite.position.x = 300;
            this.jugadores[0].sprite.position.y = 280;
            this.jugadores[1].sprite.position.x = 300;
            this.jugadores[1].sprite.position.y = 720;
            this.jugadores[2].sprite.position.x = 600;
            this.jugadores[2].sprite.position.y = 280;
            this.jugadores[3].sprite.position.x = 600;
            this.jugadores[3].sprite.position.y = 720;
            
            if (quien === "jugador"){
                this.jugadores[4].sprite.position.x = 900;
                this.jugadores[4].sprite.position.y = 300;
                this.jugadores[5].sprite.position.x = 900;
                this.jugadores[5].sprite.position.y = 700;
            }
            else{
                this.jugadores[4].sprite.position.x = (juego.ancho_campo / 2) - 50;
                this.jugadores[4].sprite.position.y = (juego.alto_campo / 2) - 120;

                this.jugadores[5].sprite.position.x = (juego.ancho_campo / 2) - 50;
                this.jugadores[5].sprite.position.y = (juego.alto_campo / 2) + 120;
            }
        }

    }


}

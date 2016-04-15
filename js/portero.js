'use strict';
function Portero(juego, x, y, cpu){

    if(cpu){
        this.sprite = juego.add.sprite (x, y,'portero_cpu');
        this.is_cpu = true;
        this.area = new Phaser.Rectangle(juego.ancho_campo-400, juego.alto_campo/2-300, 400, 600);
        this.sprite.scale.x = -1;
    }
    else{
        this.sprite = juego.add.sprite (x, y,'portero');
        this.is_cpu = false;
        this.area = new Phaser.Rectangle(0, juego.alto_campo/2-300, 400, 600);
    }

    this.sprite.anchor.setTo(0.5, 0.5);

    this.sprite.animations.add('semueve', [0,1], 7, true);
    this.sprite.animations.add('coge_pelota', [2], 5, true);
    this.sprite.animations.add('selanza', [3], 5, true);

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
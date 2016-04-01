var Joystick = function(juego, x, y) {

	this.pin = juego.add.sprite(0, 0, "joy_front");
	this.holder = juego.add.sprite(0, 0, "joy_back");
	this.holder.anchor.setTo(0.5, 0.5);
	this.holder.fixedToCamera = true;
	this.holder.cameraOffset.setTo(x, y);

	this.holder.direction      = new Phaser.Point(0, 0);
	this.holder.distance       = 0;
	this.holder.pinAngle       = 0;
	this.holder.disabled       = false;
	this.holder.isBeingDragged = false;

	this.holder.events.onDown = new Phaser.Signal();
	this.holder.events.onUp   = new Phaser.Signal();
	this.holder.events.onMove = new Phaser.Signal();

	this.pin.anchor.setTo(0.5, 0.5);
	this.holder.addChild(this.pin);

	/* Invisible sprite that players actually drag */
	var dragger = this.dragger = juego.add.sprite(0, 0, "null");
		dragger.anchor.setTo(0.5, 0.5);
		dragger.width = dragger.height = 181;
		dragger.inputEnabled = true;
		dragger.input.enableDrag(true);
		/* Set flags on drag */
		dragger.events.onDragStart.add(onDragStart, this);
		dragger.events.onDragStop.add(onDragStop, this);
		dragger.alpha = 0;
	this.holder.addChild(dragger);

	this.enable = function() {
		this.disabled = false;
	}
	this.disable = function() {
		this.disabled = true;
	}
	function onDragStart() {
		this.isBeingDragged = true;
		if (this.disabled) return;
		this.holder.events.onDown.dispatch();
	}
	function onDragStop () {
		this.isBeingDragged = false;
		/* Reset pin and dragger position */
		this.dragger.position.setTo(0, 0);
		this.pin.position.setTo(0, 0);
		if (this.disabled) return;
		this.holder.events.onUp.dispatch(this.direction, this.distance, this.angle);
	}
	this.update = function() {
		
		if (this.isBeingDragged) {
			var dragger   = this.dragger.position;
			var pin       = this.pin.position;

			var zero = new Phaser.Point(0, 0);
			var angle     = this.pinAngle = zero.angle(dragger);
			var distance  = this.distance = dragger.getMagnitude();

			var normalize = Phaser.Point.normalize;
			var direction = normalize(dragger, this.direction);
			pin.copyFrom(dragger);
			if (distance > 80) pin.setMagnitude(80);
			if (this.disabled) return;
			this.holder.events.onMove.dispatch(direction, distance, angle);
		}
	}


}


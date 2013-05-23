(function(window, document) {
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', deviceMotionHandler, false);
	}

	var SHAKE_THRESHOLD = 1500;
	var lastUpdate = 0;
	var x, y, z, last_x, last_y, last_z;
	var shakeEvent = [];

	function deviceMotionHandler(eventData) {
		// Grab the acceleration including gravity from the results
		var acceleration = eventData.accelerationIncludingGravity;

		var curTime = +new Date();

		if ((curTime - lastUpdate) > 100) {

			var diffTime = (curTime - lastUpdate);
			lastUpdate = curTime;

			x = acceleration.x;
			y = acceleration.y;
			z = acceleration.z;

			var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
			if (speed > SHAKE_THRESHOLD) {
				shakeEvent.forEach(function(v) {
					if (typeof v === 'function') {
						v();
					}
				});
			}
			last_x = x;
			last_y = y;
			last_z = z;
		}


	}
	window.addShakeEvent = function(fn) {
		shakeEvent.push(fn);
	}
}(window, document));
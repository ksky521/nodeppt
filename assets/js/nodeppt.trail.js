(function(window, document, Slide) {
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    var RADIUS = 8;

    var RADIUS_SCALE = 1;
    var RADIUS_SCALE_MIN = 1;
    var RADIUS_SCALE_MAX = 1.5;

    var QUANTITY = 1;

    var canvas;
    var context;

    var mouseX = SCREEN_WIDTH * 0.5;
    var mouseY = SCREEN_HEIGHT * 0.5;
    var mouseIsDown = false;
    var particle = {
        size: 1,
        position: {
            x: mouseX,
            y: mouseY
        },
        offset: {
            x: 0,
            y: 0
        },
        shift: {
            x: mouseX,
            y: mouseY
        },
        speed: 0.2,
        targetSize: 4,
        fillColor: '#' + (Math.random() * 0x404040 + 0xaaaaaa | 0).toString(16),
        orbit: RADIUS * .5 + (RADIUS * .5 * Math.random())
    };



    function documentMouseMoveHandler(event) {
        mouseX = event.clientX - (window.innerWidth - SCREEN_WIDTH) * .5;
        mouseY = event.clientY - (window.innerHeight - SCREEN_HEIGHT) * .5;
    }

    function documentMouseDownHandler(event) {
        mouseIsDown = true;
    }

    function documentMouseUpHandler(event) {
        mouseIsDown = false;
    }


    function windowResizeHandler() {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
    }

    function loop() {

        if (mouseIsDown) {
            RADIUS_SCALE += (RADIUS_SCALE_MAX - RADIUS_SCALE) * (0.02);
        } else {
            RADIUS_SCALE -= (RADIUS_SCALE - RADIUS_SCALE_MIN) * (0.02);
        }

        RADIUS_SCALE = Math.min(RADIUS_SCALE, RADIUS_SCALE_MAX);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        var lp = {
            x: particle.position.x,
            y: particle.position.y
        };

        // Rotation
        particle.offset.x += particle.speed;
        particle.offset.y += particle.speed;

        // Follow mouse with some lag
        particle.shift.x += (mouseX - particle.shift.x) * (particle.speed);
        particle.shift.y += (mouseY - particle.shift.y) * (particle.speed);

        // Apply position
        particle.position.x = particle.shift.x + Math.cos(particle.offset.x) * (particle.orbit * RADIUS_SCALE);
        particle.position.y = particle.shift.y + Math.sin(particle.offset.y) * (particle.orbit * RADIUS_SCALE);

        // Limit to screen bounds
        particle.position.x = Math.max(Math.min(particle.position.x, SCREEN_WIDTH), 0);
        particle.position.y = Math.max(Math.min(particle.position.y, SCREEN_HEIGHT), 0);

        particle.size += (particle.targetSize - particle.size) * 0.05;

        if (Math.round(particle.size) == Math.round(particle.targetSize)) {
            particle.targetSize = 1 + Math.random() * 7;
        }

        context.beginPath();
        context.fillStyle = particle.fillColor;
        context.strokeStyle = particle.fillColor;
        context.lineWidth = particle.size;
        context.moveTo(lp.x, lp.y);
        context.lineTo(particle.position.x, particle.position.y);
        context.stroke();
        context.arc(particle.position.x, particle.position.y, particle.size / 2, 0, Math.PI * 2, true);
        context.fill();
    }

    var isShow = false;
    var timer;
    Slide.on('keyup', function(e) {
        if (e.keyCode === 84) {
            if (!isShow) {
                canvas = document.createElement('canvas');
                canvas.width = '300';
                canvas.height = '300';
                with(canvas.style) {
                    position = 'absolute';
                    left = '0';
                    top = '0';
                    zIndex = '99999';
                }
                document.body.appendChild(canvas);
            } else {
                document.body.removeChild(canvas);
                canvas = null;
                clearInterval(timer);
            }
            isShow = !isShow;

            if (canvas && canvas.getContext) {
                context = canvas.getContext('2d');

                // Register event listeners
                window.addEventListener('mousemove', documentMouseMoveHandler, false);
                window.addEventListener('mousedown', documentMouseDownHandler, false);
                window.addEventListener('mouseup', documentMouseUpHandler, false);
                window.addEventListener('resize', windowResizeHandler, false);

                windowResizeHandler();
                timer = setInterval(loop, 1000 / 60);
            } else {
                window.removeEventListener('mousemove', documentMouseMoveHandler, false);
                window.removeEventListener('mousedown', documentMouseDownHandler, false);
                window.removeEventListener('mouseup', documentMouseUpHandler, false);
                window.removeEventListener('resize', windowResizeHandler, false);
            }
        }

    });
}(window, document, Slide));

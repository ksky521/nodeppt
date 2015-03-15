function outcallback() {
    document.getElementById('outcallback').innerHTML = 'outcallback fire';
}

function incallback() {
    document.getElementById('incallback').innerHTML = 'incallback fire';
}
var ctx, width, height, canvas;
window.onload = function() {
    canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.display = 'none';
    height = canvas.height = document.documentElement.offsetHeight;
    width = canvas.width = document.documentElement.offsetWidth;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
}
var timer = null;
var colors = ['#487BD3', '#FAF0E5', '#DA4A89', '#03C8CB', '#dc6c5f', '#04AA55'];
Slide.on('update', function(i, si) {
    Puff.add('#FFC524' /*colors[i % 6]*/ , ctx, 20, 700, width / 2, height / 2, width / 1.8, 400);
    clearInterval(timer);
    //有动效
    if (i === 7 && si === 5) {
        timer = setInterval(function() {
            Puff.draw(1);
        }, 1E3 / FPS);
    }else{
        canvas.style.display = 'none';
    }

})



var Easing = {
    get: function(a, b, c, e, d, f, g) {
        return b + Easing[a](Math.min(e, d), d, f, g) * (c - b)
    },
    getRound: function(a, b, c, e, d, f, g) {
        return Math.round(Easing.get(a, b, c, e, d, f, g))
    },
    easeInQuad: function(a, b) {
        return (a /= b) * a
    },
    easeOutQuad: function(a, b) {
        return -(a /= b) * (a - 2)
    },
    easeInOutQuad: function(a, b) {
        return (a /= b / 2) < 1 ? 0.5 * a * a : -0.5 * (--a * (a - 2) - 1)
    },
    easeInCubic: function(a, b) {
        return (a /= b) * a * a
    },
    easeOutCubic: function(a, b) {
        return (a = a / b - 1) * a * a + 1
    },
    easeInOutCubic: function(a, b) {
        return (a /= b / 2) < 1 ? 0.5 * a * a * a : 0.5 * ((a -= 2) * a * a + 2)
    },
    easeInQuart: function(a, b) {
        return (a /= b) * a * a * a
    },
    easeOutQuart: function(a, b) {
        return -((a = a / b - 1) * a * a * a - 1)
    },
    easeInOutQuart: function(a, b) {
        return (a /= b / 2) < 1 ? 0.5 * a * a * a * a : -0.5 * ((a -= 2) * a * a * a - 2)
    },
    easeInQuint: function(a, b) {
        return (a /= b) * a * a * a * a
    },
    easeOutQuint: function(a, b) {
        return (a = a / b - 1) * a * a * a * a + 1
    },
    easeInOutQuint: function(a, b) {
        return (a /= b / 2) < 1 ? 0.5 * a * a * a * a * a : 0.5 * ((a -= 2) * a * a * a * a + 2)
    },
    easeInSine: function(a, b) {
        return -Math.cos(a / b * (Math.PI / 2))
    },
    easeOutSine: function(a, b) {
        return Math.sin(a / b * (Math.PI / 2))
    },
    easeInOutSine: function(a, b) {
        return -0.5 * (Math.cos(Math.PI * a / b) - 1)
    },
    easeInExpo: function(a, b) {
        return a == 0 ? 1 : Math.pow(2, 10 * (a / b - 1))
    },
    easeOutExpo: function(a, b) {
        return a == b ? 1 : -Math.pow(2, -10 * a / b) + 1
    },
    easeInOutExpo: function(a, b) {
        return a == 0 ? 0 : a == b ? 1 : (a /= b / 2) < 1 ? 0.5 * Math.pow(2, 10 * (a - 1)) : 0.5 * (-Math.pow(2, -10 * --a) + 2)
    },
    easeInCirc: function(a, b) {
        return -(Math.sqrt(1 - (a /= b) * a) - 1)
    },
    easeOutCirc: function(a, b) {
        return Math.sqrt(1 - (a = a / b - 1) * a)
    },
    easeInOutCirc: function(a, b) {
        return (a /= b / 2) < 1 ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
    },
    easeInBack: function(a, b, c) {
        c == void 0 && (c = 1.70158);
        return (a /= b) * a * ((c + 1) * a - c)
    },
    easeOutBack: function(a, b, c) {
        c == void 0 && (c = 1.70158);
        return (a = a / b - 1) * a * ((c + 1) * a + c) + 1
    },
    easeInOutBack: function(a, b, c) {
        c == void 0 && (c = 1.70158);
        return (a /= b / 2) < 1 ? 0.5 * a * a * (((c *= 1.525) + 1) * a - c) : 0.5 * ((a -= 2) * a * (((c *= 1.525) + 1) * a + c) + 2)
    },
    easeInBounce: function(a, b) {
        return 1 - Easing.easeOutBounce(b - a, b)
    },
    easeOutBounce: function(a, b) {
        return (a /= b) < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375
    },
    easeInOutBounce: function(a, b) {
        return a < b / 2 ? Easing.easeInBounce(a * 2, b) * 0.5 : Easing.easeOutBounce(a * 2 - b, b) * 0.5 + 0.5
    }
};
var rand = function(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a
};
const D360 = Math.PI * 2;
const FPS = 50;

var Puff = {
    duration: 700,
    maxP: 30,
    puffs: [],
    recycling: [],
    time_ratio: 0.2,
    add: function(color, ctx, maxP, duration, cx, cy, width, height, j) {
        var a = Puff.recycling.length > 0 ? Puff.recycling.shift() : {};
        a.t = 0;
        a.color = color ? color : "#000000";
        a.ctx = ctx;
        a.back = ctx;
        a.a = [];
        a.x = Math.round(cx);
        a.y = Math.round(cy);
        a.W = Math.round(width);
        a.H = Math.round(height);

        a.duration = duration ? duration : Puff.duration;
        maxP = a.maxP = maxP ? maxP : Puff.maxP;

        a.maxD = Math.round(Math.min(a.W, a.H) * 0.4);
        a.minD = Math.round(a.maxD * 0.4);
        a.maxR = Math.round(Math.min(a.W, a.H) * 0.15);
        a.minR = Math.round(a.maxR * 0.5);

        a.tmpKat = rand(0, 360);
        a.angleLeft = j !== void 0 ? j : rand(0, 1) === 0 ? -1 : 1;
        a.removed = 0;

        a.elips_mod = Math.max(a.W, a.H) / Math.min(a.W, a.H) * 0.8;

        for (var i = 0; i < maxP; i++) {
            var c = a.a[i] || {};
            c.target_r = rand(a.minR, a.maxR);
            c.start_r = rand(5, a.minR * 0.3);
            c.a = (420 / a.maxP * (i * a.angleLeft + a.angleLeft) + a.tmpKat + rand(-12, 12)) * Math.PI / 180;
            c.d = Math.round(a.maxD + rand(-a.maxD * 0.3, 0));
            c.target_x = Math.round(Math.sin(c.a) * c.d);
            c.target_y = Math.round(Math.cos(c.a) * c.d);
            if (a.W > a.H) {
                c.target_x *= a.elips_mod;
            } else {
                c.target_y *= a.elips_mod;
            }
            c.start_x = Math.round(rand(-a.minD, a.minD)),
                c.start_y = Math.round(rand(-a.minD, a.minD));
            c.total_t = a.duration * 0.5 / a.maxP * i + a.duration * 0.5;
            a.a.push(c);
        }
        Puff.puffs.push(a);

    },
    draw: function(d, fn) {
        d = Puff.puffs;
        if (d.length === 0) {
            // fn(true);
            canvas.style.display = 'none';
            return;
        } else {
            canvas.style.display = '';
            // fn(false);
        }
        d[0].removed >= d[0].maxP && Puff.recycling.push(d.shift());
        for (var e = 0; e < d.length; e++) {
            var b = d[e];
            var ctx = b.ctx;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = b.color;
            b.t += 1E3 / FPS;
            for (var c = b.removed; c < b.a.length; c++) {
                if (b.a[c].total_t <= b.t) {
                    b.removed = c + 1;
                } else {
                    ctx.beginPath();
                    var x = Easing.getRound("easeOutQuart", b.a[c].start_x, b.a[c].target_x, b.t, b.a[c].total_t) + b.x,
                        y = Easing.getRound("easeOutQuart", b.a[c].start_y, b.a[c].target_y, b.t, b.a[c].total_t) + b.y;
                    if (b.t < b.a[c].total_t * Puff.time_ratio) {
                        var ratio = Easing.getRound("easeOutQuart", b.a[c].start_r, b.a[c].target_r, b.t, b.a[c].total_t * Puff.time_ratio);
                    } else {
                        ratio = Easing.getRound("easeInQuad", b.a[c].target_r, 0, b.t - b.a[c].total_t * Puff.time_ratio, b.a[c].total_t * (1 - Puff.time_ratio));
                    }
                    ctx.arc(x, y, ratio, 0, D360);
                    ctx.closePath();
                    ctx.fill()
                }
            }
        }
    }
};

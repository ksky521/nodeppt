(function(window, document) {
    var sf = function($imgs) {
        $imgs.forEach(function($img) {
            $img.addEventListener('click', function() {
                show(this);
            }, false);
        });
    };

    function show(t) {
        var img = document.createElement('img');
        img.src = t.src;
        img.className = 'transparent';
        $layer.innerHTML = '';
        img.onload = function() {
            img.style.height = this.height + 'px';
            var top = this.height > $body.clientHeight ? 0 : ($body.clientHeight - this.height) / 2;
            img.style.top = top + 'px';
            img.style.marginLeft = -this.width / 2 + 'px';
            img.classList.remove('transparent');
            img.onload = null;
        }
        img.style.cssText = 'max-height:' + $body.clientHeight + 'px;max-width:' + $body.clientWidth + 'px;';
        $layer.appendChild(img);
        $layer.style.display = 'block';
        setTimeout(function() {
            $layer.classList.remove('transparent');
        }, 0);

    };
    var $layer = document.createElement('div');
    $layer.className = 'img-full transparent';
    // $layer.innerHTML = '<img src="http://paulmason.name/media/demos/full-screen-background-image/background.jpg" />';
    $layer.addEventListener('click', function() {
        $layer.style.display = 'none';
        $layer.classList.add('transparent');
    }, false);
    var $body = document.body || document.getElementsByTagName('body')[0];
    $body.appendChild($layer);
    window.screenfull = sf;
}(window, document));

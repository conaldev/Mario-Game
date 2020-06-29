function Game(canvas, context) {
    var _map;
    var _player;
    var _keyStates = {};
    var _timer;
    var _images;

    var self = this;

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };
    this.init = function () {

        canvas.onkeydown = canvas_keyDown;
        canvas.onkeyup = canvas_keyUp;
        context.textAlign = "left";
        _map = new Map(canvas.width, canvas.height);

        this.newGame();
    };

    this.newGame = function () {
        _map.reset();
        _player = new Player(_map, 0, 100);
        draw();
        _timer = window.setInterval(update, 1000 / FPS);
    };

    function draw() {

        clear();
        _map.draw(context, _player);
        _player.draw(context);

    }
    function update() {
        _map.update();
        _player.handleInputs(_keyStates);
        let result = _player.update();
        if (result)
        {
            let text1, text2;

            if (result == 1) {
                text1 = "YOU LOSE !!! :(";
                text2 = "Enter to try again.";
            } else {
                    text1 = "Congratulation!!! YOU WON!!! :D";
                    _map.level = 0;
                    text2 = "Enter to try again.";
            }
            clearInterval(_timer);
            _timer = null;
            var top = canvas.height / 8;
            context.textAlign = "center";
            context.fillStyle = "black";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = "20px Time News Roman bold";
            context.fillStyle = "yellow";
            context.fillText(text1, canvas.width / 2, top * 2);
            context.fillText("Scores : " + _map.scores, canvas.width / 2, top * 3);
            context.fillText(text2, canvas.width / 2, top * 4);
            context.textAlign = "left";
            context.font = "14px Time News Roman bold";
            return;
        }
        draw();
    }

    function canvas_keyDown(e) {
        e.preventDefault();
        if (e.keyCode === 13) // Enter
        {
            if (!_timer) {
                self.newGame();
            }
        } else if (AVAILABLE_KEYS.indexOf(e.keyCode) != -1) {
            _keyStates[e.keyCode] = true;
        }

    }
    function canvas_keyUp(e) {
        e.preventDefault();
        if (_keyStates[e.keyCode]) {
            _keyStates[e.keyCode] = false;
        }
    }
}
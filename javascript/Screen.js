function Screen(canvas, isWelcomeScreen) {
    var timer;
    var width = canvas.width;
    var height = canvas.height;
    var context = canvas.getContext("2d");
    var mario;
    if (isWelcomeScreen) {
        mario = new AnimatedSprite({
            image: _images.mario,
            frameWidth: 29,
            frameHeight: 29,
            interval: 80,
            left: canvas.width / 2 - 10,
            top: 80,
            width: 20,
            height: 20
        });
        mario.addSprite({
            name: "run_right",
            startFrame: 8,
            framesCount: 3,
            marginBottom: 14,
            marginLeft: 8,
            marginRight: 10
        });
    }
    this.items = [];
    this.afterDraw = null;
    this.beforeDraw = null;

    this.update = function () {
        if (mario)
            mario.update();

        for (var i = 0; i < this.items.length; i++) {
            this.items[i].update();
        }
    };
    this.draw = function () {

        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);

        if (this.beforeDraw)
            this.beforeDraw(context);

        // draw title
        if (isWelcomeScreen) {
            context.font = "24px Times New Roman bold"
            context.fillStyle = "red";
            context.fillText("Marito", canvas.width / 2, 40);
            context.font = "17px Time News Roman bold";
            context.fillStyle = "yellow";
            context.fillText("Enjoy game :D", canvas.width / 2, canvas.height - 60);
            context.font = "10px Time News Roman bold";
            context.fillStyle = "white";
            context.fillText("minhconal", canvas.width / 2, canvas.height - 40);
        }
        if (mario)
            mario.draw(context);

        for (var i = 0; i < this.items.length; i++) {
            this.items[i].draw(context);
        }

        if (this.afterDraw)
            this.afterDraw(context);
    };
    this.start = function () {
        this.stop();
        var self = this;
        canvas.onclick = function (e) {
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            for (var i = 0; i < self.items.length; i++) {
                if (self.items[i].onclick && self.items[i].contain(x, y))
                    self.items[i].onclick(x, y);
            }
        };
        canvas.onmousemove = function (e) {
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            canvas.style.cursor = 'default';
            for (var i = 0; i < self.items.length; i++) {
                self.items[i].isMouseOver = self.items[i].contain(x, y);
                // change the cursor type to hand
                if (self.items[i].isMouseOver)
                    canvas.style.cursor = 'pointer';
            }
        };
        timer = setInterval(function () {
            self.update();
            self.draw();
        }, 1000 / FPS);
    };
    this.stop = function () {
        if (timer)
            clearInterval(timer);
        timer = null;
        canvas.style.cursor = 'default';
        canvas.onmousemove = null;
        canvas.onclick = null;
    };
    this.addItem = function (item) {
        this.items.push(item);
    };
}
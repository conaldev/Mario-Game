function Map(viewWidth, viewHeight) {


    this.width = COLS * CELL_SIZE;
    this.height = ROWS * CELL_SIZE;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;

    this.level = 0;
    var data;
    var enemiesQueue;

    this.scores = 0;

    var startingScores = 0;

    var BG_RATIO = _images.background.height / this.height;
    var BG_VIEW_WIDTH = viewWidth * BG_RATIO;
    var BG_VIEW_HEIGHT = viewHeight * BG_RATIO;


    var pipes = [];
    pipes.push({
        x: 600,
        y: this.height - CELL_SIZE - 100,
        width: 50,
        height: 100
    });
    pipes.push({
        x: 1200,
        y: this.height - CELL_SIZE - 100,
        width: 50,
        height: 100
    });

    var itemsSprite = new StaticSprite({
        image: _images.items,
        frameWidth: 29,
        frameHeight: 29
    });
    // add flower sprite
    itemsSprite.addSprite({
        name: "flower",
        frameIndex: 18,
        marginTop: 6,
        marginBottom: 12,
        marginLeft: 4,
        marginRight: 8

    });
    // add gold sprite
    itemsSprite.addSprite({
        name: "gold",
        frameIndex: 31,
        marginTop: 4,
        marginBottom: 10,
        marginLeft: 0,
        marginRight: 8

    });
    // add brick sprite
    itemsSprite.addSprite({
        name: "brick",
        frameIndex: 9,
        marginTop: 5,
        marginBottom: 14,
        marginLeft: 4,
        marginRight: 12
    });

    itemsSprite.addSprite({
        name: "wall",
        frameIndex: 10,
        marginTop: 5,
        marginBottom: 14,
        marginLeft: 5,
        marginRight: 12
    });
    itemsSprite.addSprite({
        name: "question",
        frameIndex: 0,
        marginTop: 6,
        marginBottom: 15,
        marginLeft: 5,
        marginRight: 14

    });
    itemsSprite.addSprite({
        name: "hard_brick",
        frameIndex: 2,
        marginTop: 6,
        marginBottom: 15,
        marginLeft: 5,
        marginRight: 13
    });


    if (this.width < this.viewWidth || this.height < this.viewHeight) {
        alert("Error: The viewport is larger than the map.");
        return;
    }
    this.deadzone = {
        left: this.viewWidth / 4,
        top: this.viewHeight / 4,
        right: this.viewWidth / 4 * 3,
        bottom: this.viewHeight / 4 * 3,
    };

    this.deadzone.width = this.deadzone.right - this.deadzone.left;
    this.deadzone.height = this.deadzone.bottom - this.deadzone.top;

    var buffer = document.createElement("canvas");
    buffer.width = this.width;
    buffer.height = this.height;
    var context = buffer.getContext("2d");
    this.reset = function () {

        this.scores = (this.level == 0) ? 0 : startingScores;

        var castlePos = {
            x: this.width - 300,
            y: this.height - _images.castle.height - CELL_SIZE
        };
        this.endPoint = {
            x: castlePos.x + _images.castle.width / 2,
            y: castlePos.y + _images.castle.height
        };


        this.mushrooms = [];

        this.monsters = [];
        this.plants = [];
        this.offsetX = 0;
        this.offsetY = 0;

        data = MAP[this.level].data.slice(0); // clone
        enemiesQueue = MAP[this.level].enemies.slice(0);
        context.clearRect(0, 0, buffer.width, buffer.height);

        for (var i = 0; i < COLS; i++) {
            for (var j = 0; j < ROWS; j++) {
                var val = data[i + j * COLS];
                if (val != 0) {
                    if (val == GOLD) {
                        itemsSprite.sprites.gold.draw(context, i * CELL_SIZE - HALF_SIZE / 2, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    } else if (val == MUSHROOM_BRICK || val == HARD_BRICK) {
                        data[i + j * COLS] = MUSHROOM_BRICK;
                        itemsSprite.sprites.question.draw(context, i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    } else if (val == PIPE && data[(i - 1) + j * COLS] != PIPE) {

                        if (data[i + (j - 1) * COLS] != PIPE) {
                            context.drawImage(_images.pipe_head, i * CELL_SIZE - 5, j * CELL_SIZE, CELL_SIZE * 2 + 10, CELL_SIZE);
                        } else
                            context.drawImage(_images.pipe_body, i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE * 2, CELL_SIZE);
                    } else {
                        if (val == LAND)
                            itemsSprite.sprites.wall.draw(context, i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                        else if (val == BRICK || val == FLOWER_BRICK)
                            itemsSprite.sprites.brick.draw(context, i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);


                    }
                }
            }
        }
        context.drawImage(_images.castle, castlePos.x, castlePos.y);
    };


    function clearCell(left, top, col, row) {
        data[col + row * COLS] = 0;
        context.save();
        context.globalCompositeOperation = "destination-out";
        context.fillStyle = "rgba(0,0,0,1)";
        context.fillRect(left, top, CELL_SIZE, CELL_SIZE);
        context.restore();
    }

    this.update = function () {
        var i = 0;
        var length = this.mushrooms.length;
        while (i < length) {
            if (this.mushrooms[i].isDead) {
                this.mushrooms.splice(i, 1);
                length--;
            } else {
                this.mushrooms[i].update();
                i++;
            }
        }

        i = 0;
        var length = this.monsters.length;
        while (i < length) {
            if (this.monsters[i].isDead) {
                this.monsters.splice(i, 1);
                length--;
            } else {
                this.monsters[i].update();
                i++;
            }
        }
        i = 0;
        var length = this.plants.length;
        while (i < length) {
            if (this.plants[i].isDead) {
                this.plants.splice(i, 1);
                length--;
            } else {
                this.plants[i].update();
                i++;
            }
        }
        var col = Math.floor((this.offsetX + this.viewWidth) / CELL_SIZE);
        if (enemiesQueue.length > 0 && enemiesQueue[0].col <= col) {
            var e = enemiesQueue.shift();
            this.monsters.push(new Monster(this, e.col * CELL_SIZE, e.row * CELL_SIZE));
        }

    };
    this.draw = function (ctx, obj) {

        var dx = obj.left - this.offsetX;
        var dy = obj.top - this.offsetY;

        if (dx < this.deadzone.left)
            this.offsetX = obj.left - this.deadzone.left;
        else if (dx + obj.width > this.deadzone.right)
            this.offsetX = obj.right - this.deadzone.right;

        if (dy < this.deadzone.top)
            this.offsetY = obj.top - this.deadzone.top;
        else if (dy + obj.height > this.deadzone.bottom)
            this.offsetY = obj.bottom - this.deadzone.bottom;

        if (this.offsetX < 0)
            this.offsetX = 0;
        else if (this.offsetX + this.viewWidth > buffer.width)
            this.offsetX = buffer.width - this.viewWidth;

        if (this.offsetY < 0)
            this.offsetY = 0;
        else if (this.offsetY + this.viewHeight > buffer.height)
            this.offsetY = buffer.height - this.viewHeight;
        var left = (this.offsetX * BG_RATIO) % _images.background.width;
        var top = this.offsetY * BG_RATIO;

        if (left + BG_VIEW_WIDTH > _images.background.width) {
            var bW = _images.background.width - left;
            var vW = bW / BG_RATIO;
            ctx.drawImage(_images.background, left, top, bW, BG_VIEW_HEIGHT,
                0, 0, vW, viewHeight);

            bW = BG_VIEW_WIDTH - bW;
            ctx.drawImage(_images.background, 0, top, bW, BG_VIEW_HEIGHT,
                vW - 1, 0, bW / BG_RATIO, viewHeight);
        } else
            ctx.drawImage(_images.background, left, top, BG_VIEW_WIDTH, BG_VIEW_HEIGHT, 0, 0, viewWidth, viewHeight);


        ctx.drawImage(buffer, this.offsetX, this.offsetY, this.viewWidth, this.viewHeight,
            0, 0, this.viewWidth, this.viewHeight);

        for (x in this.mushrooms) {
            this.mushrooms[x].draw(ctx);
        }
        for (x in this.monsters) {
            this.monsters[x].draw(ctx);
        }
        for (x in this.plants)
            this.plants[x].draw(ctx);

        ctx.fillStyle = "black";
        ctx.fillText("SCORES: " + this.scores, 10, 10);

    };

    this.collide = function (x, y, canDestroy, canEat) {
        var b = this.contain(x, y);

        if (b) {
            if (b.type == GOLD) {
                if (canEat) {
                    this.scores += 100;
                    clearCell(b.left, b.top, b.col, b.row);
                }
                return;
            } else if (b.type == FLOWER) {

                if (canEat) {

                    clearCell(b.left, b.top, b.col, b.row);
                    return true;
                }
                return;
            }

            if (canDestroy && b.type != HARD_BRICK) {
                if (b.type == BRICK) {
                    clearCell(b.left, b.top, b.col, b.row);
                } else if (b.type == MUSHROOM_BRICK) // add new mushroom
                {
                    data[b.col + b.row * COLS] = HARD_BRICK;

                    itemsSprite.sprites.hard_brick.draw(context, b.left, b.top, CELL_SIZE, CELL_SIZE);
                    this.mushrooms.push(new Mushroom(this, b.left, b.top - CELL_SIZE));
                } else if (b.type == FLOWER_BRICK) // show the hidden flower
                {

                    data[b.col + (b.row - 1) * COLS] = FLOWER;
                    itemsSprite.sprites.flower.draw(context, b.left, b.top - CELL_SIZE, CELL_SIZE, CELL_SIZE);

                    data[b.col + b.row * COLS] = HARD_BRICK;
                    itemsSprite.sprites.hard_brick.draw(context, b.left, b.top, CELL_SIZE, CELL_SIZE);
                }
            }
            return b;
        }
        return false;
    };
    this.contain = function (x, y) {
        var col = Math.floor(x / CELL_SIZE);
        var row = Math.floor(y / CELL_SIZE);
        var val = data[col + row * COLS];
        if (val > 0) {
            var b = {
                left: col * CELL_SIZE,
                top: row * CELL_SIZE,
                col: col,
                row: row,
                type: val,
            };
            b.right = b.left + CELL_SIZE;
            b.bottom = b.top + CELL_SIZE;

            return b;
        }
        return false;
    };

}
CanvasRenderingContext2D.prototype.drawEllipse = function (centerX, centerY, width, height) {
    this.beginPath();

    this.moveTo(centerX, centerY - height / 2);

    this.bezierCurveTo(
        centerX + width / 2, centerY - height / 2,
        centerX + width / 2, centerY + height / 2,
        centerX, centerY + height / 2);

    this.bezierCurveTo(
        centerX - width / 2, centerY + height / 2,
        centerX - width / 2, centerY - height / 2,
        centerX, centerY - height / 2);

    this.closePath();
    this.fill();

}


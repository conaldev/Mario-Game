var BULLETS_LIMIT = 3;
var SHOOT_DELAY = 500; // 2 shoots each second
function Player(map, left, top) {
    Character.call(this, map, {
        left: left,
        top: top,
        jumpPower: 9,
        canEat: true,
        canDestroyObstacles: true,
        canShoot: true,
        speed: 3,
        spriteData: {
            image: _images.mario,
            frameWidth: 29,
            frameHeight: 29,
            interval: 80
        }
    });
    this.isFalling = false;
    this.isChild = true;
    this.immuneCount = 0;
    this.canShoot = false;
    this.bullets = [];
    this.isFaceRight = true;

    this.lastShoot = 0;
    this.addSprite({
        name: "jump_left",
        startFrame: 1,
        framesCount: 1,
        marginTop: 0,
        marginBottom: 13,
        marginLeft: 0,
        marginRight: 10
    });
    this.addSprite({
        name: "jump_right",
        startFrame: 12,
        framesCount: 1,
        marginTop: 0,
        marginBottom: 13,
        marginLeft: 12,
        marginRight: 10
    });
    this.addSprite({
        name: "stand_left",
        startFrame: 6,
        framesCount: 1,
        marginBottom: 13,
        marginLeft: 6,
        marginRight: 14
    });
    this.addSprite({
        name: "stand_right",
        startFrame: 7,
        framesCount: 1,
        marginBottom: 13,
        marginLeft: 6,
        marginRight: 12
    });
    this.addSprite({
        name: "run_left",
        startFrame: 3,
        framesCount: 3,
        marginBottom: 13,
        marginLeft: 4,
        marginRight: 12
    });
    this.addSprite({
        name: "run_right",
        startFrame: 8,
        framesCount: 3,
        marginBottom: 14,
        marginLeft: 8,
        marginRight: 10
    });

    this.setSprite("run_right");
}

Player.prototype = new Character();
Player.prototype.shoot = function () {
    if (this.canShoot && this.bullets.length < BULLETS_LIMIT) {
        var time = (new Date()).getTime();
        var d = time - this.lastShoot;
        if (d > SHOOT_DELAY) {
            this.lastShoot = time;


            var left = this.isFaceRight ? this.right : this.left - 10;
            var b = new Bullet(this.map, left, this.top + this.height / 2);
            b.speedX = this.isFaceRight ? b.speed : -b.speed;
            this.bullets.push(b);
        }
    }
}
Player.prototype.die = function () {
    this.isFalling = true;
    this.top -= this.height;
    this.speedY = 0;
}
Player.prototype.grow = function () {

    if (this.isChild) // grow up
    {
        this.height *= 1.9;
        this.width *= 1.1;
    } else	// grow down
    {
        this.height /= 1.9;
        this.width /= 1.1;
        this.immuneCount = FPS;
        this.canShoot = false;
    }
    this.top = this.bottom - this.height;
    this.isChild = !this.isChild;
}
Player.prototype.draw = function (context) {

    AnimatedSprite.prototype.draw.call(this, context, this.map.offsetX, this.map.offsetY);
    for (var i = 0; i < this.bullets.length; i++)
        this.bullets[i].draw(context);
}

Player.prototype.update = function () {
    var p = this.map.endPoint;
    if (this.left <= p.x && this.top <= p.y && this.right >= p.x && this.bottom >= p.y) {
        // win
        return 2;
    }
    if (this.immuneCount > 0)
        this.immuneCount--;
    if (this.isFalling) // die
    {
        this.speedY += GRAVITY;
        this.top += this.speedY;
        return (this.top > this.map.height) ? 1 : 0;
    }
    var b = Character.prototype.update.call(this);
    if (b == true) // ate the flower
    {
        if (this.isChild)
            this.grow();
        this.canShoot = true;
    }
    this.collide();

    if (this.bullets.length > 0) {
        var i = 0;
        var length = this.bullets.length;
        while (i < length) {
            if (this.bullets[i].isDead || this.bullets[i].left < this.offsetX) {
                this.bullets.splice(i, 1);
                length--;
            } else {
                this.bullets[i].update();
                i++;
            }
        }
    }
}

Player.prototype.handleInputs = function (keyStates) {
    this.speedX = 0;
    if(keyStates[Keys.UP_ARROW])
    	this.speedY = -this.speed;
    else
    var isRunning = true;
    if (keyStates[Keys.DOWN_ARROW])
        this.speedY = this.speed;

    if (keyStates[Keys.LEFT_ARROW]) {
        this.speedX = -this.speed;
        this.isFaceRight = false;
    } else if (keyStates[Keys.RIGHT_ARROW]) {
        this.speedX = this.speed;
        this.isFaceRight = true;
    } else {
        isRunning = false;
    }

    if (keyStates[Keys.SPACE] && !this.isJumping) {
        this.jump();
    }

    if (keyStates[Keys.Z]) // shoot
    {
        this.shoot();
    }
    // set sprite
    if (this.isJumping)
        this.setSprite(this.isFaceRight ? "jump_right" : "jump_left");
    else if (isRunning)
        this.setSprite(this.isFaceRight ? "run_right" : "run_left");
    else
        this.setSprite(this.isFaceRight ? "stand_right" : "stand_left");

}
Player.prototype.collide = function () {
    for (m in this.map.monsters) {
        var mon = this.map.monsters[m];
        if (!mon)
            continue;
        if (!(this.left > mon.right ||
            this.right < mon.left ||
            this.top > mon.bottom ||
            this.bottom < mon.top)) {
            if (this.bottom < mon.bottom && this.speedY > 0) {
                mon.die();
            } else {

                if (this.isChild) {
                    if (this.immuneCount == 0) {
                        this.die();
                        break;
                    }
                } else
                    this.grow(); // grow down
            }
        }
    }

    for (m in this.map.plants) {
        var mon = this.map.plants[m];
        if (!mon || !mon.canDamage)
            continue;
        if (!(this.left > mon.right ||
            this.right < mon.left ||
            this.top > mon.bottom ||
            this.bottom < mon.top)) {
            if (this.isChild) {
                if (this.immuneCount == 0) {
                    this.die();
                    break;
                }
            } else
                this.grow(); // grow down
        }
    }

    for (var i = 0; i < this.map.mushrooms.length; i++) {
        var m = this.map.mushrooms[i];

        if (!(this.left > m.right ||
            this.right < m.left ||
            this.top > m.bottom ||
            this.bottom < m.top)) {

            if (this.isChild)
                this.grow();
            else
                this.map.scores += 1000;
            m.die();
        }

    }
}



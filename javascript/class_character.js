function Character(map, options) {

    if (!options)
        options = {};

    this.map = map;
    this.left = options.left || 0;
    this.top = options.top || 300;
    this.height = options.height || 20;
    this.width = options.width || 20;

    this.jumpPower = options.jumpPower || 4;
    this.speed = options.speed || 1;
    this.speedX = (Math.random() >= 0.5 ? this.speed : -this.speed);
    this.speedY = 0;

    this.canEat = options.canEat;
    this.canDestroyObstacles = options.canDestroyObstacles;
    this.isAutoMoving = options.isAutoMoving;
    this.canJump = options.canJump;
    this.dieOnCollide = options.dieOnCollide;
    this.isJumping = true;

    this.isDead = false;

    this.bottom = this.top + this.height;
    this.right = this.left + this.width;

    if (options.spriteData) {

        options.spriteData.left = this.left;
        options.spriteData.top = this.top;
        options.spriteData.width = this.width;
        options.spriteData.height = this.height;


        // Animated Sprite
        this.init(options.spriteData);
    }
}

Character.prototype = new AnimatedSprite();

Character.prototype.isOutsideMap = function () {
    return this.left < 0 || this.top < 0 || this.right > this.map.width || this.bottom > this.map.height;
}
Character.prototype.isOutsideView = function () {
    return this.left < this.map.offsetX || this.top < this.map.offsetY || this.right > this.map.offsetX + this.map.viewWidth || this.bottom > this.map.offsetY + this.map.viewHeight;
}
Character.prototype.jump = function () {
    this.speedY = -this.jumpPower;
    this.isJumping = true;
}
Character.prototype.die = function () {
    this.isDead = true;
}

Character.prototype.draw = function (context) {
    AnimatedSprite.prototype.draw.call(this, context, this.map.offsetX, this.map.offsetY);
}
Character.prototype.update = function () {

    if (this.isJumping)
        this.speedY += GRAVITY;
    else if (this.canJump && this.isAutoMoving)
        this.jump();

    var vtop = this.top + this.speedY;
    var vbottom = vtop + this.height;
    var vleft = this.left + this.speedX;
    var vright = vleft + this.width;

    if (this.isJumping)
        vbottom -= 1;

    var b;

    this.isJumping = true;

    if (vbottom >= this.map.height) // fall in a hole
    {
        this.die();
        return;
    }

    if (b = this.map.collide(this.left + 2, vbottom, false, this.canEat) || this.map.collide(this.right - 2, vbottom, false, this.canEat)) // bottom
    {
        if (b && b != true) {
            this.top = b.top - this.height;
            this.speedY = 0;
            this.isJumping = false;
        }
    } else if (this.speedY < 0) // top
    {
        b = this.map.collide(this.left + 2, vtop, this.canDestroyObstacles, this.canEat);
        var b1 = this.map.collide(this.right - 2, vtop, this.canDestroyObstacles, this.canEat);
        if (!b)
            b = b1;

        if (b && b != true) {
            if (this.dieOnCollide) {
                this.die();
                return;
            }
            if (this.canDestroyObstacles)
            {
                for (m in this.map.monsters) {
                    var mon = this.map.monsters[m];
                    if (!mon)
                        continue;
                    var cx = mon.left + mon.width / 2;
                    if (mon.bottom == b.top && cx >= b.left && cx <= b.right)
                        mon.die();
                }
                this.top = b.bottom;
                this.speedY = 0;
            }
        }
    }

    vtop = this.top + this.speedY;

    vbottom = vtop + this.height;

    if (b == true) // ate flower
        return b;

    b = null;
    if (this.speedX < 0 && this.left < 0 || (b = this.map.collide(vleft, vtop + 6, false, this.canEat) ||
        this.map.collide(vleft, vbottom - 4, false, this.canEat))) // left
    {
        if (b && b != true)
            this.left = b.right;
        this.speedX = this.isAutoMoving ? this.speed : 0;

    } else if (this.speedX > 0 && this.right >= this.map.width || (b = this.map.collide(vright, vtop + 6, false, this.canEat) ||
        this.map.collide(vright, vbottom - 4, false, this.canEat))) {
        if (b && b != true)
            this.left = b.left - this.width;
        this.speedX = this.isAutoMoving ? -this.speed : 0;
    }
    this.top = vtop;
    this.bottom = vbottom;
    this.left += this.speedX;
    this.right = this.left + this.width;

    if (b == true)
        return b;

    if (b && this.dieOnCollide) {
        this.die();
        return;
    }
    AnimatedSprite.prototype.update.call(this);
}

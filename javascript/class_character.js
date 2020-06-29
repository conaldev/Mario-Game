function Character(map, options) {
    if (!options)
        options = {};
    this.map = map;
    this.left = options.left || 0;
    this.top = options.top || 300;
    this.height = options.height || 20;
    this.width = options.width || 20;
    this.bottom = this.top + this.height;
    this.right = this.left + this.width;

    this.jumpPower = options.jumpPower || 4;
    this.speed = options.speed || 1;
    this.speedX = (Math.random() >= 0.5 ? this.speed : -this.speed);
    this.speedY = 0;

    this.isJumping = true;
    this.isDead = false;

    this.canDestroyObstacles = options.canDestroyObstacles;
    this.isAutoMoving = options.isAutoMoving;
    this.canJump = options.canJump;
    this.dieOnCollide = options.dieOnCollide;//va chạm
    this.canEat = options.canEat;


















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

    }
    Character.prototype.update = function () {

        if(this.isJumping)
            this.speedY += GRAVITY;
        else if (this.canJump && this.isAutoMoving)
            this.jump();

        let vtop = this.top + this.speedY;
        let vbottom = vtop + this.height;
        let vleft = this.left + this.speedX;
        let vright = vleft + this.width;

        if(this.isJumping)
            vbottom -= 1;

        let b;

        this.isJumping = true;
        if(vbottom >= this.map.height){//fall in a hole
            this.die();
            return
        }

        if(b = this.map.collide(this.left + 2, vbottom, false, this.canEat) || this.map.collide(this,right - 2,vbottom,false, this.canEat))
            if(b && b!=true) {
                this.top = b.top - this.height;
                this.speedY = 0;
                this.isJumping = false;
            } else if (this.speedY < 0) { //top
            b = this.map
        }

    }
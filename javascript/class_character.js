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


}
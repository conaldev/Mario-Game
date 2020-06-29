function Player(map, left, top) {
    Character.call(this, map, {
        left:left,
        top: top,
        jumpPower: 9,
        canEat: true,
        speed: 3,

    })
    Player.prototype = new Character();

    Player.prototype.die = function () {//jump == player's height then die :D
        this.isFalling = true;
        this.top -= this.height;
        this.speedY = 0;
    }
    Player.prototype.grow = function () {
        if(this.isChild) { //grow up :D
            this.height *= 1.9;
            this.width *= 1.1;
        }
        else {//grow down :D
            this.height /= 1.9;
            this.width /= 1.1;
            this.canShoot = false;

        }
    }

}
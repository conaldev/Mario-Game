function Bullet(map, left, top) {
    // call the super-constructor
    Character.call(this, map, {
        height: 10,
        width: 10,
        left: left,
        top: top,
        speed: 2,
        isAutoMoving: true,
        canJump: true,
        dieOnCollide: true
    });
    this.speedY = -this.speed;
}

Bullet.prototype = new Character();
Bullet.prototype.update = function () {
    Character.prototype.update.call(this);
    this.collide(this.map.monsters);
    if (this.isOutsideView()) {
        this.die();
    }
}
Bullet.prototype.draw = function (context) {

    context.save();
    context.beginPath();
    var left = this.left - this.map.offsetX;
    var top = this.top - this.map.offsetY;
    var right = left + this.width;
    var bottom = top + this.height;
    var hw = this.width / 2;
    var cx = left + hw;

    context.fillStyle = "black";
    context.arc(cx, top + hw, hw - 2, 0, Math.PI * 2, true);
    context.fill();

    context.stroke();
    context.restore();
}
Bullet.prototype.collide = function (monsters) {

    for (var i = 0; i < monsters.length; i++) {
        var m = monsters[i];

        if (!(this.left > m.right ||
            this.right < m.left ||
            this.top > m.bottom ||
            this.bottom < m.top)) {
            this.die();
            m.die();
            return;
        }

    }
}

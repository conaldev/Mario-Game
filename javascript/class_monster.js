//kế thừa class Character
function Monster(map, left, top) {
    //call this current object
    Character.call(this, map, {
        left: left,
        top: top,
        isAutoMoving: true,
        canJump: Math.random() >0.3,
        spriteData: {
            image: _images.enemies,
            frameWidth: 29,
            frameHeight: 29,
            interval: 200,
        }
    });
    if(this.canJump) {
        this.addSprite( {
            name: "naruto_left",
            startFrame: 3,
            framesCount: 4,
            marginTop: 4,
            marginBottom: 10,
            marginRight: 8
        });
        this.addSprite( {
            name: "naruto_right",
            startFrame: 7,
            framesCount: 4,
            marginTop: 4,
            marginBottom: 10,
            marginLeft: 6,
            marginRight: 8
        });
    } else
        this.addSprite({		// mushroom
            startFrame: 0,
            framesCount: 2,
            marginTop: 4,
            marginBottom: 13,
            marginRight: 10
        });
}

Monster.prototype = new Character();
Monster.prototype.update = function () {
    Character.prototype.update.call(this);

    if (this.canJump && this.speedX != 0)
        this.setSprite(this.speedX > 0 ? "naruto_right" : "naruto_left");

    this.collide(this.map.mushrooms);
}


Monster.prototype.collide = function (mushrooms) {

    for (var i = 0; i < mushrooms.length; i++) {
        var m = mushrooms[i];

        if (!(this.left > m.right ||
            this.right < m.left ||
            this.top > m.bottom ||
            this.bottom < m.top)) {
            if (this.width < 30) {
                this.top = this.bottom - this.height;
                this.width = 30;
                this.height = 30;

            }
            m.die();
        }
    }
}

function Mushroom(map, left, top) {

    Character.call(this, map, {
        left: left,
        top: top,
        speed: 1,
        isAutoMoving: true,
        spriteData: {
            image: _images.items,
            frameWidth: 29,
            frameHeight: 29,
            interval: 200
        }
    });
    this.addSprite({
        startFrame: 15,
        framesCount: 2,
        marginTop: 4,
        marginBottom: 13,
        marginLeft: 6,
        marginRight: 6
    });
}

Mushroom.prototype = new Character();

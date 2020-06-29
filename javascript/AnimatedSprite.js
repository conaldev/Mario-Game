function AnimatedSprite(data) {
    this.init(data);
    this.isFinished = false;
    this.currentSprite = null;
    this.currentFrame = 0;
    this.lastTick = 0;
}

AnimatedSprite.prototype = {
    start: function () {
        this.isFinished = false;
        this.currentFrame = 0;
    },
    init: function (data) {
        if (data) {

            this.isLooping = data.isLooping;
            if (typeof this.isLooping != "boolean")
                this.isLooping = true;

            this.image = data.image;
            this.frameWidth = data.frameWidth;
            this.frameHeight = data.frameHeight || this.frameWidth;
            this.framesPerRow = Math.floor(this.image.width / this.frameWidth),
                this.sprites = [];
            this.interval = data.interval;

            this.left = data.left;
            this.top = data.top;
            this.width = data.width || this.frameWidth;
            this.height = data.height || this.frameHeight;

            this.onCompleted = data.onCompleted;
        }

    },
    addSprite: function (data) {
        this.sprites[data.name] = {
            startFrame: data.startFrame || 0,
            framesCount: data.framesCount || 1,

            marginLeft: data.marginLeft || 0,
            marginTop: data.marginTop || 0,
            marginRight: data.marginRight || 0,
            marginBottom: data.marginBottom || 0
        };

        this.currentSprite = this.currentSprite || this.sprites[data.name];
    },
    setSprite: function (name) {
        if (this.currentSprite != this.sprites[name]) {
            this.currentSprite = this.sprites[name];
            this.currentFrame = 0;
        }
    },
    update: function () {
        if (this.isFinished)
            return;

        var newTick = (new Date()).getTime();

        if (newTick - this.lastTick >= this.interval) {
            this.currentFrame++;
            // reached the last frame
            if (this.currentFrame == this.currentSprite.framesCount) {
                if (this.isLooping)
                    this.currentFrame = 0;
                else {
                    this.isFinished = true;
                    if (this.onCompleted)
                        this.onCompleted();
                }
            }

            this.lastTick = newTick;
        }

    },

    draw: function (context, mapOffsetX, mapOffsetY) {

        if (!mapOffsetX)
            mapOffsetX = 0;
        if (!mapOffsetY)
            mapOffsetY = 0;

        if (this.isFinished)
            return;
        var realIndex = this.currentSprite.startFrame + this.currentFrame;
        var row = Math.floor(realIndex / this.framesPerRow);
        var col = realIndex % this.framesPerRow;

        var sx = col * this.frameWidth + this.currentSprite.marginLeft;
        var sy = row * this.frameHeight + this.currentSprite.marginTop;
        var sw = this.frameWidth - this.currentSprite.marginRight;
        var sh = this.frameHeight - this.currentSprite.marginBottom;

        context.drawImage(this.image, sx, sy, sw, sh, this.left - mapOffsetX, this.top - mapOffsetY, this.width, this.height);
    }
}
//kế thừa class Character
function Monster(map, left, top) {
    //call this current object
    Character.call(this, map, {
        left: left,
        top: top,
        width: 20,
        height: 20,
        speed: 1,
        isAutoMoving: true
    });
}

Monster.prototype = new Character();
Monster.prototype.draw = function (context) {
    context.save();
    context.beginPath();

    let left = this.left - this.map.offsetX;
    let top = this.top - this.map.offsetY;

    let right = left + this.width;
    let bottom = top + this.height;

    let hw = this.width / 2;   //y-coordinate
    let cx = left + hw;

    context.fillStyle = "violet";
    context.arc(cx, top + hw, hw - 2, 0, Math.PI * 2, true);
    context.fill();

    context.stroke();
    context.restore();

}
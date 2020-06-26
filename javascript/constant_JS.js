const FPS = 60;
const GRAVITY = 0.35;
const COLS = 100;
const ROWS = 25;
const CELL_SIZE = 25;
const HALF_SIZE = CELL_SIZE / 2;
const LAND = 1;
const BRICK = 2;
const HARD_BRICK = 3;
const MUSHROOM_BRICK = 4;
const FLOWER_BRICK = 5;
const FLOWER = 6;
const GOLD = 7;
const PIPE = 8;
const Keys = {
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
    SPACE: 32,
    Z: 90
};
const AVAILABLE_KEYS =
    [
        Keys.UP_ARROW,
        Keys.LEFT_ARROW,
        Keys.LEFT_ARROW,
        Keys.RIGHT_ARROW,
        Keys.SPACE,
        Keys.Z
    ];

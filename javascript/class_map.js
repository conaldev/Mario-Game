function Map(viewWidth, viewHeight) {

    this.width = COLS *CELL_SIZE;
    this.height = ROWS*CELL_SIZE;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;

    this.level = 0;
    this.scores = 0;
    let data;
    let enemiesQueue;

    let startingScores = 0;

    let BG_RATIO = _images.background.height / this.height;
    let BG_VIEW_WIDTH  = viewWidth * BG_RATIO;
    let BG_VIEW_HEIGHT = viewHeight *BG_RATIO;

    let pipes = [];
    pipes.push({
        x: 600,
        y: this.height - CELL_SIZE - 100,
        width: 50,
        height: 100
    });

}
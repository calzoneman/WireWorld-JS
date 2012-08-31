const CELL_NOTACELL = -1;
const CELL_EMPTY = 0;
const CELL_CONDUCTOR = 1;
const CELL_WIREHEAD = 2;
const CELL_WIRETAIL = 3;
const CELL_COLORS = ['#AAAAAA', '#DDDD00', '#FF0000', '#0000FF'];
const CELL_SIZE = 8;

function CellGrid(width, height) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
    for(var i = 0; i < width * height; i++) {
        this.cells[i] = CELL_EMPTY;
    }
}

CellGrid.prototype = {
    getCell: function(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return CELL_NOTACELL;
        }
        return this.cells[y * this.width + x];
    },

    setCell: function(x, y, type) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        this.cells[y * this.width + x] = type;
        return true;
    },

    getColor: function(x, y) {
        type = this.getCell(x, y)
        return type < 0 ? '#000000' : CELL_COLORS[type];
    },

    neighbors: function(x, y) {
        var n1 = this.getCell(x - 1, y);
        var n2 = this.getCell(x + 1, y);
        var n3 = this.getCell(x, y - 1);
        var n4 = this.getCell(x, y + 1);

        var n5 = this.getCell(x - 1, y - 1);
        var n6 = this.getCell(x + 1, y - 1);
        var n7 = this.getCell(x - 1, y + 1);
        var n8 = this.getCell(x + 1, y + 1);

        var n = [];
        if (n1 != CELL_NOTACELL)
            n.push(n1);
        if (n2 != CELL_NOTACELL)
            n.push(n2);
        if (n3 != CELL_NOTACELL)
            n.push(n3);
        if (n4 != CELL_NOTACELL)
            n.push(n4);
        if (n5 != CELL_NOTACELL)
            n.push(n5);
        if (n6 != CELL_NOTACELL)
            n.push(n6);
        if (n7 != CELL_NOTACELL)
            n.push(n7);
        if (n8 != CELL_NOTACELL)
            n.push(n8);
        return n;
    },

    draw: function(context) {
        for(var x = 0; x < this.width; x++) {
            for(var y = 0; y < this.height; y++) {
               context.fillStyle = this.getColor(x, y);
               context.fillRect(x * (CELL_SIZE + 1) + 1,
                                y * (CELL_SIZE + 1) + 1,
                                CELL_SIZE, CELL_SIZE);
            }
        }
    },

    runStep: function() {
        var nextFrame = new Array(this.cells.length);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var type = CELL_EMPTY;
                switch(this.getCell(x, y)) {
                    case CELL_EMPTY:
                        break;
                    case CELL_WIREHEAD:
                        type = CELL_WIRETAIL;
                        break;
                    case CELL_WIRETAIL:
                        type = CELL_CONDUCTOR;
                        break;
                    case CELL_CONDUCTOR:
                        var neighborList = this.neighbors(x, y);
                        var count = 0;
                        for (var i = 0; i < neighborList.length; i++) {
                            if (neighborList[i] == CELL_WIREHEAD)
                                count++;
                        }
                        if (count == 1 || count == 2)
                            type = CELL_WIREHEAD;
                        else
                            type = CELL_CONDUCTOR;
                        break;
                    default:
                        break;
                }
                nextFrame[y * this.width + x] = type;
            }
        }
        this.cells = nextFrame;
    },

    reset: function() {
        for(var i = 0; i < this.cells.length; i++) {
            this.cells[i] = CELL_EMPTY;
        }
    }

};

function Player(grid) {
    this.world = grid;
    this.cellType = CELL_CONDUCTOR;
}

Player.prototype = {
    isMouseDown: false,

    mousedown: function(event) {
        if (event.which != 1)
            return true;
        this.isMouseDown = true;

        var pos = relMouseCoords(event);
        var cellX = Math.floor(pos.x / (CELL_SIZE + 1));
        var cellY = Math.floor(pos.y / (CELL_SIZE + 1));
        this.world.setCell(cellX, cellY, this.cellType);
        if (event.preventDefault)
            event.preventDefault();
        else
            event.returnValue = false;
        return false;
    },

    mouseup: function(event) {
        if (event.which != 1)
            return true;
        this.isMouseDown = false;
        if (event.preventDefault)
            event.preventDefault();
        else
            event.returnValue = false;
        return false;
    },

    mousemove: function(event) {
        if (!this.isMouseDown)
            return true;
        var pos = relMouseCoords(event);
        var cellX = Math.floor(pos.x / (CELL_SIZE + 1));
        var cellY = Math.floor(pos.y / (CELL_SIZE + 1));
        this.world.setCell(cellX, cellY, this.cellType);
        if (event.preventDefault)
            event.preventDefault();
        else
            event.returnValue = false;
        return false;
    },

    keypress: function(event) {
        switch(event.which) {
            case 119: // W
                this.cellType = CELL_CONDUCTOR;
                break;
            case 113: // Q
                this.cellType = CELL_EMPTY;
                break;
            case 101: // E
                this.cellType = CELL_WIREHEAD;
                break;
            case 114: // R
                this.cellType = CELL_WIRETAIL;
            default:
                break;
        }
    }
};


// Relative mouse input from <http://stackoverflow.com/a/5932203>
function relMouseCoords(event){
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = $('#game')[0];
        do {
            totalOffsetX += currentElement.offsetLeft;
            totalOffsetY += currentElement.offsetTop;
        }
        while(currentElement = currentElement.offsetParent)

        canvasX = event.pageX - totalOffsetX;
        canvasY = event.pageY - totalOffsetY;
        return {x:canvasX, y:canvasY};
}


var $document = $(document);
var context = $('#game')[0].getContext('2d');
var width = 16;
var height = 16;
var grid = new CellGrid(width, height);
var player = new Player(grid);
$('#game')[0].width = width * (CELL_SIZE + 1) + 1;
$('#game')[0].height = height * (CELL_SIZE + 1) + 1;

// Event bindings
$('#game').mousedown(function(event) { return player.mousedown(event); });
$('#game').mouseup(function(event) { return player.mouseup(event); });
$('#game').mousemove(function(event) { return player.mousemove(event); });
$document.keypress(function(event) { player.keypress(event); });
$('#runStep').click(function() { grid.runStep(); });
$('#reset').click(function() { grid.reset(); });

// Rendering
setInterval(function() { grid.draw(context); }, 1000/10);

class SnakeTile {
    constructor(x,y) {
        this.height = Math.floor(400/size);
        this.width = Math.floor(400/size);
        this.snake = false;
        this.head = false;
        this.food = false;
        this.x = x;
        this.y = y;
        this.age = 0;
    }
}

document.getElementById("start-button").addEventListener("click", startGame)

var c = document.getElementById("gameCanvas"); var ctx = c.getContext("2d"); var tiles = []; var length; var end;
var newDirection = 1;
var direction = 1; //0 = up, 1 = right, 2 = down, 3 = left
var size = 10;


function startGame() {
    document.getElementById("start-button").setAttribute("class","btn btn-info d-none")
    tiles = [];
    newDirection = 1;
    direction = 1; //0 = up, 1 = right, 2 = down, 3 = left
    length = 1;
    end = false;
    instantiateTiles();
    if (size % 2 == 0) {
        tiles[(size**2-size)/2].snake = true;
        tiles[(size**2-size)/2].head = true;}
    else {
        tiles[Math.floor((size**2)/2)].snake = true;
        tiles[Math.floor((size**2)/2)].head = true;}
    genFood();
    drawCanvas();
    main();
}
function instantiateTiles() {
    for (let i = 0; i < size**2; i++) {
        let y = Math.floor(i/size)
        let x = i%size
        tiles.push(new SnakeTile(x,y))
    }
}
function drawCanvas() {  
    let relativeSize = Math.floor(400/size)
    for (let tile of tiles) {
        if (tile.head) {ctx.fillStyle = "#718f58";} 
        else if (tile.snake) {ctx.fillStyle = "#98bb7c";} 
        else if (tile.food) {ctx.fillStyle = "#E6A99F";} 
        else {ctx.fillStyle = "#808080";}
        ctx.fillRect(relativeSize*0.1 + tile.x*relativeSize, relativeSize*0.1 + tile.y*relativeSize, tile.width*0.9, tile.height*0.9)
    }
}
function main() {
    setTimeout( function onTick() {
        ageSnakeTile();
        direction = newDirection
        moveSnakeHead();
        if (end == true) return
        growSnake();
        document.getElementById("score").innerText = `Score: ${length}`
        newDirection = changeDirection();
        deleteSnakeTile(length);
        drawCanvas();
        main();
    }, 3000/size);

};
function moveSnakeHead() {
    for (let tile of tiles.filter(tile => tile.head == true)) {
        let tileCurrent = tile
        tile.head = false
        if (direction == 0) {
            if (tileCurrent.y == 0) {endGame(); return}
            if (tiles.filter(newTile => newTile.y == (tileCurrent.y - 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].snake == true) {endGame(); return}
            tiles.filter(newTile => newTile.y == (tileCurrent.y - 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].snake = true;
            tiles.filter(newTile => newTile.y == (tileCurrent.y - 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].head = true;
        }
        else if (direction == 1) {
            if (tileCurrent.x == (size - 1)) {endGame(); return}
            if (tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x + 1))[0].snake == true) {endGame(); return}
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x + 1))[0].snake = true;
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x + 1))[0].head = true;}
        else if (direction == 2) {
            if (tileCurrent.y == (size - 1)) {endGame(); return}
            if (tiles.filter(newTile => newTile.y == (tileCurrent.y + 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].snake == true) {endGame(); return}
            tiles.filter(newTile => newTile.y == (tileCurrent.y + 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].snake = true;
            tiles.filter(newTile => newTile.y == (tileCurrent.y + 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].head = true;}
        else {
            if (tileCurrent.x == 0) {endGame(); return}
            if (tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x - 1))[0].snake == true) {endGame(); return}
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x - 1))[0].snake = true;
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x - 1))[0].head = true;}
    }
};
function changeDirection() {  //0 = up, 1 = right, 2 = down, 3 = left
    document.onkeydown = function(event) {
        switch (event.key) {
            case "w":
                if (direction == 2) break;
                newDirection = 0;
            break;
            case "ArrowUp":
                if (direction == 2) break;
                newDirection = 0;
            break;
            case "d":
                if (direction == 3) break;
                newDirection = 1;
            break;
            case "ArrowRight":
                if (direction == 3) break;
                newDirection = 1;
            break;
            case "s":
                if (direction == 0) break;
                newDirection = 2;
            break;
            case "ArrowDown":
                if (direction == 0) break;
                newDirection = 2;
            break;
            case "a":
                if (direction == 1) break;
                newDirection = 3;
            break;
            case "ArrowLeft":
                if (direction == 1) break;
                newDirection = 3;
            break;
        }
    };
    return newDirection
};
function ageSnakeTile() {
    for (tile of tiles.filter(tile => tile.snake == true)) {
        ++tile.age
    };
};
function deleteSnakeTile(length) {
    for (tile of tiles.filter(tile => tile.snake == true)) {
        if ((length) == tile.age) {
            tile.age = 0;
            tile.snake = false;
        }
    }
}
function genFood() {
    if (tiles.filter(tile => tile.snake == false).length == 0) {gameWin()}
    tiles.filter(tile => tile.snake == false)[Math.floor(Math.random()*tiles.filter(tile => tile.snake == false).length)].food = true

}
function growSnake() {
    if (tiles.filter(tile => tile.head == true)[0].food == true) {
        tiles.filter(tile => tile.head == true)[0].food = false;
        ++length;
        genFood();
        drawCanvas();
        return true
    } else return false
}
endGame = () => {$('#exampleModal').modal("show"); alert(`you lose Your final length was: ${length}`); end = true}
gameWin = () => {alert("you win!!!"); end = true}

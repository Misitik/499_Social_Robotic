
let player = document.getElementById("buddha");



let posX = (window.innerWidth / 2 )
let posY = (window.innerHeight / 2 )
console.log(posX, posY)
player.style.left = `${posX}px`;
player.style.top = `${posY}px`;
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowUp":
            posY -= 10;
            break;
        case "ArrowDown":
            posY += 10;
            break;
        case "ArrowLeft":
            posX -=10;
            break;
        case "ArrowRight":
            posX += 10;
            break;
    }
    player.style.left = `${posX}px`;
    player.style.top = `${posY}px`;
});


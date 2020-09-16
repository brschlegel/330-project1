
"use strict";
const canvasWidth = 1000, canvasHeight = 800;
let ctx;
let ants = [];
let foods = [];
let pheremones = [];
let hill;


window.onload = init
function init() {
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    document.querySelector("#smellFactorSlider").onchange = function(){
        for(let i =0; i < ants.length; i++){
            ants[i].smellFactor = this.value;
            console.log(this.value);
        }
    }

    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    let f = new Food(200,200,10);
    let f1 = new Food(400,400,40);
  
    hill = new AntHill(600,600,10,.005);
    hill.SpawnAnt(ants);
    hill.SpawnAnt(ants);
    foods.push(f);
    foods.push(f1);
    
    loop();
}

function loop() {
    setTimeout(loop, 100);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    drawArray(foods, ctx);
    drawArray(ants, ctx);
    hill.draw(ctx);
    ants[0].update(foods,foods );
    ants[1].update(foods, foods);

}

function drawArray(arr, ctx){
    for(let i =0; i < arr.length; i++)
    {
        arr[i].draw(ctx);
    }
}



"use strict";
const canvasWidth = 1000, canvasHeight = 800;
let ctx;
let ants = [];
let foods = [];
let pheremones = [];
let hill;
let pheremoneDecay = .01;


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
  
    let f1 = new Food(400,400,40);
    let f2 = new Food(800,800, 40);
    let f = new Food(200,200,10);
    foods.push(new Food(400,300,20))
    foods.push(new Food(600,100,30))
    foods.push(new Food(700,50,40))
    foods.push(new Food(400,200,20))
    let f3 = new Food(800,700, 40);
    hill = new AntHill(600,600,10,.005);
    for(let i = 0; i < 100; i++)
    {
        hill.SpawnSearcher(ants);
    }
    for(let i = 0; i < 20; i++)
    {
        hill.SpawnHarvester(ants);
    }
    foods.push(f);
    foods.push(f1);
    foods.push(f2);
    foods.push(f3);
    
    loop();
}

function loop() {
    setTimeout(loop, 100);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    drawArray(foods, ctx);
    drawArray(ants, ctx);
    drawArray(pheremones, ctx);
    hill.draw(ctx);
    updateAnts();
    updatePheremones();
 
   
}

function drawArray(arr, ctx){
    for(let i =0; i < arr.length; i++)
    {
        arr[i].draw(ctx);
    }
}

function updateAnts(){
    for(let i =0; i < ants.length; i++)
    {
        ants[i].update(pheremones);
    }
}

function updatePheremones(){
    for(let i = 0; i < pheremones.length; i++){
        pheremones[i].update();
    }
}


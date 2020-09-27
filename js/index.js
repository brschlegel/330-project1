
"use strict";
const canvasWidth = 1000, canvasHeight = 800;
let ctx;
let ants = [];
let foods = [];
let pheremones = [];
let hills = [];
let pheremoneDecay = .1;
let harvesterBiasRatio = .01; 
let antHarvestTimer = 10;
let foodDecay = .1;
let hillDecay = .003;
let harvesterCost = .2;
let searcherCost = .5;
let harvesterReturnFood = .2;
const harvesterSize = 15;
const searcherSize = 10;
let harvesterSpeed = 4;
let searcherSpeed = 4;
let numHarvesterWave = 7;
let numSearcherWave = 10;
let harvesterDeathChance = .007;
let searcherDeathChance = .001;
let searcherSigma = .25;
let harvesterPStrength = 5;
let searcherPStrength = 50;


window.onload = init
function init() {
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    //#region eventSubscription
    document.querySelector("#smellFactorSlider").onchange = function(){
        harvesterBiasRatio = this.value;
    }

    document.querySelector("#HarvesterSpeedSlider").onchange = function(){
        harvesterSpeed  = this.value;
    }

    document.querySelector("#SearcherSigmaSlider").onchange = function(){
        searcherSigma = this.value;
    }

    document.querySelector("#SearcherSpeedSlider").onchange = function(){
        searcherSpeed = this.value;
    }

    document.querySelector("#HarvesterPStrengthSlider").onchange = function(){
        harvesterPStrength = this.value;
    }

    document.querySelector("#SearcherPStrengthSlider").onchange = function(){
        searcherPStrength = this.value;
    }

    //#endregion

    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
    let f1 = new Food(400,400,40);
    let f2 = new Food(800,800, 40);
    let f = new Food(200,200,10);
    foods.push(new Food(400,300,20))
    foods.push(new Food(600,100,30))
    foods.push(new Food(700,50,40))
    foods.push(new Food(400,200,20))
    let f3 = new Food(800,700, 40);
    hills.push( new AntHill(300,500,20,100));
    initHills();
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
    drawArray(hills, ctx);
    updateAnts();
    updatePheremones();
    updateHills();
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

function updateHills(){
    for(let i = 0; i < hills.length; i++){
        hills[i].update();
    }
}

function initHills(){
    for(let i = 0; i < hills.length; i++){
        hills[i].init();
    }
}





class Object{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.position = {x: this.x, y:this.y};
    }

    draw(ctx){
        console.log("this should be overwritten")
    }
   
}

const States = {
    Harvesting : 1,
    Resting : 2,
    Searching : 3,
    Returning : 4,
}

let antHarvestTimer = 10;

class Ant extends Object{
    constructor(x,y,size,speed, smellFactor,home){
        super(x,y);
        this.size = size;
        this.speed = speed;
        this.smellFactor = smellFactor;
        this.home = home;
     
        this.currentState = States.Searching;
        this.counter = 0;
    }

    

    draw(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
        ctx.closePath();
        ctx.fillStyle = "brown";
        ctx.fill();
        ctx.restore();
    }

    update(pointsOfInterest, foods){
        switch(this.currentState){
            case States.Searching:
                this.move(pointsOfInterest);
                this.checkFood(foods);
            break;
            case States.Resting:
                this.counter++;
                if(this.counter == 10){
                    this.counter = 0;
                    this.currentState = States.Searching;
                }
                break;
            case States.Returning:
                this.goHome();
                if(this.home.size > Math.sqrt(GetDistanceSquared({x:this.x, y:this.y}, {x:this.home.x, y:this.home.y}))){
                    this.currentState = States.Resting;
                }
                break;
            case States.Harvesting:
                this.counter++;
                if(this.counter == antHarvestTimer){
                    this.counter = 0;
                    this.currentState = States.Returning;
                }
                break;
        }
    }

    goHome(){
        let biasVector = {x: this.smellFactor * 2 * (this.home.x - this.x), y: this.smellFactor * 2* (this.home.y - this.y)};
        let vector = GetRandomUnitVector();
       
        let moveVector = {x: vector.x + biasVector.x, y: vector.y + biasVector.y}
        let mvMag = Math.sqrt(moveVector.x * moveVector.x + moveVector.y * moveVector.y)
        moveVector = {x: this.speed * (moveVector.x / mvMag), y: this.speed * (moveVector.y /mvMag)}
       
        this.x += moveVector.x;
        this.y += moveVector.y;
    }

    move(pointsOfInterest){
        if(pointsOfInterest.length == 0)
        {
            this.currentState = States.Returning;
            return;
        }

        let weights = [];
        let magnitude =0;
        for( let i = 0; i < pointsOfInterest.length; i ++){
            let d = GetDistanceSquared({x: this.x, y: this.y}, pointsOfInterest[i].position);
           
            weights.push(1/d);
            magnitude += (1/d) * (1/d);
        }
        magnitude = Math.sqrt(magnitude);
        //normalize the vector
        for(let i = 0; i < weights.length; i++){
            weights[i] /= magnitude;
        }
        let rand = Math.random();
        let index = 0;
        //get index of random vector
        for(let i = 0; i < weights.length; i++){
            if(rand <= weights[i]){
                index = i;
                break;
            }
        }
        let biasVector = {x: this.smellFactor * (pointsOfInterest[index].x - this.x), y: this.smellFactor * (pointsOfInterest[index].y- this.y)};
        let vector = GetRandomUnitVector();
       
        let moveVector = {x: vector.x + biasVector.x, y: vector.y + biasVector.y}
        let mvMag = Math.sqrt(moveVector.x * moveVector.x + moveVector.y * moveVector.y)
        moveVector = {x: this.speed * (moveVector.x / mvMag), y: this.speed * (moveVector.y /mvMag)}
       
        this.x += moveVector.x;
        this.y += moveVector.y;
    }

    checkFood(foods){
        for(let i = 0; i < foods.length; i++){
            if(foods[i].size > Math.sqrt(GetDistanceSquared({x:this.x, y:this.y}, {x:foods[i].x, y:foods[i].y}))){
                this.currentState = States.Harvesting;
                foods[i].Harvest();
            }
        }
    }

}

class Pheromone extends Object{
    constructor(x,y,strength){
        super(x,y);
        this.strength = strength;
    }

    draw(){
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = .2;
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.restore();
    }
}

class Food extends Object{
    constructor(x,y,size){
        super(x,y);
        this.size = size;
        this.opacity = 1;
        this.counter = 0;
    }

    draw(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.opacity;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath();
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.restore();
    }

    Harvest(){
        setTimeout(this.Harvest, 100);
        this.counter++;
        if(this.counter == antHarvestTimer){
            clearTimeout(Harvest);
            this.counter = 0;
        }
        this.opacity -= .1;
        if(this.opacity < .05){
            
            foods.splice(foods.indexOf(this),1);
            console.log("deleted");
            this.counter = 0;
        }
    }

}

class AntHill extends Object{
    constructor(x,y,size,smellFactor){
        super(x,y);
        this.size = size;
        this.speed = 4;
        this.smellFactor = smellFactor;
    }

    draw(ctx){
        ctx.save();
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 30,30);
        ctx.restore();
    }

    SpawnAnt(ants){
        ants.push(new Ant(this.x,this.y, this.size,this.speed, this.smellFactor,this));
    }
}

function GetRandomUnitVector(lowerThetaBound = 0, upperThetaBound = 2 * Math.PI)
{
    let theta = Math.random() * (upperThetaBound - lowerThetaBound) + lowerThetaBound;
    let x = Math.cos(theta);
    let y = Math.sin(theta);
    return{x : x, y : y};
}

function GetDistanceSquared(position1, position2){
    return (position1.x - position2.x)*(position1.x - position2.x) + (position1.y - position2.y)*(position1.y - position2.y);
}

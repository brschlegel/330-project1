
class Object {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.position = { x: this.x, y: this.y };
    }

    draw(ctx) {
        console.log("this should be overwritten");
        console.log("are abstract methods easy in Javascript?");
        console.log("Survey says no");
    }

}

const States = {
    Harvesting: 1,
    Resting: 2,
    Searching: 3,
    Returning: 4,
}



class Ant extends Object {
    constructor(x, y, size, speed, home) {
        super(x, y);
        this.size = size;
        this.speed = speed;
        this.home = home;
        this.currentState = States.Searching;
        this.counter = 0;
    }



    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    rest() {
        this.counter++;
        if (this.counter > 10) {
            this.counter = 0;
            this.currentState = States.Searching;
        }
    }

    goHome() {
        let biasVector = { x: harvesterBiasRatio * 2 * (this.home.center.x - this.x), y: harvesterBiasRatio * 2 * (this.home.center.y - this.y) };
        let vector = util.getRandomUnitVector();

        let moveVector = { x: vector.x + biasVector.x, y: vector.y + biasVector.y }
        let mvMag = Math.sqrt(moveVector.x * moveVector.x + moveVector.y * moveVector.y)
        moveVector = { x: this.speed * (moveVector.x / mvMag), y: this.speed * (moveVector.y / mvMag) }

        this.x += moveVector.x;
        this.y += moveVector.y;
    }



    checkFood() {
        for (let i = 0; i < foods.length; i++) {
            if (foods[i].size > Math.sqrt(util.getDistanceSquared({ x: this.x, y: this.y }, { x: foods[i].x, y: foods[i].y }))) {
                this.currentState = States.Harvesting;
                this.counter == 0;
                return foods[i];
            }
        }
    }

    dropPheremone(pstrength) {
        pheremones.push(new Pheromone(this.x, this.y, this.pstrength));
    }

 

}

class Searcher extends Ant {
    constructor(x, y, size, speed, home) {
        super(x, y, size, speed, home);
        this.previousTheta = Math.random() * 2 * Math.PI;
        this.color = "orange";

    }

    update(poi) {
        switch (this.currentState) {
            case States.Harvesting:
                this.dropPheremone(this.pstrength);
                this.currentState = States.Returning;
                this.checkDeath();
                break;
            case States.Returning:
                this.goHome();
                this.checkDeath();
                if (this.home.size/2 > Math.sqrt(util.getDistanceSquared({ x: this.x, y: this.y }, { x: this.home.center.x, y: this.home.center.y }))) {
                    this.currentState = States.Resting;
                    this.home.searcherReturning();
                }
                break;
            case States.Resting:
                this.rest();
                break;
            case States.Searching:
                this.move();
                this.checkDeath();
                break;

        }

    }



    move() {
        let theta = util.generateNormalNoise(searcherSigma, this.previousTheta);
        let move = { x: searcherSpeed * Math.cos(theta), y: searcherSpeed * Math.sin(theta) };
        this.x += move.x;
        this.y += move.y;
        this.checkFood();
        this.previousTheta = theta;

    }
    checkDeath(){
        if(Math.random() < searcherDeathChance){
            ants.splice(ants.indexOf(this), 1);
        }
    }

    dropPheremone(){
        pheremones.push(new Pheromone(this.x, this.y, searcherPStrength));
    }

}

class Harvester extends Ant {
    constructor(x, y, size, speed, home) {
        super(x, y, size, speed, home);
        this.color = "brown";
    }
    update(pointsOfInterest) {
        switch (this.currentState) {
            case States.Searching:
                this.move(pointsOfInterest);
                let f = this.checkFood(foods);
                if (f != null) {
                    f.Harvest();
                }
                this.checkDeath();
               
                break;
            case States.Resting:
                this.rest();
                break;
            case States.Returning:
                this.goHome();
                if (this.home.size > Math.sqrt(util.getDistanceSquared({ x: this.x, y: this.y }, { x: this.home.x, y: this.home.y }))) {
                    this.currentState = States.Resting;
                    this.home.harvesterReturning();
                }
                this.checkDeath();
                break;
            case States.Harvesting:
                this.counter++;
                if (this.counter > antHarvestTimer) {
                    this.counter = 0;
                    this.currentState = States.Returning;
                    this.dropPheremone();
                }
                break;
        }
    }

    move(pointsOfInterest) {
        let biasVector
        if (pointsOfInterest.length > 0) {
            let weights = [];
            let magnitude = 0;
            for (let i = 0; i < pointsOfInterest.length; i++) {
                let d = util.getDistanceSquared({ x: this.x, y: this.y }, pointsOfInterest[i].position);

                weights.push(pointsOfInterest[i].strength / d);
                magnitude += (1 / d) * (1 / d);
            }
            magnitude = Math.sqrt(magnitude);
            //normalize the vector
            for (let i = 0; i < weights.length; i++) {
                weights[i] /= magnitude;
            }
            let rand = Math.random();
            let index = 0;
            //get index of random vector
            for (let i = 0; i < weights.length; i++) {
                if (rand <= weights[i]) {
                    index = i;
                    break;
                }
            }
             biasVector = { x: harvesterBiasRatio * (pointsOfInterest[index].x - this.x), y: harvesterBiasRatio * (pointsOfInterest[index].y - this.y) };
        }
        else{
             biasVector = {x:0,y:0};
        }
        let vector = util.getRandomUnitVector();

        let moveVector = { x: vector.x + biasVector.x, y: vector.y + biasVector.y }
        let mvMag = Math.sqrt(moveVector.x * moveVector.x + moveVector.y * moveVector.y)
        moveVector = { x: harvesterSpeed * (moveVector.x / mvMag), y: harvesterSpeed * (moveVector.y / mvMag) }

        this.x += moveVector.x;
        this.y += moveVector.y;
    
        
    }

    draw(ctx) {
        super.draw(ctx);
        if (this.currentState == States.Returning) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x + 1, this.y - 1, 1, 0, Math.PI * 2)
            ctx.closePath();
            ctx.fillStyle = "green";
            ctx.fill();
            ctx.restore();

        }
    }

    checkDeath(){
        if(Math.random() < harvesterDeathChance){
            ants.splice(ants.indexOf(this), 1);
        }
    }

    
    dropPheremone(){
        pheremones.push(new Pheromone(this.x, this.y, harvesterPStrength));
    }

}

class Pheromone extends Object {
    constructor(x, y, strength) {
        super(x, y);
        this.strength = strength;
        this.totalStrength = strength;
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.strength/this.totalStrength;
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2)
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.strength -= pheremoneDecay;
       
        if(this.strength < .1){
            pheremones.splice(pheremones.indexOf(this), 1);
            
        }
    }
}

class Food extends Object {
    constructor(x, y, size) {
        super(x, y);
        this.size = size;
        this.opacity = 1;
        this.counter = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath();
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.restore();
    }

    Harvest() {
        setTimeout(this.Harvest, 100);
        this.counter++;
        if (this.counter == antHarvestTimer) {
            clearTimeout(this.Harvest);
            this.counter = 0;
        }
        this.size -= foodDecay;
        if (this.size < 5) {
            foods.splice(foods.indexOf(this), 1);
            console.log("deleted");
            this.counter = 0;
        }
    }

}

class AntHill extends Object {
    constructor(x, y, size) {
        super(x, y);
        this.size = size;
        this.center = {x: this.x - (this.size / 2), y: this.y - (this.size /2)}
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "red";
        ctx.fillRect(this.center.x, this.center.y,this.size, this.size);
        ctx.restore();

    }

    spawnHarvester() {
        for(let i =0; i < numHarvesterWave; i++){
            ants.push(new Harvester(this.center.x, this.center.y, harvesterSize, harvesterSpeed, this));
        }
       
    }

    spawnSearcher() {
        for(let i =0; i < numSearcherWave; i++){
            ants.push(new Searcher(this.center.x, this.center.y, searcherSize, searcherSpeed, this));
        }
        
    }

    harvesterReturning(){
        this.spawnHarvester();
        this.size += harvesterReturnFood;
    }

    //If a searcher returns this means they found some food
    searcherReturning(){
        this.spawnHarvester();
    }

    init(){
        setTimeout(this.init.bind(this),10000);
        this.spawnSearcher();
    }

    update(){
        this.size -= hillDecay * Math.sqrt(this.size);
        this.center = {x: this.x - (this.size / 2), y: this.y - (this.size /2)}
        if(this.size < 1){
            hills.splice(hills.indexOf(this), 1);
            delete(this);
        }
    }
}




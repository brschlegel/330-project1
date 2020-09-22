
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

let antHarvestTimer = 10;
let harvesterTimeBetweenPheremone = 10;

class Ant extends Object {
    constructor(x, y, size, speed, home, pstrength) {
        super(x, y);
        this.size = size;
        this.speed = speed;
        this.home = home;
        this.currentState = States.Searching;
        this.counter = 0;
        this.pstrength = pstrength;
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
        let biasVector = { x: this.smellFactor * 2 * (this.home.x - this.x), y: this.smellFactor * 2 * (this.home.y - this.y) };
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
        pheremones.push(new Pheromone(this.x, this.y, pstrength));
    }

}

class Searcher extends Ant {
    constructor(x, y, size, speed, home, pstrength, sigma) {
        super(x, y, size, speed, home, pstrength);
        this.previousTheta = Math.random() * 2 * Math.PI;
        this.sigma = sigma
        this.smellFactor = .4;
        this.color = "orange";
    }

    update(poi) {
        switch (this.currentState) {
            case States.Harvesting:
                this.dropPheremone(this.pstrength);
                this.currentState = States.Returning
                break;
            case States.Returning:
                this.goHome();
                break;
            case States.Resting:
                this.rest();
                break;
            case States.Searching:
                this.move();

        }

    }



    move() {
        let theta = util.generateNormalNoise(this.sigma, this.previousTheta);
        let move = { x: this.speed * Math.cos(theta), y: this.speed * Math.sin(theta) };
        this.x += move.x;
        this.y += move.y;
        this.checkFood();
        this.previousTheta = theta;

    }


}

class Harvester extends Ant {
    constructor(x, y, size, speed, home, pstrength, smellFactor) {
        super(x, y, size, speed, home, pstrength);
        this.smellFactor = smellFactor;
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
               
                break;
            case States.Resting:
                this.rest();
                break;
            case States.Returning:
                this.goHome();
                if (this.home.size > Math.sqrt(util.getDistanceSquared({ x: this.x, y: this.y }, { x: this.home.x, y: this.home.y }))) {
                    this.currentState = States.Resting;
                }
                this.counter++;
                if(this.counter % harvesterTimeBetweenPheremone == 0){
                    this.dropPheremone(this.pstrength/this.counter);
                }
                break;
            case States.Harvesting:
                this.counter++;
                if (this.counter > antHarvestTimer) {
                    this.counter = 0;
                    this.currentState = States.Returning;
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
             biasVector = { x: this.smellFactor * (pointsOfInterest[index].x - this.x), y: this.smellFactor * (pointsOfInterest[index].y - this.y) };
        }
        else{
             biasVector = {x:0,y:0};
        }
        let vector = util.getRandomUnitVector();

        let moveVector = { x: vector.x + biasVector.x, y: vector.y + biasVector.y }
        let mvMag = Math.sqrt(moveVector.x * moveVector.x + moveVector.y * moveVector.y)
        moveVector = { x: this.speed * (moveVector.x / mvMag), y: this.speed * (moveVector.y / mvMag) }

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
            clearTimeout(Harvest);
            this.counter = 0;
        }
        this.size -= .1;
        if (this.size < 5) {
            foods.splice(foods.indexOf(this), 1);
            console.log("deleted");
            this.counter = 0;
        }
    }

}

class AntHill extends Object {
    constructor(x, y, size, smellFactor) {
        super(x, y);
        this.size = size;
        this.speed = 4;
        this.smellFactor = smellFactor;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 30, 30);
        ctx.restore();

    }

    SpawnHarvester(ants) {
        ants.push(new Harvester(this.x, this.y, this.size + 2, this.speed, this, 5, this.smellFactor));
    }

    SpawnSearcher(ants) {
        ants.push(new Searcher(this.x, this.y, this.size, this.speed, this, 50, 1));
    }
}




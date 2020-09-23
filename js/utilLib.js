(function () {

    let util = {
        getRandomColor() {
            const getByte = _ => 55 + Math.round(Math.random() * 200);
            return `rgba(${getByte()},${getByte()},${getByte()}, .8)`;
        },

        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },


        dtr(degrees) {
            return degrees * (Math.PI / 180);
        },

        getRandomUnitVector(lowerThetaBound = 0, upperThetaBound = 2 * Math.PI) {
            let theta = Math.random() * (upperThetaBound - lowerThetaBound) + lowerThetaBound;
            let x = Math.cos(theta);
            let y = Math.sin(theta);
            return { x: x, y: y };
        },

        getDistanceSquared(position1, position2) {
            return (position1.x - position2.x) * (position1.x - position2.x) + (position1.y - position2.y) * (position1.y - position2.y);
        },
        //Box-Mueller transform
         generateNormalNoise(sigma, mu){
            let num1 = Math.random();
            let num2 = Math.random();
            let z = Math.sqrt(-2 * Math.log(num1)) * Math.cos(2*Math.PI * num2);
           
            return z * sigma + mu;
        }
        
        
    }


    if (window) {
        window["util"] = util
    }
    else {
        throw "window is not defined";
    }
})();

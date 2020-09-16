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
        }
    }


    if (window) {
        window["util"] = util
    }
    else {
        throw "window is not defined";
    }
})();

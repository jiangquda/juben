module.exports = {
 
    weightRandom(randomConfig) {
        var randomList = [];
        for (var i in randomConfig) {
            for (var j = 0; j < randomConfig[i].weight; j++) {
                randomList.push(randomConfig[i].id);
            }
        }
        var randomValue = randomList[Math.floor(Math.random() * randomList.length)];
        return randomValue ;
    },
    randomRange(min,max){
        return parseInt(Math.random()*[max + 1 - min]) + min
    },

    versionNumber(a) {
        var a = a.toString();
        var c = a.split(/\./);//或者： var c = a.split('.');
        var num_place = ["","0","00","000","0000"], r = num_place.reverse();
        for (var i = 0; i< c.length; i++){ 
            var len = c[i].length;       
            c[i] = r[len] + c[i];  
        } 
        var res = c.join(''); 
        return res; 
    }

}

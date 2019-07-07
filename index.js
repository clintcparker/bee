const fs = require("fs");
void (async()=>{
    console.log("it wokrs");
    var path = require('path')
    let gameLetters = ["gphfiro"];
    let centerLetter = "o";
    const gameRegex = new RegExp(`(^[${gameLetters.join("")}]{4,})([\r\n\s]+)*`,"gm");
    //let gameRegex = new RegExp(gameRegexPart,"gm");
    var allPossilbeArr = [];
    while ((m = gameRegex.exec(dictStr)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === gameRegex.lastIndex) {
            gameRegex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex == 1 && match){
                allPossilbeArr.push(match);
            }
            //console.log(`Found match, group ${groupIndex}: ${match}`);
        });
    }


    let centerLetterPattern =`${centerLetter}+`;
    let centerLetterRegex = new RegExp(centerLetter);
    var validminuscenter = allPossilbeArr.filter(x=>gameRegex.test(x))
    var valid = validminuscenter.filter(x=>centerLetterRegex.test(x));
    console.table(valid);
})()

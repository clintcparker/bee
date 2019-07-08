module.exports = function(){
    const fs = require("fs");
    // const dictFile = "test/testdict.txt"
    const dictFile = "dict.txt"
    const replace = require('replace-in-file');

    function removeWord(word){
        var regex = new RegExp(`^${word}$`,"gm")
        const options = {
            files: dictFile,
            from: regex,
            to: `--${word}`,
        };
        try {
            const results = replace.sync(options);
            if(results.hasChanged){
                console.log(`replaced: ${word}`)
            }
            //console.log('Replacement results:', results);
          }
          catch (error) {
            console.error('Error occurred:', error);
          }
    }
    
    function applyYesterday(letters, centerLetter, validWords){
        let foundwords = findWords(letters, centerLetter).map(x=>x.word)
        let invalidwords = foundwords.filter(x=>!validWords.includes(x))
        for (let invalidword of invalidwords){
            removeWord(invalidword);
        }
        let newFoundWords = findWords(letters,centerLetter);
        console.assert(newFoundWords.length == validWords.length, missingWords(validWords,newFoundWords.map(x=>x.word)));
    
        function missingWords(validWords, newFoundWords)
        {
            let missingValidWords = validWords.filter(x=>!newFoundWords.includes(x));
            let foundInvalidWords = newFoundWords.filter(x=>!validWords.includes(x))
            return `missingValidWords: ${missingValidWords.join( " ")}
            foundInvalidWords: ${foundInvalidWords.join(" ")}`;
        }
    }
    
    
    function findWords(gameLetters, centerLetter){
        let dictStr =  fs.readFileSync(dictFile,{encoding:"utf-8"});
        const gameRegex = new RegExp(`(^[${gameLetters}]+$)`,"gm");
        //let gameRegex = new RegExp(gameRegexPart,"gm");
        var allPossilbeArr = [];
        while ((m = gameRegex.exec(dictStr)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === gameRegex.lastIndex) {
                gameRegex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                if (groupIndex == 1 && match && match.includes(centerLetter)){
                    allPossilbeArr.push(match);
                }
                //console.log(`Found match, group ${groupIndex}: ${match}`);
            });
        }
    
    
        //let centerLetterPattern =`${centerLetter}+`;
        //let centerLetterRegex = new RegExp(centerLetter);
        //var validminuscenter = allPossilbeArr.filter(x=>gameRegex.test(x))
        var valid = allPossilbeArr.map(function(x){
            let pangram = false;
            let points = 0;
            if (x.length >= 7){
                pangram = true;
                for (let i in gameLetters){
                    let letter  = gameLetters[i];
                    if(!x.includes(letter)){
                        pangram = false;
                    }
                }
            }
            if (x.length == 4){
                points = 4;
            } else {
                points = x.length;
            }
            if(pangram){
                points+=7
            }
           return { word:x, points: points};
        });// validminuscenter.filter(x=>centerLetterRegex.test(x));
        valid.sort((a,b)=>b.points-a.points);
        return valid;
    }

    return {
        applyYesterday  :  applyYesterday,
        removeWord : removeWord,
        findWords : findWords
    }
}();


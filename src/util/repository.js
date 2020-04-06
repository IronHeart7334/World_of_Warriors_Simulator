import {notNull, TYPES, verifyType, verifyClass} from "./verifyType.js";
import {AbstractBaseClass} from "./baseClass.js";

/*
The Repository class is used to store
instances of classes inheriting from AbstractBaseClass
which have a limited range of options
(Element, SpecialMove, Stat, WarriorSkill),
essentially acting as a private constructor.
*/
class Repository{
    constructor(){
        this.keys = [];
        this.values = [];
        this.minLettersToCompare = 1;
    }

    set(key, value){
        verifyType(key, TYPES.string);
        //verifyClass(value, AbstractBaseClass);
        key = key.toLowerCase();
        this.keys.push(key);
        this.values.push(value);

        let index = this.keys.length - 1; //the index of the new key
        let temp;
        while(this.keys[index - 1] > this.keys[index] && index > 0){
            //swap keys...
            temp = this.keys[index];
            this.keys[index] = this.keys[index - 1];
            this.keys[index - 1] = temp;
            //...and values
            temp = this.values[index];
            this.values[index] = this.values[index - 1];
            this.values[index - 1] = temp;
            index--;
        }

        //figure out how many letters we need to compare at minimum
        /*
        The two closest matches to this new key are to
        its immediate left and right.
        Lets count how many of the letters we would have
        to see in order to tell the two words apart.
        */
        let leftMatches = (index >= 1) ? countMatchingLetters(this.keys[index - 1], key) + 1 : 0;
        let rightMatches = (index + 1 < this.keys.length) ? countMatchingLetters(this.keys[index + 1], key) + 1 : 0;

        this.minLettersToCompare = Math.max(this.minLettersToCompare, leftMatches, rightMatches);
    }

    contains(key){
        verifyType(key, TYPES.string);
        key = key.toLowerCase();
        let ret = false;
        let min = 0;
        let max = this.keys.length;
        let mid = parseInt((min + max) / 2);
        let curr;
        let possibleMatch;
        while(min > max && !ret){
            curr = this.keys[mid];
            possibleMatch = true;
            for(let i = 0; i < this.minLettersToCompare && possibleMatch; i++){
                possibleMatch = curr[i] === key[i];
            }
            if(possibleMatch){
                ret = true;
            } else {
                if(curr > key){
                    max = mid;
                } else {
                    min = mid;
                }
                mid = parseInt((min + max) / 2);
            }
        }
        return ret;
    }

    get(key){
        throw new Error("not implemented yet!");
    }

    /*
    Finds the index where
    the given key would be
    in the key array.
    If the key is already in
    the key array, this will
    return its index.
    If the key is not in the
    key array, this will return
    the index where it would be
    inserted into.
    */
    findIndex(key, entireKey=false){
        verifyType(key, TYPES.string);
        key = key.toLowerCase();
        let min = 0;
        let max = this.keys.length;
        let mid = parseInt((min + max) / 2);
        let compareTo;
        let found;
        while(min < max && !found){
            compareTo = this.keys[mid];
            if(compareTo === key){
                found = true;
            } else if(key < compareTo){
                max = mid;
                mid = parseInt((min + max) / 2);
            } else {
                min = mid + 1;
                mid = parseInt((min + max) / 2);
            }
        }
        return mid;
    }

    toString(){
        let ret = "REPOSITORY:"
        for(let i = 0; i < this.keys.length; i++){                                        //.toString()
            ret += `\n* ${this.keys[i].substring(0, this.minLettersToCompare)}: ${this.values[i]}`;
        }
        return ret;
    }
}

function countMatchingLetters(str1, str2){
    verifyType(str1, TYPES.string);
    verifyType(str2, TYPES.string);
    let matches = 0;
    let done = false;
    for(let i = 0; i < str1.length && i < str2.length && !done; i++){
        if(str1[i] === str2[i]){
            matches++;
        } else {
            done = true;
        }
    }
    return matches;
}

let repo = new Repository();
console.log(repo.toString());
repo.set("alpha", 1);
console.log(repo.toString());
repo.set("bravo", 2);
console.log(repo.toString());
repo.set("bacon", 3);
console.log(repo.toString());
repo.set("bacon's rebellion", 4);
console.log(repo.toString());
console.log(repo.findIndex("alpha"));
console.log(repo.findIndex("al capone"));
console.log(repo.findIndex("charlie"));

export {
    Repository
};

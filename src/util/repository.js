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

        let index = this.findIndex(key, true);
        if(this.keys[index] === key){
            this.values[index] = value;
            return;
        } //############################### RETURNS HERE IF KEY IS ALREADY IN THE KEY ARRAY

        //               start at index...
        this.keys.splice(index, 0, key);
        //                      delete 0 items...

        this.values.splice(index, 0, value);
        //                           and insert something there, shoving everything after it up one index

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

    containsKey(key){
        verifyType(key, TYPES.string);
        key = key.toLowerCase();
        let ret = false;
        let idx = this.findIndex(key, false);
        console.log(this.toString());
        console.log(key, idx);
        if(idx >= this.keys.length){
            ret = false;
            //key would be inserted at the end of the key array
        } else {
            let closest = this.keys[idx];
            if(true || key.substring(0, this.minLettersToCompare) === closest.substring(0, this.minLettersToCompare)){
                ret = true;
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

    If entireKey is set to true, searches for the entire key,
    otherwise, this checks for an approximate match, based on
    how many letters this needs to compare to quarantee two strings are different.
    For example, given a key set of: [a, ab, cde],
    it needs to compare 2 letters, because the first two keys share a first letter.
    calling findIndex("abc", false) would return 1 in this example, because the first 2 letters match,
    but findIndex("abc", true) would return 2, because that's where it belongs in the array.
    */
    findIndex(key, entireKey){
        verifyType(key, TYPES.string);
        verifyType(entireKey, TYPES.boolean);
        key = key.toLowerCase();
        if(!entireKey){
            key = key.substring(0, this.minLettersToCompare);
        }
        let min = 0;
        let max = this.keys.length;
        let mid = parseInt((min + max) / 2);
        let compareTo;
        let found;
        while(min < max && !found){
            compareTo = this.keys[mid];
            if(!entireKey){
                compareTo = compareTo.substring(0, this.minLettersToCompare);
            }
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
repo.set("bacon", 5);
console.log(repo.toString());
console.log(repo.containsKey("alpha"));
console.log(repo.containsKey("pneumonoultramicroscopicsilicovolcanoconiosis"));
console.log(repo.containsKey("alpha team"));
console.log(repo.containsKey("bacon's rebellion wasn't delicious"));

export {
    Repository
};

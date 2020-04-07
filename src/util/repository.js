import {notNull, TYPES, verifyType, verifyClass} from "./verifyType.js";
import {AbstractBaseClass} from "./baseClass.js";

/*
The Repository class is used to store
instances of classes inheriting from AbstractBaseClass
which have a limited range of options
(Element, SpecialMove, Stat, WarriorSkill),
essentially acting as a private constructor.

The Repository essentially acts as a map,
connecting string keys to AbstractBaseClass values.
The unique feature this class supports is
Partial Key Matching (PKM).

PKM:
    Given a list of string keys in alphabetical order,
    there exists a minimum number of characters, n, required
    to identify a single key in the list. This value, n, is
    stored in this class as this.minDiffChars.

    For example, given a list of keys:
        [a, ab, b]
    The value n would be 2, as keys share a common first letter,
    so it needs at least 2 characters to compare.

    Using PKM, the Repository will return the closest matching
    value when using the get(key) method.
    For example, given a list of keys:
        [air, earth, fire, water]
    get("a") === get("air"), as it needs only one character to
    verify that "a" is the start of one specific key.
    However, get("z") would throw an error, as no key starts with 'z'.
*/
class Repository{
    constructor(){
        this.keys = [];
        this.values = [];
        this.minDiffChars = 1;
    }

    /*
    Inserts the given key into the Repository,
    with the given value associated with it.
    The key must be a string, while the value
    must inherit from AbstractBaseClass.

    If the given key is already in the Repository,
    replaces the old value associated with the key
    with the value passed as a parameter.

    This method also updates the minimum number of
    characters needed to verify adjacent keys are
    different.
    */
    set(key, value){
        verifyType(key, TYPES.string);
        //verifyClass(value, AbstractBaseClass);
        key = key.toLowerCase();

        let index = this.findIndex(key, false);
        if(this.keys[index] === key){
            this.values[index] = value;
        } else {
            //               start at index...
            this.keys.splice(index, 0, key);
            //                      delete 0 items...

            this.values.splice(index, 0, value);
            //                           and insert something there, shoving everything after it up one index

            /*
            The two closest matches to this new key are to
            its immediate left and right.
            Lets count how many of the letters we would have
            to see in order to tell the two words apart.
            */
            let leftMatches = (index >= 1) ? countMatchingChars(this.keys[index - 1], key) + 1 : 0;
            let rightMatches = (index + 1 < this.keys.length) ? countMatchingChars(this.keys[index + 1], key) + 1 : 0;

            this.minDiffChars = Math.max(this.minDiffChars, leftMatches, rightMatches);
        }
    }

    /*
    Checks if PKM can find exactly
    one match for the given key.
    */
    containsPartialKey(key){
        verifyType(key, TYPES.string);
        key = key.toLowerCase();
        let ret = false;
        let idx = this.findIndex(key, true);
        if(idx >= this.keys.length){
            ret = false;
            //key would be inserted at the end of the key array
        } else {
            let closest = this.keys[idx];
            if(key.length < this.minDiffChars){
                /*
                Key is too short to match keys.
                Therefore, see how many keys it
                could potentially match.
                idx is the lowest index that could
                possibly match, so see if the next
                one matches as well.
                */
                if(idx + 1 >= this.keys.length){
                    //next index is out of bounds,
                    //so idx is the closest match.
                    ret = true;
                } else if(closest.substring(0, key.length) === this.keys[idx + 1].substring(0, key.length)){
                    // both (idx) and (idx + 1) match key, so cannot find a distinct match
                    ret = false;
                } else {
                    // can tell the difference between (idx) and (idx + 1), so idx matches
                    ret = true;
                }
            } else if(key.substring(0, this.minDiffChars) === closest.substring(0, this.minDiffChars)){
                ret = true;
            }
        }

        return ret;
    }

    get(key, copyOptions={}){
        verifyType(key, TYPES.string);
        verifyType(copyOptions, TYPES.object);
        key = key.toLowerCase();
        if(!this.containsPartialKey(key)){
            throw new Error(`No partial match for key \"${key}\". This contains the following options: \n ${this.toString()}`);
        }
        let idx = this.findIndex(key, true);
        return this.values[idx];//.copy(copyOptions);
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

    If usePKM is set to false, searches for the entire key,
    otherwise, it uses PKM to search.
    For example, given a key set of: [a, ab, cde],
    it needs to compare 2 letters, because the first two keys share a first letter.
    calling findIndex("abc", true) would return 1 in this example, because the first 2 letters match,
    but findIndex("abc", false) would return 2, because that's where it belongs in the array.
    */
    findIndex(key, usePKM){
        verifyType(key, TYPES.string);
        verifyType(usePKM, TYPES.boolean);
        key = key.toLowerCase();
        if(usePKM){
            key = key.substring(0, this.minDiffChars);
        }
        let min = 0;
        let max = this.keys.length;
        let mid = parseInt((min + max) / 2);
        let compareTo;
        let found;
        while(min < max && !found){
            compareTo = this.keys[mid];
            if(usePKM){
                compareTo = compareTo.substring(0, this.minDiffChars);
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
            ret += `\n* ${this.keys[i].substring(0, this.minDiffChars)}: ${this.values[i]}`;
        }
        return ret;
    }
}

/*
Counts how many characters the two strings
share, starting from the beginning of the
string, until it finds a character that differs.

For example,
    countMatchingChars("bacon", "background") === 3
    countMatchingChars("cattle", "battle") === 0
    countMatchingChars("p", "pneumonoultramicroscopicsilicovolcanoconiosis") === 1
*/
function countMatchingChars(str1, str2){
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
console.log(repo.get("a"));
console.log(repo.get("bacon's rebellion wasn't delicious"));
console.log(repo.get("bacon"));


export {
    Repository
};

import {notNull, TYPES, verifyType, inRange} from "./verifyType.js";

/*
The PartialMatchingMap class is used to store
instances of classes which have a limited
range of options
(Element, SpecialMove, Stat, WarriorSkill),
essentially acting as a private constructor.

The PartialMatchingMap acts as a map,
connecting string keys to values.
The unique feature this class supports is
Partial Key Matching (PKM), which "autocompletes"
keys that don't match one in the key set.

Using PKM, the PartialMatchingMap will return the
value associated with the closest matching key
if the key to match is the start of exactly one key
in the key set when using the getPartialMatch(key) method.
For example, given a list of keys:
    [air, earth, fire, water]
getPartialMatch("a") === getPartialMatch("air"), as it needs only one character to
verify that "a" is the start of one specific key.
However, getPartialMatch("z") would throw an error, as no key starts with 'z'.
*/
class PartialMatchingMap{
    constructor(){
        this.keys = [];
        this.values = [];
    }

    /*
    Inserts the given key into the PartialMatchingMap,
    with the given value associated with it.
    The key must be a string, while the value
    can be anything.

    If the given key is already in the PartialMatchingMap,
    replaces the old value associated with the key
    with the value passed as a parameter.
    */
    set(key, value){
        verifyType(key, TYPES.string);
        notNull(value);
        key = key.toLowerCase().trim();

        let index = this.findIndex(key, false);
        if(this.keys[index] === key){
            this.values[index] = value;
        } else {
            //               start at index...
            this.keys.splice(index, 0, key);
            //                      delete 0 items...

            this.values.splice(index, 0, value);
            //                           and insert something there, shoving everything after it up one index
        }
    }

    /*
    Checks if PKM can find exactly
    one match for the given key.
    */
    containsPartialKey(key){
        verifyType(key, TYPES.string);
        key = key.toLowerCase().trim();
        let ret = false;
        let idx = this.findIndex(key, true);
        if(idx >= this.keys.length){
            ret = false;
            //key would be inserted at the end of the key array
        } else {
            ret = this.isPartialMatch(key, idx);
        }

        return ret;
    }

    /*
    Checks to see if the given
    key is a partial match for
    the key at the given index
    in this' key set.

    A key is considered a partial
    match iff:
    (*) it matches a key in the key set exactly
    (*) the key to match is contained in the start of the key to match against
        "bacon" may be a partial match for "bacon's rebellion",
        but "bacon" is not a partial match for "I want bacon"
    (*) the key to match does not have an "ambiguous match", where it can match two keys in the key set
        For example, given key set ["apple", "application"],
        "appl" has two potential matches, so it is ambiguous.
        "appli" partially matches "application"
    */
    isPartialMatch(key, index){
        verifyType(key, TYPES.string);
        inRange(0, index, this.keys.length - 1);
        key = key.toLowerCase().trim();
        let ret = false;
        let closest = this.keys[index];

        if(closest === key){
            ret = true;
        } else if(closest.substring(0, key.length) !== key){
            ret = false;
        } else if(index + 1 >= this.keys.length){
            //next index is out of bounds,
            //so index is the closest match.
            ret = true;
        } else if(closest.substring(0, key.length) === this.keys[index + 1].substring(0, key.length)){
            /*
            Since the keys are in order, the next closest match to key is located immediately to its right.
            */
            ret = false;
        } else {
            ret = true;
        }

        return ret;
    }

    /*
    Finds a partial match for
    the given key, and returns
    the associated value.
    */
    getPartialMatch(key){
        verifyType(key, TYPES.string);
        key = key.toLowerCase().trim();
        if(!this.containsPartialKey(key)){
            throw new Error(`No partial match for key \"${key}\". This contains the following options: \n ${this.toString()}`);
        }
        let idx = this.findIndex(key, true);
        return this.values[idx];
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
    calling findIndex("abc", true) would return 1 in this example, because the first 2 letters match,
    but findIndex("abc", false) would return 2, because that's where it belongs in the array.
    */
    findIndex(key, usePKM){
        verifyType(key, TYPES.string);
        verifyType(usePKM, TYPES.boolean);
        key = key.toLowerCase().trim();
        let min = 0;
        let max = this.keys.length;
        let mid = parseInt((min + max) / 2);
        let compareTo;
        let found;
        while(min < max && !found){
            compareTo = this.keys[mid];
            if(usePKM && this.isPartialMatch(key, mid)){
                found = true;
            } else if(compareTo === key){
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
        let ret = "PARTIAL MATCHING MAP:"
        for(let i = 0; i < this.keys.length; i++){
            ret += `\n* ${this.keys[i]}: ${this.values[i]}`;
        }
        return ret;
    }
}

/*
Runs an interactive test of the
PartialMatchingMap
*/
function testPartialMatchingMap(){
    let map = new PartialMatchingMap();
    let ip = null;
    let key = null;
    let value = null;
    while(ip !== -1){
        try{
            ip = prompt(
                "Choose an option:\n"
                + "0: Print the PartialMatchingMap\n"
                + "1: Insert into the map\n"
                + "2: Check if there is a partial match for a key\n"
                + "3: Get the value associated with a key\n"
                + "4: Find the index for a key\n"
                + "-1: Quit"
            );
            if(!isNaN(ip)){
                ip = parseInt(ip, 10);
                switch(ip){
                    case 0:
                        alert(map.toString());
                        break;
                    case 1:
                        key = prompt("Enter key:");
                        value = prompt("Enter value:");
                        map.set(key, value);
                        break;
                    case 2:
                        key = prompt("Enter key:");
                        if(map.containsPartialKey(key)){
                            alert("does contain match for key " + key);
                        } else {
                            alert("no matching key found for " + key);
                        }
                        break;
                    case 3:
                        key = prompt("Enter key:");
                        value = map.getPartialMatch(key);
                        alert("Value is " + value.toString());
                        break;
                    case 4:
                        key = prompt("Enter key:");
                        alert(`Indexes for ${key}:\n(*) With PKM: ${map.findIndex(key, true)}\n(*) Without: ${map.findIndex(key, false)}`);
                        break;
                    case -1:
                        alert("Goodbye");
                        break;
                }
            }
        } catch(e){
            alert(e.message);
            alert(e.stack);
        }
    }
}

export {
    PartialMatchingMap,
    testPartialMatchingMap
};

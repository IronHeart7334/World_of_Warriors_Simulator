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
        this.minLettersToCompare = 0;
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

        //TODO: figure out how many letters we need to compare at minimum
        this.minLettersToCompare = 1;
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

    }

    toString(){
        let ret = "REPOSITORY:"
        for(let i = 0; i < this.keys.length; i++){                                        //.toString()
            ret += `\n* ${this.keys[i].substring(0, this.minLettersToCompare + 1)}: ${this.values[i]}`;
        }
        return ret;
    }
}

let repo = new Repository();
repo.set("b", 1);
repo.set("bb", 2);
repo.set("a", 3);
repo.set("ab", 4);
console.log(repo.toString());

export {
    Repository
};

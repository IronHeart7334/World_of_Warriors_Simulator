import {Team} from     "../warrior/team.js";
import {Warrior} from  "../warrior/warrior.js";

let nextId = 0;
export const NEWLINE = /\r?\n|\r/;

class User{
    constructor(userName="User", warriors=[], teams=[]){
        this.name = userName;
        this.warriors = new Map();
        warriors.forEach((warrior)=>{
            this.addWarrior(warrior.copy());
        });
        this.teams = teams;
        this.id = nextId;
        nextId++;
    }

    addWarrior(warrior){
        this.warriors.set(warrior.name, warrior);
    }

    getWarrior(warriorName){
        if(!this.warriors.has(warriorName)){
            throw new Error(`Warrior not found with name '${warriorName}'`);
        }
        return this.warriors.get(warriorName);
    }
}

const DEFAULT_USER = new User(
    "User",
    [],
    [
        /*
        new Team("Starter Team", [
            new Warrior("Abu"),
            new Warrior("Toki"),
            new Warrior("Zenghis")
        ]),
        new Team("Arena Favorites", [
            new Warrior("Ironhart"),
            new Warrior("Erika"),
            new Warrior("Boris")
        ]),
        new Team("Boost", [
            new Warrior("Kwan"),
            new Warrior("Joan"),
            new Warrior("Aka")
        ]),
        new Team("Poison", [
            new Warrior("Ram"),
            new Warrior("Luuser Tarhu"),
            new Warrior("Gunnar")
        ]),
        new Team("Heal", [
            new Warrior("Brutus"),
            new Warrior("Clovis"),
            new Warrior("Blaine")
        ])
        */
    ]
);

export {
    User,
    DEFAULT_USER
};

import {warriors} from "../warrior/realWarriors.js";
import {Team} from     "../warrior/team.js";
import {Warrior} from  "../warrior/warrior.js";
//not fully implemented yet

let nextId = 0;
class User{
    constructor(userName="User", warriors=[], teams=[]){
        this.name = userName;
        this.warriors = warriors;
        this.teams = teams;
        this.id = nextId;
        nextId++;
    }
}

const DEFAULT_USER = new User(
    "User",
    warriors,
    [
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
    ]
);

export {
    User,
    DEFAULT_USER
};
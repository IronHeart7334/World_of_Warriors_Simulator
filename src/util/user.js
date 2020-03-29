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
        this.teams = new Map();
        teams.forEach((team)=>{
            this.addTeam(team.copy());
        });
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

    /*
    Returns an array of all of this User's Warriors
    */
    getAllWarriors(){
        return Array.from(this.warriors.values());
    }

    addTeam(team){
        this.teams.set(team.name, team);
    }

    getTeam(teamName){
        if(!this.teams.has(teamName)){
            throw new Error(`Team not found with name '${teamName}'`);
        }
        return this.teams.get(teamName);
    }

    getAllTeams(){
        return Array.from(this.teams.values());
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

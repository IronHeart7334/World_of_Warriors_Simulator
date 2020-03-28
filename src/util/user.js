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
    }

    async loadModules(){
        let response = await fetch("./data/installedModules.txt").then((response)=>response.text());
        //console.log(response);
        response.split(NEWLINE).forEach(async (line)=>{
            if(line[0] !== "#" && line.trim().length > 0){
                await (this.loadWarriorModule(line));
            }
        });
    }

    async loadWarriorModule(name){
        let response = await fetch(`./data/${name}`).then((response)=>response.text());
        //todo more complex modules, installedModules says what type it is (warriors, teams, other)
        //console.log(response);
        let lines = response
            .split(NEWLINE)
            .map(
                (line)=>line.split(",").map((cell)=>cell.trim())
            );
        let nameCol;
        let offCol;
        let ratioCol;
        let armorCol;
        let hpCol;
        let pipCol;
        let eleCol;
        let specCol;
        let lsAmountCol;
        let lsTypeCol;

        //console.log(lines);
        let currHeader;
        for(let i = 0; i < lines[0].length; i++){
            currHeader = lines[0][i].toUpperCase();
            if(currHeader.includes("NAME")){
                nameCol = i;
            } else if(currHeader.includes("OFF") || currHeader.includes("ATT")){
                offCol = i;
            } else if(currHeader.includes("RAT")){
                ratioCol = i;
            } else if(currHeader.includes("ARM")){
                armorCol = i;
            } else if(currHeader.includes("HP") || currHeader.includes("HIT")){
                hpCol = i;
            } else if(currHeader.includes("PIP")){
                pipCol = i;
            } else if(currHeader.includes("ELE")){
                eleCol = i;
            } else if(currHeader.includes("SPEC")){
                specCol = i;
            } else if(currHeader.includes("AMOUNT")){
                lsAmountCol = i;
            } else if(currHeader.includes("LS") || currHeader.includes("TYPE")){
                lsTypeCol = i;
            } else {
                console.error("Invalid column header: " + currHeader);
            }
        }

        let newWarrior;
        for(let i = 1; i < lines.length; i++){
            //oh wait, still need warrior constructor
        }
    }
}

const DEFAULT_USER = new User(
    "User",
    [],
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

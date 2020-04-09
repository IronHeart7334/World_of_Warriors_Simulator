import {Warrior} from "../warrior/Warrior.js";

const DATA_PATH_BASE = "./data";
const WARRIOR_FILE_LIST_PATH = DATA_PATH_BASE + "/installedWarriorFiles.txt";
const TEAM_FILE_LIST_PATH = DATA_PATH_BASE + "/installedTeamFiles.txt";
const NEWLINE = /\r?\n|\r/;

async function fetchFileList(path){
    let req = await fetch(path);
    let text = await req.text();
    let fileList = [];
    text.split(NEWLINE).forEach((line)=>{
        if(line.trim().length > 0 && line[0] !== "#"){
            fileList.push(line.trim());
        }
    });
    return fileList;
}
async function getWarriorFileList(){
    return fetchFileList(WARRIOR_FILE_LIST_PATH);
}
async function getTeamFileList(){
    return fetchFileList(TEAM_FILE_LIST_PATH);
}

//these next two contain shared functionality, so I will want to pull some of them out into another function later
async function loadWarriorFile(fileName, intoUser){
    let req = await fetch(DATA_PATH_BASE + "/" + fileName);
    let text = await req.text();

    //this is the format warriors are stored in in defaultWarriors.csv
    //wowdata.csv doesn't contain their element, so it's pretty useless
    let columns = [
        "name",
        "offense",
       	"ratio",
        "armor",
        "hp",
        "pip",
        "element",
        "special",
        "lsamount",
       	"lsstat"
    ];

    let colToIdx = new Map();
    let rows = text.split(NEWLINE);
    let headers = rows.shift().split(",").map((cell)=>cell.trim().toUpperCase()); // returns rows[0] and pops it from rows
    for(let i = 0; i < headers.length; i++){
        for(let j = 0; j < columns.length; j++){
            if(headers[i] === columns[j].toUpperCase()){
                colToIdx.set(columns[j], i);
            }
        }
    }

    /*
    TODO: change this to have better error messages. Maybe move the various
    checks from Warrior?
    */
    rows.filter((row)=>row.trim() !== "" && row[0] !== "#").forEach((row)=>{
        try{
            let split = row.split(",").map((cell)=>cell.trim());
            let newWarrior = new Warrior(
                split[colToIdx.get("name")],
                split[colToIdx.get("element")],
                parseFloat(split[colToIdx.get("offense")]),
                parseFloat(split[colToIdx.get("ratio")]),
                parseInt(split[colToIdx.get("armor")]),
                parseFloat(split[colToIdx.get("hp")]),
                parseInt(split[colToIdx.get("lsamount")]),
                split[colToIdx.get("lsstat")],
                split[colToIdx.get("special")],
                parseInt(split[colToIdx.get("pip")]),
                [] //todo: add warrior skills?
            );
            intoUser.addWarrior(newWarrior);
        } catch(e){
            console.error("Encountered the following error while attempting to read warrior file " + fileName);
            console.error(e);
            console.error(e.stack);
            console.error("Caused by line: " + row);
        }
    });
}
async function loadTeamFile(fileName, intoUser){
    let req = await fetch(DATA_PATH_BASE + "/" + fileName);
    let text = await req.text();

    let columns = [
        "team name",
        "warrior 1 name",
        "warrior 2 name",
        "warrior 3 name"
    ];

    let colToIdx = new Map();
    let rows = text.split(NEWLINE);
    let headers = rows.shift().split(",").map((cell)=>cell.trim().toUpperCase()); // returns rows[0] and pops it from rows
    for(let i = 0; i < headers.length; i++){
        for(let j = 0; j < columns.length; j++){
            if(headers[i] === columns[j].toUpperCase()){
                colToIdx.set(columns[j], i);
            }
        }
    }

    rows.filter((row)=>row.trim() !== "" && row[0] !== "#").forEach((row)=>{
        try{
            let split = row.split(",").map((cell)=>cell.trim());
            let warriorNames = [];
            let warriorName;
            for(let i = 1; i <= 3; i++){
                warriorName = split[colToIdx.get(`warrior ${i} name`)];
                if(warriorName === ""){
                    //team has less than 3 warriors
                } else {
                    warriorNames.push(warriorName)
                }
            }        
            intoUser.createTeam(split[colToIdx.get("team name")], warriorNames);
        } catch(e){
            console.error("Encountered the following error while attempting to read team file " + fileName);
            console.error(e);
            console.error(e.stack);
            console.error("Caused by line: " + row);
        }
    });
}

async function loadAllDataInto(intoUser){
    let warriorList = await getWarriorFileList();
    let teamList = await getTeamFileList();

    let allWarriorPromises = warriorList.map((fileName)=>{
        return loadWarriorFile(fileName, intoUser);
    });
    await Promise.all(allWarriorPromises);

    //need to wait until after loading Warriors into the User to load teams
    let allTeamPromises = teamList.map((fileName)=>{
        return loadTeamFile(fileName, intoUser);
    });
    await Promise.all(allTeamPromises);
}

export {
    loadAllDataInto
};

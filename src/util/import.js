import {Warrior} from "../warrior/Warrior.js";

const MODULE_PATH_BASE = "./data";
const MODULE_LIST_PATH = MODULE_PATH_BASE + "/installedModules.txt";
const NEWLINE = /\r?\n|\r/;

//next, work on explicitly defining the standards for WoW modules.

async function getModuleList(){
    let req = await fetch(MODULE_LIST_PATH);
    let text = await req.text();
    let moduleList = [];
    text.split(NEWLINE).forEach((line)=>{
        if(line.trim().length > 0 && line[0] !== "#"){
            moduleList.push(line.trim());
        }
    });
    return moduleList;
}

async function loadModule(moduleName, intoUser){
    let req = await fetch(MODULE_PATH_BASE + "/" + moduleName);
    let text = await req.text();

    //this is the format warriors are stored in in defaultWarriors.csv
    //oh wait, wowdata.csv doesn't contain their element, so it's pretty useless
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
    //console.log(headers);
    for(let i = 0; i < headers.length; i++){
        for(let j = 0; j < columns.length; j++){
            if(headers[i] === columns[j].toUpperCase()){
                colToIdx.set(columns[j], i);
            }
        }
    }

    rows.filter((row)=>row.trim() !== "").forEach((row)=>{
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
            []
        );
        intoUser.addWarrior(newWarrior);
    });
}

async function loadAllModules(intoUser){
    let moduleList = await getModuleList();
    moduleList.forEach(async (moduleName)=>{
        await loadModule(moduleName, intoUser);
    });
    let allPromises = moduleList.map((moduleName)=>{
        return loadModule(moduleName, intoUser);
    });
    await Promise.all(allPromises);
}

export {
    loadAllModules
};

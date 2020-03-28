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

async function loadModule(moduleName){
    let req = await fetch(MODULE_PATH_BASE + "/" + moduleName);
    let text = await req.text();

    //this is the format warriors are stored in in wowdata.csv,
    //but I'm not sure if I want to save it in a different way,
    //probably not though.
    //oh wait, wowdata.csv doesn't contain their element, so it's pretty useless
    /*
    let columns = [
        "Warrior",
        "Rank",
       	"Commonality",
        "Skill 1",
        "Skill 2",
        "Base Phys",
        "Base Ele",
        "Base HP",
        "Armor",
       	"Leader Skill",
        "Special"
    ];*/
}

export {
    getModuleList
};

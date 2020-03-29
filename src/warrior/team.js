//import {Warrior} from "./warrior.js";

export class Team{
    constructor(name, members){
        if(name == null){
            throw new Error("Cannot create Team with no name");
        }
        if(members == null){
            throw new Error("Cannot create Team with no members");
        }
        if(!Array.isArray(members)){
            throw new Error("members argument must be an array");
        }
        if(members.length <= 0 || members.length > 3){
            throw new Error("Team must contain between 1 and 3 members");
        }
        /*
        Instanceof appears not to work with ES6 classes

        members.forEach((member)=>{
            if(!(member instanceof Warrior)){
                throw new Error(`members argument must be an array of Warriors, but it contains ${member}`);
            }
        });*/
        this.name = name;
        this.members = members;
        this.koListeners = [];
    }
    //use this instead of this.membersRem
    forEach(func){
        this.membersRem.forEach((member)=>func(member));
    }

	init(){
		this.membersRem = [];
		for (let member of this.members){
		    member.init();
		    member.team = this;
		    member.enemyTeam = this.enemyTeam;
		    this.membersRem.push(member);
		}
		this.leader = this.membersRem[0];
		this.active = this.membersRem[0];
		this.energy = 2;
		this.won = false;
	}
	gainEnergy(){
		if (this.energy < 0){
			this.energy = 1;
		}
		if (this.energy < 4){
			this.energy += 1;
		}
	}

	prev(){
		/*
		Returns the member of this' members
		above num
		as an index
		*/
		var prev = this.membersRem.indexOf(this.active) - 1;
		if (prev === -1){
			prev = this.membersRem.length - 1;
		}
		return this.membersRem[prev];
	}
	next(){
		/*
		Returns the next member of this' members
		*/
		var nextup = this.membersRem.indexOf(this.active) + 1;
		if (nextup >= this.membersRem.length){
			nextup = 0;
		}
		return this.membersRem[nextup];
	}
	switchin(warrior){
		if (this.membersRem.length === 1){
			this.active = this.membersRem[0];
			return;
		}
		for (let member of this.membersRem){
			if (member === warrior){
				this.active = member;
				return;
			}
		}
		console.log("Error: The warrior " + warrior + " does not exist!");
	}
	update(){
		for (let member of this.membersRem){
			member.update();
		}
		this.check_if_ko();
	}

    addKoListener(f){
        this.koListeners.push(f);
    }

	check_if_ko(){
		/*
         * Removes KOed warriors from the members remaining
         */
        let index = this.membersRem.indexOf(this.active);
        this.membersRem = this.membersRem.filter((member)=>!member.check_if_ko());
		if (this.membersRem.length === 0){
            this.koListeners.forEach((f)=>f(this));
		} else if (this.active.check_if_ko()){
            if(index >= this.membersRem.length){
				index = 0;
			}
			this.switchin(this.membersRem[index]);
		}
	}

    //Don't delete me yet!
	turn_part2(){
		/*
		Action phase
		*/
        this.update(); //this comes first, otherwise leader skill doesn't apply
        if (!this.leader.check_if_ko()){
			this.leader.lead_skill.apply(this);
		}


		for (let member of this.membersRem){
			member.reset_dmg();
		}
        this.check_if_ko();
	}

    toString(){
        let ret = this.name + ": \n";
        this.members.forEach((warrior)=>{
            ret += `* ${warrior.name}\n`;
        });
        return ret;
    }

    copy(){
        return new Team(this.name, this.members.map((warrior)=>warrior.copy()));
    }
}

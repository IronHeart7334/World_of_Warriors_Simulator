import {Warrior} from "./warrior.js";

export class Team{
    /*
     * Currently, members is an array of arrays,
     * the first element being their name, 
     * second is an array of strings, their skills.
     * Once I have a better way of doing this, 
     * change this to invoke copy constructor
     */
    constructor(name, members){
        this.members = [];
        for(let member of members){
        	this.members.push(new Warrior(member[0], member[1]));
        }
	    this.name = name;
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
	check_if_ko(){
		/*
         * Removes KOed warriors from the members remaining
         */
        let index = this.membersRem.indexOf(this.active);
        this.membersRem = this.membersRem.filter((member)=>!member.check_if_ko());
		if (this.membersRem.length === 0){
			this.enemyTeam.win();
		} else if (this.active.check_if_ko()){
            if(index >= this.membersRem.length){
				index = 0;
			}
			this.switchin(this.membersRem[index]);
		}
	}
	win(){
		alert(this.name + " wins!");
		this.won = true;
		disp_menu();
	}
	
    //Don't delete me yet!
	turn_part2(){
		/*
		Action phase
		*/
		
		for (var member of this.membersRem){
			member.reset_dmg();
		}
        
        if (!this.leader.check_if_ko()){
			this.leader.lead_skill.apply(this);
		}
        
		this.update();
		this.check_if_ko();
	}
}
import React, {Component} from "react";

import {Button} from   "./button.js";
import {WarriorCard} from "./warriorCard.js";
import {Warrior} from "../warrior/warrior.js";
import {Team} from "../warrior/team.js";
import {Controller} from "../controller.js";

export class TeamBuilder extends Component{
    constructor(props={}){
        super(props);
        
        this.options = this.props.controller.state.user.warriors.map((data)=>data[0]);
        this.state = {
            warrior1: this.options[0],
            warrior2: this.options[1],
            warrior3: this.options[2]
        };
    }
    
    selectWarrior(name){
        //todo: skill selection
        this.teamWorkshop.push(name);
        this.options.splice(this.options.indexOf(name), 1);
        this.currIdx--;
        
        if(this.teamWorkshop.length === 3){
            let teamName = prompt("What do you want to call this team?");
            //save the team
            this.user.teams.push(new Team(teamName, this.teamWorkshop.map((name)=>{
                return new Warrior(name);
            })));
            console.log(this.user.teams);
            this.controller.setView(Controller.MAIN_MENU);
        } else {
            this.update();
        }
    }
    
    update(){
        //clear warrior cards. Better way?
        let newChildren = this.children.filter((child)=>!(child instanceof WarriorCard));
        this.children = newChildren;
        
        if(this.currIdx !== 0){
            let leftCard = new WarriorCard(0, 0, 25);
            leftCard.setWarrior(new Warrior(this.options[this.currIdx - 1]));
            this.addChild(leftCard);
        }
        
        let midCard = new WarriorCard(25, 0, 50);
        midCard.setWarrior(new Warrior(this.options[this.currIdx]));
        this.addChild(midCard);
        
        if(this.currIdx !== this.options.length - 1){
            let rightCard = new WarriorCard(75, 0, 25);
            rightCard.setWarrior(new Warrior(this.options[this.currIdx + 1]));
            this.addChild(rightCard);
        }
        
        this.draw();
    }
    
    selectWarrior1(name){
        this.setState({
            warrior1: name
        });
        console.log(name);
    }
    selectWarrior2(name){
        this.setState({
            warrior2: name
        });
        console.log(name);
    }
    selectWarrior3(name){
        this.setState({
            warrior3: name
        });
        console.log(name);
    }
    
    render(){
        //todo warrior cards instead
        const opt1 = this.options.map((name)=>
            <td key={name} onClick={()=>this.selectWarrior1(name)}>{name}</td>
        );
        const opt2 = this.options.map((name)=>
            <td key={name} onClick={()=>this.selectWarrior2(name)}>{name}</td>
        );
        const opt3 = this.options.map((name)=>
            <td key={name} onClick={()=>this.selectWarrior3(name)}>{name}</td>
        );
        
        return (
            <div className="TeamBuilder">
                <table>
                    <tbody>
                        <tr>
                            {opt1}
                        </tr>
                        <tr>
                            {opt2}
                        </tr>
                        <tr>
                            {opt3}
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

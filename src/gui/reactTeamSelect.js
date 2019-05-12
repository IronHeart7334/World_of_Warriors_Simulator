import React, { Component } from 'react';
import {ReactController} from "./reactController.js";
import {TeamDisplay} from "./teamDisplay.js";

function sayHi(){
    console.log("hi");
}
export class TeamSelect extends Component{
    constructor(props={}){
        super(props);
        this.state = {
            team1: null,
            team2: null
        };
    }
    
    setTeam1(team){
        this.setState({
            team1: team
        });
    }
    setTeam2(team){
        this.setState({
            team2: team
        });
    }
    
    componentWillUpdate(newProps, newState){
        console.log(this.props);
        console.log(newProps);
        console.log(this.state);
        console.log(newState);
    }
    
    render(){
        let teams = this.props.controller.state.user.teams;
        
        const t = teams.map((team)=>
            <li key={team.name} onClick={sayHi}>
                <TeamDisplay team={team} onClick={sayHi}/>
            </li>
        );
        
        return (
            <div className="TeamSelect">
                <ul>{t}</ul>
            </div>
        );
    }
};

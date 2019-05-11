import React, { Component } from 'react';
import {ReactController} from "./reactController.js";

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
        let content = "";
        let x1 = 10;
        let x2 = 50;
        let y1 = 10;
        let y2 = 10;
        let button;
        teams.forEach((team)=>{
            //just make button class for this
            //ooh, button that list the members and team name
            button = (<div 
                style="left: {x1}%; top: {y1}%; width: 10%; height: 10%"
                onClick="()=>{console.log('hi');}"
            ></div>);
            y1 += 10;
            if(y1 >= 90){
                y1 = 10;
                x1 += 10;
            }
            console.log(button);
            content += button;
        });
        
        return (
            <div className="TeamSelect">
                {content}
            </div>
        );
    }
};

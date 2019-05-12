import React, { Component } from 'react';
import {ReactController} from "./reactController.js";

export class MainMenu extends Component {
    howToPlay(){
        console.log("How to play not created yet");
    }
    fight(){
        //make sure user is logged in
        //make sure they have at least 2 teams
        this.props.controller.setView(ReactController.TEAM_SELECT);
    }
    teamBuilder(){
        //make sure user is logged in
        console.log("build teams");
    }
    info(){
        console.log("Info not created yet");
    }
    
    render(){
        return (
            <div className="MainMenu">
                <div className="MainMenuItem" id="HowToPlayButton" onClick={this.howToPlay.bind(this)}>
                    <p> How to Play </p>
                </div>
                <div className="MainMenuItem" id="FightButton" onClick={this.fight.bind(this)}>
                    <p> Fight! </p>
                </div>
                <div className="MainMenuItem" id="TeamBuilderButton" onClick={this.teamBuilder.bind(this)}>
                    <p> Teambuilder </p>
                </div>
                <div className="MainMenuItem" id="InfoButton" onClick={this.info.bind(this)}>
                    <p> Info </p>
                </div>
            </div>
        );
    }
}
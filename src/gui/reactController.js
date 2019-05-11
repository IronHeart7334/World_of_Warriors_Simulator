import {Controller as OldController} from "../controller.js";
import React, { Component } from 'react';
import {MainMenu} from "../gui/reactMainMenu.js";

export class ReactController extends Component {
    constructor(props={}){
        super(props);
        this.state = {
            user: null,
            view: ReactController.MAIN_MENU
        };
    }
    
    setUser(globalObject){
        this.setState({
            user: globalObject
        });
    }
    
    //newView is a ReactController enum (Controller.MAIN_MENU, for example)
    setView(newView){
        this.setState({
            view: newView
        });
    }
    
    render(){
        let contents = "";
        if(this.state.view === ReactController.MAIN_MENU){
            contents = <MainMenu controller={this}/>;
        }
        
        switch(this.state.view){
            case ReactController.MAIN_MENU:
                contents = <MainMenu controller={this}/>;
                break;
            case ReactController.TEAM_SELECT:
                //if not logged in, redirect to login
                //if fewer than 2 teams, redirect to teambuilder
                contents = <p>Select teams</p>;
                break;
            case ReactController.TEAM_BUILDER:
                //if not logged in, redirect to login
                contents = <p>Build team</p>;
                break;
            case ReactController.BATTLE:
                contents = <p>Fight!</p>;
                break;
            default:
                throw new Error("Invalid view enum: " + this.state.view);
                break;
        }
        
        return (
            <div id="Controller">
                {contents}
            </div>
        );
    }
};
ReactController.MAIN_MENU = 0;
ReactController.TEAM_SELECT = 1;
ReactController.TEAM_BUILDER = 2;
ReactController.BATTLE = 3;
//ReactController.LOGIN = 4;
//ReactController.MULTIPLAYER = 5;
import {Controller as OldController} from "../controller.js";
import React, { Component } from 'react';
import {MainMenu} from "../gui/reactMainMenu.js";

export class ReactController extends Component {
    constructor(props){
        super(props);
        this.view = ReactController.MAIN_MENU;
    }
    
    render(){
        let contents = "";
        if(this.view === ReactController.MAIN_MENU){
            contents = <MainMenu controller={this}/>;
        }
        return (
            <div id="Controller">
                {contents}
            </div>
        );
    }
};
ReactController.MAIN_MENU = 0;
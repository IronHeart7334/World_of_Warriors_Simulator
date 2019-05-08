import React, { Component } from 'react';

function f(){
    console.log("works?");
}
export class MainMenu extends Component {
    render(){
        return (
            <div className="MainMenu">
                <div className="HowToPlay" onClick={f}>
                    <p> How to Play </p>
                </div>
            </div>
        );
    }
}
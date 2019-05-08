import React, { Component } from 'react';

class MainMenu extends Component {
    render(){
        return (
            <div className="MainMenu">
                <div className="HowToPlay" onClick="console.log('does this work?')">
                    <p> How to Play </p>
                </div>
            </div>
        );
    }
}
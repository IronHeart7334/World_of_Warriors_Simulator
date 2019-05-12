import React, { Component } from 'react';

/*
 * Used to display information about a team 
 * todo: info on members when you hover or click on them
*/
export class TeamDisplay extends Component{
    render(){
        let contents = "";
        //for some reason I can't include the curly brackets
        const members = this.props.team.members.map((member)=>
            <li key={member.name}>{member.name}</li>
        );
        return (
            <div className="TeamDisplay">
                <h1>{this.props.team.name}</h1>
                <ol>
                    {members}
                </ol>
            </div>
        );
    }
};

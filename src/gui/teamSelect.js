//import {TeamDisplay} from "./teamDisplay.js";

export class TeamSelect{
    constructor(props={}){
        this.availableTeams = [];
        this.team1 = null;
        this.team2 = null;
    }
    setPlayer1(user){
        
    }
    setTeam1(team){
        return;
        this.setState({
            team1: team
        });
    }
    setTeam2(team){
        return;
        this.setState({
            team2: team
        });
    }
    fight(){
        return;
        this.props.controller.setView(ReactController.BATTLE);
        //this.props.controller.state.view.setTeams(this.state.team1, this.state.team2);
    }
    
    render(){
        /*
        let teams = this.props.controller.state.user.teams;
        
        const t1 = teams.map((team)=>
            <li key={team.name} onClick={()=>this.setTeam1(team)}>
                <TeamDisplay team={team}/>
            </li>
        );
        const t2 = teams.map((team)=>
            <li key={team.name} onClick={()=>this.setTeam2(team)}>
                <TeamDisplay team={team}/>
            </li>
        );
        
        return (
            <div className="TeamSelect">
                <div className="BackButton" onClick={this.back.bind(this)}>Back</div>
                <table>
                <tbody>
                    <tr>
                        <td><ul>{t1}</ul></td>
                        <td><ul>{t2}</ul></td>
                    </tr>
                </tbody>
                </table>
                <h2>{this.state.team1.name} VS {this.state.team2.name}</h2>
                <div onClick={this.fight.bind(this)}><p>Fight!</p></div>
            </div>
        );*/
    }
};

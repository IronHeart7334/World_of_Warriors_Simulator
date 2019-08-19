//not done, still need to pass the selected teams to the new battle
export class TeamSelect{
    constructor(){
        this.player1 = null;
        this.player2 = null;
        this.team1 = null;
        this.team2 = null;
        let page = this;
        $("#fight-button").click(()=>this.fight());
    }
    setPlayer1(user){
        this.player1 = user;
        let newEle;
        let sel = $("#player-1-teams");
        let ts = this;
        sel.empty();
        
        user.teams.forEach((team)=>{
            newEle = $(`<button>${team.name}</button>`);
            newEle.click(()=>{
                ts.setTeam1(team);
            });
            sel.append(newEle);
        });
        
        this.setTeam1(user.teams[0]);
    }
    setPlayer2(user){
        this.player2 = user;
        let newEle;
        let sel = $("#player-2-teams");
        let ts = this;
        sel.empty();
        
        user.teams.forEach((team)=>{
            newEle = $(`<button>${team.name}</button>`);
            newEle.click(()=>{
                ts.setTeam2(team);
            });
            sel.append(newEle);
        });
        this.setTeam2(user.teams[0]);
    }
    
    setTeam1(team){
        this.team1 = team;
        $("#team1").text(team.getDesc());
        if(this.team2 !== null){
            $("#header").empty().text(`${this.team1.name} VS ${this.team2.name}`);
        }
    }
    setTeam2(team){
        this.team2 = team;
        $("#team2").text(team.getDesc());
        if(this.team1 !== null){
            $("#header").empty().text(`${this.team1.name} VS ${this.team2.name}`);
        }
    }
    
    //todo: make the battle use the selected teams
    fight(){
        if(this.team1 !== null && this.team2 !== null){
            window.location.href = "battle.html";
        } else {
            alert("both teams must be chosen before fighting");
        }
    }
};

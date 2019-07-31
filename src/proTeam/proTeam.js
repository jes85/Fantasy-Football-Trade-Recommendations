class ProTeam {

  static buildFromServer(proTeamData) {
    return new ProTeam(proTeamData.id, proTeamData.location, proTeamData.name, proTeamData.byeWeek);
  }

  constructor(id, location, name, byeWeek) {
      this.id = id;
      this.location = location;
      this.name = name;
      this.byeWeek = byeWeek;
  }

  // toString() {
 //        return '(' + this.id + ', ' + this.location + ', ' + this.name + ', ' + this.byeWeek + ')';
 //    }
}

export default ProTeam;

/**
 * A ProTeam represents an NFL team.
 * 
 * {String} id Unique identifier for the pro team from Espn
 * {String} location The location of the pro team (i.e. Kansas City)
 * {String} name The name of the pro team (i.e. Chiefs)
 * {String} byeWeek The index of the week that this pro team has a bye (no games).
 */
class ProTeam {

  /**
   * Constructs a ProTeam object based on data retrieved from the Espn client.
   * 
   * TODO Extract this to a Factory class.
   * 
   * @param {Object} proTeamData Data about the pro team retrieved from Espn
   * @return {ProTeam} 
   */
  static buildFromServer(proTeamData) {
    return new ProTeam(proTeamData.id, proTeamData.location, proTeamData.name, proTeamData.byeWeek);
  }

  constructor(id, location, name, byeWeek) {
      this.id = id;
      this.location = location;
      this.name = name;
      this.byeWeek = byeWeek;
  }
}

export default ProTeam;

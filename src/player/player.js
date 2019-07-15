class Player {

	static buildFromServer(playerData) {
		return new Player(playerData.id, playerData.fullName);
	}

	constructor(id, fullName) {
	    this.id = id;
	    this.fullName = fullName;
	}
}

export default Player;

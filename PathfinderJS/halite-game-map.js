var test = "2 0 3 0 75.0000 100.0000 255 0.0000 0.0000 0 0 0 0 1 75.0000 97.0000 255 0.0000 0.0000 0 0 0 0 2 75.0000 103.0000 255 0.0000 0.0000 0 0 0 0 1 3 3 225.0000 100.0000 255 0.0000 0.0000 0 0 0 0 4 225.0000 97.0000 255 0.0000 0.0000 0 0 0 0 5 225.0000 103.0000 255 0.0000 0.0000 0 0 0 0 14 0 161.6405 111.6405 1971 7.7311 3 0 1113 0 0 0 1 138.3595 111.6405 1971 7.7311 3 0 1113 0 0 0 2 138.3595 88.3595 1971 7.7311 3 0 1113 0 0 0 3 161.6405 88.3595 1971 7.7311 3 0 1113 0 0 0 4 157.3554 170.8320 1227 4.8138 2 0 693 0 0 0 5 61.2322 139.6428 1227 4.8138 2 0 693 0 0 0 6 53.8768 68.8108 1227 4.8138 2 0 693 0 0 0 7 142.6446 29.1680 1227 4.8138 2 0 693 0 0 0 8 238.7678 60.3572 1227 4.8138 2 0 693 0 0 0 9 246.1232 131.1892 1227 4.8138 2 0 693 0 0 0 10 206.3571 172.6796 1501 5.8877 2 0 847 0 0 0 11 89.0666 167.2211 1501 5.8877 2 0 847 0 0 0 12 93.6429 27.3204 1501 5.8877 2 0 847 0 0 0 13 210.9334 32.7789 1501 5.8877 2 0 847 0 0 0";

class World {
    constructor() {
        this.players = []
        this.ships = []
        this.planets = []
    }
}

class Ship {
    constructor() {
        this.owner = -1;
        this.id = -1;
        this.xPos = -1;
        this.yPos = -1;
        this.health = -1;
        this.dockingStatus = -1;
        this.dockedPlanet = -1;
        this.dockingProgress = -1;
        this.weaponCooldown = -1;
    }
}

class Planet {
    constructor() {
        this.owner = -1;
        this.id = -1;
        this.xPos = -1;
        this.yPos = -1;
        this.health = -1;
        this.radius = -1;
        this.dockingSpots = -1;
        this.currentProduction = -1;
        this.remainingProduction = -1;
        this.dockedShips = -1;
    }
}

var DockingStatus = {
    0: "Undocked",
    1: "Docking",
    2: "Docked",
    3: "Undocking"
}

function getShipList(playerId, metadata) {
    var numberOfShips = parseInt(metadata.pop());
    var ships = []
    for (var i = 0; i < numberOfShips; i++) {
        var ship = new Ship();
        ship.owner = playerId;
        ship.id = parseInt(metadata.pop());
        ship.xPos = parseFloat(metadata.pop());
        ship.yPos = parseFloat(metadata.pop());
        ship.health = parseInt(metadata.pop());
        // Ignoring velocity(x,y) which is always (0,0) in current version.
        metadata.pop();
        metadata.pop();
        ship.dockingStatus = DockingStatus[parseInt(metadata.pop())];
        ship.dockedPlanet = parseInt(metadata.pop());
        ship.dockingProgress = parseInt(metadata.pop());
        ship.weaponCooldown = parseInt(metadata.pop());
        ships.push(ship);
    }
    return ships;
}

function parsePlanet(metadata) {
    var planet = new Planet();

    planet.id = parseInt(metadata.pop());
    planet.xPos = parseFloat(metadata.pop());
    planet.yPos = parseFloat(metadata.pop());
    planet.health = parseInt(metadata.pop());
    planet.radius = parseFloat(metadata.pop());
    planet.dockingSpots = parseInt(metadata.pop());
    planet.currentProduction = parseInt(metadata.pop());
    planet.remainingProduction = parseInt(metadata.pop());

    if (parseInt(metadata.pop()) == 1) {
        planet.owner = parseInt(metadata.pop());
    } else {
        planet.owner = null;
        metadata.pop();
    }

    var dockedShipCount = parseInt(metadata.pop());
    var dockedShips = [];
    for (var i = 0; i < dockedShipCount; i++) {
        dockedShips.add(parseInt(metadata.pop()));
    }
    // console.log(planet);
    return planet;
}

function readMap(line) {
    // initial line has id, next line has width height, next line onwards is a game map
    var world = new World();
    var numbers = line.trim().split(" ");
    var metadata = numbers.reverse();
    // pop takes from back

    var numberOfPlayers = parseInt(metadata.pop());
    for (var i = 0; i < numberOfPlayers; i++) {
        var playerId = metadata.pop();
        world.players.push(playerId);
        var ships = getShipList(playerId, metadata);
        // console.log(ships);
        world.ships = world.ships.concat(ships);
    }

    var numberOfPlanets = parseInt(metadata.pop());
    for (var i = 0; i < numberOfPlanets; i++) {
        world.planets.push(parsePlanet(metadata));
    }

    console.log(world);
    if (metadata.length > 0) {
        console.error("ERROR - Leftover map data:", metadata)
    }
    return world;
}

function writeMap(world) {
    return "todo";
}

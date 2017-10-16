var drawingApp = (function() {

    "use strict";

    var myId = 0, enemyId = 1;

    var canvas, context, scale = 2, //todo use
    canvasWidth = 384 * scale, canvasHeight = 256 * scale,
    shipImage = new Image(), enemyShipImage = new Image(), planetImage = new Image(), world = new World(), paint = false, curTool = "planet", //todo display this
    curRadius = 11, totalLoadResources = 3, curLoadResNum = 0,
    // Clears the canvas.
    clearCanvas = function() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    },
    // Redraws the canvas.
    redraw = function() {

        var locX, locY, radius, i, selected;

        // Make sure required resources are loaded before redrawing
        if (curLoadResNum < totalLoadResources) {
            return;
        }

        clearCanvas();

        for (var i = 0; i < world.planets.length; i += 1) {
            var planet = world.planets[i];
            var d = 2 * planet.radius * scale;
            context.drawImage(planetImage, planet.xPos * scale, planet.yPos * scale, d, d);
        }
        for (var i = 0; i < world.ships.length; i += 1) {
            var ship = world.ships[i];
            var radius = 5;
            var d = 2 * radius * scale;
            if(ship.owner == myId)
                context.drawImage(shipImage, ship.xPos * scale, ship.yPos * scale, d, d);
            else
                context.drawImage(enemyShipImage, ship.xPos * scale, ship.yPos * scale, d, d);
        }

    },

    // draw an entity
    addClick = function(x, y, dragging) {
        console.log("click ", x, y, dragging)
        switch (curTool) {
        case "planet":
            var planet = new Planet();
            planet.xPos = x / scale;
            planet.yPos = y / scale;
            planet.radius = curRadius;
            world.planets.push(planet);
        case "ship":
            myId = 0;
            // todo expose ui
            addShip(x / scale, y / scale, myId);
            break;
        case "enemyShip":
            enemyId = 1;
            addShip(x / scale, y / scale, enemyId);
            break;
        default:
            break;
        }
    },
    addShip = function(x, y, owner) {
        var ship = new Ship();
        ship.xPos = x / scale;
        ship.yPos = y / scale;
        ship.owner = owner;
        world.ships.push(ship);
    },

    // Add mouse and touch event listeners to the canvas
    createUserEvents = function() {

        var press = function(e) {
            // Mouse down location
            var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft
              , mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
            paint = true;
            addClick(mouseX, mouseY, false);
            redraw();
        }
          ,
        release = function() {
            paint = false;
            redraw();
        }
          ,
        cancel = function() {
            paint = false;
        };

        // Add mouse event listeners to canvas element
        canvas.addEventListener("mousedown", press, false);
        canvas.addEventListener("mouseup", release);
        canvas.addEventListener("mouseout", cancel, false);

        // Add touch event listeners to canvas element
        canvas.addEventListener("touchstart", press, false);
        canvas.addEventListener("touchend", release, false);
        canvas.addEventListener("touchcancel", cancel, false);
    },
    // Calls the redraw function after all necessary resources are loaded.
    resourceLoaded = function() {

        curLoadResNum += 1;
        if (curLoadResNum === totalLoadResources) {
            redraw();
            createUserEvents();
        }
    },
    // Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
    init = function() {

        // Create the canvas
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);
        canvas.setAttribute('id', 'canvas');
        canvas.setAttribute('style', "border-style: solid")
        document.getElementById('canvasDiv').appendChild(canvas);
        context = document.getElementById('canvas').getContext("2d");

        // Load images
        shipImage.onload = resourceLoaded;
        shipImage.src = "images/ship.png";

        enemyShipImage.onload = resourceLoaded;
        enemyShipImage.src = "images/enemy-ship.png";

        planetImage.onload = resourceLoaded;
        planetImage.src = "images/planet.png";

        document.getElementById('choosePlanet').addEventListener("click", function() {
            curTool = "planet";
        });
        document.getElementById('chooseShip').addEventListener("click", function() {
            curTool = "ship";
        });
        document.getElementById('chooseEnemyShip').addEventListener("click", function() {
            curTool = "enemyShip";
        });

        document.getElementById('planetRadius').addEventListener("change", function() {
            curRadius = document.getElementById('planetRadius').value;
        });

        document.getElementById('clearCanvas').addEventListener("click", function() {
            clickX = new Array();
            clickY = new Array();
            clickTool = new Array();
            clearCanvas();
        });

        document.getElementById('load').addEventListener("click", function() {
            world = readMap(document.getElementById('mapDataIn').value);
            console.log("loaded ", world)
            redraw();
        });
        document.getElementById('export').addEventListener("click", function() {
            document.getElementById('mapDataOut').innerHTML = writeMap(world);;
            console.log("exported ", world)
        });

    };

    return {
        init: init
    };
}());

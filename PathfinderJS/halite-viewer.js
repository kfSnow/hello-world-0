var drawingApp = (function() {

    "use strict";

    var playerId = 0, enemyId = 1;

    var canvas, context,
    scale = window.devicePixelRatio,
    canvasWidth = 360, canvasHeight = 240,
    shipImage = new Image(), enemyShipImage = new Image(), planetImage = new Image(), world = new World(),
    paint = false,
    curTool = "planet", //todo display this
    curRadius = 11,
    totalLoadResources = 3, curLoadResNum = 0,

    // Clears the canvas and draw a grid.
    clearCanvas = function() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.lineWidth = 0.05;
        context.lineColor = "gray";
        for(var i = 0; i < canvasWidth; i+=7) {
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, canvasHeight)
            context.stroke();
        }
        for(var j = 0; j < canvasHeight; j += 7) {
            context.beginPath();
            context.moveTo(0, j);
            context.lineTo(canvasWidth, j);
            context.stroke();
        }
    },
    // Redraws the canvas.
    redraw = function() {

       // reset canvas
       document.getElementById('canvas').setAttribute('width', canvasWidth * scale);
       document.getElementById('canvas').setAttribute('height', canvasHeight * scale);
       context = document.getElementById('canvas').getContext("2d");
       context.scale(scale, scale);  // handle high dpi

        var locX, locY, radius, i, selected;

        // Make sure required resources are loaded before redrawing
        if (curLoadResNum < totalLoadResources) {
            return;
        }

        clearCanvas();

        for (var i = 0; i < world.planets.length; i += 1) {
            var planet = world.planets[i];
            var d = 2 * planet.radius;
            context.drawImage(planetImage, (planet.xPos - planet.radius), (planet.yPos - planet.radius), d, d);
        }
        for (var i = 0; i < world.ships.length; i += 1) {
            var ship = world.ships[i];
            var radius = 5;
            var d = 2 * radius;
            if(ship.owner == playerId)
                context.drawImage(shipImage, (ship.xPos - radius), (ship.yPos - radius), d, d);
            else
                context.drawImage(enemyShipImage, (ship.xPos - radius), (ship.yPos - radius), d, d);
        }

    },

    // draw an entity
    addClick = function(x, y, dragging) {
        console.log("click ", x, y, dragging)
        switch (curTool) {
        case "planet":
            var planet = new Planet();
            planet.xPos = x;
            planet.yPos = y;
            planet.radius = curRadius;
            world.planets.push(planet);
            break;
        case "ship":
            addShip(x, y, playerId);
            break;
        case "enemyShip":
            addShip(x, y, enemyId);
            break;
        default:
            break;
        }
    },
    addShip = function(x, y, owner) {
        var ship = new Ship();
        ship.xPos = x;
        ship.yPos = y;
        ship.owner = owner;
        world.ships.push(ship);
    },

    // Add mouse and touch event listeners to the canvas
    createUserEvents = function() {

        var press = function(e) {
            if (e.button != 0) {
                return;
            }
            var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft
            var mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
            mouseX /= scale;
            mouseY /= scale;
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
        canvas.setAttribute('width', canvasWidth * scale);
        canvas.setAttribute('height', canvasHeight * scale);
        canvas.setAttribute('id', 'canvas');
        canvas.setAttribute('style', "border-style: solid")
        document.getElementById('canvasDiv').appendChild(canvas);
        context = document.getElementById('canvas').getContext("2d");
        context.scale(scale, scale);  // handle high dpi

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

        document.getElementById('playerId').addEventListener("change", function() {
            playerId = document.getElementById('playerId').value;
            redraw();
        });

        document.getElementById('mapWidth').addEventListener("change", function() {
            canvasWidth = document.getElementById('mapWidth').value;
            redraw();
        });

        document.getElementById('mapHeight').addEventListener("change", function() {
            canvasHeight = document.getElementById('mapHeight').value;
            redraw();
        });

        document.getElementById('clearCanvas').addEventListener("click", function() {
            clearCanvas();
        });

        document.getElementById('load').addEventListener("click", function() {
            world = readMap(document.getElementById('mapDataIn').value);
            console.log("loaded ", world);

            // auto size canvas
            var sumX = 0, sumY = 0, i = 0;
            for(; i < world.planets.length; i++) {
                var planet = world.planets[i];
                sumX += planet.xPos;
                sumY += planet.yPos;
            }
            var midX = sumX / i;
            var midY = sumY / i;
            canvasWidth = midX * 2;
            canvasHeight = midY * 2;
            console.log("map size roughly ", canvasWidth, canvasHeight);

            document.getElementById('mapWidth').value = canvasWidth;
            document.getElementById('mapHeight').value = canvasHeight;

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

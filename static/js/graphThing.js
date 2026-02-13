import { getEquationTypeFromInput } from "./graphHelper.mjs"; 

math.config({
  number: 'number'
});

function makeGood(x) {
        const bn = math.bignumber(x);
        const eps = math.bignumber('1e-30');
        return math.smaller(math.abs(bn), eps) ? math.bignumber(0) : bn;
}

function doMath(mathToDo) {

        mathToDo = mathToDo.replaceAll(' ', '')
        mathToDo = mathToDo.replaceAll('mod', '%')
        mathToDo = mathToDo.replaceAll('√', 'sqrt')
        mathToDo = mathToDo.replaceAll('π', 'pi')

        console.log(mathToDo)
        return mathToDo
}

document.addEventListener('DOMContentLoaded', () => {

    // STUPID GRAPH SETUP

    const canvas = document.getElementById('graphing-calc-canvas');
    const ctx = canvas.getContext('2d');
    const graph = document.getElementById("graphing-calc-canvas");
    const addNewItemButton = document.getElementById("add_new_item");

    let amountOfInserts = 1;

    // RESIZE HANDLING

    function resizeCanvasToParent() {
        const parent = canvas.parentElement;
        const rect = parent.getBoundingClientRect();
        const scale = 1;

        canvas.style.width  = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        canvas.width  = Math.floor(rect.width * scale);
        canvas.height = Math.floor(rect.height * scale);

        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        
    }

    resizeCanvasToParent();

    window.addEventListener('resize', resizeCanvasToParent);

    // STUPID MATH THAT I HATE

    var width = canvas.width;
    var height = canvas.height;
    const ratio = 3/2;
    var baseSize = 20;
    var squareSizeX = width / (baseSize * ratio);
    var squareSizeY = height / baseSize;
    var amountOfSquaresX = width / squareSizeX
    var amountOfSquaresY = height / squareSizeY

    const listOfColors = ["rgb(26, 94, 220)", "rgb(26, 220, 107)", "rgb(220, 26, 26)", "rgb(204, 26, 220)", "rgb(255, 145, 0)", "rgb(0, 0, 0)", 'rgb(80, 0, 104)']

    var offsetX = 0;
    var offsetY = 0;
    var realOriginX = width / 2 + offsetX;
    var realOriginY = height / 2 + offsetY;

    // DRAWING THE GRAPH GRID

    function drawGrid(direction) {

        baseSize = baseSize + direction;

        squareSizeX = width / (baseSize * ratio);
        squareSizeY = height / baseSize;
        amountOfSquaresX = width / squareSizeX;
        amountOfSquaresY = height / squareSizeY;

        while (amountOfSquaresX % 2 != 0 || amountOfSquaresY % 2 != 0) {
            baseSize = baseSize + direction;
            squareSizeX = width / (baseSize * ratio);
            squareSizeY = height / baseSize;
            amountOfSquaresX = width / squareSizeX;
            amountOfSquaresY = height / squareSizeY;
        }

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        const startX = Math.floor((-offsetX) / squareSizeX);
        const endX = Math.ceil((width - offsetX) / squareSizeX);

        for (let x = startX; x <= endX; x++) {

            //if(x % 4 == 0) {ctx.lineWidth = 2}

            const xPos = x * squareSizeX + offsetX;
            ctx.beginPath();
            ctx.strokeStyle = '#666666';
            ctx.moveTo(xPos, 0);
            ctx.lineTo(xPos, height);
            ctx.stroke();
            ctx.lineWidth = 1
        }

        const startY = Math.floor((-offsetY) / squareSizeY);
        const endY = Math.ceil((height - offsetY) / squareSizeY);

        for (let y = startY; y <= endY; y++) {

            //if(y % 4 == 0) {ctx.lineWidth = 2}

            const yPos = y * squareSizeY + offsetY;
            ctx.beginPath();
            ctx.strokeStyle = '#666666';
            ctx.moveTo(0, yPos);
            ctx.lineTo(width, yPos);
            ctx.stroke();
            ctx.lineWidth = 1;
        }

        ctx.lineWidth = 3;

        /*
        ctx.beginPath();
        ctx.arc(realOriginX, realOriginY, squareSizeX / 3, 0, 360);
        ctx.strokeStyle = 'rgb(26, 94, 220)';
        ctx.stroke();
        */
        

        ctx.beginPath();
        ctx.moveTo((width / 2) + offsetX, height);
        ctx.lineTo((width / 2 + offsetX), 0);
        ctx.strokeStyle = 'rgb(0, 0, 0)';;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, (height / 2) + offsetY);
        ctx.lineTo(width, (height / 2) + offsetY);
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.stroke();

        ctx.lineWidth = 1;
    }

    // CONVERT THE STUPID SCREEN CORDS

    function convertToCanvasCoords(x, y) {
        x = realOriginX + (x * squareSizeX);
        y = realOriginY - (y * squareSizeY);
        return [x, y];
    }

    // DRAW DOTS

    function plotPoint(x, y, i) {
        const realCords = convertToCanvasCoords(x, y);

        ctx.beginPath();
        ctx.arc(realCords[0], realCords[1], squareSizeX / 4, 0, 360);
        ctx.lineWidth = 2;
        ctx.strokeStyle = listOfColors[i];
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.stroke();

    }

    // REFRESH THE STUIPD GRAPH

    // Ok so idk what I was on when I wrote this but holy crap it's TUFF.

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    function drawLine(x1, y1, x2, y2, i) {
        let startingCords = convertToCanvasCoords(x1, y1);
        let endingCords = convertToCanvasCoords(x2, y2);

        let minXVisible = math.ceil((-amountOfSquaresX / 2) - (math.floor(offsetX / squareSizeX)))
        let minYVisible = math.ceil((-amountOfSquaresY / 2) + (math.floor(offsetY / squareSizeY)))
        let maxXVisible = math.ceil((amountOfSquaresX / 2) - (math.floor(offsetX / squareSizeX)))
        let maxYVisible = math.ceil((amountOfSquaresY / 2) + (math.floor(offsetY / squareSizeY)))

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(startingCords[0], startingCords[1]);
        ctx.lineTo(endingCords[0], endingCords[1]);
        ctx.strokeStyle = listOfColors[i];
        ctx.stroke();

    }
    

    function refreshCanvas(direction = 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(direction);
        itemCheck();
    }

    refreshCanvas(1);

    function graphLineFromInfo(information, i) {

        let minXVisible = math.ceil((-amountOfSquaresX / 2) - (math.floor(offsetX / squareSizeX)))
        let minYVisible = math.ceil((-amountOfSquaresY / 2) + (math.floor(offsetY / squareSizeY)))
        let maxXVisible = math.ceil((amountOfSquaresX / 2) - (math.floor(offsetX / squareSizeX)))
        let maxYVisible = math.ceil((amountOfSquaresY / 2) + (math.floor(offsetY / squareSizeY)))

        var indexOfColor = i - 1
        while(indexOfColor > listOfColors.length - 1) {
            indexOfColor = indexOfColor - (listOfColors.length - 1)
        }
        

        if (information[0] == 'point') {
            plotPoint(information[1], information[2], indexOfColor)
            return
        }

        // So they forced me to use the stupid calc thing that was made by Epstein probably...

        else if (information[0] == "LSFY") {

            const soThatJSdoesntKillMe = doMath(information[2]);

            let lastPoint = null
            let lastSlope = null

            let step = Math.max(0.1, 1 / squareSizeX);

            for(let x = minXVisible - 2; x <= maxXVisible; x += step) {
                        
                let xEquation = soThatJSdoesntKillMe.replaceAll("x", "(" + x.toString() + ")")
                        
                try {

                    let y = math.evaluate(xEquation);

                    // The AI recommended !isFinite, js roll with it...
                            
                    if (isNaN(y) || !isFinite(y)) {
                        lastPoint = null;
                        continue;
                    }
                            
                    if (lastPoint == null) {
                        lastPoint = [x, y]
                        continue
                    }

                    let slope = (lastPoint[1] - y) / (lastPoint[0] / x)

                    if(lastSlope != null) {
                        if(Math.abs(slope - lastSlope) <= 0.01) {
                            lastSlope = slope
                            //console.log(lastSlope)
                            continue
                        }

                    }

                    //plotPoint(x, y)
                    drawLine(lastPoint[0], lastPoint[1], x, y, indexOfColor)
                    lastPoint = [x, y]
                    lastSlope = slope
                    //console.log(lastSlope)
                } 
                
                catch (e) {
                    lastPoint = null;
                }

            }
        }
    }

    // INPUT HANDLING

    function readdListeners() {
        for (let i = 1; i <= amountOfInserts; i++) {
            
            const input = document.getElementById(`where_the_math_goes_${i}`);

            input.addEventListener("input", () => {

                refreshCanvas(0)

                if(input.value.toString().toUpperCase() == "Die Kuh".toUpperCase()) {
                    let dieKuh = new Image()
                    dieKuh.src = "../static/img/DieKueh.jpg"
                    ctx.drawImage(dieKuh, 0, 0, width, height)
                }

                let information = getEquationTypeFromInput(input.value.toString())

                if(information == "invalid") {return}
                if(!(Array.isArray(information))) {return}


                graphLineFromInfo(information, i)
            
            });
        }
    }    
    

    function itemCheck() {
        for (let i = 1; i <= amountOfInserts; i++) {
            const input = document.getElementById(`where_the_math_goes_${i}`);

            if(input.value.toString().toUpperCase() == "Die Kuh".toUpperCase()) {
                let dieKuh = new Image()
                dieKuh.src = "../static/img/DieKueh.jpg"
                ctx.drawImage(dieKuh, 0, 0, width, height)
            }

            let information = getEquationTypeFromInput(input.value.toString())

            if(information == "invalid") {return}
            if(!(Array.isArray(information))) {return}

            graphLineFromInfo(information, i)
        }
    }

    readdListeners();

    addNewItemButton.addEventListener('click', () => {
        amountOfInserts = amountOfInserts + 1;
        const whereYouPutMath = document.querySelector('.where_you_put_math');
        const againWithTheBlocks = document.createElement('div');
        againWithTheBlocks.style.display = 'flex';
        againWithTheBlocks.style.height = '15%';
        againWithTheBlocks.style.width = '100%';
        againWithTheBlocks.innerHTML = `<h2 class="whatever_this_thing_is_called">${amountOfInserts}</h2><input class="graphing-calc-text" type="text" id="where_the_math_goes_${amountOfInserts}" placeholder="...">`;
        whereYouPutMath.insertBefore(againWithTheBlocks, addNewItemButton);

        readdListeners();
    });

    // MOUSE STUFF

    var isDragging = false;
    var originalXPos = 0;
    var originalYPos = 0;
    let rect = canvas.getBoundingClientRect();

    graph.style.cursor = 'grab';

    function onMouseDown(event) {
        rect = canvas.getBoundingClientRect();
        isDragging = true;
        originalXPos = event.clientX - rect.left;
        originalYPos = event.clientY - rect.top;
        canvas.style.cursor = 'grabbing';
    }

    addNewItemButton.style.cursor = 'pointer';


    function onMouseMove(event) {
        if (!isDragging) return;

        rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const movementX = -(mouseX - originalXPos) * 1;
        const movementY = -(mouseY - originalYPos) * 1;

        offsetX -= movementX;
        offsetY -= movementY;

        originalXPos = mouseX;
        originalYPos = mouseY;

        realOriginX = width / 2 + offsetX;
        realOriginY = height / 2 + offsetY;

        canvas.style.cursor = 'grabbing';

        refreshCanvas(0);
    }

    function onMouseUp(event) {
        isDragging = false;
        canvas.style.cursor = 'grab';
        itemCheck();
    }

    function onScrollOut() {
        baseSize = baseSize + 1;
        refreshCanvas(1);
    }

    function onScrollIn() {
        if (baseSize > 1) {
            baseSize = baseSize - 1;
            refreshCanvas(-1);
        }
    }

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseout', onMouseUp);

    canvas.addEventListener('wheel', (event) => {
        event.preventDefault();

        if (event.deltaY > 0) {
            onScrollOut();
        } 
        
        else {
            onScrollIn();
        }
    });

});

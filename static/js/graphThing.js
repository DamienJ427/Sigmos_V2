document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('graphing-calc-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvasToParent() {
        const parent = canvas.parentElement;
        const rect = parent.getBoundingClientRect();
        const scale = window.devicePixelRatio || 1;

        canvas.style.width  = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        canvas.width  = Math.floor(rect.width * scale);
        canvas.height = Math.floor(rect.height * scale);

        ctx.setTransform(scale, 0, 0, scale, 0, 0);
    }

    function drawGrid() {
        const width = canvas.width;
        const height = canvas.height;
        const ratio = 2/3;
        const baseSize = 30
        const squareSizeX = width / baseSize * ratio;
        const squareSizeY = height / baseSize;
        
        
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        for (let x = 0; x <= width; x += squareSizeX) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y <= height; y += squareSizeY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc((width / 2) - (squareSizeX * 4.5), (height / 2) - (squareSizeY * 3), squareSizeX / 2, 0, 360);
        ctx.stroke(); 

    }

    resizeCanvasToParent();
    window.addEventListener('resize', resizeCanvasToParent);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    window.addEventListener('resize', () => {
        drawGrid();
    });

});
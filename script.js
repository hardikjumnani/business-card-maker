const body = document.body;
const addElement = document.querySelector('.add-element')
const businessCard = document.getElementById('business-card')
const c = businessCard.getContext('2d');

const selectShapeType = document.querySelector('.select-shape-type')

let addElementToggle = 'none'; // text, image, shape, none
let drawShape = 'none'; // none, triangle, rectangle, oval

function getAdjustedMousePos(e) {
    const rect = businessCard.getBoundingClientRect();
    const scaleX = businessCard.width / rect.width;
    const scaleY = businessCard.height / rect.height;

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function drawTriangle(x1, y1, x2, y2) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.lineTo(x1, y2);
    c.closePath();

    c.fillStyle = 'rgba(0, 0, 255, 0.5)';
    c.fill();
    c.strokeStyle = 'blue';
    c.stroke();
}

function drawRectangle(x, y, width, height) {
    c.beginPath();
    c.rect(x, y, width, height); // Define the rectangle
    c.closePath();

    c.fillStyle = 'rgba(0, 255, 0, 0.5)'; // Fill color
    c.fill();
    c.strokeStyle = 'green'; // Border color
    c.stroke();
}

function drawOval(x, y, radiusX, radiusY) {
    c.beginPath();
    c.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2); // Draw the oval
    c.closePath();

    c.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Fill color
    c.fill();
    c.strokeStyle = 'red'; // Border color
    c.stroke();
}

addElement.addEventListener('click', e => {
    if (e.target.classList == 'nav-icon') {
        e.target.classList.add('tool-active');

        if (e.target.parentElement.classList == 'text-element') {
            addElementToggle = 'text';
            businessCard.style.cursor = 'text';
        } else if (e.target.parentElement.classList == 'image-element') {
            addElementToggle = 'image';
        } else if (e.target.parentElement.classList == 'shapes-element') {
            addElementToggle = 'shape';
            businessCard.style.cursor = 'crosshair';
            selectShapeType.style.display = 'flex';
        }

        setTimeout(() => {
            e.target.classList.remove('tool-active');
        }, 100);
    }
});

selectShapeType.addEventListener('click', e => {
    if (addElementToggle == 'shape') {
        if (e.target.classList.contains('shape-triangle')) {
            drawShape = 'triangle';
        } else if (e.target.classList.contains('shape-rectangle')) {
            drawShape = 'rectangle';
        } else if (e.target.classList.contains('shape-oval')) {
            drawShape = 'oval';
        }
        selectShapeType.style.display = 'none';
    }
});

let isDrawing = false;
let startX, startY;

businessCard.addEventListener('mousedown', (e) => {
    isDrawing = true;

    const pos = getAdjustedMousePos(e);
    startX = pos.x;
    startY = pos.y;
    console.log(e.clientX, e.clientY, startX, startY);
});

businessCard.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const pos = getAdjustedMousePos(e);
    const currentX = pos.x;
    const currentY = pos.y;

    // Clear canvas and redraw triangle
    c.clearRect(0, 0, businessCard.width, businessCard.height);
    
    console.log(drawShape);
    if (drawShape == 'triangle') {
        drawTriangle(startX, startY, currentX, currentY);
    } else if (drawShape == 'rectangle') {
        drawRectangle(startX, startY, currentX-startX, currentY-startY);
    } else if (drawShape == 'oval') {
        let radiusX = Math.abs(currentX-startX)/2;
        let radiusY = Math.abs(currentY-startY)/2;
        drawOval((currentX+startX)/2, (currentY+startY)/2, radiusX, radiusY);
    }
});

businessCard.addEventListener('mouseup', () => {
    isDrawing = false;
    addElementToggle = 'none';
    drawShape = 'none';
    businessCard.style.cursor = 'pointer';
});
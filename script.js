const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');
const undoBtn = document.getElementById('undoBtn');

let drawing = false;
let lines = []; // store all line segments
let currentLine = null;

// Get mouse position relative to canvas
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const pos = getMousePos(e);
    currentLine = { color: colorPicker.value, size: brushSize.value, points: [pos] };
});

canvas.addEventListener('mousemove', (e) => {
    const pos = getMousePos(e);

    // Draw custom cursor
    drawAll();
    ctx.fillStyle = colorPicker.value;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize.value / 2, 0, Math.PI * 2);
    ctx.fill();

    if (!drawing) return;

    const lastPoint = currentLine.points[currentLine.points.length - 1];
    currentLine.points.push(pos);

    // Draw the new segment
    ctx.strokeStyle = currentLine.color;
    ctx.lineWidth = currentLine.size;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    if (currentLine) {
        lines.push(currentLine);
        currentLine = null;
    }
});

canvas.addEventListener('mouseout', () => {
    drawing = false;
    if (currentLine) {
        lines.push(currentLine);
        currentLine = null;
    }
});

// Draw all saved lines
function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let line of lines) {
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);
        for (let i = 1; i < line.points.length; i++) {
            ctx.lineTo(line.points[i].x, line.points[i].y);
        }
        ctx.stroke();
    }

    // Draw current line while dragging
    if (currentLine) {
        ctx.strokeStyle = currentLine.color;
        ctx.lineWidth = currentLine.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(currentLine.points[0].x, currentLine.points[0].y);
        for (let i = 1; i < currentLine.points.length; i++) {
            ctx.lineTo(currentLine.points[i].x, currentLine.points[i].y);
        }
        ctx.stroke();
    }
}

// Clear canvas
clearBtn.addEventListener('click', () => {
    lines = [];
    currentLine = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Undo last line segment
undoBtn.addEventListener('click', () => {
    lines.pop();
    drawAll();
});

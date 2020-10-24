import { debounce } from 'lodash';
function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
}

function drawGrid(rows, cols) {

    ctx.strokeStyle = '#e2e3e3';
    ctx.lineWidth = 1;

    for (var i = 0; i < rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * rowHeight);
        ctx.lineTo(canvas.width, (i) * rowHeight);
        ctx.stroke();
    }
    for (var i = 0; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * colWidth, 0);
        ctx.lineTo(i * colWidth, canvas.height);
        ctx.stroke();
    }
}

function select(x, y, w, h) {
    const el = document.querySelector('.selected');
    el.style.display = 'block';
    el.style.top = y + 'px';
    el.style.left = x + 'px';
    el.style.width = (w - 2) + 'px';
    el.style.height = (h - 2) + 'px';
}

/**
 *
 * @param {any[]} data
 */
function drawContent(data) {
    for (var i = 0; i < data.length; i++) {
        var cell = data[i];
        ctx.textBaseline = 'middle';
        ctx.fillText(cell.v, cell.x * colWidth + 5, cell.y * rowHeight + (rowHeight / 2));
    }
}

/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
setupCanvas(canvas);
const ctx = canvas.getContext('2d');
const selected = document.querySelector('.selected');
const overlay = document.querySelector('.canvas-overlay');
const rows = 50,
    cols = 20,
    rowHeight = 20,
    colWidth = 50,
    data = [
        { x: 2, y: 2, v: 'Hello' },
        { x: 5, y: 2, v: 'Total is here and always available' },
    ];


drawGrid(rows, cols);
drawContent(data);

function snapX(x) {
    return x = x - (x % colWidth);
}

function snapY(x) {
    return x = x - (x % rowHeight);
}

// drawSelected(0, 0, colWidth, rowHeight);
var isMousedown = false;
var mousedown = { x: 0, y: 0 };
var canClick = true;
var clickDelay = 100;
var clickTimeout;
// overlay.onclick = function (ev) {
//     let { clientX: x, clientY: y } = ev;
//     x = snapX(x)
//     y = snapY(y);
//     select(x, y, colWidth, rowHeight);
// }

function onMousedown(ev) {
    clickTimeout = setTimeout(() => { canClick = false }, clickDelay);
    isMousedown = true;
    mousedown.x = snapX(ev.clientX);
    mousedown.y = snapY(ev.clientY);
    overlay.addEventListener('mousemove', onMousemove);
}

function onMousemove(ev) {
    if (isMousedown) {
        debounce(() => {
            console.countReset('move');
            var xs = mousedown.x,
                ys = mousedown.y,
                xe = snapX(ev.clientX),
                ye = snapY(ev.clientY);
            select(Math.min(xs, xe), Math.min(ys, ye), Math.abs(xs - xe), Math.abs(ys - ye));
            console.count('move');
        }, 10)();
    }
}

function onMouseup(ev) {
    clearTimeout(clickTimeout);
    if (canClick) {
        select(snapX(ev.clientX), snapY(ev.clientY), colWidth, rowHeight);
    } else {
        if (isMousedown) {
            overlay.removeEventListener('mousemouse', onMousemove);
        }
    }
    isMousedown = false;
    canClick = true;
}

overlay.onmousedown = onMousedown;
overlay.onmouseup = onMouseup;

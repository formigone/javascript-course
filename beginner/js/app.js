function main(options) {
  var canvas = initializeCanvas(options.canvas);
  var tools = Object.assign({}, { selected: null }, options.tools);
  var colors = Object.assign({}, { selected: null }, options.colors);
  var lastPt = [];

  canvas.colors = colors;

  initializeColors(colors, canvas);
  selectColor(colors, 'black', function() {
    canvas.ctx.strokeStyle = '#000';
  });

  initializeActions(tools, canvas, colors);
  selectTool(tools, 'pencil', function() {
    canvas.ctx.lineCap = 'round';
  });

  var mouseDown = false;

  canvas.el.addEventListener('mousedown', function (event) {
    mouseDown = true;
    var x = event.offsetX;
    var y = event.offsetY;
    lastPt = plot(tools.selected, canvas, x, y, lastPt);
  });

  canvas.el.addEventListener('mouseup', function () {
    lastPt = [];
    mouseDown = false;
  });

  canvas.el.addEventListener('mousemove', function (event) {
    if (!mouseDown) {
      return;
    }

    var x = event.offsetX;
    var y = event.offsetY;
    lastPt = plot(tools.selected, canvas, x, y, lastPt);
  });
}

function plot(activeTool, canvas, x, y, lastPt) {
  if (activeTool === 'erase') {
    if (lastPt.length) {
      canvas.ctx.beginPath();
      canvas.ctx.moveTo(lastPt[0], lastPt[1]);
      canvas.ctx.lineTo(x, y);
      canvas.ctx.stroke();
    } else {
      canvas.ctx.fillRect(x, y, 1, 1);
    }
  } else if (activeTool === 'pencil' || activeTool === 'brush') {
    if (lastPt.length) {
      canvas.ctx.beginPath();
      canvas.ctx.moveTo(lastPt[0], lastPt[1]);
      canvas.ctx.lineTo(x, y);
      canvas.ctx.stroke();
    } else {
      canvas.ctx.fillRect(x, y, 1, 1);
    }
  }

  return [x, y];
}

function initializeCanvas(canvas) {
  var parent = canvas.parentElement;
  var styles = getComputedStyle(parent);
  var bodyStyles = getComputedStyle(document.body);
  canvas.width = parent.clientWidth - parseInt(styles.paddingLeft, 10) - parseInt(styles.paddingRight, 10);
  canvas.height = parseInt(bodyStyles.height, 10) - canvas.getBoundingClientRect().top - 20;

  return {
    el: canvas,
    ctx: canvas.getContext('2d'),
  };
}

function selectTool(tools, action, cb) {
  tools.selected = action;
  Object.keys(tools).map(function (tool) {
    if (tools[tool] instanceof HTMLElement) {
      tools[tool].classList.remove('active');
    }

    if (action === tool) {
      tools[tool].classList.add('active');
    }
  });

  if (cb instanceof Function) {
    cb(action);
  }
}

function initializeActions(tools, canvas) {
  Object.keys(tools).forEach(function (tool) {
    if (tools[tool] instanceof HTMLElement) {
      tools[tool].addEventListener('click', function () {
        var style = getComputedStyle(canvas.colors[canvas.colors.selected]);
        canvas.ctx.strokeStyle = style.backgroundColor;
        selectTool(tools, tool, function (action) {
          if (action === 'pencil') {
            canvas.ctx.lineWidth = 1;
          } else if (action === 'brush') {
            canvas.ctx.lineWidth = 10;
          } else if (action === 'erase') {
            canvas.ctx.lineWidth = 10;
            canvas.ctx.strokeStyle = '#fff';
          }
        });
      });
    }
  });
}

function selectColor(colors, color, cb) {
  var style = getComputedStyle(colors[color]);
  colors.selected = color;
  colors.active.style.background = style.background;
  if (cb instanceof Function) {
    cb(style.backgroundColor);
  }
}

function initializeColors(colors, canvas) {
  Object.keys(colors).forEach(function (color) {
    if (colors[color] instanceof HTMLElement && color !== 'active') {
      colors[color].addEventListener('click', function () {
        selectColor(colors, color, function(color) {
          canvas.ctx.strokeStyle = color;
        });
      });
    }
  });
}

function main(options) {
  var canvas = initializeCanvas(options.canvas);
  var tools = Object.assign({}, { selected: null }, options.tools);
  var colors = Object.assign({}, { selected: null }, options.colors);

  initializeActions(tools);
  selectTool(tools, 'pencil');

  initializeColors(colors);
  selectColor(colors, 'black');
}

function initializeCanvas(canvas) {
  var parent = canvas.parentElement;
  var styles = getComputedStyle(parent);
  var bodyStyles = getComputedStyle(document.body);
  canvas.width = parent.clientWidth - parseInt(styles.paddingLeft, 10) - parseInt(styles.paddingRight, 10);
  canvas.height = parseInt(bodyStyles.height, 10) - canvas.getBoundingClientRect().top - 20;
  return {
    ctx: canvas.getContext('2d'),
    canvas: canvas,
  };
}

function selectTool(tools, action) {
  tools.selected = action;
  Object.keys(tools).map(function (tool) {
    if (tools[tool] instanceof HTMLElement) {
      tools[tool].classList.remove('active');
    }

    if (action === tool) {
      tools[tool].classList.add('active');
    }
  });
}

function initializeActions(tools) {
  Object.keys(tools).map(function (tool) {
    if (tools[tool] instanceof HTMLElement) {
      tools[tool].addEventListener('click', function () {
        selectTool(tools, tool);
      });
    }
  });
}

function selectColor(colors, color) {
  var style = getComputedStyle(colors[color]);
  colors.selected = color;
  colors.active.style.background = style.background;
}

function initializeColors(colors) {
  Object.keys(colors).map(function (color) {
    if (colors[color] instanceof HTMLElement && color !== 'active') {
      colors[color].addEventListener('click', function () {
        selectColor(colors, color);
      });
    }
  });
}

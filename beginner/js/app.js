function main(options) {
  var canvas = initializeCanvas(options.canvas);
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

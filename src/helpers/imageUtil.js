module.exports.imageDataToGrayscale = function imageDataToGrayscale(imageData) {
  var grayscaleImg = [];
  for (var y = 0; y < imageData.height; y++) {
    grayscaleImg[y] = [];
    for (var x = 0; x < imageData.width; x++) {
      var offset = y * 4 * imageData.width + 4 * x;
      var alpha = imageData.data[offset + 3];
      // weird: when painting with stroke, alpha == 0 means white;
      // alpha > 0 is a grayscale value; in that case I simply take the R value
      if (alpha == 0) {
          imageData.data[offset] = 255;
          imageData.data[offset + 1] = 255;
          imageData.data[offset + 2] = 255;
      }
      imageData.data[offset + 3] = 255;
      // simply take red channel value. Not correct, but works for
      // black or white images.
      grayscaleImg[y][x] = imageData.data[y * 4 * imageData.width + x * 4 + 0] / 255;
    }
  }
  return grayscaleImg;
}

module.exports.getBoundingRectangle = function getBoundingRectangle(img, threshold) {
  var rows = img.length;
  var columns = img[0].length;
  var minX = columns;
  var minY = rows;
  var maxX = -1;
  var maxY = -1;
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < columns; x++) {
      if (img[y][x] < threshold) {
        if (minX > x) minX = x;
        if (maxX < x) maxX = x;
        if (minY > y) minY = y;
        if (maxY < y) maxY = y;
      }
    }
  }
  return { minY: minY, minX: minX, maxY: maxY, maxX: maxX};
}

module.exports.centerImage = function centerImage(img) {
  var meanX = 0;
  var meanY = 0;
  var rows = img.length;
  var columns = img[0].length;
  var sumPixels = 0;
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < columns; x++) {
      var pixel = (1 - img[y][x]);
      sumPixels += pixel;
      meanY += y * pixel;
      meanX += x * pixel;
    }
  }
  meanX /= sumPixels;
  meanY /= sumPixels;

  var dY = Math.round(rows/2 - meanY);
  var dX = Math.round(columns/2 - meanX);
  return {transX: dX, transY: dY};
}

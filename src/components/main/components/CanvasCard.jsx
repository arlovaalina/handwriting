import React from 'react';
import brain from 'brain.js';

import { imageDataToGrayscale, getBoundingRectangle, centerImage } from 'helpers/imageUtil';

import './Card.styles';

class CanvasCard extends React.Component {
  state = {
    startDrawing: false,
  }

  getOffsetSum = (elem) => {
    let top = 0;
    let left = 0;
    while (elem) {
      top = top + parseInt(elem.offsetTop);
      left = left + parseInt(elem.offsetLeft);
      elem = elem.offsetParent;
    }
    return {
      top,
      left,
    };
  }

  onClearCanvas = () => {
    const context = this.refs.canvas.getContext('2d');
    context.fillStyle = "white";
    context.fillRect(0, 0, 280, 280);
    // thumbnailCtx.fillStyle = "white";
    // thumbnailCtx.fillRect(0,0,footprint.width,footprint.height);
    // document.getElementById('result').innerText = '';
    // isRecognized = false;
  }

  onRecognizeDigit = () => {
    const canvas = this.refs.canvas;
    const context = this.refs.canvas.getContext('2d');
    let imageData = context.getImageData(0, 0, 280, 280);

    let grayscaleImage = imageDataToGrayscale(imageData);
    const boundingRectangle = getBoundingRectangle(grayscaleImage, 0.01);
    const trans = centerImage(grayscaleImage); // [dX, dY] to center of mass

    // copy to hidden canvas
    const canvasCopy = document.createElement("canvas");
    canvasCopy.width = imageData.width;
    canvasCopy.height = imageData.height;
    const copyCtx = canvasCopy.getContext("2d");
    const brW = boundingRectangle.maxX + 1 - boundingRectangle.minX;
    const brH = boundingRectangle.maxY + 1 - boundingRectangle.minY;
    const scaling = 190 / (brW > brH ? brW : brH);

    // scale
    copyCtx.translate(canvas.width/2, canvas.height/2);
    copyCtx.scale(scaling, scaling);
    copyCtx.translate(-canvas.width/2, -canvas.height/2);
    // translate to center of mass
    copyCtx.translate(trans.transX, trans.transY);
    copyCtx.drawImage(context.canvas, 0, 0);

    // now bin image into 10x10 blocks (giving a 28x28 image)
    imageData = copyCtx.getImageData(0, 0, 280, 280);
    grayscaleImage = imageDataToGrayscale(imageData);

    var nnInput = new Array(784);
    for (var y = 0; y < 28; y++) {
      for (var x = 0; x < 28; x++) {
        var mean = 0;
        for (var v = 0; v < 10; v++) {
          for (var h = 0; h < 10; h++) {
              mean += grayscaleImage[y * 10 + v][x * 10 + h];
          }
        }
        mean = (1 - mean / 100); // average and invert
        nnInput[x * 28 + y] = (mean - .5) / .5;
      }
    }

    const network = new brain.NeuralNetwork();
    network.fromJSON(require('data/trainedNetwork.json'));
    const output = network.run(nnInput);

    const resultNumber = output.indexOf(Math.max(...output));

    console.log(output);
    console.log(resultNumber);
  }

  onMouseDown = (event) => {
    const context = this.refs.canvas.getContext('2d');
    const x = event.pageX - this.getOffsetSum(this.refs.canvas).left;
    const y = event.pageY - this.getOffsetSum(this.refs.canvas).top;

    this.setState({
      ...this.state,
      context,
      startDrawing: true,
    });
    context.beginPath();
    context.lineWidth = 5;
    context.lineCap="round";
    context.strokeStyle="#585858";
    context.moveTo(x, y);
  }

  onMouseMove = (event) => {
    const { context, startDrawing } = this.state;
    if (startDrawing) {
      const x = event.pageX - this.getOffsetSum(this.refs.canvas).left;
      const y = event.pageY - this.getOffsetSum(this.refs.canvas).top;

      context.lineTo(x, y);
      context.stroke();
    }
  }

  onMouseUp = () => {
    this.setState({
      ...this.state,
      startDrawing: false,
    });
  }

  render() {
    return (
      <article className="card">
        <div className="card__title">
          Try it yourself
        </div>
        <div className="card__subtitle">
          Please, draw a digit from 0 to 9 in the field below.
          After you have drawn, click the "Recognize" button and compare results.
        </div>
        <div className="card__canvas">
          <canvas
            ref="canvas"
            className="canvas"
            width="280"
            height="280"
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseUp}
          >
          </canvas>
          <div className="canvas__button-container">
            <button className="canvas__clear-button" onClick={this.onClearCanvas}>Clear</button>
            <button className="canvas__recognize-button" onClick={this.onRecognizeDigit}>Recognize</button>
          </div>
        </div>
      </article>
    );
  }
}

export default CanvasCard;

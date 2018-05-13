import React from 'react';

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
            <button className="canvas__clear-button">Clear</button>
            <button className="canvas__recognize-button">Recognize</button>
          </div>
        </div>
      </article>
    );
  }
}

export default CanvasCard;

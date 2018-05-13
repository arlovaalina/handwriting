import React from 'react';

import './Card.styles';

class CanvasCard extends React.Component {
  state = {
    startDrawing: false,
  }

  getOffsetSum = (elem) => {
    var top=0, left=0
    while(elem) {
        top = top + parseInt(elem.offsetTop)
        left = left + parseInt(elem.offsetLeft)
        elem = elem.offsetParent
    }
    return {top: top, left: left};
  }

  onMouseDown = (event) => {
    const context = this.refs.canvas.getContext('2d');
    const x = event.pageX - this.getOffsetSum(this.refs.canvas).left;
    const y = event.pageY - this.getOffsetSum(this.refs.canvas).top;

    console.log(event.target.offsetTop);

    console.log(x);
    console.log(y);

    this.setState({
      ...this.state,
      context,
      startDrawing: true,
    });
    context.beginPath();
    context.lineWidth = 10;
    context.lineCap="round";
    context.moveTo(x, y);
  }

  onMouseMove = (event) => {
    if (this.state.startDrawing) {
      const x = event.pageX - this.getOffsetSum(this.refs.canvas).left;
      const y = event.pageY - this.getOffsetSum(this.refs.canvas).top;
      const { context } = this.state;
      console.log('move');
      context.lineTo(x, y);
      context.stroke();
    }
  }

  onMouseUp = () => {
    this.setState({
      ...this.state,
      startDrawing: false,
    });
    console.log('up');
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
        <div className="card__main">
          <canvas
            ref="canvas"
            className="card__canvas"
            name="canvas"
            id="canvas"
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

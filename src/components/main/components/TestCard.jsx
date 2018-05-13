import React from 'react';

import './Card.styles';

class TestCard extends React.Component {
  state = {
    isDigitGenerated: false,
  }

  onGenerateDigit = () => {
    const set = mnist.set(0, 1);
    const testSet = set.test;
    this.setState({
      ...this.state,
      isDigitGenerated: true,
      testSet: testSet[0],
    });
  }

  onStartAlgorithm = () => {
    const network = new brain.NeuralNetwork();
    network.fromJSON(require('data/trainedNetwork.json'));
    const output = network.run(this.state.testSet.input);
    this.setState({
      ...this.state,
      isDigitGenerated: false,
      result: output,
    });
  }

  render() {
    const { isDigitGenerated, testSet, result } = this.state;

    return (
      <article className="card">
        <div className="card__title">
          Try network on test data
        </div>
        <div className="card__subtitle">
          After you click "Generate digit" button program will generate a test data set.
          Then you can check that algorithm works correctly by comparing its output
          with ideal result.
        </div>
        <div className="card__main">
          <div className="card__button-container">
            {!isDigitGenerated ?
              <button className="card__generate-button" onClick={this.onGenerateDigit}>
                Generate digit
              </button> :
              <button className="card__start-button" onClick={this.onStartAlgorithm}>
                Start algorithm
              </button>
            }
          </div>
          <div className="card__result">
            <div>
              {testSet && `[ ${testSet.output.join(', ')} ] - number ${testSet.output.findIndex(digit => digit === 1)}`}
            </div>
              {result &&
                <div>
                  <div className="card__result-label">
                    <p>&#8595;</p>
                    <span>Result</span>
                    <p>&#8595;</p>
                  </div>
                  <div>
                    {result.map((value, index) => {
                      return index === result.length - 1 ?
                        <div>{value} ] - number {result.indexOf(Math.max(...result))}</div> :
                        <div>{index === 0 ? `[ ${value},` : `${value},`}</div>
                    })}
                  </div>
                </div>
              }
          </div>
        </div>
      </article>
    );
  }
}

export default TestCard;

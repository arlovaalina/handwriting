import React from 'react';
import brain from 'brain.js';
import mnist from 'mnist';

import TestCard from './components/TestCard';
import CanvasCard from './components/CanvasCard';

import './Main.styles';

class Main extends React.Component {
  render() {
    return (
      <main className="main">
        <section className="main__caption">
          <div className="main__title">
            Handy
          </div>
          <div className="main__subtitle">
            Your handwritten letters recognition.
          </div>
        </section>
        <section className="main__demo">
          <TestCard />
          <CanvasCard />
        </section>
      </main>
    );
  }
}

export default Main;

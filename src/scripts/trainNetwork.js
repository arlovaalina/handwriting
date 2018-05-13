const brain = require('brain.js');
const fs = require('fs');
const mnist = require('mnist');

const startTrain = () => {
  const network = new brain.NeuralNetwork();

  const set = mnist.set(20000, 0);
  const trainingSet = set.training;

  network.train(trainingSet,
    {
      errorThresh: 0.001,  // error threshold to reach
      iterations: 20000,   // maximum training iterations
      log: true,           // console.log() progress periodically
      logPeriod: 1,       // number of iterations between logging
      learningRate: 0.3    // learning rate
    }
  );

  const wstream = fs.createWriteStream('../data/trainedNetwork.json');
  wstream.write(JSON.stringify(network.toJSON(), null, 2));
  wstream.end();

  console.log('Network train is finished.');
}

startTrain();

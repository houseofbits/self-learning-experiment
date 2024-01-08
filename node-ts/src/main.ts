import TrainingDataBuilder from "./TrainingDataBuilder";
import FitnessPrediction from "./FitnessPrediction";
import InterpolatedGenerator from "./generators/InterpolatedGenerator";
import WaveGenerator from "./generators/WaveGenerator";
import RandomGenerator from "./generators/RandomGenerator";
import Range from "./helpers/Range";
import Graph from "./graph/Graph";

const trainingDataBuilder = new TrainingDataBuilder();

// trainingDataBuilder.generateTrainingData();

// console.log('Done building training data. Data points size: ' + trainingDataBuilder.parametricGenerator.getIterationCount());

// trainingDataBuilder.save('data/training.json');

// console.log('Training data written to file');

import * as tf from "@tensorflow/tfjs-node";

async function train() {
    await trainingDataBuilder.read("data/training.json");

    const dataSize = trainingDataBuilder.trainingDataInput[0].length;
    const dataPointsSize = trainingDataBuilder.trainingDataInput.length;

    const model = tf.sequential();
    model.add(
        tf.layers.dense({
            units: 80,
            inputShape: [dataSize],
            activation: "sigmoid",
        })
    );
    model.add(tf.layers.dense({ units: 60, activation: "sigmoid" }));
    model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
    //   model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' })
    model.compile({ optimizer: tf.train.adam(0.005), loss: "meanSquaredError" });

    const inputTensor = tf.tensor2d(trainingDataBuilder.trainingDataInput, [
        dataPointsSize,
        dataSize,
    ]);
    const outputTensor = tf.tensor2d(trainingDataBuilder.trainingDataExpected, [
        dataPointsSize,
        1,
    ]);

    const epochSize = 5000;

    // Train model with fit().
    await model.fit(inputTensor, outputTensor, {
        epochs: epochSize,
    });

    model.save("file://mymodel");
}

async function predictFitness() {
    const prediction = new FitnessPrediction();
    await prediction.load("test-model");

    const generator = new InterpolatedGenerator(
        new WaveGenerator(30),
        new RandomGenerator(-45, 45, 30, 30),
        0.5
    );

    const xScale = new Range(20, 50);
    const yScale = new Range(0.8, 1.6);

    (<WaveGenerator>generator.generatorA).xScale = xScale.getRandom();
    (<WaveGenerator>generator.generatorA).yScale = yScale.getRandom();

    const graph = new Graph();
    graph.generate(generator, 40);

    await prediction.predict(graph);
}

// train();
predictFitness();

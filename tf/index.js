const tf = require("@tensorflow/tfjs-node");

// async function train() {
//     const model = tf.sequential();
//     model.add(tf.layers.dense({ units: 3, inputShape: [2], activation: 'sigmoid' }));
//     model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
//     model.compile({ optimizer: tf.train.adam(0.1), loss: "meanSquaredError" });

//     // Generate some synthetic data for training.
//     const inputTensor = tf.tensor2d([[0, 0],[1, 0],[0, 1],[1, 1]], [4, 2]);
//     const outputTensor = tf.tensor2d([0, 1, 1, 0], [4, 1]);

//     // Train model with fit().
//     await model.fit(inputTensor, outputTensor, { epochs: 250 });

//     const result = model.predict(
//         tf.tensor2d([
//             [0, 0],
//             [1, 0],
//             [0, 1],
//             [1, 1],
//         ])
//     ); //.print();
//     const dta = await result.data();

//     console.log(dta);
// }

// async function train2() {
//     const model = tf.sequential();
//     model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

//     // Prepare the model for training: Specify the loss and the optimizer.
//     model.compile({ optimizer: tf.train.adam(0.1), loss: "meanSquaredError" });
    // model.compile({ optimizer: 'sgd', loss: "meanSquaredError" });

//     //y = x * 2
//     const xs = tf.tensor2d([1, 2, 3, 8, 10, 12], [6, 1]);
//     const ys = tf.tensor2d([2, 4, 6, 16, 20, 24], [6, 1]);    

//     // Train the model
//     await model.fit(xs, ys, { epochs: 250 });

//     const testInput = tf.tensor2d([1.2], [1, 1]);
//     const predictions = model.predict(testInput);

//     const dta = await predictions.data();

//     console.log(dta);
// }

// async function train3() {
//     const model = tf.sequential();
//     model.add(tf.layers.dense({ units: 4, inputShape: [4], activation: 'sigmoid' }));
//     model.add(tf.layers.dense({ units: 3, activation: 'sigmoid' }));
//     model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
//     model.compile({ optimizer: tf.train.adam(0.01), loss: "meanSquaredError" });

//     const input = [
//         [1,2,3,4], [4,3,2,1], [0,0,0,0]
//     ];
//     const output = [1.0, 0.0, 0.0];

//     const inputTensor = tf.tensor2d(input, [input.length, input[0].length]);
//     const outputTensor = tf.tensor2d(output, [input.length, 1]);

//     await model.fit(inputTensor, outputTensor, { epochs: 1000 });

//     await model.save('file://mymodel');
// }

async function loadAndTest()
{
    const model = await tf.loadLayersModel('file://mymodel/model.json');
    if (model) {
        const test = [
            [1,2,3,4],
            [4,3,2,1],
            [0,0,0,0],
            [1,0,0,0],
            [1,2,0,0],                
            [1,2,3,0],                        
        ];
        const testInput = tf.tensor2d(test, [test.length, 4]);
        const predictions = model.predict(testInput);
    
        const dta = await predictions.data();
    
        console.log(dta);
    }
}

// train();
// train2();

// train3();
loadAndTest();


// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/ewvM65v9z/";

let model, webcam, labelContainer, maxPredictions;


let speech = new SpeechSynthesisUtterance();
speech.lang = "en-US";
speech.text;
speech.volume = 10;
speech.rate = 1;
speech.pitch = 1;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    var msg;
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        // classPrediction.j7pro
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
    for (const model of prediction) {
        console.log(model.className + " whiteBoardmarker " + " all the models");
        if (model.className === "whiteBoardmarker") {
            // console.log("I'm seing a phone j7 pro!!!") 
            msg = "I'm seeing a whiteBoardmarker"
        } 
        else if (model.className === "j7 pro" ) {
            msg = "I'm seeing a phone j7 pro!!!";
        } 
        else if (model.className === "kokipen") {
            msg = "I'm seeing a kokipen!!!"
        }
        else {
            msg = "not quiet sure what that is, try a different angle!"

        }
    }
    // speak here...
    // console.log(msg);
    await textToAudio(msg)
}

async function textToAudio(text) {
    speech.text = text;
    console.log(speech.text + " text to be read!!!");
    window.speechSynthesis.speak(speech);
}

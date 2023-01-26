const question = document.querySelector("#question"),
    responseArea = document.querySelector("#response"),
    voiceList = document.querySelector("#voice-submission"),
    voiceList2 = document.querySelector("#voice-response"),
    speechBtn = document.querySelector("#ask-btn"),
    speechResponse = document.querySelector("#response-speak"),
    speechQuestion = document.querySelector("#question-speak");

let synth = speechSynthesis,
    isSpeakingQuestion = true,
    isSpeakingResponse = true,
    isPaused = false,
    type = 'question',
    myInterval,
    currentResponse;

voices();

function voices() {
    for (let voice of synth.getVoices()) {
        let selected = voice.name === "Google US English" ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
        voiceList2.insertAdjacentHTML("beforeend", option);
    }
}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text, type) {

    let utterance = new SpeechSynthesisUtterance(text);
    if (type === "question") {
        for (let voice of synth.getVoices()) {
            if (voice.name === voiceList.value) {
                utterance.voice = voice;
            }
        }
    } else {
        for (let voice of synth.getVoices()) {
            if (voice.name === voiceList2.value) {
                utterance.voice = voice;
            }
        }
    }
    synth.speak(utterance);
}

speechBtn.addEventListener("click", e => {
    e.preventDefault();

    if (question.value !== "" && type === "question") {
        if (!synth.speaking) {
            aiFunction();
            textToSpeech(question.value, type);
        }
        if (question.value.length > 80) {
            let questionInterval = setInterval(() => {
                if (!synth.speaking && !isSpeakingQuestion) {
                    isSpeakingQuestion = true;
                    type = 'response';
                    clearInterval(questionInterval)
                } else {
                }
            }, 300);
            if (isSpeakingQuestion) {
                isPaused = false;
                synth.resume();
                isSpeakingQuestion = false;
                speechBtn.innerText = "Pause Speech";
            } else {
                isPaused = true;
                clearInterval(myInterval)
                synth.pause();
                isSpeakingQuestion = true;
                speechBtn.innerText = "Resume Speech";
            }
        } else {
            let questionInterval1 = setInterval(() => {
                if (!synth.speaking) {
                    speechBtn.innerText = "Submit & Speak";
                    type = 'response';
                    clearInterval(questionInterval1)
                } else {
                }
            }, 300);
        }
    }


    if (!isPaused) {
        myInterval = setInterval(function () {
            speakResponse();
        }, 300);
    }

});

function speakResponse() {

    if (responseArea.value !== "" && type === "response" && currentResponse != responseArea.value) {
        clearInterval(myInterval);
        currentResponse = responseArea.value;
        if (!synth.speaking) {
            textToSpeech(responseArea.value, type);
        }
        if (responseArea.value.length > 80) {
            let responseInterval = setInterval(() => {
                if (!synth.speaking && !isSpeakingResponse) {
                    isSpeakingResponse = true;
                    speechBtn.innerText = "Submit & Speak";
                    type = "question";
                    clearInterval(responseInterval);
                } else {
                }
            }, 300);
            if (isSpeakingResponse) {
                synth.resume();
                isSpeakingResponse = false;
                speechBtn.innerText = "Pause Speech";
            } else {
                synth.pause();
                isSpeakingResponse = true;
                speechBtn.innerText = "Resume Speech";
            }
        } else {
            let responseInterval1 = setInterval(() => {
                if (!synth.speaking) {
                    speechBtn.innerText = "Submit & Speak";
                    type = 'question';
                    clearInterval(responseInterval1)
                } else {
                }
            }, 300);
        }
    }
}

function aiFunction() {

    let url = "https://galileo-ai.herokuapp.com/post";
    let response = fetch(url + "?prompt=" + "{" + question.value + "}", {
        method: "GET",
    }).then(response => response.json())
        .then(data => {
            responseArea.value = data.response.trim().replace(/^\:+/g, '').trim().replace(/^\:+/g, '').replace('A:', '').trim();
        });
}

speechResponse.addEventListener('click', speakOnlyResponse);
speechQuestion.addEventListener('click', speakOnlyQuestion);

function speakOnlyResponse(event) {
    event.preventDefault();
    if (!synth.speaking && responseArea.value !== "") {
        textToSpeech(responseArea.value, 'response');
    }
}

function speakOnlyQuestion(event) {
    event.preventDefault();
    if (!synth.speaking && question.value !== "") {
        textToSpeech(question.value, 'question');
    }
}
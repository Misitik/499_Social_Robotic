const nameInput = document.getElementById("player-name");
const nameButton = document.getElementById("name-submit");
const nameSection = document.getElementById("name-section");
const contentSection = document.getElementById("content-section");
const welcomeText = document.getElementById("welcome-text");
const startLink = document.getElementById("start-link");

nameButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) return alert("Please enter your name!");

    sessionStorage.setItem("playerName", name);
    welcomeText.textContent = `👋 Welcome, ${name}!`;
    nameSection.style.display = "none";
    contentSection.style.display = "block";

    readWelcome(); // Auto-read welcome
});

// Voice Agent Functions
function speak(text) {
    const synth = window.speechSynthesis;
    if (!synth) {
        alert("Sorry, your browser doesn't support text-to-speech.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    synth.cancel(); // Stop any ongoing speech
    synth.speak(utterance);
}

function readWelcome() {
    const name = document.getElementById("player-name").value.trim();
    if (!name) {
        speak("Please enter your name first.");
        return;
    }
    const welcomeMessage = `Hello ${name}, welcome to the Canadian National Parks game! Get ready to explore!`;
    speak(welcomeMessage);
}

function readInstructions() {
    const instructions = `
        Here's how to play:
        Drag each tourist place to its correct province on the map.
        You get 10 points for every correct answer.
        You'll lose 10 points for incorrect ones.
        Learn here first to improve your chances!
    `;
    speak(instructions);
}

function startListening() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Not supported. Try again.");
        return;
    }

    let recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = function () {
        document.getElementById("status").innerText = "Listening...";
    };

    recognition.onresult = function (event) {
        let command = event.results[0][0].transcript.trim();
        document.getElementById("status").innerText = "Recognition complete.";
        document.getElementById('player-name').value = command;
    };

    recognition.start();
}


// Save/Load Logic
let users = [];
let datalog = {};
let selected_user = '';
let log_ids = [];
let the_log_id = -1;

function load_saves() {
    document.getElementById('black_screen').style.visibility = 'visible';
    document.getElementById('load_panel').style.visibility = 'visible';
    document.getElementById('save_select').style.visibility = 'hidden';
    document.getElementById('user_select').style.visibility = 'visible';
    get_user_saves();
}

function close_saves() {
    document.getElementById('black_screen').style.visibility = 'hidden';
    document.getElementById('load_panel').style.visibility = 'hidden';
    document.getElementById('save_select').style.visibility = 'hidden';
    document.getElementById('user_select').style.visibility = 'hidden';
}

function get_user_saves() {
    users = JSON.parse(document.getElementById('map_users').getAttribute('value'));
    users = JSON.parse(users);
    const user_select = document.getElementById('user_select');
    user_select.innerHTML = '';

    users.forEach(user => {
        let option = document.createElement('option');
        option.value = user.fields.save_points;
        option.textContent = user.fields.name;
        option.onclick = function () {
            const array = option.value.split(',').map(Number);
            selected_user = option.textContent;
            log_ids = array;
        };
        user_select.appendChild(option);
    });
}

function create_user(new_user) {
    fetch(`/api/save-log-map-user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(new_user)
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}

function update_user(user, log_id) {
    fetch(`/api/load-log-map-user/${log_id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    }).then(response => console.log(response))
      .catch(error => console.error('Error:', error));
}

function go_to_game_3(user, log_id) {
    Object.assign(user, { log_id: log_id });

    fetch(`/game3_game/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    }).then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.text();
        }
    }).catch(error => console.error('Error:', error));
}

function admit_user() {
    const name = document.getElementById('player-name').value;
    let user_index = 0;
    let user_exist = false;
    let the_user = {};

    users = JSON.parse(document.getElementById('map_users').getAttribute('value'));
    saves = JSON.parse(document.getElementById('map_saves').getAttribute('value'));

    const new_save_index = JSON.parse(saves).length + 1;
    users = JSON.parse(users);

    users.forEach(user => {
        if (user.fields.name === name) {
            user_exist = true;
            user_index = user.pk;
            the_user = user.fields;
        }
    });

    if (!user_exist) {
        const new_user = { name: name, save_points: [new_save_index] };
        create_user(new_user);
        go_to_game_3(new_user, -1);
    } else {
        the_user.save_points.push(new_save_index);
        update_user(the_user, user_index);
        go_to_game_3(the_user, -1);
    }
}

document.getElementById('select_user_button').onclick = function () {
    const saves = JSON.parse(document.getElementById('map_saves').getAttribute('value'));
    document.getElementById('save_select').style.visibility = 'visible';

    const save_select = document.getElementById('savepoints_select');
    save_select.innerHTML = '';
    let save_index = 0;

    log_ids.forEach(log_id => {
        const save_point = JSON.parse(saves).find(obj => obj.pk === log_id);
        const option = document.createElement('option');
        option.value = log_id;
        option.textContent = selected_user + '  ' + save_index.toString();
        save_index += 1;
        option.onclick = function () {
            the_log_id = option.value;
        };
        save_select.appendChild(option);
    });
};

document.getElementById('select_load_button').onclick = function () {
    const users = JSON.parse(document.getElementById('map_users').getAttribute('value'));
    const parsed_users = JSON.parse(users);
    let the_user = '';

    parsed_users.forEach(user => {
        if (user.fields.name === selected_user) {
            the_user = user;
        }
    });

    go_to_game_3(the_user, the_log_id);
};
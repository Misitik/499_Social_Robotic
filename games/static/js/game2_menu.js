
/////////////////////////////////////////////////////
//Load save_points//////////////////////////////////
///////////////////////////////////////////////////
//////////////////////////////////////////////////
selected_user = ''
log_ids = []
the_log_id = 0
function get_user_saves()
{
    users = JSON.parse(document.getElementById('users').getAttribute('value'))

    users = JSON.parse(users)
    console.log(users)
    user_select = document.getElementById('user_select')
    user_select.innerHTML = ''

    users.forEach(user => {
        let option = document.createElement('option')
        option.value = [user.fields.save_points]
        option.textContent = user.fields.name
        option.onclick = function(){
            array = [option.value]
            array = array[0].split(',').map(Number)
            console.log(array)
            selected_user = option.textContent
            log_ids = array
            console.log(log_ids)
        }
        user_select.appendChild(option)
        
    })
}


function load_saves()
{
    //console.log(JSON.parse(document.getElementById('users').getAttribute('value')))
    get_user_saves()
    document.getElementById('black_screen').style.visibility='visible'
    document.getElementById('load_panel').style.visibility = 'visible'
}

function close_saves()
{
    document.getElementById('black_screen').style.visibility='hidden'
    document.getElementById('load_panel').style.visibility = 'hidden'
}

function get_saves()
{


}

let users = []



function create_user(new_user)
{
    console.log(new_user)
    fetch(`/api/save-log-manner-user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new_user)
    })
    .then(response => response.json())
    .then(new_user => console.log(new_user))
    .catch(error => console.error('Error:', error));
}

function update_user(user, log_id)
{
    console.log(JSON.stringify(user))
    fetch(`/api/load-log-manner-user/${log_id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        
        },
        body: JSON.stringify(user)
    })
    .then(response => console.log(response))
    .then(user => console.log(user))
    .catch(error => console.error('Error:', error));
}

function go_to_game_2(user, log_id)
{

    Object.assign(user, {log_id: log_id})
    
    fetch(`/game2_game/`, {
    
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (response.redirected)
        {
            window.location.href = response.url
        }else
        {
            return response.text()
        }
    })
    .then(user => console.log())
    .catch(error => console.error('Error:', error));
  
}

function admit_user()
{
    //get the user name
    name = document.getElementById('input_box').value
    console.log(name)
    user_index = 0;
    user_exist = false
    the_user = {}
    //get the data
    console.log(document.getElementById('users').getAttribute('value'))
    users = JSON.parse(document.getElementById('users').getAttribute('value'))
    saves = JSON.parse(document.getElementById('savepoints').getAttribute('value'))
    console.log(JSON.parse(users), JSON.parse(saves).length)

    new_save_index = JSON.parse(saves).length + 1
    console.log(new_save_index)
    console.log(users)
    users = JSON.parse(users)
    users.forEach(user => {
        if(user.fields.name === name)
        {
            console.log(user)
            user_exist = true
            user_index = user.pk
            the_user = user.fields
            
        }

    })//no problem

    console.log(user_exist, user_index)
    //check whether user exists already
    if(user_exist === false)
    {
        new_user = {
            name:name,
            save_points:[new_save_index]
        }
        console.log(new_user)
        create_user(new_user)

        go_to_game_2(new_user,-1)
    }//else
   {
        //get the user data
        user = {
           name: the_user.name,
           save_points: the_user.savepoints
        }
        console.log(user, the_user)
        the_user.save_points.push(new_save_index)
        console.log(the_user)
        new_user = the_user
        update_user(the_user, user_index)

        go_to_game_2(new_user,-1)
    }

}



//////////////////////////
//Voice
window.speechSynthesis.cancel()
console.log(document.getElementById('instruction').innerHTML)
function startListening() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Not supported. Try again.");
        return;
    }

    let recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = function() {
        document.getElementById("status").innerText = "Listening...";
    };

    // event.result[0] = [
    //     {transcript: "The answer is right", confidence: 0.97},
    //     {transcript: "The answer is write", confidence: 0.80},
    // ]
    recognition.onresult = function(event) {
        let command = event.results[0][0].transcript.trim();
        document.getElementById("status").innerText = "Recognition complete.";
        document.getElementById('input_box').value = command


    };

    recognition.start();
}

function sendData() {
    let username = document.getElementById("username").value;

    fetch('/process/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken() // Get CSRF token dynamically
        },
        body: JSON.stringify({ username: username })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("response").innerText = data.message;
    })
    .catch(error => console.error("Error:", error));
}

// Function to get CSRF token from Django (required for security)
function getCSRFToken() {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("csrftoken=")) {
            return cookie.substring("csrftoken=".length, cookie.length);
        }
    }
    return "";
}

document.getElementById('storm').volume = 0.25
document.getElementsByTagName("body")[0].style = "background-image: url('static/images/elementary_school.jpg');"

//html
let voices = [];

function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    let voiceSelect = document.getElementById("voiceSelect");

    voiceSelect.innerHTML = ''; // Clear previous options
   
    voices.forEach((voice, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.onclick = function(){console.log(option)}
        option.textContent = voice.name;
        voiceSelect.appendChild(option);
    });

    voiceSelect.onclick = function(){
        e = document.getElementById('voiceSelect') 
        console.log(e.options[e.selectedIndex].text)}
}
window.speechSynthesis.onvoiceschanged = loadVoices;
window.addEventListener("load", loadVoices);

function speakText(text) {
    
    console.log(text)
    let speech = new SpeechSynthesisUtterance(text); // text="Hello World"
    window.speechSynthesis.cancel()
    let voiceSelect = document.getElementById("voiceSelect");

    if (voices.length > 0) {
        speech.voice = voices[185];
        console.log(voiceSelect.value)
    }

    speech.lang = "en-US";
    speech.rate = 1; // slow to fast
    speech.pitch = 1; // deep to high
    speech.volume = 1; // mute to loud

   // let mouth = document.getElementById("robotMouth");

    // Animate Mouth
  //  mouth.classList.add("talking");

   // speech.onend = function() {
   //     mouth.classList.remove("talking");
 //  };

    window.speechSynthesis.speak(speech);
}

/**
 * the button that display the necessary information for player to load data
 */
document.getElementById('select_user_button').onclick = function(){
    name_to_find = selected_user
    saves = JSON.parse(document.getElementById('savepoints').getAttribute('value'))
    document.getElementById('save_select').style.visibility = 'visible'

    saves = JSON.parse(saves)
    save_select = document.getElementById('savepoints_select')
    save_select.innerHTML = ''
    user_saves = []
    save_index = 0
    console.log(saves)

    console.log(log_ids)
    log_ids.forEach(log_id => {
            console.log(log_id)
 
            save_point = saves.find(obj => obj.pk === log_id)
            console.log(save_point)

            let option = document.createElement('option')
            option.value = log_id
            option.textContent = selected_user + '  ' + save_index.toString()
            save_index +=1
            option.onclick = function(){
                console.log(option.value)
                the_log_id = option.value
            }
            save_select.appendChild(option)
        
       
        
    })
}

document.getElementById('select_load_button').onclick = function(){
    users = JSON.parse(document.getElementById('users').getAttribute('value'))
    users = JSON.parse(users)

    the_user = ''

    users.forEach(user => {
        if (user.fields.name === selected_user)
        {
            the_user = user
        }

    })

         go_to_game_2(the_user,the_log_id)


}
instruction_text = document.getElementById("instruction_text").innerText;
background_text = document.getElementById("background_text").innerText;
instruction_button = document.getElementById('instruction_button')
background_button = document.getElementById('instruction_button')



instruction_button.onclick = function(){speakText(instruction_text)}
background_button.onclick = function(){speakText(background_text)}


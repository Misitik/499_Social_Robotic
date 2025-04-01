  
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
        document.getElementById('spoken').innerHTML = command
    };

    recognition.start();
}

function speaken(){
    console.log('fff')
    startListening()
    spoken = document.getElementById('spoken').innerHTML
    if(spoken === dialogue_option_1)
    {
        last_branch_name = branch_name
        branch_name = dialogue_fields.option_1_branch
        datalog.choosing_scenario.push(branch_name)
        datalog.options_choosen.push(2)
        update_save_point(log_id)
        play_sound(option_click_sound)
        console.log('clicked')
        get_branching_info()
    }else if(spoken === dialogue_option_2)
    {
        last_branch_name = branch_name
        branch_name = dialogue_fields.option_2_branch
        datalog.choosing_scenario.push(branch_name)
        datalog.options_choosen.push(2)
        update_save_point(log_id)
        play_sound(option_click_sound)
        console.log('clicked')
        get_branching_info()
    }else if(spoken === dialogue_option_3)
    {
        last_branch_name = branch_name
        branch_name = dialogue_fields.option_3_branch
        datalog.choosing_scenario.push(branch_name)
        datalog.options_choosen.push(2)
        update_save_point(log_id)
        play_sound(option_click_sound)
        console.log('clicked')
        get_branching_info()
    }else{
        speakText('Say it again please')
    }
}

console.log(document.getElementById('speak'))


//musics
hover_sound = document.getElementById('hover')
click_sound = document.getElementById('click')
option_click_sound = document.getElementById('option_click')
classroom_sound = document.getElementById('classroom')
happy_sound = document.getElementById('happy')
sad_sound = document.getElementById('sad')
play_ending_music = true
branch_name = '1_introduction'   //initial branch
////////////////////////////////////////////////////////////////////////
//Load and save functionalies
////////////////////////////////////////////////////////////////////////
users_data = JSON.parse(document.getElementById('userdata').getAttribute('value'))


//console.log(JSON.parse(users_data))
let username = users_data.name
//get the last element, which points to the save slot
console.log(users_data)
log_id = Number(users_data.log_id)
console.log(users_data.log_id)
last_branch_name = ''
saves = JSON.parse(document.getElementById('saves').getAttribute('value'))
//log_id = JSON.parse(document.getElementById('logid').getAttribute('value'))
//console.log(log_id)

let datalog = {}
let time = 0

function timer(time){
  
    var timer = setInterval(function(){
    datalog.time +=1
    update_save_point(log_id)

    }, 1000);
}

function create_save_point()
{
    fetch(`/api/save-log-manner/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datalog)
    })
    .then(response => response.json())
    .then(datalog => console.log(datalog))
    .catch(error => console.error('Error:', error));
}

function update_save_point(log_id)
{
    //console.log(JSON.stringify(datalog))
    fetch(`/api/load-log-manner/${log_id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        
        },
        body: JSON.stringify(datalog)
    })
    .then(response => console.log())
    .then(datalog => console.log())
    .catch(error => console.error('Error:', error));
}

function load_game()
{
    console.log(last_branch_name)
    //get the branch name
    branch_name = last_branch_name

    //load the branch
    get_branching_info()

    //update the log
}

if(log_id === -1)
{
    if(username === '') {username = 'Anonymous'}
    branch_name = "1_introduction"
    log_id = saves.length +1

    console.log(log_id)
    //create a new data
    datalog = {
        time: 0,
        game_won:false,
        options_choosen:[],
        choosing_scenario:[branch_name]
    }


   create_save_point()


   //start the timer from 0
   timer(0)

}else{//if we are loading an existing save

    //load the saves 
    save_spot = saves.find(obj => obj.pk === log_id).fields

    //update the variables for the game
    username = users_data.fields.name
    datalog = save_spot
    scenarios = datalog.choosing_scenario
    branch_name = scenarios[scenarios.length-1]
    console.log( branch_name)
    time = datalog.time
    timer(time)

}


//get the dialogue passed from game1_py from the div element dialogue

let dialogues = JSON.parse(document.getElementById("dialogue").getAttribute('value'))
dialogues= JSON.parse(dialogues)


dialogue_text = document.getElementById('dialogue_text')
option_box = document.getElementById('choice_box')
c_name = document.getElementById('character_name')
option_box.style.visibility = 'hidden'



function play_sound(sound)
{
    sound.currentTime = 0
    sound.play()
}


    buttons = document.querySelectorAll('button')
    buttons.forEach(button => {
        button.onclick = function()
        {
            happy_sound.pause()
            sad_sound.pause()
        }
    })


dialogue = dialogues[0].fields.dialogue

/**
 * 
 * @param textfield dialogue 
 * @returns splited string array of tuples: (name, text), the tuple is an array
 */
function split_dialogue(dialogue)
{
    lines = dialogue.split(/r?\n/)
    splited_dialogue = []
    lines.forEach(line => {

        if(line !== "\r" )
        {
            //should have the form of name: text, i.e: teacher: how are you guys?
            splited = line.split(':')
            splited_dialogue.push(splited)
            console.log(splited_dialogue)
            
        }

    })

    return splited_dialogue
}

let this_dialogue = []    //this is for click to advance the dialogue


let dialogue_object =  ""
dialogues.forEach(element => {
                          if(element.fields.name === branch_name) 
                            {
                                dialogue_object = element
                                console.log(element)
                            }
               
                     }) 
                     
//text displayed for each choice
dialogue_option_1 = ''
dialogue_option_2 = ''
dialogue_option_3 = ''

//the hint associated with each choice
dialogue_option_1_hint = ''
dialogue_option_2_hint = ''
dialogue_option_3_hint = ''

//the name of the branch to go, when chose this particular choice, 
dialogue_option_1_branch = ''
dialogue_option_2_branch = ''
dialogue_option_3_branch = ''

//win and lose flag
win = false
lose = false

//the correct choice for this branch
correct_option = ''

//what to show up on the screen
ending_message = ''

function choice_hover()
{
    hover_sound.currentTime = 0
    hover_sound.play()
      
}

//function for the click event on choice 
function choice_click(name)
{

    branch_name = name
    console.log('clicked')
    get_branching_info()

}


//add sounds effect when hover and when clicked
choices = document.querySelectorAll('.choice')

choices.forEach(choice => {
    choice.addEventListener('mouseenter', choice_hover)
    
})
/**
 * voices
 */


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
 * function that advance the dialogue 
 * also has the effect of
 */

function dialogue_advance()
{
    if(this_dialogue.length !== 0)
        {

            console.log(this_dialogue)
            display_dialogue = this_dialogue[0]//get the 1 element in the dialogue array


            this_dialogue = this_dialogue.splice(1)//remove the 1 element in the dialogue array


            //display the current dialogue
            dialogue_text.innerHTML = display_dialogue[1]
            speakText(display_dialogue[1])
            //change the display of name 
            name_text = display_dialogue[0]
            if(name_text === 'Narrator')
            {
                c_name.style.visibility = 'hidden'
            }else if (name_text === 'Player')
            {
                c_name.textContent = username;
                c_name.style.borderColor =  '#ffcc00'; /* Yellow glow effect */
                c_name.style.boxShadow = '0px 0px 15px 15px rgba(255, 204, 0, 0.8)';
                c_name.style.visibility = 'visible'
                document.querySelectorAll('img').forEach(image => {
                    image.style.opacity = '0.6'
                })
                
            }else{
                c_name.textContent = name_text
                c_name.style.visibility = 'visible'
                c_pic = document.getElementById(name_text)
                c_name.style.boxShadow = '0px 0px 0px 0px rgba(255, 204, 0, 0.8)';
                c_name.style.borderColor = 'black'
                document.querySelectorAll('img').forEach(image => {
                    image.style.opacity = '0.6'
                })
                c_pic.style.opacity = '1'
                c_pic.style.visibility = 'visible'

            }
        
        }else
        {
            option_box.style.visibility = 'visible'
            
            //when win or lose 
            if(win === true)
                {
                 option_box.style.visibility = 'hidden'
                 document.getElementById('win').style.visibility = 'visible'
                 document.getElementById('black_screen').style.visibility = 'visible'
                 document.getElementById('win_message').innerHTML = ending_message
                 if(play_ending_music === true)
                    {

                        datalog.game_won = true
                        update_save_point(log_id)
                        play_sound(happy_sound)
                        play_ending_music = false
                        classroom_sound.pause()
                    }
                 console.log('game won')
                }else if (lose === true)
                {
                 option_box.style.visibility = 'hidden'
                 document.getElementById('lose').style.visibility = 'visible'
                 document.getElementById('black_screen').style.visibility = 'visible'
                 document.getElementById('lose_message').innerHTML = ending_message
                 if(play_ending_music === true)
                    {
                        play_sound(sad_sound)
                        play_ending_music = false
                        classroom_sound.pause()
                    }
                 console.log('game lost')
                }
        }
}


/**
 * main function that runs the game ______________________________________________________________________________________
 * _______________________________________________________________________________________________________________________
 * _______________________________________________________________________________________________________________________
 * _______________________________________________________________________________________________________________________
 */
function get_branching_info()
{


    //update the dialogue_object
    dialogues.forEach(element => {
        if(element.fields.name === branch_name) dialogue_object = element
      })
    



    //hide the choice box
    option_box.style.visibility = 'hidden'

    console.log(dialogue_object)
   //get all the necessary informations
   dialogue_fields = dialogue_object.fields

   //add the current dialogue to the dialogue
   this_dialogue = split_dialogue(dialogue_fields.dialogue)

   //display the first line of dialogue
    dialogue_advance()

   dialogue_option_1 = dialogue_fields.option_1
   dialogue_option_2 = dialogue_fields.option_2
   dialogue_option_3 = dialogue_fields.option_3

   dialogue_option_1_hint = dialogue_fields.option_1_hint
   dialogue_option_2_hint = dialogue_fields.option_2_hint
   dialogue_option_3_hint = dialogue_fields.option_3_hint

   dialogue_option_1_branch = dialogue_fields.option_1_branch
   dialogue_option_2_branch = dialogue_fields.option_2_branch
   dialogue_option_3_branch = dialogue_fields.option_3_branch

   win = dialogue_fields.game_win
   lose = dialogue_fields.game_over
   correct_option = dialogue_fields.correct_option
   ending_message = dialogue_fields.ending_message

   //win or lose or continue
if(win !== true && lose !== true)//if didn't win and didn't lose, meaning there is a branch to go to
   {
     /**
     * change the choices' text
     * implement hints
     * implement the correct option hint
     */

    

    choices.forEach(choice => {

        choice_text = choice.querySelector('.text_pos')
        if(choice.id === '1')
        {
            choice_text.innerHTML = dialogue_option_1
            choice.onclick = function()
            {   
                last_branch_name = branch_name
                branch_name =dialogue_fields.option_1_branch
                datalog.choosing_scenario.push(branch_name)
                datalog.options_choosen.push(1)
                update_save_point(log_id)
                play_sound(option_click_sound)
                console.log('clicked')
                get_branching_info()}

        }else if (choice.id === '2')
        {
            choice_text.innerHTML = dialogue_option_2
            choice.onclick = function()
            {   
                last_branch_name = branch_name
                branch_name = dialogue_fields.option_2_branch
                datalog.choosing_scenario.push(branch_name)
                datalog.options_choosen.push(2)
                update_save_point(log_id)
                play_sound(option_click_sound)
                console.log('clicked')
                get_branching_info()}

        }else{
            choice_text.innerHTML = dialogue_option_3
            choice.onclick = function()
            {   
                last_branch_name = branch_name
                branch_name = dialogue_fields.option_3_branch
                datalog.choosing_scenario.push(branch_name)
                datalog.options_choosen.push(3)
                update_save_point(log_id)
                play_sound(option_click_sound)
                console.log('clicked')
                get_branching_info()}
      
        }


    })
        //hint or when AI is on
    
        correct_choice = document.getElementById(correct_option.toString())
        console.log(correct_choice)
        correct_choice.style.border_radius = '30px'
        correct_choice.style.border_color = 'yellow'
        correct_choice.style.border_style = 'solid'
    

   }//end of modifying the choices


}


window.speechSynthesis.cancel()
document.addEventListener('mousedown', (event) => {
    if (event.button === 0)//left click
    {
        play_sound(click_sound)
        dialogue_advance()


    }

  });



console.log('before_get_branch')
document.getElementById('retry_button').onclick = function()
{

    document.getElementById('lose').style.visibility = 'hidden'
    document.getElementById('black_screen').style.visibility = 'hidden'
    scenarios = datalog.choosing_scenario
    if(branch_name !== '1_introduction' )
    {
        branch_name = scenarios[scenarios.length-2]
    }

    console.log(branch_name)
    get_branching_info()
}

document.getElementById('restart_button').onclick = function()
{
    document.getElementById('win').style.visibility = 'hidden'
    document.getElementById('black_screen').style.visibility = 'hidden'
    scenarios = datalog.choosing_scenario
    branch_name = '1_introduction' 
    console.log(branch_name)
    get_branching_info()
}



get_branching_info()

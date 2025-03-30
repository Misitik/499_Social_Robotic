function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  }

  function speakInstructions() {
    const instructions = `
      Welcome to the game!
      Your mission is to explore the solar system.
      Click anywhere to move your spaceship.
      Visit all the planets and the Sun.
      When you reach a planet, a fun fact will appear.
      Keep exploring until you've visited them all!
    `;
    speakText(instructions);
  }

///////////////////////////////////////////////////////////////////////////////////////////
//DATALOGGING/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
console.log(document.getElementById('space_saves').getAttribute('value'))
console.log(document.getElementById('space_users').getAttribute('value'))


  function load_saves()
{
    //console.log(JSON.parse(document.getElementById('users').getAttribute('value')))
    //get_user_saves()
    document.getElementById('black_screen').style.visibility='visible'
    document.getElementById('load_panel').style.visibility = 'visible'
}

function close_saves()
{
    document.getElementById('black_screen').style.visibility='hidden'
    document.getElementById('load_panel').style.visibility = 'hidden'
}


function get_user_saves()
{
    users = JSON.parse(document.getElementById('space_users').getAttribute('value'))
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

let users = []

function create_user(new_user)
{
    console.log(new_user)
    fetch(`/api/save-log-space-user/`, {
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
    fetch(`/api/load-log-space-user/${log_id}/`, {
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
    
    fetch(`/game1_game/`, {
    
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
    console.log(document.getElementById('space_users').getAttribute('value'))
    users = JSON.parse(document.getElementById('space_users').getAttribute('value'))
    saves = JSON.parse(document.getElementById('space_saves').getAttribute('value'))
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
        console.log('user exists not')
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


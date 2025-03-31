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
    startLink.href = "{% url 'game3_play' %}";
});

selected_user = ''

  function load_saves()
{
    //console.log(JSON.parse(document.getElementById('users').getAttribute('value')))

    document.getElementById('black_screen').style.visibility='visible'
    document.getElementById('load_panel').style.visibility = 'visible'
    //get_user_saves()
}

function close_saves()
{
    document.getElementById('black_screen').style.visibility='hidden'
    document.getElementById('load_panel').style.visibility = 'hidden'
}



function get_user_saves()
{
    users = JSON.parse(document.getElementById('map_users').getAttribute('value'))
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
    fetch(`/api/save-log-map-user/`, {
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
    fetch(`/api/load-log-map-user/${log_id}/`, {
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

function go_to_game_3(user, log_id)
{

    Object.assign(user, {log_id: log_id})
    
    fetch(`/game3_game/`, {
    
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
    console.log(document.getElementById('map_users').getAttribute('value'))
    users = JSON.parse(document.getElementById('map_users').getAttribute('value'))
    saves = JSON.parse(document.getElementById('map_saves').getAttribute('value'))
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

        go_to_game_3(new_user,-1)
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

        go_to_game_3(new_user,-1)
    }

}


document.getElementById('select_user_button').onclick = function(){
    name_to_find = selected_user
    saves = JSON.parse(document.getElementById('map_saves').getAttribute('value'))
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
    users = JSON.parse(document.getElementById('map_users').getAttribute('value'))
    users = JSON.parse(users)

    the_user = ''

    users.forEach(user => {
        if (user.fields.name === selected_user)
        {
            the_user = user
        }

    })

        // go_to_game_3(the_user,the_log_id)


}
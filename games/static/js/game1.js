

///////////////////////////DON'T MATTER///////////////////////////////////////////////////

//document.getElementById('planets_visited_display').innerHTML = '<p>sssfsdf &#10;&#13; sdfsdf</p>'

//prevent from using keyboard to zooming in and out
document.addEventListener("keydown", function(event) {
    if (
        (event.ctrlKey === true || event.metaKey === true) &&
        (event.key === "+" || event.key === "-" || event.key === "0")
    ) {
        event.preventDefault();
    }
});

//prevent use mouse wheel to zoom in and out
document.addEventListener("wheel", function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////VOICE OVER///////////////////////////////////////////////////////////////////////////////
//get the voice over the txt
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        console.log(voices[185])
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




////////////////////////Initialize/////////////////////////////////////////////////////////////////////////////////////////
// Variable and functions to intialize before game for other function to use
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
ship.style.left = '700px'
ship.style.top = '700px'
ship.style.width = '80px'
ship.style.height= '100px'
waypoint.style.width = '20px'
waypoint.style.height= '20px'
waypoint.style.opacity = '0'



function to_number(px_value)
{
    return Number(px_value.slice(0,-2))
}

//get the information of the planets into a json file for access
let string_table = JSON.parse(document.getElementById("gg").getAttribute('value'))
table= JSON.parse(string_table)

//use the table value above
//return the planet info
function get_info(name)
{
    info = ""
    question = ""
    answer = ""
    for(x = 0; x < table.length; x++)
        {
            element = table[x].fields;
            if(element.name === name)
            {
                info = element.info
                question = element.question
                answer = element.answer
            }
        }
    
    return [info, question, answer]

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////






///////////////////////////TEXT MANIPULATION/////////////////////////////////////////////////////////////////////////////////
// the function that manipulate text in game
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//change display name on top of the game

const stars = document.querySelectorAll('.star');

stars.forEach(star =>{
    star.addEventListener("mouseover", (event)=>{
       // console.log(star.id)

        star_name = star.id;
        document.getElementById('heading').textContent = star_name.toString();

});


})


///////////////////////////////////////////////////////////////////////////////////////////////////////




//change the text displayed when collide with another planet

function change_description_position(mouse_movement_event)
{
    description = window.getComputedStyle(document.getElementById("description"))
    mouse_x = event.clientX;
    mouse_y = event.clientY;

    window_width = window.screen.width;
    window_height =window.screen.height;


    description_width = to_number(description.width)
    description_height = to_number(description.height)

    des = document.getElementById("description").style

    if(window_width - mouse_x < description_width * 2) 
    {
        des.left = (mouse_x - description_width * 1.2).toString() + 'px'

    }else
    {
       des.left = (mouse_x + description_width *0.2).toString() + 'px'
      
    }
}

//make description to change its x & y movement whenever it moves
/* document.addEventListener('mousemove', (event)=>
    {

        change_description_position(event)
 
    })
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////COLLISION///////////////////////////////////////////////////////////////////////////////////
//Regarding when the ship come in contact with a planet
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function planet_visited_index(planet_name)
{
    planet_index = 0;


    switch(planet_name.toString())
    {
        case 'Sun':
            planet_index = 0;
            break;
 
        case 'Mercury':
            planet_index = 1;
            break;

        case 'Venus':
            planet_index = 2;
            break;

        case 'Earth':
            planet_index = 3;
            break;

        case 'Mars':
            planet_index = 4;
            break;

        case 'Jupiter':
            planet_index = 5;
            break;

        case 'Saturn':
            planet_index = 6;
            break;

        case 'Uranus':
            planet_index = 7;
            break;

        case 'Neptune':
            planet_index = 8;
            break;
    

    }

    return planet_index
}

planet_visited = [0,0,0,0,0,0,0,0,0]
all_visited =    [1,1,1,1,1,1,1,1,1]
planet_visited_name = []


function collision(x, y)
{

    ship_element = window.getComputedStyle(document.getElementById('ship'))
    description = document.getElementById("description")
    description.style.visibility = "hidden"
    description_overlay = document.getElementById("description_overlay")
    console.log(description_overlay)
    description_overlay.style.visibility = "hidden"


    ship_x = to_number(ship_element.left)
    ship_y = to_number(ship_element.top)
    ship_width = to_number(ship_element.width)
    ship_height = to_number(ship_element.height)
    stars.forEach(star =>
        {
         

            this_star= window.getComputedStyle(document.getElementById(star.id))
            x_width = to_number(this_star.width) 
            y_height = to_number(this_star.height) 
            x_l = to_number(this_star.left ) - x_width/2 - ship_width/2
            y_t = to_number(this_star.top) - y_height/2 - ship_height/2
            x_r = x_l + x_width
            y_d = y_t + y_height
                   
       
           // console.log(star.id, [x, x_l, x_r], [y, y_t, y_d])
       
       
           //if there is a collision
            if(ship_x >x_l && ship_x <  x_r && ship_y > y_t && ship_y <  y_d)
            {
 

                description_overlay.style.visibility = "visible"

               
                description.style.visibility = "visible"
                planet_num = planet_visited_index(star.id)
                //console.log(star.id, planet_num)
                planet_visited[planet_num] = 1
                //console.log(planet_visited)

                //add planet name to the visited planet name array
                if(!(planet_visited_name.includes(star.id)))
                {
                    planet_visited_name.push(star.id)
                    planet_visited_display = document.getElementById("display_text")
                    planet_visited_display.innerHTML =    planet_visited_display.innerHTML + `${star.id} <br> `
                }
     
                //remove everything from description
                description.innerHTML = ""
                info_array= get_info(star.id)
                speakText(info_array[0])

                lines = info_array[0].split("\n")
          
                lines.forEach(line => {
                    this_line  = document.createElement("div")
                    this_line.className = "feature"

                    text = document.createElement("div")
                    text.className = "text"
                    text.innerHTML = line
                    this_line.appendChild(text)
                    description.appendChild(this_line)
                    //console.log(this_line)
                    //console.log(description)
                })
               // description.innerHTML = `<p>${info_array[0]}</p>`
                question = document.getElementById('question')
                question.innerHTML = `${info_array[1]}`

                
                if (planet_visited.every((value, index) => value === all_visited[index])) {
                    //console.log("All planets visited! Showing win window.");
                    document.getElementById('win_window').style.visibility = 'visible';
                }
                

            }
        })
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////MOVEMENT//////////////////////////////////////////////////////////////////////////
// Ship movement
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


ship = document.getElementById('ship')
waypoint = document.getElementById('waypoint')


  // Using eventListener to detect if a KEY is PRESSED
  document.addEventListener('mousedown', (event) => {


if(event.button === 0)
{
const moving = setInterval(function () 
{



 //make way point visible
 waypoint.style.opacity = '1'
 //get the offset of the ship
 const w = Number(ship.style.width.slice(0,-2))
 const h = Number(ship.style.height.slice(0,-2))

 //get mouse x y
  const target_x = event.clientX - w/2;
  const target_y = event.clientY - h/2;

 //get the offset for the waypoint
 const w_w = Number(waypoint.style.width.slice(0,-2))
 const w_h = Number(waypoint.style.height.slice(0,-2))
  //set waypoint
  waypoint.style.left =(event.clientX - w_w/2).toString() + 'px'
  waypoint.style.top = (event.clientY - w_h).toString() + 'px'

  //get ship x y
  const x_pos = Number(ship.style.left.slice(0,-2))
  const y_pos = Number(ship.style.top.slice(0,-2))

  collision(x_pos, y_pos)

  //get the difference
  const x_difference = target_x - x_pos
  const y_difference = target_y - y_pos
  
  //get the direction based on whether its positive or negative
  const x_dir = Math.sign(x_difference)
  const y_dir = Math.sign(y_difference)

  //get the absolute value of difference for later use
  const x_abs_difference = Math.abs(x_difference)
  const y_abs_difference = Math.abs(y_difference)
  
  const angle = Math.atan(y_abs_difference/ x_abs_difference) * 180 / Math.PI

  let rotate_angle = 0
  if(x_dir === 1 && y_dir === -1)
      {
          rotate_angle += (90 - angle)
      }else if(x_dir === 1 && y_dir === 1)
      {
          rotate_angle += (90 + angle)
      }else if (x_dir === -1 && y_dir === 1)
      {
          rotate_angle += (270 - angle)
      }else if (x_dir === -1 && y_dir === -1)
      {
          rotate_angle += (270 + angle)
      }
  //rotate the ship
  ship.style.rotate = '0deg'; 
  ship.style.rotate =  + rotate_angle.toString() + 'deg';

  //calculate the change needed to move the coordinate in x & y direction
  const x_move = Math.cos(angle* Math.PI/180)*2 * x_dir
  const y_move = Math.sin(angle* Math.PI/180)*2 * y_dir


  //update ship position
 ship.style.left = (x_move + x_pos).toString() + 'px';
 ship.style.top = (y_move + y_pos).toString() + 'px';

 if(x_abs_difference < 2 && y_abs_difference < 2)
 {
  waypoint.style.opacity = '0'
  clearInterval(moving);
 }

 document.addEventListener('mousedown', (click) => {

  if(click.button === 0)
  {
  waypoint.style.opacity = '0'
  clearInterval(moving);
  }
      
  });

}, 20);

}


});

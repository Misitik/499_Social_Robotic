

///////////////////////////DON'T MATTER///////////////////////////////////////////////////


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



////////////////////////Initialize/////////////////////////////////////////////////////////////////////////////////////////
// Variable and functions to intialize before game for other function to use
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
ship.style.left = '220px'
ship.style.top = '220px'
ship.style.width = '50px'
ship.style.height= '50px'
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
    for(x = 0; x < table.length; x++)
        {
            element = table[x].fields;
            if(element.name === name)
            {
                info = element.info
            }
        }
    
    return info

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
document.addEventListener('mousemove', (event)=>
    {

        change_description_position(event)
 
    })

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


function collision(x, y)
{
    description = document.getElementById("description")
    description.style.visibility = 'hidden'
    ship_element = window.getComputedStyle(document.getElementById('ship'))
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

              
                
                description = document.getElementById("description")
                description.style.visibility = 'visible'
                planet_num = planet_visited_index(star.id)
                //console.log(star.id, planet_num)
                planet_visited[planet_num] = 1
                console.log(planet_visited)

                info = get_info(star.id)
                description.innerHTML = `<p>${info}</p>`
                
                if (planet_visited.every((value, index) => value === all_visited[index])) {
                    console.log("All planets visited! Showing win window.");
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


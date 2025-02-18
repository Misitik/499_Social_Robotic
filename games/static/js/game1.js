
ship.style.left = '220px'
ship.style.top = '220px'
ship.style.width = '50px'
ship.style.height= '50px'
waypoint.style.width = '20px'
waypoint.style.height= '20px'
waypoint.style.opacity = '0'

//get the information of the planets into a json file for access
let string_table = JSON.parse(document.getElementById("gg").getAttribute('value'))
table= JSON.parse(string_table)



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
console.log(get_info('Earth'))

function change_planet_name(name)
{
   name_display =  document.getElementById(name)
   name_display.innerHTML = `<p style =  "color: black; background-color: black; border-radius: 10px"  >${name} </p> `;
   
}

const stars = document.querySelectorAll('.star');

stars.forEach(star =>{
    star.addEventListener("mouseover", (event)=>{
        console.log(star.id)

        star_name = star.id;
        //change_planet_name(star_name);
        document.getElementById('heading').textContent = star_name.toString();

});


})





document.addEventListener("keydown", function(event) {
    if (
        (event.ctrlKey === true || event.metaKey === true) &&
        (event.key === "+" || event.key === "-" || event.key === "0")
    ) {
        event.preventDefault();
    }
});

document.addEventListener("wheel", function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });

function to_number(px_value)
{
    return Number(px_value.slice(0,-2))
}

function collision(x, y)
{
    description = document.getElementById("description")
    description.style.visibility = 'hidden'
    stars.forEach(star =>
        {

            this_star= window.getComputedStyle(document.getElementById(star.id))
            x_l = to_number(this_star.left)
            y_t = to_number(this_star.top)
            x_r = to_number(this_star.width) 
            y_d = to_number(this_star.height) 
                    
           // console.log(star.id, [x, x_l, x_r], [y, y_t, y_d])

           //if there is a collision
            if(x >x_l - x_r && x < x_l && y > y_t - y_d && y < y_t)
            {
                console.log(star.id)
                description = document.getElementById("description")
                description.style.left = '10%'
                description.style.top = '10%'
                description.style.width = '100px'
                description.style.height = '100px'
                description.style.visibility = 'visible'
                info = get_info(star.id)
                console.log(info)
                description.innerHTML = `<p>${info}</p>`
            }
        })
}



  // Using eventListener to detect if a KEY is PRESSED
  document.addEventListener('mousedown', (event) => {
// Get the mouse position relative to the viewport

ship = document.getElementById('ship')



if(event.button === 0)
{
const moving = setInterval(function () 
{

 ship = document.getElementById('ship')
 waypoint = document.getElementById('waypoint')

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


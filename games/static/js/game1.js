
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



//console.log(JSON.parse(f))


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

if(event.button === 2)
{
    description = document.getElementById("description")
    description.style.left = `${event.clientX}px`
    description.style.top = `${event.clientY}px`
    description.style.visibility = 'visible'
}
});


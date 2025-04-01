function timer(){
  
  var timer = setInterval(function(){
  datalog.time +=1
  update_save_point(log_id)

  }, 1000);
}

function create_save_point()
{
    fetch(`/api/save-log-map/`, {
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
    console.log(JSON.stringify(datalog))
    fetch(`/api/load-log-map/${log_id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        
        },
        body: JSON.stringify(datalog)
    })
    .then(response => console.log(response))
    .then(datalog => console.log(datalog))
    .catch(error => console.error('Error:', error));
}

game_won = false
 
//parse the data passed from game3.py from game3_game method
let save_points = JSON.parse(document.getElementById("map_savepoints").getAttribute('value'))
save_points = JSON.parse(save_points)
console.log(save_points)
let datalog = {}

let the_user = JSON.parse(document.getElementById("user_data").getAttribute('value'))
console.log(the_user)
let log_id = Number(the_user.log_id)
time = 0
console.log(the_user)
console.log(log_id)
console.log(datalog)

/**
 * depend on the log id, it will create new data
 * if it is -1 create a new save
 * if it is not -1, it means we are loading a save
 * just pass the variable from the save to the game
 */
if(log_id === -1){//create a new data
    console.log('new_savepoint')
    log = {
        time: 0,
        game_won:false, 
        map_draged:[],
        map_correct:[],
        current_drags:[]
    }
    datalog = log
    log_id = save_points.length +1

    create_save_point()
    timer()

}else{//get the save's data
 
    //load the saves 
    save_spot = save_points.find(obj => obj.pk === log_id).fields

    //update the variables for the game
    username = the_user.fields.name
    datalog = save_spot


    time = datalog.time
    timer()

}
 const correctDropZones = {
        // British Columbia
        "place-whistler": "drop-bc",
        "place-vancouver-island": "drop-bc",

        // Ontario
        "place-cn-tower": "drop-ontario",
        "place-niagara": "drop-ontario",
        "place-thousand-islands": "drop-ontario",

        // Alberta
        "place-lake-louise": "drop-alberta",
        "place-banff": "drop-alberta",
        "place-jasper": "drop-alberta",

        // Newfoundland and Labrador
        "place-gros-morne": "drop-nl",

        // Quebec
        "place-omega-park": "drop-quebec",
        "place-montmorency": "drop-quebec"
    };

    let score = 0; // 🧠 Score tracker
    const scoreElement = document.getElementById('score');

    const draggables = document.querySelectorAll('.draggable');
    const dropzones = document.querySelectorAll('.dropzone');

    draggables.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.id);
        });
    });

    dropzones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('over');

            const draggedItemId = e.dataTransfer.getData('text/plain');
            const draggedItem = document.getElementById(draggedItemId);
            const dropZoneId = zone.id;
            const messageBox = document.getElementById('message');

            const isCorrect = correctDropZones[draggedItemId] === dropZoneId;

            if (isCorrect) {
                // Prevent re-scoring if item already dropped correctly
                if (!zone.contains(draggedItem)) {
                    score += 10;
                    zone.appendChild(draggedItem);
                    draggedItem.style.margin = '5px';
                    datalog.map_correct.push('C')
                    datalog.map_draged.push(draggedItem)
                    datalog.curent_drags = []
                }
                messageBox.textContent = "✅ Correct!";
                messageBox.className = "drop-message correct";
            } else {
                score -= 10;
                messageBox.textContent = "❌ Wrong province!";
                messageBox.className = "drop-message wrong";
                datalog.map_correct.push('W')
                datalog.map_draged.push(draggedItem)
                datalog.current_drags = []
            }

            // Update score display
            scoreElement.textContent = score;

            // Show message
            messageBox.style.display = "block";
            setTimeout(() => {
                messageBox.style.display = "none";
            }, 2000);
        });
    });

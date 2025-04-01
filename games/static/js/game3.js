// ✅ Full game3.js with voice control, win screen, and animations

// ========== Timer & Save ==========
function timer() {
    setInterval(() => {
      datalog.time += 1;
      update_save_point(log_id);
    }, 1000);
  }
  
  function create_save_point() {
    fetch(`/api/save-log-map/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datalog)
    })
      .then(res => res.json())
      .then(console.log)
      .catch(console.error);
  }
  
  function update_save_point(log_id) {
    fetch(`/api/load-log-map/${log_id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datalog)
    })
      .then(console.log)
      .catch(console.error);
  }
  
  // ========== Game Setup ==========
  let game_won = false;
  let datalog = {};
  let save_points = JSON.parse(document.getElementById("map_savepoints").getAttribute('value'));
  save_points = JSON.parse(save_points);
  let the_user = JSON.parse(document.getElementById("user_data").getAttribute('value'));
  let log_id = Number(the_user.log_id);
  let time = 0;
  
  if (log_id === -1) {
    datalog = {
      time: 0,
      game_won: false,
      map_draged: [],
      map_correct: [],
      current_drags: []
    };
    log_id = save_points.length + 1;
    create_save_point();
    timer();
  } else {
    const save_spot = save_points.find(obj => obj.pk === log_id).fields;
    datalog = save_spot;
    time = datalog.time;
    timer();
  }
  
  const correctDropZones = {
    "place-whistler": "drop-bc",
    "place-vancouver-island": "drop-bc",
    "place-niagara": "drop-ontario",
    "place-thousand-islands": "drop-ontario",
    "place-lake-louise": "drop-alberta",
    "place-banff": "drop-alberta",
    "place-jasper": "drop-alberta",
    "place-prince-albert": "drop-saskatchewan",
    "place-omega-park": "drop-quebec",
    "place-montmorency": "drop-quebec"
  };
  
  const provinceNames = {
    "drop-bc": "British Columbia",
    "drop-ontario": "Ontario",
    "drop-alberta": "Alberta",
    "drop-saskatchewan": "Saskatchewan",
    "drop-quebec": "Quebec"
  };
  
  let score = 0;
  const scoreElement = document.getElementById('score');
  const draggables = document.querySelectorAll('.draggable');
  const dropzones = document.querySelectorAll('.dropzone');
  const messageBox = document.getElementById('message');
  
  // ========== Drag & Drop ==========
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
  
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('over');
      const draggedItemId = e.dataTransfer.getData('text/plain');
      const draggedItem = document.getElementById(draggedItemId);
      const dropZoneId = zone.id;
      processDrop(draggedItem, dropZoneId);
    });
  });
  
  // ========== Voice Agent ==========
  function speak(text) {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    synth.cancel();
    synth.speak(utter);
  }
  
  // ========== Drop Handler + Win Check ==========
  function processDrop(draggedItem, dropZoneId) {
    const draggedItemId = draggedItem.id;
    const isCorrect = correctDropZones[draggedItemId] === dropZoneId;
    const dropZone = document.getElementById(dropZoneId);
    const placeName = draggedItem.alt || draggedItemId;
    const provinceName = provinceNames[dropZoneId] || dropZoneId;
  
    if (isCorrect) {
      if (!dropZone.contains(draggedItem)) {
        score += 10;
        dropZone.appendChild(draggedItem);
        draggedItem.style.margin = '5px';
      }
      if (!datalog.map_draged.includes(draggedItemId)) {
        datalog.map_correct.push('C');
        datalog.map_draged.push(draggedItemId);
      }
      datalog.current_drags = [];
      messageBox.textContent = "✅ Correct!";
      messageBox.className = "drop-message correct";
      speak(`Correct! ${placeName} belongs to ${provinceName}.`);
    } else {
      score -= 10;
      datalog.map_correct.push('W');
      datalog.map_draged.push(draggedItemId);
      datalog.current_drags = [];
      messageBox.textContent = "❌ Wrong province!";
      messageBox.className = "drop-message wrong";
      speak(`Oops! ${placeName} does not belong to ${provinceName}. Try again.`);
      draggedItem.classList.add("shake");
      setTimeout(() => draggedItem.classList.remove("shake"), 500);
    }
  
    scoreElement.textContent = score;
    messageBox.style.display = "block";
    setTimeout(() => messageBox.style.display = "none", 2000);
  
    // ✅ Win check: all 10 correctly placed
    const allPlaceIds = Object.keys(correctDropZones);
    const placedCorrectly = allPlaceIds.every(id => {
      const element = document.getElementById(id);
      const parentId = element?.parentElement?.id;
      return correctDropZones[id] === parentId;
    });
  
    if (placedCorrectly && !game_won) {
      game_won = true;
      datalog.game_won = true;
      speak("🎉 Congratulations! You placed all the locations correctly!");
      document.getElementById("win-screen").style.display = "flex";
      document.getElementById("final-score").textContent = score;
    }
  }
  
  // ========== Voice Commands ==========
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false;
  
  document.getElementById("mic-button").addEventListener("click", () => {
    recognition.start();
  });
  
  const voicePlaceMap = {
    "whistler": "place-whistler",
    "vancouver island": "place-vancouver-island",
    "niagara falls": "place-niagara",
    "thousand islands": "place-thousand-islands",
    "lake louise": "place-lake-louise",
    "banff": "place-banff",
    "jasper": "place-jasper",
    "prince albert": "place-prince-albert",
    "omega park": "place-omega-park",
    "montmorency falls": "place-montmorency"
  };
  
  const voiceDropMap = {
    "british columbia": "drop-bc",
    "ontario": "drop-ontario",
    "alberta": "drop-alberta",
    "saskatchewan": "drop-saskatchewan",
    "quebec": "drop-quebec"
  };
  
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    const match = transcript.match(/drop (.+?) to (.+)/);
    if (match) {
      const place = match[1].trim();
      const province = match[2].trim();
      const placeId = voicePlaceMap[place];
      const zoneId = voiceDropMap[province];
      if (placeId && zoneId) {
        const draggedItem = document.getElementById(placeId);
        if (draggedItem) processDrop(draggedItem, zoneId);
      } else {
        speak("Could not understand the place or province. Try again.");
      }
    } else {
      speak("Say something like 'Drop Banff to Alberta'");
    }
  };
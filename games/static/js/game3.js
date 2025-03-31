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
                }
                messageBox.textContent = "✅ Correct!";
                messageBox.className = "drop-message correct";
            } else {
                score -= 10;
                messageBox.textContent = "❌ Wrong province!";
                messageBox.className = "drop-message wrong";
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

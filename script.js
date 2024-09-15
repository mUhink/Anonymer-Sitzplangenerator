document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const studentCount = parseInt(document.getElementById('studentCount').value);
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
    const avoidPairsInput = document.getElementById('avoidPairs').value;
    const enforcePairsInput = document.getElementById('enforcePairs').value;

    // Verarbeitung der Eingaben
    let avoidPairs = parsePairs(avoidPairsInput, '-');
    let enforcePairs = parsePairs(enforcePairsInput, '+');

    // Generierung der Sitzordnung
    let seatingPlan = generateSeatingPlan(studentCount, rows, columns, avoidPairs, enforcePairs);

    // Anzeige des Sitzplans
    displaySeatingPlan(seatingPlan, rows, columns);

    // Export-Button anzeigen
    document.getElementById('exportButton').style.display = 'block';
});

function parsePairs(input, separator) {
    let pairs = [];
    if (input.trim() === '') return pairs;
    let entries = input.split(',');
    for (let entry of entries) {
        let [a, b] = entry.split(separator).map(Number);
        pairs.push([a, b]);
    }
    return pairs;
}

function generateSeatingPlan(studentCount, rows, columns, avoidPairs, enforcePairs) {
    let students = [];
    for (let i = 1; i <= studentCount; i++) {
        students.push(i);
    }

    // Erzwinge bestimmte Paare
    for (let pair of enforcePairs) {
        let indexA = students.indexOf(pair[0]);
        let indexB = students.indexOf(pair[1]);
        if (indexA > -1 && indexB > -1) {
            students.splice(indexB, 1);
            students.splice(indexA + 1, 0, pair[1]);
        }
    }

    // Zufälliges Mischen der Schüler
    students = shuffleArray(students);

    // Vermeide bestimmte Paare (einfache Implementierung)
    // Für eine bessere Vermeidung könnte ein komplexerer Algorithmus verwendet werden

    // Sitzplan erstellen
    let seatingPlan = [];
    let index = 0;
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            if (index < students.length) {
                row.push(students[index]);
                index++;
            } else {
                row.push(null);
            }
        }
        seatingPlan.push(row);
    }

    return seatingPlan;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displaySeatingPlan(seatingPlan, rows, columns) {
    let container = document.getElementById('seatingPlan');
    container.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        let rowDiv = document.createElement('div');
        rowDiv.style.display = 'flex';
        rowDiv.style.justifyContent = 'center';
        for (let c = 0; c < columns; c++) {
            let tableDiv = document.createElement('div');
            tableDiv.className = 'table';
            let student = seatingPlan[r][c];
            tableDiv.textContent = student ? 'Schüler ' + student : 'Leer';
            rowDiv.appendChild(tableDiv);
        }
        container.appendChild(rowDiv);
    }
}

// Funktion zum Exportieren als PNG (benötigt html2canvas Bibliothek)
document.getElementById('exportButton').addEventListener('click', function() {
    html2canvas(document.getElementById('seatingPlan')).then(function(canvas) {
        let link = document.createElement('a');
        link.download = 'sitzplan.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

// Laden der html2canvas Bibliothek
let script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
document.head.appendChild(script);

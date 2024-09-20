
document.addEventListener("DOMContentLoaded", async function () {   
    const scheduleDataElement = document.getElementById('schedule-data');
    const jsonData = JSON.parse(scheduleDataElement.getAttribute('data-json'));
    const yearData = jsonData.courses;
    const scheduleDiv = document.getElementById("scheduleDiv"); 
    const startDay = "2024-08-19";
    const table = createYearlyTable(startDay, "ETML", 1, 13);
    scheduleDiv.appendChild(table);
    mapAllYear(document, yearData, table, false);
    insertVacations(table);
    grouperCours(table);
});
const etml_schedule = {
    "P1": "(P1) 8h00 - 8h45",
    "P2": "(P2) 8h50 - 9h35",
    "P3": "(P3) 9h50 - 10h35",
    "P4": "(P4) 10h40 - 11h25",
    "P5": "(P5) 11h30 - 12h15",
    "P6": "(P6) 12h20 - 13h05",
    "P7": "(P7) 13h10 - 13h55",
    "P8": "(P8) 14h00 - 14h45",
    "P9": "(P9) 15h00 - 15h45",
    "P10": "(P10) 15h50 - 16h35",
    "P11": "(P11) 16h40 - 17h25",
    "P12": "(P12) 17h30 - 18h15",
    "P13": "(P13) 18h20 - 19h05"
};
function grouperCours(table) {

    fusionnerCellulesVerticales(table);
    fusionnerCellulesHorizontales(table);

}

function getWeekNumber(date) {
    const dayOfWeek = date.getDay();
    const currentDate = new Date(date);
    currentDate.setDate(date.getDate() - (dayOfWeek + 6) % 7 + 3); // Nearest Thu
    const ms = currentDate.valueOf(); // GMT
    currentDate.setMonth(0);
    currentDate.setDate(4); // Thu in Week 1
    return Math.round((ms - currentDate.valueOf()) / (7 * 864e5)) + 1;
}

function formatDateToYyyyMmDd(date) {
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); //  (attention : les mois commencent à 0) 
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}
function formatDateToDdMmYyyy(date) {
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear(); 

    return `${day}-${month}-${year}`;
}

function formatDateToDdMm(date) {
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    return `${day}.${month}`;
}
function abbregerStr(chaine, longueurMax) {
  // Vérifier si la chaîne est plus courte ou égale à la longueur maximale
  if (chaine.length <= longueurMax) {
    return chaine;
  } 
  else {
    const mots = chaine.split(' ');
    const motsAbreges = mots.map(mot => mot.length > 4 ? mot.substring(0, 4) + '. ' : mot);
    return motsAbreges.join(' ').trim();
  }
}
function insertVacations(table) {
    const vacationPeriods = {
        "Jeûne fédéral": ["2024-09-16"],
        "Vacances d'automne": ["2024-10-14", "2024-10-15", "2024-10-16", "2024-10-17", "2024-10-18", "2024-10-21", "2024-10-22", "2024-10-23", "2024-10-24", "2024-10-25"],
        "Vacances d'hiver": ["2024-12-23", "2024-12-24", "2024-12-25", "2024-12-26", "2024-12-27", "2024-12-30", "2024-12-31", "2025-01-01", "2025-01-02", "2025-01-03"],
        "Relâches": ["2025-02-17", "2025-02-18", "2025-02-19", "2025-02-20", "2025-02-21"],
        "Vacances de Pâques": ["2025-04-14", "2025-04-15", "2025-04-16", "2025-04-17", "2025-04-21", "2025-04-22", "2025-04-23", "2025-04-24", "2025-04-25"],
        "Vendredi Saint": ["2025-04-18"],
        "Pont de l'Ascension": ["2025-05-29", "2025-05-30"],
        "Lundi de Pentecôte": ["2025-06-09"]
    };

    for (const vacationName in vacationPeriods) {
        
        const vacationDays = vacationPeriods[vacationName];
        vacationDays.forEach(vacationDay => {
            let cells = table.querySelectorAll(`[data-period*="${vacationDay}"]`);
            cells.forEach(cell => {  
                cell.classList.add("vacations");
                const textVacations = document.createElement("div");
                cell.appendChild(textVacations);                
                textVacations.textContent = vacationName;
                textVacations.classList.add("vacations-text");
                cell.dataset.key = vacationName;
            });
        });
    }
}

function summariesNames(names) {
    return names.map(name => {
        const parts = name.split(' '); 
        const lastNames = parts.slice(1).join(' '); 
        const firstNameShort = parts[0].charAt(0) + '.'; 
        return `${lastNames} ${firstNameShort}`;
    });
}


function mapAllYear(document, cours, table, clearTable) {
    
    const usedCourseKeys = new Set();

    if (clearTable) {
        removeAllChildren(table);
    }
    
    cours.forEach(currentCours => {
        
        
        
        const courseKey = currentCours.discipline + currentCours.ensembles + currentCours.enseignants;                 
        
        for (let i = currentCours.periodStart; i <= currentCours.periodEnd; i++){
            const currentPeriod = currentCours.periodDate + i;
            let cell = table.querySelector(`[data-period="${currentPeriod}"]`);
            if (cell !== null) {
                
                //cell.classList.add("first-cell-of-row");
                const tblClasses = currentCours.ensembles.toString().split(',');
                if (tblClasses.length <=  2){
                    cell.textContent = abbregerStr(currentCours.discipline) + " (" + currentCours.ensembles + ") " + "[" + currentCours.roomName + "] " + summariesNames(currentCours.enseignants) ;
                }
                else{
                    cell.textContent = abbregerStr(currentCours.discipline);
                }
                usedCourseKeys.add(courseKey); 
                cell.dataset.key = courseKey;
                
                if (currentCours.roomName){
                    if (currentCours.roomName.startsWith("A") || currentCours.roomName.startsWith("B") || currentCours.roomName.startsWith("C")){
                        cell.classList.add("cours-active-site-a");
                    }
                    else if (currentCours.roomName.startsWith("N") || currentCours.roomName.startsWith("S")){
                        cell.classList.add("cours-active-site-b");
                    }
                    else{
                        cell.classList.add("cours-active");
                    }
                }
                else{
                    cell.classList.add("cours-active");
                }
                
             
            } else {
                console.log("error : " + currentPeriod);
            }
        }
        

    });
}

function fusionnerCellulesVerticales(table) {
    const rows = table.querySelectorAll("tr");

    for (let j = 0; j < rows[0].cells.length; j++) {
        let previousCell = null;

        for (let i = 0; i < rows.length; i++) {
            const currentCell = rows[i].cells[j];

            if (previousCell && currentCell.dataset.key === previousCell.dataset.key && currentCell.dataset.key) {
                const rowspan = previousCell.rowSpan || 1;
                previousCell.rowSpan = rowspan + 1;
                currentCell.classList.add("cell-to-hide");
            } else {
                previousCell = currentCell;
            }
        }
    }
}

function fusionnerCellulesHorizontales(table) {
    const rows = table.querySelectorAll("tr");

    for (let i = 0; i < rows.length; i++) {
        let previousCell = null;

        for (let j = 0; j < rows[i].cells.length; j++) {
            const currentCell = rows[i].cells[j];

            if (previousCell && currentCell.dataset.key === previousCell.dataset.key && currentCell.dataset.key) {
                const colspan = previousCell.colSpan || 1;
                previousCell.colSpan = colspan + 1;

                currentCell.classList.add("cell-to-hide");
            } else {
                previousCell = currentCell;
            }
        }
    }
}

function createYearlyTable(dateBeginSchool, etablissement, periodMin, periodMax) {
    
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    const nbWeekPerYear = 44;
    const nbWorkDayPerWeek = 5;
    const nbWorkPeriodPerDay = periodMax - periodMin + 1;

    const table = document.createElement("table");
    table.className = "fixed-size-table";
    table.classList.add("printable-yearlytable");

    let date = new Date(dateBeginSchool);
    const firstWeek = getWeekNumber(date);

    // Corrected reassignment
    let offset = date.getDay() - 1;
    if (offset < 0) {
        offset = 6;
    }
    date.setDate(date.getDate() + (7 - offset) % 7);
    
    let dateCopy = new Date(date);
    const datesRow = document.createElement("tr");
    for (let i = 0; i <= nbWeekPerYear + 2; i++) {
        
        const cell = document.createElement("td");
        if (i === 0){
            cell.textContent = "";       
        }
        else if (i === 1){
            cell.textContent = "Date des lundis";
            cell.classList.add("wider");
        }
        else {
            dateCopy = new Date(date)
            dateCopy.setDate(date.getDate() + 7 * (i - 2));
            cell.textContent = formatDateToDdMm(dateCopy);
        }
        datesRow.appendChild(cell);
    }
    table.appendChild(datesRow);
    
    const noSemRow = document.createElement("tr");
    for (let i = 0; i <= nbWeekPerYear + 2; i++) {
        
        const cell = document.createElement("td");
        if (i === 0){
            cell.textContent = "Jour";            
        }
        else if (i === 1){
            cell.textContent = "No de semaine";
            cell.classList.add("wider");
        }
        else {
            dateCopy.setDate(date.getDate() + 7 * (i - 2));
            cell.textContent = ((firstWeek + i - 3) % 52) + 1;
        }
        noSemRow.appendChild(cell);
    }
    table.appendChild(noSemRow);
    
    for (let i = 0; i < nbWorkDayPerWeek; i++){
        for (let j = periodMin; j < periodMax; j++) {
            const row = document.createElement("tr");
            
            for (let k = 0; k <= nbWeekPerYear + 2; k++) {                
                const cell = document.createElement("td");
                if (j === periodMax - 1){
                    cell.classList.add('cell-separator'); 
                }
                else{                       
                    
                    cell.classList.add('cell-schedule'); 
                    if (k === 0 && j === periodMin){
                        cell.rowSpan = nbWorkPeriodPerDay - 1;
                        cell.classList.add("colonneJour");
                        cell.textContent = jours[i];
                    }  
                    else if (k === 0){
                        cell.classList.add('cell-to-hide'); 
                    }
                    else if (k === 1){

                        if (etablissement.includes("ETML")){
                            cell.textContent = etml_schedule['P' + j];
                        }
                        else{
                            cell.textContent = 'P' + j;
                        }
                    }                
                    else{
                        dateCopy = new Date(date);
                        dateCopy.setDate(date.getDate() + 7 * (k - 2));
                        //cell.textContent = formatDateToYyyyMmDd(dateCopy) + "P"+ ((j % nbWorkPeriodPerDay) + 1);
                        cell.dataset.period = formatDateToYyyyMmDd(dateCopy) + j;
                    }
                }
                row.appendChild(cell);
            }

            table.appendChild(row);
        }
        date.setDate(date.getDate() + 1);
    }


    return table;
}
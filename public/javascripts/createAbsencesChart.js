document.addEventListener("DOMContentLoaded", function() {
    const scheduleDataElement = document.getElementById('schedule-data');
    const jsonData = JSON.parse(scheduleDataElement.getAttribute('data-json'));
    const eleve = jsonData;
    createTableInDynamicContent(eleve);
});

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

function insertVacationsAbsences(table) {
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
                textVacations.classList.add("absences-vacations-text");
                cell.dataset.key = vacationName;
            });
        });
    }
}

function getAge(date){

    const dateOfBirth = new Date(date);
    const dateToday = new Date();

    // Calcul de l'âge
    const diffAnnees = dateToday.getFullYear() - dateOfBirth.getFullYear();

    // Vérification si l'anniversaire est déjà passé cette année
    const anniversairePasse = dateToday.getMonth() > dateOfBirth.getMonth() ||
        (dateToday.getMonth() === dateOfBirth.getMonth() && dateToday.getDate() >= dateOfBirth.getDate());

    // Si l'anniversaire n'est pas encore passé, on réduit l'âge d'une année
    const age = anniversairePasse ? diffAnnees : diffAnnees - 1;

    return age;
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

function createTableInDynamicContent(eleve) {
        const dateBeginSchool = "2024-08-19";
        
        //const titleElementH1 = document.getElementById("titre");
        const dateTodayFormatee = formatDateToDdMmYyyy(new Date());
        //titleElementH1.textContent = `Situation de ${eleve.firstName} ${eleve.officialName} au ${dateTodayFormatee}`;
        const nbRetard = eleve.absences.filter(absence => absence.absenceType === "RETARD").length;
        const nbExclu = eleve.absences.filter(absence => absence.absenceType === "EXCLU").length;
        const nbInjustifiee = eleve.absences.filter(absence => absence.absenceStatus === "INJUSTIFIEE").length;
        const nbJustifie = eleve.absences.filter(absence => absence.absenceStatus === "JUSTIFIEE").length;
        const nbAJustifier = eleve.absences.filter(absence => absence.absenceStatus === "A_JUSTIFIER").length;
        const absencesTotal = nbExclu + nbInjustifiee + nbJustifie + nbAJustifier;
        // Vue annuelle des absences
        const diaries = [];
        // Header des absences
        // Récupérez l'élément "content" dans la page principale

        
        const contentElement = document.getElementById("absencesDiv");
        contentElement.textContent = "";


        const age = getAge(eleve.dateOfBirth);
        const displayAge = document.createElement("div");
        const classe = document.createElement("div");
        const dateAge = new Date(eleve.dateOfBirth);
        const displayDate = formatDateToDdMmYyyy(dateAge);
        const statutAge = age < 18 ? "Mineur" : "Majeur";
        displayAge.textContent = age + ` ans (${statutAge} - ${displayDate})`;
        classe.textContent = "Classe : " + eleve.classeName;


        const headerInfo = document.createElement("header");
        contentElement.appendChild(headerInfo);




        

        const displayInfo = document.createElement("div");
        displayInfo.style.padding = "0 30px";
        displayInfo.classList.add('col');
        const titleInfo = document.createElement("div");
        const tauxAbsenceInfo = document.createElement("div");
        const tauxAbsence1erSemInfo = document.createElement("div");
        const tauxAbsence2emeSemInfo = document.createElement("div");
        const tauxAbsenceAnneeInfo = document.createElement("div");
        const tauxAbsenceFormationInfo = document.createElement("div");
        const nbPeriodesAbsencesInfo = document.createElement("div");
 
        tauxAbsenceInfo.textContent =  `Taux d'absence :`;
        tauxAbsence1erSemInfo.textContent =  `1er semestre : ${eleve.firstSemester}%`;
        tauxAbsence2emeSemInfo.textContent =  `2ème semestre : ${eleve.secondSemester}%`;
        tauxAbsenceAnneeInfo.textContent =  `Année en cours : ${eleve.currentYear}%`;
        tauxAbsenceFormationInfo.textContent =  `Formation : ${eleve.currentFormation}%`;
        nbPeriodesAbsencesInfo.textContent =  `Nombre de périodes d'absence : ${absencesTotal} période(s)`;

        const titleInfoStudent = document.createElement("div");

        titleInfoStudent.appendChild(classe);
        titleInfoStudent.appendChild(displayAge);
        titleInfo.appendChild(titleInfoStudent);
        displayInfo.appendChild(titleInfo);
        displayInfo.appendChild(tauxAbsenceInfo);
        displayInfo.appendChild(tauxAbsence1erSemInfo);
        displayInfo.appendChild(tauxAbsence2emeSemInfo);
        displayInfo.appendChild(tauxAbsenceAnneeInfo);
        displayInfo.appendChild(tauxAbsenceFormationInfo);
        displayInfo.appendChild(nbPeriodesAbsencesInfo);
        headerInfo.appendChild(displayInfo);

        const titleElement = document.querySelector('title');
        titleElement.textContent = `${eleve.firstName} ${eleve.officialName} ${dateTodayFormatee}`;

        const legendDiv = document.createElement("div");
        legendDiv.classList.add('col');
        legendDiv.style.width = "250px";
        headerInfo.appendChild(legendDiv);

        const legendTable = document.createElement("table");
        legendTable.className = "legend-table";
        legendDiv.appendChild(legendTable);

        const legendRetardRow = document.createElement("tr");
        const colorlegendRetardCell = document.createElement("td");
        colorlegendRetardCell.classList.add("retard");
        const textlegendRetardCell = document.createElement("td");
        textlegendRetardCell.textContent = `Retard (${nbRetard})`;
        const circleLeg = document.createElement("div");
        circleLeg.className = "circle";
        colorlegendRetardCell.appendChild(circleLeg);
        legendRetardRow.appendChild(colorlegendRetardCell);
        legendRetardRow.appendChild(textlegendRetardCell);

        const legendJustifieeRow = document.createElement("tr");
        const colorlegendJustifieeCell = document.createElement("td");
        colorlegendJustifieeCell.classList.add("absence-justifiee");
        const textlegendJustifieeCell = document.createElement("td");
        textlegendJustifieeCell.textContent =  `Absence justifiée (${nbJustifie}p)`;
        legendJustifieeRow.appendChild(colorlegendJustifieeCell);
        legendJustifieeRow.appendChild(textlegendJustifieeCell);

        const legendInjustifieeRow = document.createElement("tr");
        const colorlegendInjustifieeCell = document.createElement("td");
        colorlegendInjustifieeCell.classList.add("absence-injustifiee");
        const textlegendInjustifieeCell = document.createElement("td");
        textlegendInjustifieeCell.textContent = `Absence injustifiée (${nbInjustifiee}p)`;
        legendInjustifieeRow.appendChild(colorlegendInjustifieeCell);
        legendInjustifieeRow.appendChild(textlegendInjustifieeCell);



        const legendExcluRow = document.createElement("tr");
        const colorlegendExcluCell = document.createElement("td");
        colorlegendExcluCell.classList.add("absence-exclu");
        const textlegendExcluCell = document.createElement("td");
        textlegendExcluCell.textContent = `Mise à la porte (${nbExclu})`;
        legendExcluRow.appendChild(colorlegendExcluCell);
        legendExcluRow.appendChild(textlegendExcluCell);


        const legendJustificatifRow = document.createElement("tr");
        const colorlegendJustificatifCell = document.createElement("td");
        colorlegendJustificatifCell.classList.add("avec_certificat");
        const textlegendJustificatifCell = document.createElement("td");
        textlegendJustificatifCell.id = "legendJustificatifId";
        legendJustificatifRow.appendChild(colorlegendJustificatifCell);
        legendJustificatifRow.appendChild(textlegendJustificatifCell);

        const legendCongesAccordesRow = document.createElement("tr");
        const colorlegendCongesAccordesCell = document.createElement("td");
        colorlegendCongesAccordesCell.textContent = "C";
        const textlegendCongesAccordesCell = document.createElement("td");
        textlegendCongesAccordesCell.id = "legendCongesAccordesId";
        legendCongesAccordesRow.appendChild(colorlegendCongesAccordesCell);
        legendCongesAccordesRow.appendChild(textlegendCongesAccordesCell);

        
        const legendAJustifierRow = document.createElement("tr");
        const colorlegendAJustifierCell = document.createElement("td");
        colorlegendAJustifierCell.classList.add("absence-a_justifier");
        const textlegendAJustifierCell = document.createElement("td");
        textlegendAJustifierCell.textContent = `Absence à justifier (${nbAJustifier}p)`;
        legendAJustifierRow.appendChild(colorlegendAJustifierCell);
        legendAJustifierRow.appendChild(textlegendAJustifierCell);

        legendTable.appendChild(legendRetardRow);
        legendTable.appendChild(legendAJustifierRow);
        legendTable.appendChild(legendJustifieeRow);
        legendTable.appendChild(legendInjustifieeRow);
        legendTable.appendChild(legendExcluRow);
        legendTable.appendChild(legendJustificatifRow);
        legendTable.appendChild(legendCongesAccordesRow);


        // Tableau des absences
        // Créez un élément de tableau
        const table = document.createElement("table"); 
        contentElement.appendChild(table);    
        table.className = "absences-fixed-size-table"; 
        
        const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const thNo = document.createElement("th");
        thNo.textContent = "No";
        headerRow.appendChild(thNo);

        const thDate = document.createElement("th");
        thDate.textContent = "Date";
        headerRow.appendChild(thDate);

        daysOfWeek.forEach(day => {
          const thDay = document.createElement("th");
          thDay.colSpan = 13;
          thDay.textContent = day;
          headerRow.appendChild(thDay);
        }); 

        thead.appendChild(headerRow);
        table.appendChild(thead);
     
        let offset = 1;
        let count = 0;
        let date = new Date(dateBeginSchool);

        // On trouve le lundi le plus proche de cette date.
        offset = date.getDay() - 1;
        if (offset < 0) {
            offset = 6;
        }
        
        date.setDate(date.getDate() + (7 - offset) % 7);    
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', separator: '-' };
        const rowPeriod = document.createElement("tr");
        const createTd = document.createElement("td");
        rowPeriod.appendChild(createTd);
        rowPeriod.appendChild(createTd);
        for (let i = 0; i <= 5 * 13; i++){
            const cell = document.createElement("td");
            if (i == 0) {
                
                cell.classList.add('week-cell');
                cell.classList.add('cell-with-border');     
            }
            else {
                let period = (i - 1) % 13 + 1;
                cell.textContent = `P${period}`;
                
                if (period == 13) {
                    cell.classList.add('cell-with-border');
                }
            }
            rowPeriod.appendChild(cell);
        }
        table.appendChild(rowPeriod);
         
        // Boucle pour créer les lignes (40 lignes)
        for (let i = 0; i < 48; i++) {
            const row = document.createElement("tr");    

            const cellDate = document.createElement("td");
            cellDate.classList.add('week-cell');
            cellDate.classList.add('cell-with-border');

            const cellNo = document.createElement("td");
            var weekNumber = getWeekNumber(date);

            cellNo.textContent = weekNumber;
            row.appendChild(cellNo);

            row.appendChild(cellDate);
            
            let dateFormatee = formatDateToYyyyMmDd(date);
            
            let dateFormateeCH = formatDateToDdMmYyyy(date);
            //console.log(dateFormatee);

            cellDate.textContent = dateFormateeCH;

            for (let j = 0; j < 7; j++) {
                
                const annee = date.getFullYear();
                const mois = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois commence à 0, alors ajoutez 1
                const jour = date.getDate().toString().padStart(2, '0');
                dateFormatee = annee + '-' + mois + '-' + jour;
                
                if (date.getDay() != 6 && date.getDay() != 0) // on ignore les weekends.
                {
                    for (let k = 0; k < 13; k++) {
                        const cell = document.createElement("td");
                        cell.dataset.period = dateFormatee + (k + 1);  
                    

                        if (k == 12) {
                            cell.classList.add('cell-with-border');
                        }
                        row.appendChild(cell);
                    }
                }

                count++; 
                date.setDate(date.getDate() + 1);
            }       

            // Ajoutez la ligne à la table
            table.appendChild(row);
        }

        // Ajoutez la table à l'élément "content"
        eleve.absences.forEach(absence => {
            
            

            const periodDate = absence.periodDate;
            const periodStart = absence.periodStart;
            const periodEnd = absence.periodEnd;
            const period = absence.period;
            const absenceType = absence.absenceType;
            const absenceStatus = absence.absenceStatus;
            
            const cellAbsence = table.querySelector(`[data-period="${periodDate}${period}"]`);
            
            if (cellAbsence) {
                if (absenceStatus === "INJUSTIFIEE")
                {
                    if (!cellAbsence.classList.contains("absence-injustifiee")) {
                        cellAbsence.classList.add("absence-injustifiee");               
                    }
                }
                if (absenceStatus === "A_JUSTIFIER")
                {
                    if (!cellAbsence.classList.contains("absence-a_justifier")) {
                        cellAbsence.classList.add("absence-a_justifier");   
                                               
                    }
                }
                else if (absenceType === "EXCLU"){
                    if (!cellAbsence.classList.contains("absence-exclu")) {
                        cellAbsence.classList.add("absence-exclu");             
                    }
                }
                else if (absenceType === "ABSENT" ){    
                    if (!cellAbsence.classList.contains("absence-justifiee")) {
                      cellAbsence.classList.add("absence-justifiee");
                    }
                }       
                else if (absenceType === "RETARD" ) {
                    if (!cellAbsence.classList.contains("retard")) {
                      cellAbsence.classList.add("retard");
                    }   
                    
                    const circle = document.createElement("div");
                    circle.className = "circle";
                    cellAbsence.appendChild(circle);            
                } 
            }                
        });

        let nbPeriodesJustifieesMedicales = 0;
        let nbCongesAccordes = 0;

        eleve.justificatifs.forEach(justificatif => {
            if (justificatif.motif === "RAISONS_MEDICALES_AVEC_CERTIFICAT")
            {

                const dateDebut = justificatif.dateDebut;
                const dateFin = justificatif.dateFin;
                const periodeDebut = justificatif.periodeDebut;
                const periodeFin = justificatif.periodeFin;


                // trouver toutes les cellules entre date de début et date de fin

                if (dateDebut === dateFin){
                    for (let i = periodeDebut; i <= periodeFin; i++){
                        const cellJustifiee = table.querySelector(`[data-period="${dateDebut}${i}"]`);
                        if (cellJustifiee !== null)
                        {
                            cellJustifiee.classList.add("avec_certificat");
                            cellJustifiee.classList.remove("justifiee");
                            nbPeriodesJustifieesMedicales++;
                        }
                    }
                }
                else {
                    for (let i = periodeDebut; i <= 40; i++) {
                        const cellJustifiee = table.querySelector(`[data-period="${dateDebut}${i}"]`);
                        if (cellJustifiee !== null) {
                            if (cellJustifiee.classList.contains("absence-justifiee"))
                            {
                                cellJustifiee.classList.add("avec_certificat");
                                cellJustifiee.classList.remove("absence-justifiee");
                                nbPeriodesJustifieesMedicales++;
                            }
                        }
                    }

                    for (let i = 0; i <= periodeFin; i++) {
                        const cellJustifiee = table.querySelector(`[data-period="${dateFin}${i}"]`);
                        if (cellJustifiee !== null) {
                            if (cellJustifiee.classList.contains("absence-justifiee"))
                            {
                                cellJustifiee.classList.add("avec_certificat");
                                cellJustifiee.classList.remove("absence-justifiee");
                                nbPeriodesJustifieesMedicales++;
                            }
                        }
                    }
                    const startDate = new Date(dateDebut);
                    const endDate = new Date(dateFin);
                    startDate.setDate(startDate.getDate() + 1);
                    for (let currentDate = new Date(startDate); currentDate < endDate; currentDate.setDate(currentDate.getDate() + 1)) {
                        for (let j = 0; j <= 40; j++) {
                            const currentDateIntl = formatDateToYyyyMmDd(currentDate);
                            const cellJustifiee = table.querySelector(`[data-period="${currentDateIntl}${j}"]`);
                            if (cellJustifiee !== null) {
                                if (cellJustifiee.classList.contains("absence-justifiee"))
                                {
                                    cellJustifiee.classList.add("avec_certificat");
                                    cellJustifiee.classList.remove("absence-justifiee");
                                    nbPeriodesJustifieesMedicales++;
                                }
                            }
                        }
                    }

                }
            }

            if (justificatif.motif === "CONGE_ACCORDE")
            {

                const dateDebut = justificatif.dateDebut;
                const dateFin = justificatif.dateFin;
                const periodeDebut = justificatif.periodeDebut;
                const periodeFin = justificatif.periodeFin;


                // trouver toutes les cellules entre date de début et date de fin

                if (dateDebut === dateFin){
                    for (let i = periodeDebut; i <= periodeFin; i++){
                        const cellJustifiee = table.querySelector(`[data-period="${dateDebut}${i}"]`);
                        if (cellJustifiee !== null) {
                            cellJustifiee.textContent = "C";
                            nbCongesAccordes++;
                        }

                    }
                }
                else {
                    for (let i = periodeDebut; i <= 40; i++) {
                        const cellJustifiee = table.querySelector(`[data-period="${dateDebut}${i}"]`);
                        if (cellJustifiee !== null) {
                            cellJustifiee.textContent = "C";
                            nbCongesAccordes++;
                        }
                    }

                    for (let i = 0; i <= periodeFin; i++) {
                        const cellJustifiee = table.querySelector(`[data-period="${dateFin}${i}"]`);
                        if (cellJustifiee !== null) {
                            cellJustifiee.textContent = "C";
                            nbCongesAccordes++;
                        }
                    }
                    const startDate = new Date(dateDebut);
                    const endDate = new Date(dateFin);
                    startDate.setDate(startDate.getDate() + 1);
                    for (let currentDate = new Date(startDate); currentDate < endDate; currentDate.setDate(currentDate.getDate() + 1)) {
                        for (let j = 0; j <= 40; j++) {
                            const currentDateIntl = formatDateToYyyyMmDd(currentDate);
                            const cellJustifiee = table.querySelector(`[data-period="${currentDateIntl}${j}"]`);
                            if (cellJustifiee !== null) {
                                cellJustifiee.textContent = "C";
                                nbCongesAccordes++;
                            }
                        }
                    }

                }
            }
            
            if (justificatif.motif === "SUSPENSION")
            {

                const dateDebut = justificatif.dateDebut;
                const dateFin = justificatif.dateFin;
                const periodeDebut = justificatif.periodeDebut;
                const periodeFin = justificatif.periodeFin;


                // trouver toutes les cellules entre date de début et date de fin

                if (dateDebut === dateFin){
                    for (let i = periodeDebut; i <= periodeFin; i++){
                        const cellJustifiee = table.querySelector(`[data-period="${dateDebut}${i}"]`);
                        if (cellJustifiee !== null) {
                            cellJustifiee.classList.add("absence-exclu");
                        }

                    }
                }
                else {
                    for (let i = periodeDebut; i <= 40; i++) {
                        const cellJustifiee = table.querySelector(`[data-period="${dateDebut}${i}"]`);
                        if (cellJustifiee !== null) {
                            cellJustifiee.classList.add("absence-exclu");
                        }
                    }

                    for (let i = 0; i <= periodeFin; i++) {
                        const cellJustifiee = table.querySelector(`[data-period="${dateFin}${i}"]`);
                        if (cellJustifiee !== null) {
                            cellJustifiee.classList.add("absence-exclu");
                        }
                    }
                    const startDate = new Date(dateDebut);
                    const endDate = new Date(dateFin);
                    startDate.setDate(startDate.getDate() + 1);
                    for (let currentDate = new Date(startDate); currentDate < endDate; currentDate.setDate(currentDate.getDate() + 1)) {
                        for (let j = 0; j <= 40; j++) {
                            const currentDateIntl = formatDateToYyyyMmDd(currentDate);
                            const cellJustifiee = table.querySelector(`[data-period="${currentDateIntl}${j}"]`);
                            if (cellJustifiee !== null) {
                                cellJustifiee.classList.add("absence-exclu");
                            }
                        }
                    }

                }
            }

        });

        textlegendJustificatifCell.textContent = `Justi. avec cert. médical (${nbPeriodesJustifieesMedicales}p)`;
        textlegendCongesAccordesCell.textContent = `Congés accordés (${nbCongesAccordes}p)`;

        /*
        const diariesDiv = document.createElement("div");
        diariesDiv.classList.add('col');
        contentElement.appendChild(diariesDiv);
        const diariesTitle = document.createElement("h4");
        diariesTitle.textContent = "Journal";
        diariesTitle.classList.add("diaryTitle");
        diariesDiv.appendChild(diariesTitle);

        
        eleve.diaries.forEach(diary => {
     
            // Create new entry diary
            const newDiary= document.createElement("div");
            newDiary.classList.add('diary');
            
            // Create info diary
            const diaryDivInfo= document.createElement("div");
            diaryDivInfo.classList.add('infoDiary');
            let diaryDate = new Date(diary.diaryDate);
            let displayDate = formatDateToDdMmYyyy(diaryDate) + " " + diaryDate.getHours() + ":" + diaryDate.getMinutes();
            diaryDivInfo.innerHTML = "<span>" + displayDate + "</span> - <span>" + diary.diaryFirstName + " " + diary.diaryLastName + "</span> - <span class='diaryAuthor'>" + diary.diaryAuthorRole + "</span>";
            newDiary.appendChild(diaryDivInfo);

            // Create content diary
            const diaryDivContent= document.createElement("div");
            diaryDivContent.classList.add('contentDiary');
            diaryDivContent.textContent = diary.diaryContent;
            newDiary.appendChild(diaryDivContent); 
            
            diariesDiv.appendChild(newDiary);
        });
        
        */
        insertVacationsAbsences(table);
        fusionnerCellulesHorizontales(table);
    }
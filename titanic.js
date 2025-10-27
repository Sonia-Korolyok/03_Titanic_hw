import fs from 'node:fs';

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && line[i + 1] === '"') { // Экранированная кавычка
            current += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

fs.readFile('./train.csv', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {

        const lines = data.split('\n').filter(Boolean);
        const headers = parseCSVLine(lines[0]);
        const rows = lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            const obj = {};
            headers.forEach((header, i) => {
                obj[header] = values[i];
            });
            return obj;
        });

        const totalFare = rows.reduce((sum, row) => {
            const fare = parseFloat(row.Fare);
            return sum + (isNaN(fare) ? 0 : fare);
        }, 0);

        console.log(`Total Fare: ${totalFare.toFixed(2)}`); // 1 task

        const fareByClass = { 1: [], 2: [], 3: [] };

        rows.forEach(row => {
            const fare = parseFloat(row.Fare);
            const pclass = row.Pclass;
            if (!isNaN(fare) && fareByClass[pclass]) {
                fareByClass[pclass].push(fare);
            }
        });

        Object.entries(fareByClass).forEach(([cls, fares]) => {
            if(fares.length > 0) {
                const avg = fares.reduce((a, b) => a + b, 0) / fares.length;
                console.log(`Average fare for class ${cls}: ${avg.toFixed(2)}`); // 2 task
            } else {
                console.log(`No data for class ${cls}`);
            }
        });

        let survived = 0;
        let notSurvived = 0;

        for (let i = 0; i < rows.length; i++) {
            const v = (rows[i].Survived || '').toString().trim();
            if (v === '1') {
                survived++;
            } else if (v === '0') {
                notSurvived++;
            } else {
                continue;
            }
        }

        console.log('Survived:', survived);  // 3 task
        console.log('Not Survived:', notSurvived); // 3 task

        const groups = {
            men: { survived: 0, died: 0 },
            women: { survived: 0, died: 0 },
            children: { survived: 0, died: 0 }
        };

        rows.forEach(row => {
            const age = parseFloat(row.Age);
            const sex = (row.Sex || '').toLowerCase();
            const survived = row.Survived === '1' || row.Survived === 1;

            if (!isNaN(age) && age < 18) {
                groups.children[survived ? 'survived' : 'died']++;
            } else if (sex === 'male') {
                groups.men[survived ? 'survived' : 'died']++;
            } else if (sex === 'female') {
                groups.women[survived ? 'survived' : 'died']++;
            }
        });

        console.log('Survival by group:', groups); // 4 task

    }
});
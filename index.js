import fs from 'node:fs';

function parseCSVLine(line) {
    const result = [];
    let tmp = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && line[i + 1] === '"') {
            tmp += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(tmp);
            tmp = '';
        } else {
            tmp += char;
        }
    }
    result.push(tmp);
    return result;
}
console.log("====== 1 task ======")
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

        const averageFare = totalFare / rows.length;

        const fares = rows
            .map(row => parseFloat(row.Fare))
            .filter(fare => !isNaN(fare) && fare > 0);

        // const minFare = fares.reduce((min, fare) => Math.min(min, fare), Infinity);
        // const maxFare = fares.reduce((max, fare) => Math.max(max, fare), -Infinity);

        const [minFare, maxFare] = fares.reduce(
            ([min, max], fare) => [
                Math.min(min, fare),
                Math.max(max, fare)
            ],
            [Infinity, -Infinity]
        );

        console.log(`Total Fare: ${totalFare.toFixed(2)}`);
        console.log(`Average fare: ${averageFare.toFixed(2)}`);
        console.log(`Max Fare: ${maxFare.toFixed(2)}`);
        console.log(`Min Fare: ${minFare.toFixed(2)}`);

        console.log("====== 2 task ======")
        const fareByClass = { 1: [], 2: [], 3: [] };

        rows.forEach(row => {
            const fare = parseFloat(row.Fare);
            const pclass = row.Pclass;
            if (!isNaN(fare) && fare > 0 && fareByClass[pclass]) {
                fareByClass[pclass].push(fare);
            }
        });

        Object.entries(fareByClass).forEach(([cls, fares]) => {
            if(fares.length > 0) {
                const avg = fares.reduce((a, b) => a + b, 0) / fares.length;          // 1: 86.15
                console.log(`Average fare for class ${cls}: ${avg.toFixed(2)}`);  // 2: 21.36
            } else {                                                                          // 3: 13.79
                console.log(`No data for class ${cls}`);                              // fare a bit higher cause 0 is excluded
            }
        });
        console.log("--------- price range ---------")
        for (const pclass in fareByClass) {
            const fares = fareByClass[pclass];
            if (fares.length > 0) {
                const minFare = Math.min(...fares);
                const maxFare = Math.max(...fares);
                console.log(`Class ${pclass}: min = ${minFare.toFixed(2)}, max = ${maxFare.toFixed(2)}`);
            } else {
                console.log(`Class ${pclass}: нет данных`);
            }
        }


        console.log("====== 3 task ======")
        let survived = 0;
        let notSurvived = 0;

        for (let i = 0; i < rows.length; i++) {
            const v = (rows[i].Survived || '').toString().trim();
            if (v === '1') {
                survived++;
            } else if (v === '0') {
                notSurvived++;
            }
        }

        console.log('Survived:', survived);
        console.log('Not Survived:', notSurvived);

        console.log("====== 4 task ======")

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

        console.log('Survival by group:', groups);

        const crew = rows.filter(row => parseFloat(row.Fare) === 0);
        const crewCount = crew.length;
        console.log(`Crew: ${crewCount} persons`);

        const savedCrew = crew.filter(row => Number(row.Survived) === 1).length;
        const deadCrew = crew.filter(row => Number(row.Survived) === 0).length;

        console.log(`Survived: ${savedCrew}`);
        console.log(`Didn't survived: ${deadCrew}`);

    }
});
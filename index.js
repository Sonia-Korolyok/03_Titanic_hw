import fs from 'node:fs';
import {Titanic} from "./model/Titanic.js";

fs.readFile('./train.csv', 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        const arr = data.split('\n');
        arr.shift();
        const stats = new Titanic(arr, /,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        console.log(`Total fares:`, stats.totalFares.toFixed(2));
        console.log(`Average fares by classes:`, stats.avgFaresByClasses)
        console.log(stats.totalSurvived);
        console.log(stats.totalSurvivedByGender);
        console.log(stats.totalSurvivedChildren)
    }
})

export class Titanic {
    constructor(data, separator) {
        this.data = data.map(s => s.split(separator))
    }

    get totalFares() {
        return this.data
            .map(c => +c[9])
            .filter(f => !isNaN(f))
            .reduce((a, b) => a + b);
    }

    get avgFaresByClasses() {
        const res = this.data
            .filter(c => !isNaN(+c[9]))
            .map(c => ({pClass: c[2], fare: +c[9]}))
            .reduce((acc, info) => {
                const key = info.pClass;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(info.fare);
                return acc;
            }, {})
        for (const key in res) {
            res[key] = +(res[key].reduce((a, b) => a + b) / res[key].length).toFixed(2);
        }
        return res;
    }

    get totalSurvived() {
        return this.data
            .reduce((acc, c) => {
                const key = +c[1] ? 'Survived' : 'Non survived';
                if (!acc[key]) {
                    acc[key] = 0;
                }
                acc[key]++;
                return acc;
            }, {})
    }

    get totalSurvivedByGender() {
        return this.data
            .reduce((acc, c) => {
                const key = this._survivedGender(c[4], c[1]);
                if (!acc[key]) {
                    acc[key] = 0;
                }
                acc[key]++;
                return acc;
            }, {})
    }

    get totalSurvivedChildren() {
        return this.data
            .filter(c => c[5] && c[5] < 18)
            .reduce((acc, c) => {
                const key = +c[1] ? 'Children survived' : 'Children non survived';
                if (!acc[key]) {
                    acc[key] = 0;
                }
                acc[key]++;
                return acc;
            }, {})
    }

    _survivedGender(gender, survived) {
        survived = +survived ? 'survived' : 'non survived';
        return gender + " " + survived;
    }
}

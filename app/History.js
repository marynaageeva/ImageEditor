export class History {
    constructor() {
        this.steps = [];
        this._activeStep = 0;
    }

    save(step) {
        if (this._activeStep !== this.steps.length) {
            this.steps.length = this._activeStep;
        }
        this.steps.push(step);
        this._activeStep++;
    }

    undo() {
        if (this._activeStep > 1) {
            this._activeStep--;
        }
        return this.steps[this._activeStep-1];
    }

    redo() {
        if (this._activeStep < this.steps.length) {
            this._activeStep++;
        }
        return this.steps[this._activeStep - 1];
    }
}
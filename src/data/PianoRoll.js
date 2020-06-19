import { PianoRollNote } from "./PianoRollNote";

export class PianoRoll {
    constructor() {
        this.reset(16);
    }

    reset(notes) {
        this.grid = [];

        for (let note = 0; note < notes; note++) {
            let semitones = [];

            // add 12 blank semitones to the roll
            for (let semitone = 12; semitone >= 0; semitone--) {
                // 440 is A4, start at A3, then adjust up to C3
                let modifiedSemitone = semitone + 3;

                let frequency = 440 * Math.pow(2, (modifiedSemitone - 12) / 12);

                semitones.push(new PianoRollNote(frequency));
            }

            this.grid.push(semitones);
        }
    }
}
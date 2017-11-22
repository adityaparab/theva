import { argv } from 'process';

export class Theva {
    constructor() {
        console.log('Initializing...');
        const applicableArgs:Array<string> = Array.from(argv).slice(2);
        console.log(applicableArgs);
    }
}

export let instance = new Theva();
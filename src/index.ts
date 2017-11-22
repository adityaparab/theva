//import { argv } from 'process';

//import { IConfig } from './IConfig';
import { IPathConfig } from './IPathConfig';

import { Deployer } from './deployer';


export class Theva {
    constructor() {
        console.log('Initializing...');
        const paths: Array<IPathConfig> = [
            {
                src: 'D:/Aditya/test/folder1',
                dest: 'D:/Aditya/test/folder1_out'
            },
            {
                src: 'D:/Aditya/test/folder2',
                dest: 'D:/Aditya/test/folder2_out'
            }
        ];
        const deployer = new Deployer(paths);
        deployer.spawnWatch();
    }
}

export let instance = new Theva();
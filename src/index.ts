import { cwd } from 'process';
import { resolve, join, extname } from 'path';
import { argv, Arguments } from 'yargs';
import { writeJSONSync, pathExistsSync, readJSONSync } from 'fs-extra';
import { IPathConfig } from './IPathConfig';

import { Deployer } from './deployer';

export class Theva {
    constructor() {
        const args: Arguments = argv;
        let paths:Array<IPathConfig>;
        let shouldStart:boolean = true;
        let fileName:string;
        if (args._.length === 0 && args.hasOwnProperty('init')) {
            shouldStart = false;
            const config: Array<IPathConfig> = [
                {
                    src: resolve(cwd()).replace(/\\/g,'/'),
                    dest: ''
                }
            ];

            const filePath = join(cwd(), 'config.json');
            writeJSONSync(filePath, config, {
                spaces:4
            });
            console.log(`A sample configuration file has been generated at ${join(cwd(), 'config.json')}`);

        } else if (args._.length === 1 && !args.init) {
            fileName = args._[0];
        } else if (args._.length === 0 && !args.hasOwnProperty('init')) {
            fileName = 'config.json';
        } else {
            shouldStart = false;
            console.error('Invalid arguments');
        }

        if(shouldStart){
            const filePath = join(cwd(), fileName!);
            const exists = pathExistsSync(filePath);

            if(exists){
                const isJson = extname(filePath) === '.json';
                if(isJson){
                    const jsonContent = readJSONSync(filePath);
                    paths = jsonContent.map((o:IPathConfig) => <IPathConfig>o);
                    const deployer = new Deployer(paths);
                    deployer.spawnWatch();
                } else {
                    console.error('Configuration file must be a .json file');
                }
            } else {
                console.error('Configuration File not found');
            }
        }
    }
}

export let instance = new Theva();
import { join, dirname, resolve } from 'path';
import { FSWatcher, watch } from 'chokidar';

import {
    pathExistsSync,
    ensureDirSync,
    copySync,
    removeSync
} from 'fs-extra';

import { green, red, bold } from 'colors';



import { IPathConfig } from './IPathConfig';

import { EventConstants } from './EventsConstant';

export class Deployer {
    private watcher: FSWatcher;
    private target: Array<IPathConfig>;
    constructor(targets: Array<IPathConfig>) {
        this.target = targets.map(p => {
            return {
                src: resolve(p.src).replace(/\\/g, '/'),
                dest: resolve(p.dest).replace(/\\/g, '/')
            }
        });
        console.log(`Watching for changes at
${this.target.map(t => t.src).join('\n')}\n`);
    }


    public get targets(): Array<IPathConfig> {
        return this.target;
    }
    public spawnWatch() {
        const sources: Array<string> = this.target.map(t => t.src);
        this.watcher = watch(sources, {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            ignoreInitial: true
        });

        this.watcher.on(EventConstants.ANY_EVENT, this.watchCallback.bind(this));
    }

    private watchCallback(event: string, filePath: string): void {
        filePath = filePath.replace(/\\/g, '/');
        const targetObj = this.target.find(t => filePath.includes(t.src));

        const relativePath = filePath.slice(targetObj!.src.length);
        const destinationPath = join(targetObj!.dest, relativePath);
        const folderName = dirname(destinationPath);
        //const source = targetObj!.id || filePath;

        switch (event) {
            case EventConstants.FILE_ADDED:
            case EventConstants.FILE_CHANGED:
                ensureDirSync(folderName);
                copySync(filePath, destinationPath);
                this.$log(filePath, destinationPath);
                break;
            case EventConstants.FILE_DELETED:
                if (pathExistsSync(folderName)) {
                    ensureDirSync(folderName);
                    removeSync(destinationPath);
                    this.$log(filePath, destinationPath);
                }
                break;
            case EventConstants.DIRECTORY_ADDED:
                ensureDirSync(filePath);
                copySync(filePath, destinationPath);
                this.$log(filePath, destinationPath);
                break;
            case EventConstants.DIRECTORY_DELETED:
                ensureDirSync(filePath);
                removeSync(destinationPath);
                this.$log(filePath, destinationPath);
                break;
            default:
                console.error(`Error - EventType ${event} is not handled`);

        }
    }

    $log(from:string, to:string, success:boolean = true){
        const clr:any = success ? green : red;
        console.log(`${bold(clr('From:'))} ${clr(from)}
${bold(clr('To:'))}   ${clr(to)}`);
                        
    }

}
import { join, resolve } from 'path';
import { FSWatcher, watch } from 'chokidar';

import { IPathConfig } from './IPathConfig';

import { EventConstants } from './EventsConstant';

export class Deployer {
    private watcher: FSWatcher;
    private target: Array<IPathConfig>;
    constructor(targets: Array<IPathConfig>) {
        this.target = targets;
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

        const relativePath = filePath.slice(targetObj.src.length);
        const destinationPath = join(targetObj.dest, relativePath);


        console.log(`${filePath} ===> ${destinationPath}`);
    }

}
import { format } from 'date-fns';
import {Config} from '../config/config';
import gitService, {GitService} from '../service/git-service';
import vscodeService, {VscodeService} from '../service/vscode-service';

export class TaskService{

    timer: NodeJS.Timeout | undefined
    config: Config | undefined;
    interval: number = 1;
    
    setConfig(config : Config){
        this.config = config;
    }

    async startTimer(){
        console.log("start");
        if(this.timer){
            return;
        }

        try {
            const workspace = vscodeService.getCurrentWorkspacePath();
            const config : Config = await vscodeService.loadConfig(workspace);
            taskService.setConfig(config);
        } catch (error) {
            console.log("start error:" + error);
            vscodeService.setStatusBarMessage("git-robot:no config")
            return;
        }
        await this.runTask();
    }

    stopTimer(){
        if(this.timer){
            clearInterval(this.timer);
        }
        if(this.config){
            this.config.enable = false;
        }
        console.log("stop");
    }

    async runTask(){
        console.log("interval = " + this.interval);
        vscodeService.setStatusBarMessage("git-robot:" + this.interval)
        
        if(!this.config){
            console.log("no config, do not sync");
            vscodeService.setStatusBarMessage("git-robot:no config")
            return;
        }
        
        if(!this.config.enable){
            console.log("config is disable, do not sync");
            vscodeService.setStatusBarMessage("git-robot:disable")
            return;
        }

        if(!this.config.updateInterval){
            console.log("updateInterval undifine, do not sync");
            vscodeService.setStatusBarMessage("git-robot:no updateInterval")
            return;
        }

        const workspace = vscodeService.getCurrentWorkspacePath();
        if(!workspace){
            console.log("workspace is empty, can not sync");
            vscodeService.setStatusBarMessage("git-robot:no workspace")
            return;
        }
        
        if(this.interval >= this.config.updateInterval / 1000) {
            this.interval = 1;
            vscodeService.setStatusBarMessage("git-robot:syncing")
            gitService.setRepoDir(workspace);
            await gitService.sync();
        } else {
            this.interval++;
        }

        // const newdate = new Date();
        // let dateFormat = format(newdate, 'yyyy-MM-dd HH:mm:ss');
        // console.log(dateFormat);

        this.timer = setTimeout(async () => {
            await this.runTask();
          }, 1000);
    }
}

const taskService : TaskService = new TaskService();
export default taskService;
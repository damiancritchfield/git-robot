import { format } from 'date-fns';
import {Config} from '../config/config';
import gitService, {GitService} from '../service/git-service';
import vscodeService, {VscodeService} from '../service/vscode-service';

export class TaskService{

    timer: NodeJS.Timeout | undefined
    config: Config | undefined;
    interval: number = 1;
    switch: boolean = true;
    
    setConfig(config : Config){
        this.config = config;
    }

    async restart(){
        this.stopTimer();
        this.startTimer();
    }

    async startup(){
        try {
            const workspace = vscodeService.getCurrentWorkspacePath();
            const config : Config = await vscodeService.loadConfig(workspace);
            if(config && config.enable){
                this.startTimer();
            }
        } catch (error) {
            console.log("startup error:" + error);
            vscodeService.setStatusBarMessage("git-robot:no config")
            return;
        }
    }

    async startTimer(){
        
        this.switch = true;
        if(this.timer){
            console.log("started");
            return;
        }
        console.log("starting");

        try {
            const workspace = vscodeService.getCurrentWorkspacePath();
            const config : Config = await vscodeService.loadConfig(workspace);
            this.interval = config.updateInterval / 1000;
            if(!this.interval || this.interval <= 0){
                vscodeService.setStatusBarMessage("git-robot:no updateInterval")
                return;
            }
            taskService.setConfig(config);
            await this.runTask();
        } catch (error) {
            console.log("start error:" + error);
            vscodeService.setStatusBarMessage("git-robot:no config")
            return;
        }
    }

    stopTimer(){
        if(this.timer){
            clearInterval(this.timer);
        }
        this.switch = false;
        this.timer = undefined;
        console.log("stop");
        vscodeService.setStatusBarMessage("git-robot:stop")
    }

    async runTask(){
        
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

        console.log("interval = " + this.interval);
        vscodeService.setStatusBarMessage("git-robot:" + this.interval)

        if(this.interval <= 0) {
            try {
                this.interval = this.config.updateInterval / 1000;
                vscodeService.setStatusBarMessage("git-robot:syncing")
                gitService.setRepoDir(workspace);
                await gitService.sync();
            } catch (error) {
                vscodeService.showErrorMessage("git-robot:sync error" + error)
                this.stopTimer();
            }
        } else {
            this.interval--;
        }

        // const newdate = new Date();
        // let dateFormat = format(newdate, 'yyyy-MM-dd HH:mm:ss');
        // console.log(dateFormat);
        if(!this.switch){
            console.log("switch off, do not sync");
            vscodeService.setStatusBarMessage("git-robot:stop")
            return;
        }
        this.timer = setTimeout(async () => {
            await this.runTask();
          }, 1000);
    }
}

const taskService : TaskService = new TaskService();
export default taskService;
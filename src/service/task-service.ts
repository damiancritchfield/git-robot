import { format } from 'date-fns';
import {Config} from '../config/config';
import gitService, {GitService} from '../service/git-service';
import vscodeService, {VscodeService} from '../service/vscode-service';

export class TaskService{

    timer: NodeJS.Timeout | undefined
    config: Config = new Config();
    interval: number = 1;
    switch: boolean = true;
    taskCode: number | undefined;
    
    setConfig(config : Config){
        this.config = config;
    }

    async loadConfig(){
        try {
            const workspace = vscodeService.getCurrentWorkspacePath();
            const config : Config = await vscodeService.loadConfig(workspace);
            this.interval = config.updateInterval / 1000;
            if(!this.interval || this.interval <= 0){
                this.showStatusBarMessage("no updateInterval")
                return;
            }
            taskService.setConfig(config);
            return config;
        } catch (error) {
            this.showStatusBarMessage("no config")
            return undefined;
        }
    }

    async restart(){
        this.stopTimer();
        this.startTimer();
    }

    async startTimer(){

        this.switch = true;
        if(this.timer){
            console.log("started");
            return;
        }
        console.log("starting");

        const config = await this.loadConfig();
        if(!config){
            return;
        }
        if(!this.validateConfig()){
            return;
        }
        await this.runTask();
    }

    stopTimer(){
        if(this.timer){
            clearInterval(this.timer);
        }
        this.switch = false;
        this.timer = undefined;
        this.showStatusBarMessage("stop")
    }

    async runTask(){

        let taskCodeTmp = this.generateTaskCode();

        this.showStatusBarMessage(this.interval);
        
        if(!this.reloadWorkspace()){
            return;
        }

        if(this.interval <= 0) {
            try {
                this.interval = this.config.updateInterval / 1000;
                this.showStatusBarMessage("syncing")
                await gitService.sync();
            } catch (error) {
                vscodeService.showErrorMessage("git-robot:sync error" + error)
                this.stopTimer();
            }
        } else {
            this.interval--;
        }

        if(!this.switch){
            this.showStatusBarMessage("stop")
            return;
        }

        if(!this.validateTaskCode(taskCodeTmp)){
            console.log("taskCode error, timer stop");
            return;
        }
        this.timer = setTimeout(async () => {
            await this.runTask();
          }, 1000);
    }

    generateTaskCode(){
        this.taskCode = new Date().getTime();
        return this.taskCode;
    }

    validateTaskCode(taskCodeTmp: number | undefined){
        return taskCodeTmp == this.taskCode;
    }

    validateConfig(){
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
        return true;
    }

    showStatusBarMessage(msg : any){
        vscodeService.setStatusBarMessage("git-robot:" + msg)
    }

    reloadWorkspace(){
        const workspace = vscodeService.getCurrentWorkspacePath();
        if(!workspace){
            this.showStatusBarMessage("no workspace")
            return;
        }
        gitService.setRepoDir(workspace);
        return workspace;
    }
}

const taskService : TaskService = new TaskService();
export default taskService;
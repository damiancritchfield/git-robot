import * as vscode from 'vscode';
import {Config} from '../config/config';

export class VscodeService{

    getCurrentWorkspacePath() : string | undefined {
        let workspace = vscode.workspace.workspaceFolders;
		if(workspace && workspace.length > 0){
            return workspace[0].uri.fsPath;
        }
    }

    async loadConfig(workspace: string | undefined) : Promise<Config>{
        if(!workspace) {
            return new Config();
        }
        const uri = vscode.Uri.file(workspace + "/.git-robot/config.json");
        const configArray : Uint8Array = await vscode.workspace.fs.readFile(uri);
        const config : Config = JSON.parse(configArray.toString());
        return config;
    }

    async writeConfig(config: Config, workspace: string | undefined){
        const uri = vscode.Uri.file(workspace + "/.git-robot/config.json");
        const configUint8Array = this.stringToUint8Array(JSON.stringify(config));
        await vscode.workspace.fs.writeFile(uri, configUint8Array);
        return config;
    }

    async initConfig(){
        const config : Config = new Config();
        config.updateInterval = 5000;
        config.enable = true;
        await this.writeConfig(config, this.getCurrentWorkspacePath())
    }

    setStatusBarMessage(msg: string){
        vscode.window.setStatusBarMessage(msg);
    }

    showErrorMessage(msg: string){
        vscode.window.showErrorMessage(msg);
    }

    
    stringToUint8Array(str: string){
        let arr = [];
        for (let i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
    
        let tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array
    }
}

const vscodeService = new VscodeService();
export default vscodeService;
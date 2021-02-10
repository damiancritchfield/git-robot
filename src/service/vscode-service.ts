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
        const uri = vscode.Uri.file(workspace + "\\.git-robot\\config.json");
        const configArray : Uint8Array =await vscode.workspace.fs.readFile(uri);
        const config : Config = JSON.parse(configArray.toString());
        return config;
    }

    setStatusBarMessage(msg: string){
        vscode.window.setStatusBarMessage(msg);
    }

    showErrorMessage(msg: string){
        vscode.window.showErrorMessage(msg);
    }

}

const vscodeService = new VscodeService();
export default vscodeService;
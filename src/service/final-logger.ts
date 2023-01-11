import * as vscode from 'vscode';
var log4js = require('log4js');

function getCurrentWorkspacePath(){
    let workspace = vscode.workspace.workspaceFolders;
    if(workspace && workspace.length > 0){
        return workspace[0].uri.fsPath;
    }
}

var logFile = getCurrentWorkspacePath() + "/.git-robot/git-robot.log";

log4js.configure({
  appenders: { cheese: { type: "file", filename: logFile } },
  categories: { default: { appenders: ["cheese"], level: "error" } },
});

const logger = log4js.getLogger();
logger.level = "debug";
logger.debug("setup logger");

class Log{
    debug(object: any){
        logger.debug(object);
    }
    info(object: any){
        logger.info(object);
    }
    error(object: any){
        logger.error(object);
    }
    warn(object: any){
        logger.warn(object);
    }
}

const log : Log = new Log();
export default log;

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import taskService, {TaskService} from './service/task-service';
import vscodeService, {VscodeService} from './service/vscode-service';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let startCommand = vscode.commands.registerCommand('git-robot.start', async () => {
		taskService.startTimer();
	});
	context.subscriptions.push(startCommand);

	let stopCommand = vscode.commands.registerCommand('git-robot.stop', async () => {
		taskService.stopTimer();
	});
	context.subscriptions.push(stopCommand);

	let restartCommand = vscode.commands.registerCommand('git-robot.restart', async () => {
		taskService.restart();
	});
	context.subscriptions.push(restartCommand);

	let initConfigCommand = vscode.commands.registerCommand('git-robot.initConfig', async () => {
		vscodeService.initConfig();
	});
	context.subscriptions.push(initConfigCommand);

	//自动启动
	taskService.startTimer();
}

// this method is called when your extension is deactivated
export function deactivate() {
	taskService.stopTimer();
}
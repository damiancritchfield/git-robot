# git-robot README

git-robot is an extension to push project files to git in a predefined interval without taking any action by the developer.

## Getting Started

The main function of "git-robot" plug-in is to automatically operate git commands at a fixed time, so as to achieve automatic synchronization of files in the working directory.If a file conflict or other error occurs during execution, the plugin will stop running, and you will need to reboot the plugin after the error or error has been resolved.

## Prerequisites

Before you can use this plugin, you must set your working directory to Git project and configure Git to remember authentication information or use SSH key authentication.This allows you to operate git commands without a password.Refer to the Git documentation for configuration details.

## Settings

Before using it, you should create a folder called ".git-robot" in your workspace and a file called "config.json" under ".git-robot".Otherwise the plug-in will not start by default.Then write ".git-robot/config.json" as follows:

```
{
  "enable": true,
  "updateInterval": 3000
}
```

Note that where "enable" is true the plugin is enabled and false the plugin is not enabled.The value "updateInterval" represents the time in milliseconds between the plug-in committing and pulling updates.Only take a whole number of seconds.

## Commands

Press F1 or CTRL+Shift+P to open VS Code Command Palette.

```
git-robot: start git-robot // Starts the interval and routine
git-robot: stop git-robot // Stops the interval and routine
git-robot: restart git-robot // Reloads Stop + Start
```

## Authors

damiancritchfield - Developer

Write this plug-in as a hobby. Usually used to synchronize personal notes.

## License

This project is licensed under the GPL v3 License - see the LICENSE.md file for details

## Thirdparty Libraries

Simple-Git

**Enjoy!**





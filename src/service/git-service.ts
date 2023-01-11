import { resolve } from 'dns';
import simpleGit, {Response, SimpleGit, SimpleGitOptions} from 'simple-git';
import log from '../service/final-logger';

const options: SimpleGitOptions = {
	baseDir: process.cwd(),
	binary: 'git',
	maxConcurrentProcesses: 6,
	config: [],
 };
 const git: SimpleGit = simpleGit(options);

 export class GitService {

    repoDir = '';

    setRepoDir(repoDir : string) : void {
        this.repoDir = repoDir;
    }

    commitAll() : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await git.cwd(this.repoDir)
                await git.add("--all")
                await git.commit("auto commit")
                console.log("commit")
                resolve()
            } catch (error) {
                log.error(error)
                reject()
            }
        });
    }

    push() : Promise<void>{
        return new Promise(async (resolve, reject) => {
            try {
                await git.cwd(this.repoDir)
                await git.push("origin", "master")
                console.log("push")
                resolve()
            } catch (error) {
                log.error(error)
                reject()
            }
        });
    }

    pull() : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await git.cwd(this.repoDir)
                await git.pull("origin", "master")
                console.log("pull")
                resolve()
            } catch (error) {
                log.error(error)
                reject(error)
            }
        });
    }

    async sync() : Promise<void> {
        await this.commitAll();
        await this.pull();
        await this.push();
    }
 }

const gitService = new GitService();
export default gitService;
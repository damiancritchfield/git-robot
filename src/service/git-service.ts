import { resolve } from 'dns';
import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git';

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
            await git.cwd(this.repoDir)
            await git.add("--all")
            await git.commit("auto commit")
            console.log("commit")
            resolve()
        });
    }

    push() : Promise<void>{
        return new Promise(async (resolve, reject) => {
            await git.cwd(this.repoDir)
            await git.push("origin", "master")
            console.log("push")
            resolve()
        });
    }

    pull() : Promise<void> {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                await git.cwd(this.repoDir)
                await git.pull("origin", "master")
                console.log("pull")
                resolve()
            }, 5000);
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
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
import { encrypt } from "./encryption";

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const secretsToSet = ["NPM_PUBLISH_TOKEN"];

const processArgs = async () => {
    for (const arg of process.argv) {
        await processArg(arg);
    }
};

const processArg = async (arg: string) => {
    if (!arg.endsWith("node") && !arg.endsWith("app.js")) {
        const repoSplit = arg.split("/");

        const { data } = await octokit.actions.getRepoPublicKey({
            owner: repoSplit[0],
            repo: repoSplit[1],
        });
        const { key_id, key } = data;

        for (const secretName of secretsToSet) {
            const encryptedSecret = encrypt(process.env[secretName], key);
            await octokit.actions.createOrUpdateRepoSecret({
                owner: repoSplit[0],
                repo: repoSplit[1],
                key_id,
                secret_name: secretName,
                encrypted_value: encryptedSecret,
            });
            console.log(`Secret ${secretName} set on ${arg}`);
        }
    }
};

processArgs();

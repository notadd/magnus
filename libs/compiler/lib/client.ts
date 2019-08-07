import { MagnusConfig } from '@notadd/magnus-core';
import { join } from 'path';
import globby = require('globby');
import { readFileSync, existsSync } from 'fs-extra';
import { parse } from '@notadd/magnus-graphql'
import { GraphqlToTs } from './visitors/graphqlToTs'
import { writeFileSync } from 'fs-extra';
export async function bootstrapClient(config: MagnusConfig) {
    const client = config.client;
    if (client) {
        const sources = client.map(input => join(config.root, input));
        const inputs = await globby([...sources, `!${join(config.root, config.assets)}/**/*`]);
        const clientTs = new GraphqlToTs();
        clientTs.config = config;
        const path = join(config.root, config.def);
        if (existsSync(path)) {
            const def = readFileSync(join(config.root, config.def)).toString('utf8')
            clientTs.schema = parse(def);
            inputs.map(input => {
                const path = input.replace('.graphql', '.ts');
                try {
                    const code = readFileSync(input).toString('utf8');
                    const ast = parse(code);
                    const result = ast.visit(clientTs, ``)
                    writeFileSync(path, result);
                } catch (e) {
                    console.log(`create ${path} error!!!`)
                }
            })
        } else {
            console.log(`不存在${path}文件`)
        }
    }
}
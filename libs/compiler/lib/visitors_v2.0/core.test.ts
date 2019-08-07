import { CoreFile } from './core.file'
import { join } from 'path';
import * as ts from 'typescript';
import { readFileSync } from 'fs-extra';
import stripJsonComments from 'strip-json-comments';
const json = readFileSync(join(process.cwd(), 'tsconfig.json')).toString('utf8');
const tsconfig = JSON.parse(stripJsonComments(json));
const filePath = join(__dirname, 'tests/index.ts');
const program = ts.createProgram({
    rootNames: [filePath],
    options: tsconfig.compilerOptions
});
const sourceFile = program.getSourceFile(filePath)
const file = new CoreFile(sourceFile, program);
debugger;

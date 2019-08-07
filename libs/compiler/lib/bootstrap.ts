import { MagnusConfig } from '@notadd/magnus-core';
import { toJson } from '@notadd/magnus-graphql';
import { ast as grpcAst } from '@notadd/magnus-grpc';
import { bootstrapClient } from './client'
import * as morph from 'ts-morph';
import { join, relative } from 'path';
import { writeFileSync, ensureDirSync, existsSync, readFileSync } from 'fs-extra';
import * as ast from './visitors/visitor';
import { collectionVisitor, CollectionContext } from './visitors/collection';
import { MangusContextManager, MagnusVisitor } from './visitors/magnus';
import { AstToGraphqlVisitor } from './visitors/astToGraphql'
import { AstToProtoVisitor } from './visitors/astToProto'
import { print } from 'graphql';
import { watch } from 'chokidar';
import globby = require('globby');
import { GraphqlToTs } from './visitors/graphqlToTs';
import { camelCase } from 'lodash';
export async function bootstrap(config: MagnusConfig) {
    config.output = config.output || 'output';
    config.assets = config.assets || 'assets';
    const clientTss = await globby((config.client || []).map(input => join(config.root, input)))
    const dist = join(config.root, config.output, config.name);
    const assets = join(config.root, config.assets, config.name);
    ensureDirSync(dist);
    ensureDirSync(assets);
    const sources = config.inputs.map(input => join(config.root, input));
    const srcs = [...sources, `!${join(config.root, config.output)}/**/*`, `!${join(config.root, config.assets)}/**/*`, ...clientTss.map(file => `!${file.replace('.graphql', '.ts')}`)];
    const inputs = await globby(srcs);
    async function compile(isServer: boolean = false) {
        const project = new morph.Project();
        project.addSourceFilesFromTsConfig(join(process.cwd(), 'tsconfig.json'));
        const manager = new MangusContextManager();
        manager.isServer = isServer;
        const magnus = new MagnusVisitor(manager);
        const collectionContext = new CollectionContext();
        collectionContext.isServer = isServer;
        project.getSourceFiles().map((sourceFile: any) => {
            const fileName = sourceFile.getFilePath();
            if (inputs.includes(fileName)) {
                const node = ast.tsVisitor.visitSourceFile(new ast.SourceFile(), sourceFile.compilerNode);
                node.visit(collectionVisitor, collectionContext);
            }
        });
        // 处理class
        collectionContext.classes.map(cls => magnus.visitClassDeclaration(cls, collectionContext)).filter(item => !!item);
        const astToGraphqlVisitor = new AstToGraphqlVisitor();
        const documentAst = astToGraphqlVisitor.visitContextManager(manager, collectionContext);
        if (documentAst.definitions.length > 17) {
            const res = toJson(documentAst);
            if (isServer) {
                const content = print(res);
                writeFileSync(join(assets, `magnus.server.graphql`), content);
                await config.broadcast(Buffer.from(JSON.stringify({
                    name: config.name,
                    type: 'assets',
                    debug: config.debug,
                    fileName: `magnus.server.graphql`,
                    content: content
                })));
            }
            else {
                if (res.definitions.length > 0) {
                    const content = print(res);
                    writeFileSync(join(assets, `magnus.graphql`), content);
                    await config.broadcast(Buffer.from(JSON.stringify({
                        name: config.name,
                        type: 'assets',
                        debug: config.debug,
                        fileName: `magnus.graphql`,
                        content: content
                    })));
                }
            }
            // 搜集metadata entity数据库 类名 依赖名
            if (isServer) {
                const metadataContent = JSON.stringify(astToGraphqlVisitor.tsToGraphqlVisitor.def, null, 2)
                writeFileSync(join(assets, `magnus.metadata.json`), metadataContent)
                const serverContent = JSON.stringify(res, null, 2)
                writeFileSync(join(assets, `magnus.server.json`), serverContent)
            } else {
                const content = JSON.stringify(res, null, 2);
                writeFileSync(join(assets, `magnus.json`), content);
            }
            if (!isServer) {
                // proto
                const astToProtoVisitor = new AstToProtoVisitor();
                astToProtoVisitor.config = config;
                const proto = documentAst.visit(astToProtoVisitor, collectionContext)
                const protoAst = new grpcAst.ParseVisitor();
                const protoStr = proto.visit(protoAst, ``);
                if (documentAst.definitions.length > 0 && config.hasGrpc) {
                    writeFileSync(join(assets, `magnus.proto`), protoStr);
                    await config.broadcast(Buffer.from(JSON.stringify({
                        name: config.name,
                        type: 'assets',
                        debug: config.debug,
                        fileName: `magnus.proto`,
                        content: protoStr
                    })));
                }
            }
            const visitor = new GraphqlToTs();
            const sourceFile = astToGraphqlVisitor.documentAst;

            if (sourceFile.definitions.length > 17) {
                const context = `import {
    Double,
    Float,
    Int32,
    Uint32,
    Sint32,
    Fixed32,
    Sfixed32,
    Int64,
    Uint64,
    Sint64,
    Fixed64,
    Sfixed64,
    Bool,
    String,
    Bytes,
    Empty
} from '@notadd/magnus-core';
import { Observable } from 'rxjs';
`
                const content = sourceFile.visit(visitor, context);
                if (isServer) {
                    // declare
                    writeFileSync(join(dist, `magnus.server.ts`), content);
                    await config.broadcast(Buffer.from(JSON.stringify({
                        name: config.name,
                        debug: config.debug,
                        type: 'output',
                        fileName: `magnus.server.ts`,
                        content
                    })));
                } else {
                    writeFileSync(join(dist, `magnus.ts`), content);
                    await config.broadcast(Buffer.from(JSON.stringify({
                        name: config.name,
                        debug: config.debug,
                        type: 'output',
                        fileName: `magnus.ts`,
                        content
                    })));
                }
            }
            // 生成使用文件
            if (config.hasGrpc) {
                const path2 = join(assets, `magnus.proto`);
                const relativePath = relative(dist, path2)
                const index = `import { Transport } from '@nestjs/microservices';
import { join } from 'path';
export const ${camelCase(config.name)}Options: any = {
    transport: Transport.GRPC,
    options: {
        url: \`\${process.env.${config.hostEnv || 'COMMON_HOST'} || '0.0.0.0'}:\${process.env.${config.portEnv || 'COMMON_PORT'}||'9001'}\`,
        package: '${config.name || 'magnus'}',
        protoPath: join(__dirname, '${relativePath}'),
    },
    name: "${config.name || 'magnus'}"
};
`;
                writeFileSync(join(dist, `${config.name}.ts`), index);
                await config.broadcast(Buffer.from(JSON.stringify({
                    name: config.name,
                    type: 'output',
                    debug: config.debug,
                    fileName: `${config.name}.ts`,
                    content: index
                })));
            }
            if (isServer) {
                const entities = astToGraphqlVisitor.tsToGraphqlVisitor.entities;
                if (Object.keys(entities).length > 0) {
                    writeFileSync(join(assets, `magnus.entity.json`), JSON.stringify(entities, null, 2));
                }
            } else {
                const permissions = astToGraphqlVisitor.tsToGraphqlVisitor.permission;
                if (Object.keys(permissions).length > 0) {
                    writeFileSync(join(assets, `magnus.permission.json`), JSON.stringify(permissions, null, 2));
                }
            }
            writeFileSync(join(assets, `angular.txt`), `${config.name}前端接口:${config.host}:${config.port}`);
            config.broadcast(Buffer.from(JSON.stringify({
                name: config.name,
                fileName: `ip.txt`,
                type: 'assets',
                content: `${config.host}`
            })));
        }
    }
    if (config.debug) {
        watch(inputs)
            .on('add', () => {
                compile();
                compile(true);
                bootstrapClient(config)
            })
            .on('change', () => {
                compile();
                compile(true);
                bootstrapClient(config)
            })
            .on('unlink', () => {
                compile();
                compile(true);
                bootstrapClient(config)
            })
    } else {
        compile();
        compile(true);
        bootstrapClient(config)
    }
}

export function sendLocalFile(path: string, name: string, config: MagnusConfig) {
    if (existsSync(join(path, name))) {
        config.broadcast(Buffer.from(JSON.stringify({
            name: config.name,
            type: name.endsWith('.ts') ? 'output' : 'assets',
            fileName: name,
            debug: config.debug,
            content: readFileSync(join(path, name)).toString('utf8')
        })));
    }
}

export function sendFile(config: MagnusConfig) {
    const dist = join(config.root, config.output)
    const assets = join(config.root, config.assets)
    sendLocalFile(dist, `${config.name}.ts`, config)
    sendLocalFile(dist, 'magnus.ts', config)
    sendLocalFile(assets, 'magnus.proto', config)
    config.broadcast(Buffer.from(JSON.stringify({
        name: config.name,
        fileName: `ip.txt`,
        type: 'assets',
        content: `${config.host}`
    })));
}
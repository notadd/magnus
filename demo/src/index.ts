import { Module } from '@nestjs/common';
import { bootstrap as magnusBootstrap } from '@notadd/magnus-apollo';
import { Controller } from './lib/controller';
import { createConnection } from 'typeorm';

const metadata = require('./config/entities/magnus.metadata.json');
const server = require('./config/entities/magnus.server.json');
const entity = require('./config/entities/magnus.entity.json');

import {
    User,
    System,
    SystemEvent,
    SystemRight,
    Department,
    Role,
    Station,
    ToDoItem,
    RoleGroup,
    UserLoginLog,
    SafetyScoreLog,
    SafetyScoreRule,
    Domain
} from './entities';
import { Magnus } from './runner';
export * from './entities';
export * from './runner';
@Module({
    imports: [],
    providers: [Magnus],
    exports: [Magnus]
})
export class EntitiesModule {
    async onModuleInit() {
        await createConnection({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'magnus',
            username: 'default',
            password: 'secret',
            entities: [
                User,
                System,
                SystemEvent,
                SystemRight,
                Department,
                Role,
                Station,
                ToDoItem,
                RoleGroup,
                UserLoginLog,
                SafetyScoreLog,
                SafetyScoreRule,
                Domain
            ],
            synchronize: true
        });
        return magnusBootstrap(
            metadata,
            server,
            {
                Controller
            },
            entity,
            {
                User,
                System,
                SystemEvent,
                SystemRight,
                Department,
                Role,
                Station,
                ToDoItem,
                RoleGroup,
                UserLoginLog,
                SafetyScoreLog,
                SafetyScoreRule,
                Domain
            },
            4000
        );
    }
}

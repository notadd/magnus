import { createConnection } from 'typeorm';
import { bootstrap as magnusBootstrap } from '@notadd/magnus-apollo'
const metadata = require('../assets/demo/magnus.metadata.json');
const server = require('../assets/demo/magnus.server.json');
const entity = require('../assets/demo/magnus.entity.json');
import { Controller } from './lib/controller';

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
async function bootstrap() {
    const connection = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        database: 'magnus',
        username: 'default',
        password: 'secret',
        name: 'default',
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
    })
    if (!connection.isConnected) {
        await connection.connect();
    }
    await magnusBootstrap(
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
bootstrap();
const req = require;
const res = req.resolve('./index.ts')
debugger;
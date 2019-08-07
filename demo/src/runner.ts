import { createRunner } from '@notadd/magnus-core';
const metadata = require('./assets/demo/magnus.metadata.json');
const server = require('./assets/demo/magnus.server.json');
const entity = require('./assets/demo/magnus.entity.json');
import { Controller } from './lib/controller';
import { Mutation, Query } from './config/demo/magnus.server';
import { Injectable } from '@nestjs/common';
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
export const runner = createRunner(metadata, server, {
    Controller
}, entity, {
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
    });

@Injectable()
export class Magnus {
    query: Query = runner.query;
    mutation: Mutation = runner.mutation;
}

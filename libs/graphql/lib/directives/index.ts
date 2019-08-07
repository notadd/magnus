import { GraphQLDirective } from 'graphql';
export class DemoDirective extends GraphQLDirective {
    constructor() {
        super({
            name: 'demo',
            description: ``,
            locations: [],
            args: {}
        })
    }
}

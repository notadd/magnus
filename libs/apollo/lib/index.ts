import { ApolloServer } from 'apollo-server';
import { DocumentNode } from 'graphql';
import { createResolver, HandlerDefMap, InjectMap, ClassDef } from '@notadd/magnus-core'
import { scalars } from '@notadd/magnus-graphql';
export function bootstrap(map: HandlerDefMap, context: DocumentNode, injectDef: InjectMap, entityDef: ClassDef, entities: InjectMap, port: number) {
    const resolvers = createResolver(map, injectDef, entityDef, entities);
    const server = new ApolloServer({ typeDefs: context, resolvers: { ...resolvers, ...scalars } });
    server.listen(port).then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
    process.on('beforeExit', () => { 
        console.log('exit')
        process.exit();
    })
}

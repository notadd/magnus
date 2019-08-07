import { Transport } from '@nestjs/microservices';
import { join } from 'path';
export const demoOptions: any = {
    transport: Transport.GRPC,
    options: {
        url: `${process.env.COMMON_HOST || '0.0.0.0'}:${process.env.COMMON_PORT||'9001'}`,
        package: 'demo',
        protoPath: join(__dirname, '../../assets/demo/magnus.proto'),
    },
    name: "demo"
};

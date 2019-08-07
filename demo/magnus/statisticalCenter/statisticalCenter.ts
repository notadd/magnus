import { Transport, ClientOptions } from '@nestjs/microservices';
import { join } from 'path';
export const statisticalCenterOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: '10.0.0.111:undefined',
        package: 'statisticalCenter',
        protoPath: join(__dirname, 'assets/statisticalCenter/magnus.proto'),
    },
};

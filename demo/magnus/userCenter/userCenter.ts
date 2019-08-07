import { Transport, ClientOptions } from '@nestjs/microservices';
import { join } from 'path';
export const userCenterOptions: ClientOptions = {
transport: Transport.GRPC,
options: {
    url: `${process.env.USER_CENTER_SRV_HOST}:${process.env.USER_CENTER_SRV_PORT}`,
    package: 'userCenter',
    protoPath: join(__dirname, 'assets/userCenter/magnus.proto'),
},
};

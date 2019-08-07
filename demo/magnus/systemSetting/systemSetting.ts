import { Transport, ClientOptions } from '@nestjs/microservices';
import { join } from 'path';
export const systemSettingOptions: ClientOptions = {
transport: Transport.GRPC,
options: {
    url: `${process.env.SYSTEM_SETTING_SRV_HOST}:${process.env.SYSTEM_SETTING_SRV_PORT}`,
    package: 'systemSetting',
    protoPath: join(__dirname, 'assets/systemSetting/magnus.proto'),
},
};

export interface MagnusConfig {
    /**
     * 根目录
     */
    root: string;
    /**
     * 资源目录
     */
    assets: string;
    /**
     * 输出目录
     */
    output: string;
    /**
     * 输入文件
     */
    inputs: string[];
    /**
     * 调试
     */
    debug: boolean;
    /**
     * 主机
     */
    host: string;
    /**
     * 端口号
     */
    port?: number;
    /**
     * 服务名
     */
    name: string;
    /**
     * 数据
     */
    broadcast: (data: Buffer) => any;
    /**
     * 接收项目
     */
    reciveName: string[];

    /**
     * 客户端
     */
    client: string[];
    /**
     * 执行
     */
    runner: {
        name: string,
        path: string;
    };
    /**
     * 定义文件
     */
    types: string;
    /**
     * 服务端graphql文件
     */
    def: string;
    /**
     * 是否有grpc
     */
    hasGrpc: boolean;

    /**
     * 环境变量
     */
    hostEnv: string;

    /**
     * 环境变量
     */
    portEnv: string;
}

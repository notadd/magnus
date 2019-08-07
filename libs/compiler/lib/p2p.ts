import { MagnusConfig } from "@notadd/magnus-core";
import { join } from 'path';
import { writeFileSync, existsSync, readFileSync } from 'fs-extra';
const libp2p = require('libp2p');
const TCP = require('libp2p-tcp');
const Mplex = require('libp2p-mplex');
const PeerInfo = require('peer-info');
const MulticastDNS = require('libp2p-mdns');
const defaultsDeep = require('@nodeutils/defaults-deep');
const PeerId = require('peer-id');
const pack = require('../package.json');
const WS = require('libp2p-websockets');
const SPDY = require('libp2p-spdy');
export class MyBundle extends libp2p {
    constructor(_options: any, list: string[]) {
        const defaults = {
            modules: {
                transport: [TCP, new WS()],
                streamMuxer: [SPDY, Mplex],
                peerDiscovery: [MulticastDNS]
            },
            config: {
                peerDiscovery: {
                    autoDial: true,
                    mdns: {
                        interval: 2000,
                        enabled: true
                    }
                },
                EXPERIMENTAL: {
                    pubsub: true
                }
            }
        }
        super(defaultsDeep(_options, defaults))
    }
}
export const set: Set<string> = new Set();
export const peers: Set<any> = new Set();
export async function createPeerInfo(root: string) {
    const magnusKeyPath = join(root, 'magnus.key');
    let id: any;
    if (existsSync(magnusKeyPath)) {
        const json = JSON.parse(readFileSync(magnusKeyPath).toString('utf8'));
        id = await PeerId.createFromJSON(json);
    } else {
        id = await PeerId.create({ bits: 1024, keyType: 'rsa' });
        writeFileSync(magnusKeyPath, JSON.stringify(id.toJSON(), null, 2));
    }
    const peerInfo = await PeerInfo.create(id);
    peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0');
    peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0/ws');
    return {
        peerInfo,
        id
    }
}

export async function createNode(config: MagnusConfig, callback: any) {
    console.log(`欢迎使用 magnus@${pack.version}`)
    const { peerInfo } = await createPeerInfo(config.root);
    // return node;
    return new Promise<any>((resolve, reject) => {
        const node = new MyBundle({
            peerInfo
        }, []);
        const isStarted = node.isStarted();
        if (!isStarted) {
            node.start(() => {
                config.host = ``;
                node.peerInfo.multiaddrs.forEach((ma: any) => {
                    const options: { host: string } = ma.toOptions();
                    // console.log(ma.toString())
                    if (options.host.startsWith('127')) {
                        // 本地
                        // config.host = options.host;
                    }
                    else if (options.host.startsWith('192')) {
                        if (!config.host.startsWith('192')) {
                            config.host = options.host;
                        }
                    }
                    else if (options.host.startsWith('10')) {
                        config.host = options.host;
                    }
                    else if (options.host.startsWith('170')) {
                        config.host = options.host;
                    }
                    else {
                        // 外网
                        // config.host = options.host;
                    }
                });
                // writeFileSync(join(config.root, 'magnus.json'), JSON.stringify(config, null, 2))
                resolve(node);
            });
        }
        node.on('peer:connect', (peer: any) => {
            callback(peer);
        });
        node.on('peer:disconnect', (peer: any) => {
            // console.log(`同事下线 %s`, peer.id.toB58String())
        });
        node.on('connection:start', (peer: any) => {
            // console.log(`connection:start`)
        })
        node.on('connection:end', (peer: any) => {
            // console.log(`connection:end`)
        })
        node.on(`error`, () => {
            // console.log(`error`)
        });
        node.on('peer:discovery', async (peer: any) => {
            const peerId = peerInfo.id.toB58String();
            if (peerId !== peer.id.toB58String()) {
                if (!set.has(peer.id.toB58String())) {
                    set.add(peer.id.toB58String());
                    console.log(`发现新同事(${set.size}): ${peer.id.toB58String()}`)
                }
            }
        });
    })
}
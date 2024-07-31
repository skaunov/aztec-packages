import { SignableENR } from "@chainsafe/enr";
import { createFromJSON } from "@libp2p/peer-id-factory";
import { multiaddr } from "@multiformats/multiaddr";
import { resolve } from "dns/promises";

const announceHost = "google.com";
const announcePort = "40400";

export const AZTEC_ENR_KEY = "aztec_network";
export enum AztecENR {
  devnet = 0x01,
  testnet = 0x02,
  mainnet = 0x03,
}

// TODO: Make this an env var
export const AZTEC_NET = AztecENR.devnet;
const peerId = await createFromJSON({
  id: "",
  privKey: Buffer.from(
    "0802122002f651fd8653925529e3baccb8489b3af4d7d9db440cbf5df4a63ff04ea69683",
    "hex"
  ).toString("base64"),
});

const resolved = await resolve(announceHost);

console.log(resolved);

const enr = SignableENR.createFromPeerId(peerId);

enr.set(AZTEC_ENR_KEY, Uint8Array.from([AZTEC_NET]));
const multiAddrTcp = multiaddr(
  `/dns4/${announceHost}/tcp/${announcePort}/p2p/${peerId.toString()}`
);
const multiAddrUdp = multiaddr(
  `/dns4/${announceHost}/udp/${announcePort}/p2p/${peerId.toString()}`
);
console.log(multiAddrUdp);

enr.setLocationMultiaddr(multiAddrUdp);
enr.setLocationMultiaddr(multiAddrTcp);
console.log(enr.encodeTxt());

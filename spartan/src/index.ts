import { SignableENR } from "@chainsafe/enr";
import { createFromJSON } from "@libp2p/peer-id-factory";

export const AZTEC_ENR_KEY = "aztec_network";

const delayBeforeStart = 2000; // 2sec

export enum AztecENR {
  devnet = 0x01,
  testnet = 0x02,
  mainnet = 0x03,
}

// TODO: Make this an env var
export const AZTEC_NET = AztecENR.devnet;
const nodeId = await createFromJSON({
  id: "",
  privKey: Buffer.from(
    "0802122002f651fd8653925529e3baccb8489b3af4d7d9db440cbf5df4a63ff04ea69683",
    "hex"
  ).toString("base64"),
});

const enr = SignableENR.createFromPeerId(nodeId);

enr.set(AZTEC_ENR_KEY, Uint8Array.from([AZTEC_NET]));

console.log(enr.toString());

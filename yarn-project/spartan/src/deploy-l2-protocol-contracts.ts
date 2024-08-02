import { createCompatibleClient } from "@aztec/cli";
import { createConsoleLogger, createDebugLogger } from "@aztec/foundation/log";

const { PXE_URL = "http://localhost:8080" } = process.env;

const userLog = createConsoleLogger();
const debugLogger = createDebugLogger("aztec:cli");
const client = await createCompatibleClient(PXE_URL, debugLogger);
const info = await client.getNodeInfo();

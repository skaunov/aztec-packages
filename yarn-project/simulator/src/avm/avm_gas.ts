import { TypeTag } from './avm_memory_types.js';
import { InstructionExecutionError } from './errors.js';
import { Addressing, AddressingMode } from './opcodes/addressing_mode.js';
import { Opcode } from './serialization/instruction_serialization.js';

/** Gas counters in L1, L2, and DA. */
export type Gas = {
  l2Gas: number;
  daGas: number;
};

/** Maps a Gas struct to gasLeft properties. */
export function gasToGasLeft(gas: Gas) {
  return { l2GasLeft: gas.l2Gas, daGasLeft: gas.daGas };
}

/** Maps gasLeft properties to a gas struct. */
export function gasLeftToGas(gasLeft: { l2GasLeft: number; daGasLeft: number }) {
  return { l2Gas: gasLeft.l2GasLeft, daGas: gasLeft.daGasLeft };
}

/** Creates a new instance with all values set to zero except the ones set. */
export function makeGas(gasCost: Partial<Gas>) {
  return { ...EmptyGas, ...gasCost };
}

/** Sums together multiple instances of Gas. */
export function sumGas(...gases: Partial<Gas>[]) {
  return gases.reduce(
    (acc: Gas, gas) => ({
      l2Gas: acc.l2Gas + (gas.l2Gas ?? 0),
      daGas: acc.daGas + (gas.daGas ?? 0),
    }),
    EmptyGas,
  );
}

/** Multiplies a gas instance by a scalar. */
export function mulGas(gas: Partial<Gas>, scalar: number) {
  return { l2Gas: (gas.l2Gas ?? 0) * scalar, daGas: (gas.daGas ?? 0) * scalar };
}

/** Zero gas across all gas dimensions. */
export const EmptyGas: Gas = {
  l2Gas: 0,
  daGas: 0,
};

/** Dimensions of gas usage: L1, L2, and DA. */
export const GasDimensions = ['l2Gas', 'daGas'] as const;

/** Default gas cost for an opcode. */
const DefaultBaseGasCost: Gas = { l2Gas: 10, daGas: 0 };

/** Base gas costs for each instruction. Additional gas cost may be added on top due to memory or storage accesses, etc. */
const BaseGasCosts: Record<Opcode, Gas> = {
  [Opcode.ADD]: { l2Gas: 320, daGas: 0 },
  [Opcode.SUB]: { l2Gas: 320, daGas: 0 },
  [Opcode.MUL]: { l2Gas: 330, daGas: 0 },
  [Opcode.DIV]: { l2Gas: 430, daGas: 0 },
  [Opcode.FDIV]: { l2Gas: 320, daGas: 0 },
  [Opcode.EQ]: { l2Gas: 320, daGas: 0 },
  [Opcode.LT]: { l2Gas: 640, daGas: 0 },
  [Opcode.LTE]: { l2Gas: 640, daGas: 0 },
  [Opcode.AND]: { l2Gas: 640, daGas: 0 },
  [Opcode.OR]: { l2Gas: 640, daGas: 0 },
  [Opcode.XOR]: { l2Gas: 640, daGas: 0 },
  [Opcode.NOT]: { l2Gas: 410, daGas: 0 },
  [Opcode.SHL]: { l2Gas: 640, daGas: 0 },
  [Opcode.SHR]: { l2Gas: 640, daGas: 0 },
  [Opcode.CAST]: { l2Gas: 300, daGas: 0 },
  // Execution environment
  [Opcode.ADDRESS]: { l2Gas: 200, daGas: 0 },
  [Opcode.STORAGEADDRESS]: { l2Gas: 200, daGas: 0 },
  [Opcode.SENDER]: { l2Gas: 200, daGas: 0 },
  [Opcode.FEEPERL2GAS]: { l2Gas: 200, daGas: 0 },
  [Opcode.FEEPERDAGAS]: { l2Gas: 200, daGas: 0 },
  [Opcode.TRANSACTIONFEE]: { l2Gas: 200, daGas: 0 },
  [Opcode.FUNCTIONSELECTOR]: { l2Gas: 200, daGas: 0 },
  [Opcode.CHAINID]: { l2Gas: 200, daGas: 0 },
  [Opcode.VERSION]: { l2Gas: 200, daGas: 0 },
  [Opcode.BLOCKNUMBER]: { l2Gas: 200, daGas: 0 },
  [Opcode.TIMESTAMP]: { l2Gas: 200, daGas: 0 },
  [Opcode.COINBASE]: { l2Gas: 200, daGas: 0 },
  [Opcode.BLOCKL2GASLIMIT]: { l2Gas: 200, daGas: 0 },
  [Opcode.BLOCKDAGASLIMIT]: { l2Gas: 200, daGas: 0 },
  [Opcode.CALLDATACOPY]: { l2Gas: 200, daGas: 0 }, // Cost for ONE field
  // Gas
  [Opcode.L2GASLEFT]: { l2Gas: 180, daGas: 0 },
  [Opcode.DAGASLEFT]: { l2Gas: 180, daGas: 0 },
  // Control flow
  [Opcode.JUMP]: { l2Gas: 120, daGas: 0 },
  [Opcode.JUMPI]: { l2Gas: 180, daGas: 0 },
  [Opcode.INTERNALCALL]: { l2Gas: 180, daGas: 0 },
  [Opcode.INTERNALRETURN]: { l2Gas: 180, daGas: 0 },
  // Memory
  [Opcode.SET]: { l2Gas: 180, daGas: 0 },
  [Opcode.MOV]: { l2Gas: 230, daGas: 0 },
  [Opcode.CMOV]: { l2Gas: 340, daGas: 0 },
  // World state
  [Opcode.SLOAD]: { l2Gas: 200, daGas: 0 }, // Cost for ONE item
  [Opcode.SSTORE]: { l2Gas: 200, daGas: 0 }, // Cost for ONE item
  [Opcode.NOTEHASHEXISTS]: { l2Gas: 260, daGas: 0 },
  [Opcode.EMITNOTEHASH]: { l2Gas: 260, daGas: 0 },
  [Opcode.NULLIFIEREXISTS]: { l2Gas: 260, daGas: 0 },
  [Opcode.EMITNULLIFIER]: { l2Gas: 260, daGas: 0 },
  [Opcode.L1TOL2MSGEXISTS]: { l2Gas: 260, daGas: 0 },
  [Opcode.HEADERMEMBER]: DefaultBaseGasCost, // TODO
  [Opcode.GETCONTRACTINSTANCE]: { l2Gas: 480, daGas: 0 },
  [Opcode.EMITUNENCRYPTEDLOG]: { l2Gas: 200, daGas: 0 }, // Cost for ONE field
  [Opcode.SENDL2TOL1MSG]: { l2Gas: 260, daGas: 0 },
  // External calls
  [Opcode.CALL]: { l2Gas: 2000, daGas: 0 }, // Should be variable
  [Opcode.STATICCALL]: { l2Gas: 2000, daGas: 0 }, // Should be variable
  [Opcode.DELEGATECALL]: DefaultBaseGasCost,
  [Opcode.RETURN]: { l2Gas: 1000, daGas: 0 }, // Should be variable
  [Opcode.REVERT]: { l2Gas: 1000, daGas: 0 }, // Should be variable
  // Misc
  [Opcode.DEBUGLOG]: { l2Gas: 50000, daGas: 0 }, // Expensive, to deter use in production
  // Gadgets - temp
  [Opcode.KECCAK]: { l2Gas: 50000, daGas: 0 }, // Should be removed
  [Opcode.PEDERSENCOMMITMENT]: DefaultBaseGasCost, // Should be removed
  [Opcode.SHA256]: { l2Gas: 50000, daGas: 0 }, // Should be removed
  [Opcode.PEDERSEN]: { l2Gas: 50000, daGas: 0 }, // Should be removed
  // Gadgets
  [Opcode.POSEIDON2PERM]: { l2Gas: 670, daGas: 0 },
  [Opcode.SHA256COMPRESSION]: { l2Gas: 2610, daGas: 0 },
  [Opcode.KECCAKF1600]: { l2Gas: 3000, daGas: 0 },
  [Opcode.ECADD]: { l2Gas: 600, daGas: 0 },
  [Opcode.MSM]: { l2Gas: 600, daGas: 0 },
  // Conversions
  [Opcode.TORADIXLE]: { l2Gas: 170, daGas: 0 }, // Cost for ONE limb
};

/** Returns the fixed base gas cost for a given opcode. */
export function getBaseGasCost(opcode: Opcode): Gas {
  return BaseGasCosts[opcode];
}

/** Returns the gas cost associated with the memory operations performed. */
export function getMemoryGasCost(args: { reads?: number; writes?: number; indirect?: number }) {
  const { reads, writes, indirect } = args;
  const indirectCount = Addressing.fromWire(indirect ?? 0).count(AddressingMode.INDIRECT);
  const l2MemoryGasCost =
    (reads ?? 0) * GasCostConstants.MEMORY_READ +
    (writes ?? 0) * GasCostConstants.MEMORY_WRITE +
    indirectCount * GasCostConstants.MEMORY_INDIRECT_READ_PENALTY;
  return makeGas({ l2Gas: l2MemoryGasCost });
}

/** Constants used in base cost calculations. */
export const GasCostConstants = {
  MEMORY_READ: 10,
  MEMORY_INDIRECT_READ_PENALTY: 10,
  MEMORY_WRITE: 100,
};

/** Returns gas cost for an operation on a given type tag based on the base cost per byte. */
export function getGasCostForTypeTag(tag: TypeTag, baseCost: Gas) {
  return mulGas(baseCost, getGasCostMultiplierFromTypeTag(tag));
}

/** Returns a multiplier based on the size of the type represented by the tag. Throws on uninitialized or invalid. */
function getGasCostMultiplierFromTypeTag(tag: TypeTag) {
  switch (tag) {
    case TypeTag.UINT8:
      return 1;
    case TypeTag.UINT16:
      return 2;
    case TypeTag.UINT32:
      return 4;
    case TypeTag.UINT64:
      return 8;
    case TypeTag.UINT128:
      return 16;
    case TypeTag.FIELD:
      return 32;
    case TypeTag.INVALID:
    case TypeTag.UNINITIALIZED:
      throw new InstructionExecutionError(`Invalid tag type for gas cost multiplier: ${TypeTag[tag]}`);
  }
}

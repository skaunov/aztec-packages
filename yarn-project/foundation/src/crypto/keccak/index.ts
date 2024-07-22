import { BarretenbergSync } from '@aztec/bb.js';

import { strict as assert } from 'assert';
import { Keccak } from 'sha3';

import { BufferReader } from '../../serialize/buffer_reader.js';
import { deserializeBigInt, serializeBigInt } from '../../serialize/serialize.js';

/**
 * Computes the Keccak-256 hash of the given input buffer.
 *
 * @param input - The input buffer to be hashed.
 * @returns The computed Keccak-256 hash as a Buffer.
 */
export function keccak256(input: Buffer) {
  const hash = new Keccak(256);
  return hash.update(input).digest();
}

/**
 * Computes the keccak-256 hash of a given input string and returns the result as a hexadecimal string.
 */
export function keccak256String(input: string) {
  const hash = new Keccak(256);
  hash.reset();
  hash.update(input);
  return hash.digest('hex');
}

/**
 * Computes the Keccak-224 hash of the given input buffer.
 *
 * @param input - The input buffer to be hashed.
 * @returns The computed Keccak-224 hash as a Buffer.
 */
export function keccak224(input: Buffer) {
  const hash = new Keccak(224);
  return hash.update(input).digest();
}

/**
 * Computes Keccakf1600.
 * @param input - the state, 25 u64's.
 * @returns - the updated state, 25 u64's.
 */
export function keccakf1600(input: bigint[]): bigint[] {
  assert(input.length === 25, 'Input must be 25 u64s');
  input.forEach(u64 => assert(u64 < 2n ** 64n, 'Input must be 64-bit unsigned integers'));
  const bufferInput = Buffer.concat(
    input.map(u64 =>
      // Swap the bytes to little-endian.
      serializeBigInt(u64, 64 / 8).swap64(),
    ),
  );
  const result = Buffer.from(BarretenbergSync.getSingleton().keccakF1600(bufferInput));
  const reader = BufferReader.asReader(result);
  const output: bigint[] = [];
  for (let i = 0; i < 25; i++) {
    output.push(
      // Swap the bytes back to big-endian.
      deserializeBigInt(reader.readBytes(64 / 8).swap64()).elem,
    );
  }
  return output;
}

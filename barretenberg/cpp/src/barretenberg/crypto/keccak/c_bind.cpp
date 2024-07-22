#include "c_bind.hpp"
#include "barretenberg/common/mem.hpp"
#include "barretenberg/common/serialize.hpp"
#include "barretenberg/ecc/curves/bn254/fr.hpp"
#include "keccak.hpp"
#include <array>
#include <cstdint>
#include <sstream>

using namespace bb;

// The input is expected to be an array of 25 little-endian encoded uint64_t.
// The output will be the same.
WASM_EXPORT void keccak_f1600(const uint8_t* in_state, uint8_t** out_state)
{
    // I have to use a vector instead of std::array<uint64_t, 25>
    // because that's what the current BB wasm serialization expects
    // in particular, to_heap_buffer and its deserialization counterpart
    std::vector<uint8_t> state(200);
    read(in_state, state);
    ethash_keccakf1600(reinterpret_cast<uint64_t*>(state.data()));
    *out_state = to_heap_buffer(state);
}
use dep::types::{point::Point, scalar::Scalar};
use dep::std::{embedded_curve_ops::multi_scalar_mul, field::bn254::decompose};

global map_storage_slot = Point { x: 0x041223147b680850dc82e8a55a952d4df20256fe0593d949a9541ca00f0abf15, y: 0x0a8c72e60d0e60f5d804549d48f3044d06140b98ed717a9b532af630c1530791, is_infinite: false };
global G_map_slot_layer_1 = Point { x: 0x0e0dad2250583f2a9f0acb04ededf1701b85b0393cae753fe7e14b88af81cb52, y: 0x0973b02c5caac339ee4ad5dab51329920f7bf1b6a07e1dabe5df67040b300962, is_infinite: false };

#[recursive]
fn main(fee_payer: Field) -> pub Field {
    // let fee_payer_balance_slot_in_gas_token_contract = derive_storage_slot_in_map(balances_slot_in_gas_token_contract, fee_payer);

    let (key_lo, key_hi) = decompose(fee_payer.to_field());
    let fee_payer_balance_slot_in_gas_token_contract = multi_scalar_mul([G_map_slot_layer_1], [Scalar { lo: key_lo, hi: key_hi }]) + map_storage_slot;
    fee_payer_balance_slot_in_gas_token_contract.x
}

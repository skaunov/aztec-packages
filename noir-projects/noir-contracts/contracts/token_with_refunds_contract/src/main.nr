mod types;

fn main(
    funded_amount: Field,
    inputs: dep::aztec::context::inputs::PrivateContextInputs
) -> pub Field {
    let mut context = dep::aztec::context::private_context::PrivateContext::new(inputs, 4);

    assert(context.this_address().to_field() != 0, "test setup failure - this_address is zero");

    let balances: crate::types::balances_map::BalancesMap<crate::types::token_note::TokenNote, &mut dep::aztec::context::private_context::PrivateContext> = crate::types::balances_map::BalancesMap::new(&mut context, 2);
    balances.add(
        dep::aztec::prelude::AztecAddress::from_field(10),
        U128::from_integer(funded_amount)
    ).emit(
        dep::aztec::encrypted_logs::encrypted_note_emission::encode_and_encrypt_note_with_keys_2(&mut context, dep::aztec::prelude::Point::empty())
    );

    assert(context.this_address().to_field() != 0, "this_address is zero");
    assert(false, "buf reproduction failure - no revert :/");

    0
}

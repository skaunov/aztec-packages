#pragma once

#include "barretenberg/relations/generic_permutation/generic_permutation_relation.hpp"

#include <cstddef>
#include <tuple>

namespace bb {

class perm_main_alu_lt_permutation_settings {
  public:
    // This constant defines how many columns are bundled together to form each set.
    constexpr static size_t COLUMNS_PER_SET = 4;

    template <typename AllEntities> static inline auto inverse_polynomial_is_computed_at_row(const AllEntities& in)
    {
        return (in.main_sel_op_lt == 1 || in.alu_op_lt == 1);
    }

    template <typename Polys> static inline auto inverse_polynomial_is_computed_at_poly_row(const Polys& in, size_t row)
    {
        return (in.main_sel_op_lt[row] == 1 || in.alu_op_lt[row] == 1);
    }

    template <typename AllEntities> static inline auto get_const_entities(const AllEntities& in)
    {
        return std::forward_as_tuple(in.perm_main_alu_lt,
                                     in.main_sel_op_lt,
                                     in.main_sel_op_lt,
                                     in.alu_op_lt,
                                     in.main_clk,
                                     in.main_ia,
                                     in.main_ib,
                                     in.main_ic,
                                     in.alu_clk,
                                     in.alu_ia,
                                     in.alu_ib,
                                     in.alu_ic);
    }

    template <typename AllEntities> static inline auto get_nonconst_entities(AllEntities& in)
    {
        return std::forward_as_tuple(in.perm_main_alu_lt,
                                     in.main_sel_op_lt,
                                     in.main_sel_op_lt,
                                     in.alu_op_lt,
                                     in.main_clk,
                                     in.main_ia,
                                     in.main_ib,
                                     in.main_ic,
                                     in.alu_clk,
                                     in.alu_ia,
                                     in.alu_ib,
                                     in.alu_ic);
    }
};

template <typename FF_>
class perm_main_alu_lt_relation : public GenericPermutationRelation<perm_main_alu_lt_permutation_settings, FF_> {
  public:
    static constexpr const char* NAME = "perm_main_alu_lt";
};
template <typename FF_> using perm_main_alu_lt = GenericPermutation<perm_main_alu_lt_permutation_settings, FF_>;

} // namespace bb
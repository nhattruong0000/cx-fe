// Row 3: top-lists grid. isAdmin controls whether the suppliers card is shown.
// Server component — admin prop passed from page.tsx which has auth context.

import { TopRiskySkusList } from "./top-risky-skus-list";
import { TopPosList } from "./top-pos-list";
import { TopOffCadenceSuppliersList } from "./top-off-cadence-suppliers-list";

type Props = { isAdmin: boolean };

export function TopListsRow({ isAdmin }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <TopRiskySkusList />
      <TopPosList />
      {isAdmin && <TopOffCadenceSuppliersList />}
    </div>
  );
}

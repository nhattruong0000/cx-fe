import { create } from "zustand";

interface InventoryDashboardState {
  selectedSku: string | null;
  itemCodeSearch: string;
  branchFilter: string | null;
  alertTypeFilter: string | null;
  severityFilter: string | null;
}

interface InventoryDashboardActions {
  selectSku: (code: string | null) => void;
  setItemCodeSearch: (value: string) => void;
  setBranchFilter: (value: string | null) => void;
  setAlertTypeFilter: (value: string | null) => void;
  setSeverityFilter: (value: string | null) => void;
  resetFilters: () => void;
}

const initialState: InventoryDashboardState = {
  selectedSku: null,
  itemCodeSearch: "",
  branchFilter: null,
  alertTypeFilter: null,
  severityFilter: null,
};

export const useInventoryDashboardStore = create<
  InventoryDashboardState & InventoryDashboardActions
>((set) => ({
  ...initialState,
  selectSku: (code) => set({ selectedSku: code }),
  setItemCodeSearch: (value) => set({ itemCodeSearch: value }),
  setBranchFilter: (value) => set({ branchFilter: value }),
  setAlertTypeFilter: (value) => set({ alertTypeFilter: value }),
  setSeverityFilter: (value) => set({ severityFilter: value }),
  resetFilters: () => set(initialState),
}));

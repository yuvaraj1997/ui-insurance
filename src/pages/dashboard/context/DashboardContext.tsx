import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import { User } from "../../../types";

// Define Dashboard State Type
interface DashboardState {
  showSidebar: boolean;
  user: User | null;
}

// Define Action Types
type DashboardAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "RESET_USER_DATA" }
  | { type: "SET_USER_DATA"; payload: User };

// Context Types
const DashboardContext = createContext<DashboardState | undefined>(undefined);
const DashboardDispatchContext = createContext<
  Dispatch<DashboardAction> | undefined
>(undefined);

// Initial State
const InitialDashboard: DashboardState = {
  showSidebar: false,
  user: null,
};

// Reducer Function
function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, showSidebar: !state.showSidebar };
    case "SET_USER_DATA":
      return { ...state, user: action.payload };
    case "RESET_USER_DATA":
      return { ...state, user: null };
    default:
      throw new Error(`Unknown action type: `);
  }
}

// Provider Component
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dashboard, dispatch] = useReducer(dashboardReducer, InitialDashboard);

  return (
    <DashboardContext.Provider value={dashboard}>
      <DashboardDispatchContext.Provider value={dispatch}>
        {children}
      </DashboardDispatchContext.Provider>
    </DashboardContext.Provider>
  );
}

// Custom Hooks for Using Context
export function useDashboard(): DashboardState {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within an DashboardProvider");
  }
  return context;
}

export function useDashboardDispatch(): Dispatch<DashboardAction> {
  const context = useContext(DashboardDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardDispatch must be used within an DashboardProvider"
    );
  }
  return context;
}

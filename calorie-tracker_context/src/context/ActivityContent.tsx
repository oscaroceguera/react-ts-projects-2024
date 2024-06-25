import { ReactNode, createContext, useReducer, Dispatch, useMemo } from "react";
import {
  ActivityActions,
  ActvitySate,
  activityReducer,
  initialState,
} from "../reducers/activity-reducers";
import { categories } from "../data/categories";
import { Activity } from "../types";

type ActivityProviderProps = {
  children: ReactNode;
};

type ActivityContextProps = {
  state: ActvitySate;
  dispatch: Dispatch<ActivityActions>;
  caloriesConsumed: number;
  caloriesburned: number;
  netCalories: number;
  categoryName: (category: Activity["category"]) => string[];
  isEmpty: boolean;
};

// export const ActivityContext = createContext<ActivityContextProps>(
//   {} as ActivityContextProps
// );
export const ActivityContext = createContext<ActivityContextProps>(null!);

export const ActivityProvider = ({ children }: ActivityProviderProps) => {
  const [state, dispatch] = useReducer(activityReducer, initialState);

  const caloriesConsumed = useMemo(
    () =>
      state.activities.reduce(
        (total, activity) =>
          activity.category === 1 ? total + activity.calories : total,
        0
      ),
    [state.activities]
  );

  const caloriesburned = useMemo(
    () =>
      state.activities.reduce(
        (total, activity) =>
          activity.category === 2 ? total + activity.calories : total,
        0
      ),
    [state.activities]
  );

  const netCalories = useMemo(
    () => caloriesConsumed - caloriesburned,
    [state.activities]
  );

  const categoryName = useMemo(
    () => (category: Activity["category"]) =>
      categories.map((cat) => (cat.id === category ? cat.name : "")),
    [state.activities]
  );

  const isEmpty = useMemo(
    () => state.activities.length === 0,
    [state.activities]
  );

  return (
    <ActivityContext.Provider
      value={{
        state,
        dispatch,
        caloriesConsumed,
        caloriesburned,
        netCalories,
        categoryName,
        isEmpty,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

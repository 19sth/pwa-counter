import { Action, Dispatch, configureStore } from "@reduxjs/toolkit";
import pageReducer from "./slicePage";
import countersReducer from "./sliceCounters";

const localStorageMiddleware = ({ getState }: { getState: () => any }) => {
  return (next: Dispatch) => (action: Action) => {
    const result = next(action);
    localStorage.setItem("counterAppState", JSON.stringify(getState()));
    return result;
  };
};

const reHydrateStore = () => {
  const strJson = localStorage.getItem("counterAppState") || "{}";
  return JSON.parse(strJson);
};

export const store = configureStore({
  reducer: {
    page: pageReducer,
    counters: countersReducer,
  },
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

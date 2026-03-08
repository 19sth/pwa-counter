import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { INotifyingState } from "../components/mulayout";
import { NotificationInterval } from "../utils/constants";

export interface ICounter {
  id: number;
  name: string;
  count: number;
}

export interface CountersState extends INotifyingState {
  counters: ICounter[];
  notificationInterval: NotificationInterval;
}

const initialState: CountersState = {
  counters: [],
  notificationInterval: "none",
  notificationMessage: "",
  notificationIsoDt: new Date(0).toISOString(),
};

export const countersSlice = createSlice({
  name: "counters",
  initialState,
  reducers: {
    addCounter: (state, action: PayloadAction<string>) => {
      if (state.counters.length >= 5) {
        state.notificationMessage = "Maximum of 5 counters reached.";
        state.notificationIsoDt = new Date().toISOString();
        return;
      }
      const newId =
        state.counters.length > 0
          ? state.counters[state.counters.length - 1].id + 1
          : 0;
      state.counters.push({ id: newId, name: action.payload, count: 0 });
      state.notificationMessage = `Counter "${action.payload}" created.`;
      state.notificationIsoDt = new Date().toISOString();
    },
    removeCounter: (state, action: PayloadAction<number>) => {
      const idx = state.counters.findIndex((c) => c.id === action.payload);
      if (idx !== -1) {
        const name = state.counters[idx].name;
        state.counters.splice(idx, 1);
        state.notificationMessage = `Counter "${name}" removed.`;
        state.notificationIsoDt = new Date().toISOString();
      }
    },
    incrementCounter: (state, action: PayloadAction<number>) => {
      const counter = state.counters.find((c) => c.id === action.payload);
      if (counter) {
        counter.count += 1;
        state.notificationMessage = "";
        state.notificationIsoDt = new Date(0).toISOString();
      }
    },
    decrementCounter: (state, action: PayloadAction<number>) => {
      const counter = state.counters.find((c) => c.id === action.payload);
      if (counter) {
        counter.count -= 1;
        state.notificationMessage = "";
        state.notificationIsoDt = new Date(0).toISOString();
      }
    },
    resetCounter: (state, action: PayloadAction<number>) => {
      const counter = state.counters.find((c) => c.id === action.payload);
      if (counter) {
        counter.count = 0;
        state.notificationMessage = `Counter "${counter.name}" reset.`;
        state.notificationIsoDt = new Date().toISOString();
      }
    },
    setNotificationInterval: (
      state,
      action: PayloadAction<NotificationInterval>
    ) => {
      state.notificationInterval = action.payload;
      const label =
        action.payload === "none"
          ? "Notifications disabled."
          : `Notifications set to ${action.payload}.`;
      state.notificationMessage = label;
      state.notificationIsoDt = new Date().toISOString();
    },
  },
});

export const {
  addCounter,
  removeCounter,
  incrementCounter,
  decrementCounter,
  resetCounter,
  setNotificationInterval,
} = countersSlice.actions;

export default countersSlice.reducer;

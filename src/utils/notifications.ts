import { ICounter } from "../redux/sliceCounters";
import { NotificationInterval, NOTIFICATION_INTERVALS } from "./constants";

let swRegistration: ServiceWorkerRegistration | null = null;

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    swRegistration = await navigator.serviceWorker.register("/pwa-counter/sw.js");
  } catch (e) {
    console.warn("SW registration failed:", e);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function scheduleNotifications(
  interval: NotificationInterval,
  counters: ICounter[]
) {
  const entry = NOTIFICATION_INTERVALS.find((i) => i.value === interval);
  const intervalMs = entry ? entry.ms : 0;

  if (!swRegistration || !swRegistration.active) {
    navigator.serviceWorker?.ready.then((reg) => {
      reg.active?.postMessage({
        type: "SCHEDULE_NOTIFICATION",
        intervalMs,
        counters,
      });
    });
    return;
  }

  swRegistration.active.postMessage({
    type: "SCHEDULE_NOTIFICATION",
    intervalMs,
    counters,
  });
}

export function sendImmediateNotification(counters: ICounter[]) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const body =
    counters.length > 0
      ? counters.map((c) => `${c.name}: ${c.count}`).join(" | ")
      : "You have no counters yet.";
  new Notification("Counter", {
    body,
    icon: "https://fakeimg.pl/192x192/fde047/000/?font=bebas&font_size=192&text=C",
  });
}

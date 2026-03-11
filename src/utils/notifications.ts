import { ICounter } from "../redux/sliceCounters";
import { NotificationInterval, NOTIFICATION_INTERVALS } from "./constants";

let notificationTimer: ReturnType<typeof setInterval> | null = null;

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("/pwa-counter/sw.js");
  } catch (e) {
    console.warn("[SW] Registration failed:", e);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function showNotification(counters: ICounter[]) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const body =
    counters.length > 0
      ? counters.map((c) => `${c.name}: ${c.count}`).join(" | ")
      : "Open the app to check your counters.";
  new Notification("Counter", {
    body,
    icon: "https://fakeimg.pl/192x192/fde047/000/?font=bebas&font_size=192&text=C",
  });
}

export function scheduleNotifications(
  interval: NotificationInterval,
  counters: ICounter[]
) {
  if (notificationTimer) {
    clearInterval(notificationTimer);
    notificationTimer = null;
  }

  const entry = NOTIFICATION_INTERVALS.find((i) => i.value === interval);
  const intervalMs = entry ? entry.ms : 0;
  if (!intervalMs) return;

  notificationTimer = setInterval(() => {
    showNotification(counters);
  }, intervalMs);
}

export function sendImmediateNotification(counters: ICounter[]) {
  showNotification(counters);
}

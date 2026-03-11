import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MuTakoz from "../components/mutakoz";
import { updatePageState } from "../redux/slicePage";
import { setNotificationInterval } from "../redux/sliceCounters";
import { RootState } from "../redux/store";
import {
  NotificationInterval,
  NOTIFICATION_INTERVALS,
} from "../utils/constants";
import {
  requestNotificationPermission,
  scheduleNotifications,
  sendImmediateNotification,
} from "../utils/notifications";

export default function Settings() {
  const dispatch = useDispatch();
  const currentInterval = useSelector(
    (state: RootState) => state.counters.notificationInterval
  );
  const counters = useSelector((state: RootState) => state.counters.counters);
  const [interval, setInterval] = useState<NotificationInterval>(currentInterval);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | "unsupported">(
    "Notification" in window ? Notification.permission : "unsupported"
  );

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [],
        title: "Settings",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    setInterval(currentInterval);
  }, [currentInterval]);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(granted ? "granted" : "denied");
  };

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(granted ? "granted" : "denied");
    if (!granted) return;
    sendImmediateNotification(counters);
  };

  const handleSave = async () => {
    if (interval !== "none") {
      const granted = await requestNotificationPermission();
      setPermissionStatus(granted ? "granted" : "denied");
      if (!granted) return;
    }
    dispatch(setNotificationInterval(interval));
    scheduleNotifications(interval, counters);
  };

  return (
    <div className="px-2">
      <MuTakoz />

      <Typography variant="h6" fontWeight="bold" className="mb-4">
        Notifications
      </Typography>

      {permissionStatus === "unsupported" && (
        <div className="text-amber-600 text-sm mb-4 p-3 bg-amber-50 rounded">
          Your browser does not support notifications.
        </div>
      )}

      {permissionStatus === "denied" && (
        <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded">
          Notification permission was denied. Please enable it in your browser
          settings.
        </div>
      )}

      {permissionStatus === "default" && (
        <div className="mb-4">
          <Button
            variant="outlined"
            size="small"
            onClick={handleRequestPermission}
          >
            Enable Notifications
          </Button>
        </div>
      )}

      <FormControl className="w-full">
        <InputLabel>Reminder Interval</InputLabel>
        <Select
          value={interval}
          onChange={(e) => setInterval(e.target.value as NotificationInterval)}
          input={<OutlinedInput label="Reminder Interval" />}
        >
          {NOTIFICATION_INTERVALS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <MuTakoz height="8rem" />

      <Typography variant="caption" color="text.disabled" display="block" className="mb-4">
        Notifications will not work when you close the browser.
      </Typography>

      <Button
        className="w-full"
        variant="outlined"
        size="large"
        onClick={handleTestNotification}
        sx={{ mb: 2 }}
      >
        Test Notification Now
      </Button>

      <Button
        className="w-full"
        variant="contained"
        size="large"
        onClick={handleSave}
        sx={{
          bgcolor: "#fde047",
          color: "#000",
          "&:hover": { bgcolor: "#facc15" },
        }}
      >
        Save Settings
      </Button>
    </div>
  );
}

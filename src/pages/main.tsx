import { Add, Delete } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MuTakoz from "../components/mutakoz";
import { updatePageState } from "../redux/slicePage";
import { incrementCounter, removeCounter } from "../redux/sliceCounters";
import { RootState } from "../redux/store";
import { MAX_COUNTERS } from "../utils/constants";
import { scheduleNotifications } from "../utils/notifications";

function DigitDisplay({ count }: { count: number }) {
  const digits = String(Math.abs(count)).padStart(5, "0").slice(-5).split("");
  return (
    <div className="flex gap-1 w-full">
      {digits.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            aspectRatio: "3/4",
            background: "#000",
            borderRadius: "6px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={`${i}-${d}`}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontFamily: "monospace",
                fontSize: "clamp(1.5rem, 8vw, 3rem)",
                fontWeight: "bold",
              }}
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function Main() {
  const dispatch = useDispatch();
  const counters = useSelector((state: RootState) => state.counters.counters);
  const notificationInterval = useSelector(
    (state: RootState) => state.counters.notificationInterval
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [
          { icon: "Settings", link: "./settings" },
          ...(counters.length < MAX_COUNTERS ? [{ icon: "Add", link: "./counter-add" }] : []),
        ],
        title: "",
      })
    );
  }, [dispatch, counters.length]);

  useEffect(() => {
    scheduleNotifications(notificationInterval, counters);
  }, [notificationInterval, counters]);

  const confirmDelete = () => {
    if (deleteId !== null) {
      dispatch(removeCounter(deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div>
      <MuTakoz />

      {counters.length === 0 ? (
        <Box className="text-center py-16">
          <Typography variant="h6" color="text.secondary">
            No counters yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-2">
            <Link className="font-bold underline" to={"./counter-add"}>
              Tap + to create your first counter.
            </Link>
          </Typography>
        </Box>
      ) : (
        <div className="flex flex-col gap-4 px-2">
          {counters.map((counter) => (
            <div
              key={`counter_${counter.id}`}
              className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200"
            >
              <Typography fontWeight="bold" variant="h6">
                {counter.name}
              </Typography>

              <DigitDisplay count={counter.count} />

              <div className="flex items-center justify-between">
                <IconButton
                  onClick={() => setDeleteId(counter.id)}
                  color="error"
                >
                  <Delete />
                </IconButton>

                <IconButton
                  onClick={() => dispatch(incrementCounter(counter.id))}
                  sx={{
                    bgcolor: "#fde047",
                    "&:hover": { bgcolor: "#facc15" },
                    width: 64,
                    height: 64,
                  }}
                >
                  <Add fontSize="large" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <MuTakoz height="5rem" />

      {counters.length >= MAX_COUNTERS && (
        <Box className="text-center text-sm text-gray-400 pb-4">
          Maximum of {MAX_COUNTERS} counters reached.
        </Box>
      )}

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete counter?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "
            {counters.find((c) => c.id === deleteId)?.name}"? This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

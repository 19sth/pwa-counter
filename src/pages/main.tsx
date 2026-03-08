import { Add, Delete, Remove } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MuTakoz from "../components/mutakoz";
import { updatePageState } from "../redux/slicePage";
import {
  decrementCounter,
  incrementCounter,
  removeCounter,
} from "../redux/sliceCounters";
import { RootState } from "../redux/store";
import { MAX_COUNTERS } from "../utils/constants";
import { scheduleNotifications } from "../utils/notifications";

export default function Main() {
  const dispatch = useDispatch();
  const counters = useSelector((state: RootState) => state.counters.counters);
  const notificationInterval = useSelector(
    (state: RootState) => state.counters.notificationInterval
  );

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [
          { icon: "Settings", link: "./settings" },
        ],
        title: "",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    scheduleNotifications(notificationInterval, counters);
  }, [notificationInterval, counters]);

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
        <List>
          {counters.map((counter, ix) => (
            <div key={`counter_${counter.id}`}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => dispatch(removeCounter(counter.id))}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "#fde047",
                      color: "#000",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    {counter.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold">{counter.name}</Typography>
                  }
                  secondary={
                    <Box className="flex items-center gap-3 mt-1">
                      <IconButton
                        size="small"
                        onClick={() => dispatch(decrementCounter(counter.id))}
                        sx={{
                          bgcolor: "#f3f4f6",
                          "&:hover": { bgcolor: "#e5e7eb" },
                        }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        component="span"
                        sx={{ minWidth: "3rem", textAlign: "center" }}
                      >
                        {counter.count}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => dispatch(incrementCounter(counter.id))}
                        sx={{
                          bgcolor: "#fde047",
                          "&:hover": { bgcolor: "#facc15" },
                        }}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                />
              </ListItem>
              {ix < counters.length - 1 && <Divider variant="inset" component="li" />}
            </div>
          ))}
        </List>
      )}

      <MuTakoz height="5rem" />

      {counters.length < MAX_COUNTERS ? (
        <Link to={"./counter-add"}>
          <Fab
            color="primary"
            sx={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              bgcolor: "#fde047",
              color: "#000",
              "&:hover": { bgcolor: "#facc15" },
            }}
          >
            <Add />
          </Fab>
        </Link>
      ) : (
        <Box className="text-center text-sm text-gray-400 pb-4">
          Maximum of {MAX_COUNTERS} counters reached.
        </Box>
      )}
    </div>
  );
}

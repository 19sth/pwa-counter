import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MuTakoz from "../components/mutakoz";
import { updatePageState } from "../redux/slicePage";
import { addCounter } from "../redux/sliceCounters";
import { RootState } from "../redux/store";
import { MAX_COUNTERS } from "../utils/constants";

export default function CounterAdd() {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const counters = useSelector((state: RootState) => state.counters.counters);
  const atLimit = counters.length >= MAX_COUNTERS;

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [],
        title: "New Counter",
      })
    );
  }, [dispatch]);

  const handleAdd = () => {
    if (!name.trim() || atLimit) return;
    dispatch(addCounter(name.trim().charAt(0).toUpperCase() + name.trim().slice(1)));
    navigate(-1);
  };

  return (
    <div className="px-2">
      <MuTakoz />

      {atLimit && (
        <div className="text-red-500 text-sm mb-4 text-center">
          You have reached the maximum of {MAX_COUNTERS} counters.
        </div>
      )}

      <TextField
        label="Counter Name"
        className="w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
        autoComplete="off"
        autoFocus
        disabled={atLimit}
      />

      <MuTakoz height="8rem" />

      <Button
        className="w-full"
        variant="contained"
        size="large"
        disabled={!name.trim() || atLimit}
        onClick={handleAdd}
        sx={{
          bgcolor: "#fde047",
          color: "#000",
          "&:hover": { bgcolor: "#facc15" },
          "&.Mui-disabled": { bgcolor: "#f3f4f6", color: "#9ca3af" },
        }}
      >
        Create Counter
      </Button>
    </div>
  );
}

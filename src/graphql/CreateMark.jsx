import { useMutation } from "@apollo/client";

import {
  Alert,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import MarkIcon from "@mui/icons-material/RateReview";
import { CREATE_MARK } from "./mutations";
import { InputSlider } from "../components/RangeSlider";
import { GrowTransition } from "../containers/Verify";

export const CreateMarkIcon = memo((props) => {
  const { userId, size, vert, markSum, movieId, movieName, fontSize } = props;
  const [value, setValue] = useState(2.5);
  const [markCount, setMarkCount] = useState(markSum);
  const [markInput, setMarkInput] = useState("");
  const [open, setOpen] = useState(false);
  const [openB, setOpenB] = useState(true);

  const handleCloseBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenB(false);
    window.location.reload();
  };
  const handleCloseBarError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenB(false);
  };
  const log = useCallback(() => {
    setOpenB((prevState) => !prevState);
  }, []);
  const handleClickOpen = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);
  const handleClose = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);
  const addMarkCount = useCallback(() => {
    setMarkCount((prev) => prev + 1);
  }, [markCount]);

  const [createMark, { data, error, loading }] = useMutation(CREATE_MARK, {
    variables: { movieId, userId, score: value, content: markInput },
  });

  if (loading) return null;
  return (
    <>
      {!error ? null : (
        <Snackbar
          open={openB}
          autoHideDuration={2000}
          onClose={handleCloseBarError}
          TransitionComponent={GrowTransition}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="warning" sx={{ width: "100%" }}>
            Cannot post agein if you've done before!
          </Alert>
        </Snackbar>
      )}
      {!data ? null : (
        <Snackbar
          open={openB}
          autoHideDuration={700}
          onClose={handleCloseBar}
          TransitionComponent={GrowTransition}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Sucess!
          </Alert>
        </Snackbar>
      )}
      <IconButton size={size} color="inherit" onClick={handleClickOpen}>
        <Badge color="secondary">
          <MarkIcon fontSize={fontSize ? fontSize : "medium"} />
        </Badge>
      </IconButton>
      {vert ? <Box>{markCount}</Box> : markCount}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="md"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" align="center">
          Add a review of {movieName}
        </DialogTitle>
        <InputSlider setValue={setValue} value={value} />
        <DialogContent>
          <TextField
            label="Mark"
            margin="dense"
            fullWidth
            id="text"
            name="mark"
            multiline
            maxRows="12"
            onChange={(e) => {
              setMarkInput(e.target.value);
            }}
            type="text"
          />
        </DialogContent>
        <DialogActions sx={{ margin: "auto" }}>
          <Button
            onClick={() => {
              createMark();
              handleClose();
              if (data) addMarkCount();
              if (error) log();
            }}
            color="primary"
          >
            ADD
          </Button>
          <Button onClick={handleClose} color="primary">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

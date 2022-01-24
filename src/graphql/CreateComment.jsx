import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { memo, useCallback, useContext, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { MARK } from "./queries";
import { CommentDialog } from "../components/dialogs/CommentDialog";
import Scrollbars from "react-custom-scrollbars-2";
import defaultImage from "../images/stock-photos/blank-profile-picture-gc8f506528_1280.png";
import { UserImageContext } from "../components/providers/UserImageProvider";
import { CREATE_COMMENT } from "./mutations";
import { CommentThreeVertIcon } from "../components/CommentThreeVertIcon";
import { UserAuthContext } from "../components/providers/UserAuthProvider";
import { Loader } from "../components/Loader";
import { GrowTransition } from "../containers/Verify";

export const CreateCommentIcon = memo((props) => {
  const { info, markId } = props;
  const [open, setOpen] = useState(false);
  const { authState } = useContext(UserAuthContext);
  const userId = authState.id;
  const [commContent, setCommContent] = useState("");
  const { uri } = useContext(UserImageContext);
  const [openB, setOpenB] = useState(true);

  const handleCloseBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenB(false);
  };
  const handleClickOpen = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);
  const handleClose = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);
  const [createComment, { error, data: dataC }] = useMutation(CREATE_COMMENT, {
    variables: { userId, markId, content: commContent },
  });
  const { loading, data, refetch } = useQuery(MARK, {
    variables: { id: parseInt(markId) },
    fetchPolicy: "cache-and-network",
  });
  if (loading) return <Loader state={true} />;
  if (data) {
    const mark = data.mark;
    const comments = mark.comments;
    const users = comments.map((comm) => comm.user);
    const usersPath = users.map((user) =>
      !user.path ? "" : `https://www.moview-ori.com${user.path}/`
    );
    const ary = comments.map((itemOfComment, idx) => {
      return {
        comment: comments[idx],
        user: users[idx],
        userPath: usersPath[idx],
      };
    });
    return (
      <>
        <Loader state={false} />
        {!error ? null : (
          <Snackbar
            open={openB}
            autoHideDuration={3000}
            onClose={handleCloseBar}
            TransitionComponent={GrowTransition}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="warning" sx={{ width: "100%" }}>
              Type a comment!
            </Alert>
          </Snackbar>
        )}
        <IconButton onClick={handleClickOpen}>
          <CommentIcon sx={{ color: "black" }} fontSize="small" />
        </IconButton>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <CommentDialog
            mark={mark}
            favoBool={info.favoBool}
            ave={info.ave}
            clipBool={info.clipBool}
            info={info}
          />
          <Divider style={{ background: "inherit" }} />

          <DialogContent sx={{ backgroundColor: "#e6edf5" }}>
            <Scrollbars autoHeight autoHeightMin={260} autoHeightMax={260}>
              <List sx={{ width: "100%", margin: "auto" }}>
                {!comments.length ? (
                  <DialogContentText
                    mt="10%"
                    sx={{ fontStyle: "italic", fontWeight: "medium", backgroundColor: "#e6edf5" }}
                    variant="h4"
                    textAlign="center"
                  >
                    Post first comment!
                  </DialogContentText>
                ) : (
                  ary.map((ary) => {
                    return (
                      <>
                        <ListItem key={ary.comment.id}>
                          <ListItemAvatar>
                            <Avatar
                              sx={{ width: 45, height: 45 }}
                              alt={ary.user.nickname}
                              src={!ary.userPath ? defaultImage : ary.userPath}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {ary.user.nickname}
                                </Typography>
                              </>
                            }
                            secondary={
                              <>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body1"
                                  color="text.primary"
                                >
                                  {ary.comment.content}
                                </Typography>
                              </>
                            }
                          />
                          <CommentThreeVertIcon commId={ary.comment.id} userId={ary.user.id} />
                        </ListItem>
                        <Divider />
                      </>
                    );
                  })
                )}
              </List>
            </Scrollbars>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <Avatar
                sx={{ width: 33, height: 33, marginRight: 2, marginBottom: 0.5 }}
                alt="my image"
                src={uri}
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                type="text"
                fullWidth
                variant="standard"
                label="Comment"
                value={commContent}
                onChange={(e) => {
                  setCommContent(e.target.value);
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#e6edf5" }}>
            <Button
              onClick={() => {
                createComment();
                if (dataC) refetch();
                handleClose();
                if (error) setOpenB(!openB);
              }}
            >
              ADD
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
});

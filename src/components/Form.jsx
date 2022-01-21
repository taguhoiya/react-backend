import { TextField } from "@mui/material";
import { memo } from "react";

export const NicknameInput = memo((props) => {
  return (
    <TextField
      margin={props.margin}
      required
      fullWidth
      id="nickname"
      label="nickname"
      name="nickname"
      autoComplete="nickname"
      value={props.value}
      onChange={props.onChange}
    />
  );
});

export const EmailInput = memo((props) => {
  return (
    <TextField
      margin={props.margin}
      required
      fullWidth
      id="email"
      label="Email Address"
      name="email"
      autoComplete="email"
      value={props.value}
      onChange={props.onChange}
    />
  );
});

export const PasswordInput = memo((props) => {
  return (
    <TextField
      margin={props.margin}
      required
      fullWidth
      name="password"
      label="Password"
      type="password"
      id="password"
      autoComplete="new-password"
      value={props.value}
      onChange={props.onChange}
    />
  );
});

export const PasswordConfInput = memo((props) => {
  return (
    <TextField
      margin={props.margin}
      required
      fullWidth
      name="passwordConfirmation"
      label="PasswordConfirmation"
      type="password"
      id="passwordConfirmation"
      autoComplete="new-password"
      value={props.value}
      onChange={props.onChange}
    />
  );
});

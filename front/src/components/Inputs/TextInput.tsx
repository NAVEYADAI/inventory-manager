import { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  type TextFieldProps
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export type TextInputProps = Omit<TextFieldProps, 'onChange'> & {
  state?: any;
  setState?: (str: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextInput = ({
  state,
  setState,
  value,
  onChange,
  type,
  inputProps,
  InputProps,
  variant = "outlined",
  ...rest
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : (type ?? "text");

  const val = state !== undefined ? state : value;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setState) {
      setState(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <TextField
      value={val}
      onChange={handleChange}
      type={inputType}
      variant={variant}
      inputProps={{
        style: { textAlign: "left" },
        ...inputProps
      }}
      InputProps={{
        ...(isPassword ? {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        } : {}),
        ...InputProps
      }}
      {...rest}
    />
  );
};

export default TextInput;

import { useState } from "react";
import {
  TextField,
  type SxProps,
  type TextFieldVariants,
  type Theme,
  InputAdornment,
  IconButton
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type TextInputProps = {
  label?: string;
  variant?: TextFieldVariants;
  sx?: SxProps<Theme>;
  state: any;
  setState: (str: string) => void;
  type?: string;
  className?: string;
};

const TextInput = ({ label, variant, sx, state, setState, type, className }: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : (type ?? "text");

  return (
    <TextField
      className={className}
      value={state}
      onChange={(e) => setState(e.target.value)}
      label={label}
      type={inputType}
      variant={variant ?? "outlined"}
      inputProps={{ style: { textAlign: "left" } }}
      InputProps={isPassword ? {
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
      } : undefined}
      sx={sx}
    />
  );
};

export default TextInput;

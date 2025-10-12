import {
  TextField,
  type SxProps,
  type TextFieldVariants,
  type Theme,
} from "@mui/material";
type TextInputProps = {
  label?: string;
  variant?: TextFieldVariants;
  sx?: SxProps<Theme>;
  state: any;
  setState: (str: string) => void;
};
const TextInput = ({ label, variant, sx, state, setState }: TextInputProps) => {
  return (
    <TextField
      value={state}
      onChange={(e) => setState(e.target.value)}
      label={label}
      variant={variant ?? "outlined"}
      inputProps={{ style: { textAlign: "left" } }}
      sx={sx}
    />
  );
};

export default TextInput;

import { Stack, Typography } from "@mui/material";
import {
  SideContainer,
  StyledButton,
  StyledForm,
} from "./LoginAndSignin.style";
import TextInput from "../../components/Inputs/TextInput";
import { SignUpFields, SignUpFieldsHebNames, type Signup } from "./util";
import { LogInTitle, SignUpTitle } from "../../titles";
type SignUpProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  signUp: Signup;
  setSignUp: React.Dispatch<React.SetStateAction<Signup>>;
};

const SignUp = ({ setIsLogin, signUp, setSignUp }: SignUpProps) => {
  return (
    <Stack>
      <SideContainer>
        <Typography variant="h5">Join Us!</Typography>
        <Typography variant="body1">
          Create an account to start managing your inventory today.
        </Typography>
        <StyledButton variant="outlined" onClick={() => setIsLogin(true)}>
          {LogInTitle}
        </StyledButton>
      </SideContainer>
      <StyledForm>
        <Typography variant="h4">{SignUpTitle}</Typography>
        {Object.values(SignUpFields).map((value) => (
          <TextInput
            label={SignUpFieldsHebNames[value]}
            sx={{ margin: "8px", width: "250px" }}
            state={signUp[value]}
            setState={(str) =>
              setSignUp((prev) => ({
                ...prev,
                [value]: str,
              }))
            }
          />
        ))}
        <StyledButton variant="contained" type="submit">
          {SignUpTitle}
        </StyledButton>
      </StyledForm>
    </Stack>
  );
};

export default SignUp;

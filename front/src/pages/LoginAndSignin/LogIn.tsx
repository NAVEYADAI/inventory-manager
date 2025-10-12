import { Typography } from "@mui/material";
import {
  SideContainer,
  StyledButton,
  StyledForm,
} from "./LoginAndSignin.style";
import { LoginFields, LogInFieldsHebNames, type Login } from "./util";
import TextInput from "../../components/Inputs/TextInput";
import { LogInTitle, SignUpTitle } from "../../titles";

type LogInProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  logIn: Login;
  setLogIn: React.Dispatch<React.SetStateAction<Login>>;
};

const LogIn = ({ setIsLogin, logIn, setLogIn }: LogInProps) => {
  return (
    <>
      <SideContainer>
        <Typography variant="h5">Welcome Back!</Typography>
        <Typography variant="body1">
          Log in to continue managing your inventory.
        </Typography>
        <StyledButton variant="outlined" onClick={() => setIsLogin(false)}>
          {SignUpTitle}
        </StyledButton>
      </SideContainer>
      <StyledForm>
        <Typography variant="h4">Login</Typography>
        {Object.values(LoginFields).map((value) => (
          <TextInput
            label={LogInFieldsHebNames[value]}
            sx={{ margin: "8px", width: "250px" }}
            state={logIn[value]}
            setState={(str) =>
              setLogIn((prev) => ({
                ...prev,
                [value]: str,
              }))
            }
          />
        ))}
        <StyledButton variant="contained" type="submit">
          {LogInTitle}
        </StyledButton>
      </StyledForm>
    </>
  );
};

export default LogIn;

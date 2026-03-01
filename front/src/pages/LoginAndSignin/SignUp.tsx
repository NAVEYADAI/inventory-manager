import { Stack, Typography } from "@mui/material";
import {
  SideContainer,
  StyledButton,
  StyledForm,
} from "./LoginAndSignin.style";
import TextInput from "../../components/Inputs/TextInput";
import { SignUpFields, SignUpFieldsHebNames, type Signup } from "./util";
import { LogInTitle, SignUpTitle } from "../../titles";
import { register } from "../../api/login";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type SignUpProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  signUp: Signup;
  setSignUp: React.Dispatch<React.SetStateAction<Signup>>;
};

const SignUp = ({ setIsLogin, signUp, setSignUp }: SignUpProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        name: signUp.userName,
        firstName: signUp.firstName,
        lastName: signUp.lastName,
        address: signUp.address,
        phone: signUp.phone,
        email: signUp.email,
        password: String(signUp.password),
      };
      const res = await register(payload);
      if (res.status === 201 || res.status === 200) {
        setIsLogin(true);
        navigate("/home");

      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

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
      <StyledForm onSubmit={handleSubmit}>
        <Typography variant="h4">{SignUpTitle}</Typography>
        {Object.values(SignUpFields).map((value) => (
          <TextInput
            key={value}
            label={SignUpFieldsHebNames[value]}
            sx={{ margin: "8px", width: "250px" }}
            state={signUp[value as keyof Signup] as string}
            setState={(str) =>
              setSignUp((prev) => ({
                ...prev,
                [value]: str,
              }))
            }
          />
        ))}
        {error && <Typography color="error">{error}</Typography>}
        <StyledButton variant="contained" type="submit" disabled={loading}>
          {loading ? "Registering..." : SignUpTitle}
        </StyledButton>
      </StyledForm>
    </Stack>
  );
};

export default SignUp;

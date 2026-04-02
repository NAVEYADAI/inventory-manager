import { Stack, Typography } from "@mui/material";
import { SideContainer, StyledButton, StyledForm } from "../LoginAndSignin/LoginAndSignin.style";
import TextInput from "../../components/Inputs/TextInput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../../api/company";
import { useAuth } from "../../providers/AuthProvider";

interface CompanyFields {
  name: string;
  identifier: string;
  address: string;
  phone: string;
}

const CompanySetup = () => {
  const [company, setCompany] = useState<CompanyFields>({
    name: "",
    identifier: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth()
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: any = { ...company };
      if (user && user.id) {
        payload.ownerId = user.id;
      }
      const res = await createCompany(payload);
      // if subscription returned, set as selected company
      if (res.data?.subscription) {
        const compInfo = {
          id: res.data.company.id,
          name: res.data.company.name,
          subscriptionId: res.data.subscription.id,
        };
        const existingUser = user || {};
        // existingUser.selectedCompany = compInfo;
        // existingUser.activeCompanies = [compInfo];
        localStorage.setItem("user", JSON.stringify(existingUser));
      }
      navigate("/home");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack direction="row" spacing={4}>
      <SideContainer>
        <Typography variant="h5">Configure your company</Typography>
        <Typography variant="body1">
          Enter your company's details to get started.
        </Typography>
      </SideContainer>
      <StyledForm onSubmit={handleSubmit}>
        <Typography variant="h4">New Company</Typography>
        <TextInput
          label="Name"
          sx={{ margin: "8px", width: "250px" }}
          state={company.name}
          setState={(str) => setCompany((c) => ({ ...c, name: str }))}
        />
        <TextInput
          label="Identifier"
          sx={{ margin: "8px", width: "250px" }}
          state={company.identifier}
          setState={(str) => setCompany((c) => ({ ...c, identifier: str }))}
        />
        <TextInput
          label="Address"
          sx={{ margin: "8px", width: "250px" }}
          state={company.address}
          setState={(str) => setCompany((c) => ({ ...c, address: str }))}
        />
        <TextInput
          label="Phone"
          sx={{ margin: "8px", width: "250px" }}
          state={company.phone}
          setState={(str) => setCompany((c) => ({ ...c, phone: str }))}
        />
        {error && <Typography color="error">{error}</Typography>}
        <StyledButton variant="contained" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Company"}
        </StyledButton>
      </StyledForm>
    </Stack>
  );
};

export default CompanySetup;

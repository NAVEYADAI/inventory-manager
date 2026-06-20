import React from "react";
import { Box, Tooltip } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { logout as apiLogout } from "../../api/login";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  StyledAppBar,
  StyledToolbar,
  LogoImage,
  BrandTitle,
  NavButton,
  UserSection,
  UsernameText,
  LogoutButton,
} from "./navbar.style";

const Navbar: React.FC = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // If the user is not logged in, hide the navbar completely to give a clean fullscreen authentication screen
    if (!user) return null;

    const handleLogout = () => {
        apiLogout();
        setUser(undefined);
        navigate("/login");
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <StyledAppBar
            position="sticky"
            elevation={0}
        >
            <StyledToolbar dir="rtl">
                {/* Logo / Brand Title with Gradient Text */}
                <Box display="flex" alignItems="center" gap={1.5}>
                    <LogoImage
                        src="/logo.png"
                        alt="Logo"
                    />
                    <BrandTitle
                        variant="h6"
                    >
                        מנהל המלאי
                    </BrandTitle>
                </Box>

                {/* Navigation Links and User Info */}
                <Box display="flex" alignItems="center" gap={3}>
                    {/* Navigation Buttons */}
                    <Box display="flex" gap={1}>
                        <NavButton
                            component={Link}
                            to="/home"
                            active={isActive("/home")}
                        >
                            ראשי
                        </NavButton>
                        <NavButton
                            component={Link}
                            to="/recipes"
                            active={isActive("/recipes")}
                        >
                            מתכונים
                        </NavButton>
                        <NavButton
                            component={Link}
                            to="/calendar2"
                            active={isActive("/calendar2")}
                        >
                            לוח שנה
                        </NavButton>
                    </Box>

                    {/* User Section (Name & Logout) */}
                    <UserSection>
                        <UsernameText
                            variant="body2"
                        >
                            שלום, {user.name || user.email}
                        </UsernameText>

                        <Tooltip title="התנתק מהמערכת">
                            <LogoutButton
                                onClick={handleLogout}
                                size="small"
                            >
                                <LogoutIcon fontSize="small" />
                            </LogoutButton>
                        </Tooltip>
                    </UserSection>
                </Box>
            </StyledToolbar>
        </StyledAppBar>
    );
};

export default Navbar;
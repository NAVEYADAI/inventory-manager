import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { logout as apiLogout } from "../../api/login";
import LogoutIcon from "@mui/icons-material/Logout";

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
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                margin: "20px auto 0",
                maxWidth: "1200px",
                width: "calc(100% - 40px)",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                color: "#1e293b",
                top: "20px",
                zIndex: 1100,
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", py: 0.5 }} dir="rtl">
                {/* Logo / Brand Title with Gradient Text */}
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                        component="img"
                        src="/logo.png"
                        alt="Logo"
                        sx={{
                            height: 38,
                            width: "auto",
                            filter: "drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))",
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            background: "linear-gradient(135deg, #1e3c72 0%, #673ab7 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        מנהל המלאי
                    </Typography>
                </Box>

                {/* Navigation Links and User Info */}
                <Box display="flex" alignItems="center" gap={3}>
                    {/* Navigation Buttons */}
                    <Box display="flex" gap={1}>
                        <Button
                            component={Link}
                            to="/home"
                            sx={{
                                fontWeight: isActive("/home") ? 700 : 500,
                                px: 2,
                                py: 1,
                                borderRadius: "10px",
                                textTransform: "none",
                                color: isActive("/home") ? "#1e3c72" : "#64748b",
                                backgroundColor: isActive("/home") ? "rgba(30, 60, 114, 0.08)" : "transparent",
                                "&:hover": {
                                    backgroundColor: isActive("/home")
                                        ? "rgba(30, 60, 114, 0.12)"
                                        : "rgba(0, 0, 0, 0.03)",
                                },
                            }}
                        >
                            ראשי
                        </Button>
                        <Button
                            component={Link}
                            to="/recipes"
                            sx={{
                                fontWeight: isActive("/recipes") ? 700 : 500,
                                px: 2,
                                py: 1,
                                borderRadius: "10px",
                                textTransform: "none",
                                color: isActive("/recipes") ? "#1e3c72" : "#64748b",
                                backgroundColor: isActive("/recipes") ? "rgba(30, 60, 114, 0.08)" : "transparent",
                                "&:hover": {
                                    backgroundColor: isActive("/recipes")
                                        ? "rgba(30, 60, 114, 0.12)"
                                        : "rgba(0, 0, 0, 0.03)",
                                },
                            }}
                        >
                            מתכונים
                        </Button>
                        <Button
                            component={Link}
                            to="/calendar2"
                            sx={{
                                fontWeight: isActive("/calendar2") ? 700 : 500,
                                px: 2,
                                py: 1,
                                borderRadius: "10px",
                                textTransform: "none",
                                color: isActive("/calendar2") ? "#1e3c72" : "#64748b",
                                backgroundColor: isActive("/calendar2") ? "rgba(30, 60, 114, 0.08)" : "transparent",
                                "&:hover": {
                                    backgroundColor: isActive("/calendar2")
                                        ? "rgba(30, 60, 114, 0.12)"
                                        : "rgba(0, 0, 0, 0.03)",
                                },
                            }}
                        >
                            לוח שנה
                        </Button>
                    </Box>

                    {/* User Section (Name & Logout) */}
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        sx={{
                            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
                            pr: 3,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#475569",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                            }}
                        >
                            שלום, {user.name || user.email}
                        </Typography>

                        <Tooltip title="התנתק מהמערכת">
                            <IconButton
                                onClick={handleLogout}
                                size="small"
                                sx={{
                                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                                    color: "#ef4444",
                                    borderRadius: "10px",
                                    p: 1,
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                        backgroundColor: "rgba(239, 68, 68, 0.15)",
                                        transform: "scale(1.05)",
                                    },
                                }}
                            >
                                <LogoutIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
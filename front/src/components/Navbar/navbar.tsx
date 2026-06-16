import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <AppBar position="static" sx={{ margin: 0 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    מנהל המלאי
                </Typography>

                <Box display="flex" gap={1}>
                    <Button component={Link} to="/home" color="inherit">
                        ראשי
                    </Button>
                    <Button component={Link} to="/recipes" color="inherit">
                        מתכונים
                    </Button>
                    <Button component={Link} to="/calendar2" color="inherit">
                        לוח שנה
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
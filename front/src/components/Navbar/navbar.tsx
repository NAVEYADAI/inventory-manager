import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Navbar: React.FC = () => {
    return (
        <AppBar position="static" sx={{ margin: 0 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    MyApp
                </Typography>

                <Box>
                    <Button color="inherit">Home</Button>
                    <Button color="inherit">About</Button>
                    <Button color="inherit">Login</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
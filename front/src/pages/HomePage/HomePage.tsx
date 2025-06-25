import { Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Box p={3}>
      <h1>ברוך הבא</h1>
      <Button component={Link} to="/calendar" variant="contained">
        לעבור ללוח השנה
      </Button>
    </Box>
  );
};

export default HomePage;

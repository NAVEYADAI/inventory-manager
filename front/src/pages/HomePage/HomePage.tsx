import { Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { UOM } from '@inventory-manager/shared';

const HomePage = () => {
  const userStr = localStorage.getItem("user");
  let currentCompany = null;
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      currentCompany = user.selectedCompany;
    } catch { }
  }
  return (
    <Box p={3}>
      <h1>ברוך הבא</h1>
      {currentCompany && (
        <Box mb={2}>
          <strong>חברה נבחרת:</strong> {currentCompany.name}
        </Box>
      )}
      {Object.values(UOM).map((uom) => (
        <Box key={uom}>{uom}</Box>
      ))}
      <Button component={Link} to="/calendar" variant="contained">
        לעבור ללוח השנה
      </Button>
      <Button component={Link} to="/calendar2" variant="contained">
        למעבר ללוח האמיתי
      </Button>
    </Box>
  );
};

export default HomePage;

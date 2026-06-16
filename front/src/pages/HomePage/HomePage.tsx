import { Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CreateRawMaterialDialog from '../../dialogs/createRawMaterialDialog/CreateRawMaterialDialog';
import { createRawMaterials } from '../../api/rawMaterial';

const HomePage = () => {
  const [CreateRawMaterialOpen, setCreateRawMaterialOpen] = useState(false);
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
      <Box display="flex" justifyContent="center" alignItems="center" my={2}>
        <Box component="span" fontSize="2rem" role="img" aria-label="flower">
          🌸
        </Box>
      </Box>
      <Button component={Link} to="/calendar" variant="contained">
        לעבור ללוח השנה
      </Button>
      <Button component={Link} to="/calendar2" variant="contained">
        למעבר ללוח האמיתי
      </Button>
      <CreateRawMaterialDialog
        open={CreateRawMaterialOpen}
        onClose={() => setCreateRawMaterialOpen(false)}
        subscriptionId={currentCompany?.subscriptionId}
        onSave={async (rows) => {
          try {
            if (!currentCompany || !currentCompany.subscriptionId) {
              console.warn('No selected company / subscriptionId');
              return;
            }
            await createRawMaterials(currentCompany.subscriptionId, rows as any);
            // Optionally show feedback
            console.log('Raw materials saved');
          } catch (e) {
            console.error('Failed to save raw materials', e);
          }
        }}
      />
      <Box display="flex" gap={2} mt={2}>
        <Button onClick={() => setCreateRawMaterialOpen(prev => !prev)} variant="contained">
          הוספת חומרי גלם
        </Button>
        <Button component={Link} to="/recipes" variant="contained" color="secondary">
          ספר המתכונים
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;

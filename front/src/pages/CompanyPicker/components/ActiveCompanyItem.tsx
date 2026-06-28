import React from 'react';
import { Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { CompanyInfo } from '../../../api/login';
import { ActiveCompanyPaper, PickerButton } from '../CompanyPicker.style';

interface ActiveCompanyItemProps {
  company: CompanyInfo;
  onPick: (subId: number) => void;
}

const ActiveCompanyItem: React.FC<ActiveCompanyItemProps> = ({ company, onPick }) => {
  return (
    <ActiveCompanyPaper variant="outlined">
      <Typography variant="body1" fontWeight={600}>
        {company.name}
      </Typography>
      <PickerButton
        variant="contained"
        size="small"
        onClick={() => onPick(company.subscriptionId)}
        startIcon={<CheckCircleOutlineIcon fontSize="small" />}
      >
        כניסה
      </PickerButton>
    </ActiveCompanyPaper>
  );
};

export default ActiveCompanyItem;

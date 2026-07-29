import React from 'react';
import CreateProductLogDialog from '../../../dialogs/createProductLogDialog/CreateProductLogDialog';
import RecipeExecutionDetailDialog from '../../../dialogs/recipeExecutionDetailDialog/RecipeExecutionDetailDialog';
import CreateTagDialog from '../../../dialogs/createTagDialog/CreateTagDialog';
import TagSummaryDialog from '../../../dialogs/tagSummaryDialog/TagSummaryDialog';
import type { useCalendarDialogs } from '../hooks/useCalendarDialogs';

interface CalendarDialogsManagerProps {
  subscriptionId?: number;
  dialogs: ReturnType<typeof useCalendarDialogs>;
  onSaveExecutions: () => void;
  onSaveTags: () => void;
}

export const CalendarDialogsManager: React.FC<CalendarDialogsManagerProps> = ({
  subscriptionId,
  dialogs,
  onSaveExecutions,
  onSaveTags,
}) => {
  const {
    productLogState,
    closeProductLog,
    executionDetailState,
    closeExecutionDetail,
    tagState,
    closeTagDialogs,
    switchToEditTagFromSummary,
  } = dialogs;

  return (
    <>
      <CreateProductLogDialog
        open={productLogState.open}
        onClose={closeProductLog}
        dateStr={productLogState.dateStr}
        subscriptionId={subscriptionId}
        onSave={onSaveExecutions}
      />

      <RecipeExecutionDetailDialog
        open={executionDetailState.open}
        onClose={closeExecutionDetail}
        execution={executionDetailState.execution}
        onDelete={onSaveExecutions}
      />

      <CreateTagDialog
        open={tagState.openCreate}
        onClose={closeTagDialogs}
        onSave={onSaveTags}
        subscriptionId={subscriptionId}
        tagToEdit={tagState.selectedTag}
        prefilledData={tagState.prefilledTag}
      />

      <TagSummaryDialog
        open={tagState.openSummary}
        onClose={closeTagDialogs}
        tagId={tagState.selectedTag ? tagState.selectedTag.id : null}
        onEditClick={switchToEditTagFromSummary}
      />
    </>
  );
};

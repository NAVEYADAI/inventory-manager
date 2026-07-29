import { useState, useCallback } from "react";
import type { TagDto } from "../../../api/tag";

export interface PrefilledTagData {
  name: string;
  startDate: string;
  endDate: string;
}

export const useCalendarDialogs = () => {
  const [productLogState, setProductLogState] = useState<{ open: boolean; dateStr: string }>({
    open: false,
    dateStr: "",
  });

  const [executionDetailState, setExecutionDetailState] = useState<{ open: boolean; execution: any }>({
    open: false,
    execution: null,
  });

  const [tagState, setTagState] = useState<{
    openCreate: boolean;
    openSummary: boolean;
    selectedTag: TagDto | null;
    prefilledTag: PrefilledTagData | null;
  }>({
    openCreate: false,
    openSummary: false,
    selectedTag: null,
    prefilledTag: null,
  });

  // Handlers for Product Log Dialog
  const openProductLog = useCallback((dateStr: string) => {
    setProductLogState({ open: true, dateStr });
  }, []);

  const closeProductLog = useCallback(() => {
    setProductLogState({ open: false, dateStr: "" });
  }, []);

  // Handlers for Execution Detail Dialog
  const openExecutionDetail = useCallback((execution: any) => {
    setExecutionDetailState({ open: true, execution });
  }, []);

  const closeExecutionDetail = useCallback(() => {
    setExecutionDetailState({ open: false, execution: null });
  }, []);

  // Handlers for Tag Dialogs
  const openCreateTag = useCallback((prefilled: PrefilledTagData | null = null) => {
    setTagState({
      openCreate: true,
      openSummary: false,
      selectedTag: null,
      prefilledTag: prefilled,
    });
  }, []);

  const openTagSummary = useCallback((tag: TagDto) => {
    setTagState({
      openCreate: false,
      openSummary: true,
      selectedTag: tag,
      prefilledTag: null,
    });
  }, []);

  const closeTagDialogs = useCallback(() => {
    setTagState({
      openCreate: false,
      openSummary: false,
      selectedTag: null,
      prefilledTag: null,
    });
  }, []);

  const switchToEditTagFromSummary = useCallback(() => {
    setTagState((prev) => ({
      ...prev,
      openCreate: true,
      openSummary: false,
    }));
  }, []);

  return {
    productLogState,
    openProductLog,
    closeProductLog,

    executionDetailState,
    openExecutionDetail,
    closeExecutionDetail,

    tagState,
    openCreateTag,
    openTagSummary,
    closeTagDialogs,
    switchToEditTagFromSummary,
  };
};

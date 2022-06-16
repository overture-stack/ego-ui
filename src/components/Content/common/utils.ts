import { ContentState } from '../types';

export const isEditing = (mode: ContentState) =>
  mode === ContentState.CREATING || mode === ContentState.EDITING;

export interface Props
  extends Partial<{
    disabled: boolean;
    readonly: boolean;
    errorMessage: string;
    message: string;
    label: string;
    isLoading: boolean;
  }> {}

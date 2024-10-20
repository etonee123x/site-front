import type { Props as PropsIcon } from '@/components/ui/BaseIcon';

export interface Props
  extends Partial<{
    isDisabled: boolean;
    isLoading: boolean;
    propsIconPrepend: PropsIcon;
    propsIconAppend: PropsIcon;
  }> {}

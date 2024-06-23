import { useToggle } from '@vueuse/core';

export const useIsFocused = () => {
  const [isFocused, setIsFocused] = useToggle();

  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  return {
    isFocused,
    onFocus,
    onBlur,
  };
};

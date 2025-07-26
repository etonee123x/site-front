<template>
  <TextInputWrapper class="select" :label :labelFor="id" :errorMessage ref="textInputWrapper">
    <Tippy
      interactive
      trigger="manual"
      placement="bottom-start"
      v-bind="propsTippy"
      :duration="0"
      :offset="[0, 2]"
      :hideOnClick="false"
      sticky
      maxWidth="none"
      tag="div"
      ref="tippy"
      @show="onShow"
      @hidden="onHidden"
      @clickOutside="onClickOutside"
      @click.stop.prevent
    >
      <TextInputBase
        :id
        :disabled="isDisabled"
        :readonly
        :placeholder
        :modelValue="isShown ? modelSearch : textSelected"
        ref="textInputBase"
        @update:modelValue="onUpdateTextInputValue"
        @focus="onFocus"
        @keydown.up.prevent="onKeydownUp"
        @keydown.down.prevent="onKeydownDown"
        @keydown.enter.prevent.stop="onKeydownEnter"
        @keydown.tab="onKeydownTab"
      >
        <button tabindex="-1">
          <BaseIcon :path="isShown ? mdiChevronUp : mdiChevronDown" />
        </button>
      </TextInputBase>

      <template #content>
        <div
          :style="{ width: `${width}px` }"
          class="max-h-[106px] text-black bg-background border border-details-300 rounded-sm p-1 text-xs overflow-hidden"
        >
          <ul
            v-if="optionsFiltered.length"
            class="*:px-2 max-h-24 *:min-h-6 overflow-y-auto *:cursor-pointer *:rounded-xxs *:flex *:gap-2 *:items-center overflow-hidden"
            ref="content"
          >
            <li
              v-for="(option, index) in optionsFiltered"
              :class="indexHighLighted === index && 'bg-details-10'"
              ref="options"
              :key="index"
              @mouseenter="() => onMouseEnter(index)"
              @click="() => onClickOption(option)"
            >
              <BaseCheckbox
                v-if="isOptionSelected(option)"
                :class="CHECKBOX.SIZE.SM"
                modelValue
                readonly
                tabindex="-1"
              />
              {{ optionToText(option) }}
            </li>
          </ul>
          <div v-else>{{ i18n?.nothingFound ?? t('nothingFound') }}</div>
        </div>
      </template>
    </Tippy>

    <template #bottom>
      <slot name="bottom" />
    </template>
  </TextInputWrapper>
</template>

<i18n lang="yaml">
Ru:
  nothingFound: 'Ничего не найдено'
  selectAnOption: 'Выберите вариант'
En:
  nothingFound: 'Nothing found'
  selectAnOption: 'Select an option'
</i18n>

<script
  setup
  lang="ts"
  generic="
    ModelValueSingle extends string | number | object | null | Option,
    ModelValueArrayed extends Array<ModelValueSingle>,
    Option extends string | object,
    ModelValue extends ModelValueSingle | ModelValueArrayed | null
  "
>
import TextInputBase from '@/components/ui/_TextInputsElements/_TextInputBase.vue';
import TextInputWrapper from '@/components/ui/_TextInputsElements/_TextInputWrapper.vue';
import BaseIcon from '@/components/ui/BaseIcon';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { Tippy, type TippyComponent } from 'vue-tippy';
import { computed, ref, watch, nextTick, watchEffect, useId, useTemplateRef } from 'vue';
import { objectGet } from '@etonee123x/shared/utils/objectGet';
import { useElementSize, type MaybeComputedElementRef } from '@vueuse/core';
import { isNil } from '@etonee123x/shared/utils/isNil';
import { isEqual } from '@etonee123x/shared/utils/isEqual';
import { useI18n } from 'vue-i18n';
import BaseCheckbox from '@/components/ui/BaseCheckbox';
import type { Nil } from '@etonee123x/shared/types';
import { CHECKBOX } from '@/helpers/ui';
import type { Props } from './types';

const _getOptionLikeText = (optionLike: Option | ModelValue | undefined) => {
  const isStringOrNumber = (argument: unknown): argument is string | number =>
    typeof argument === 'string' || typeof argument === 'number';

  if (isNil(optionLike)) {
    return '';
  }

  if (isStringOrNumber(optionLike)) {
    return String(optionLike);
  }

  const maybeOptionText = objectGet(optionLike, 'text');

  if (isStringOrNumber(maybeOptionText)) {
    return String(maybeOptionText);
  }

  const maybeOptionLabel = objectGet(optionLike, 'label');

  if (isStringOrNumber(maybeOptionLabel)) {
    return String(maybeOptionLabel);
  }

  throw new Error(['Define a way to get option text', ...(props.label ? [`(${props.label})`] : [])].join(' '));
};

const content = useTemplateRef('content');
const htmloptions = useTemplateRef<Array<HTMLLIElement>>('options');

const props = defineProps<Props<Option, ModelValueSingle>>();

const textInputWrapper = useTemplateRef<InstanceType<typeof TextInputWrapper>>('textInputWrapper');

const emit = defineEmits<{
  'option:select': [Option];
  'option:add': [Option];
  'option:remove': [Option];
}>();

const isDisabled = computed(() => props.disabled || props.isLoading);

const id = useId();

const placeholder = computed(() => props.placeholder ?? t('selectAnOption'));

const { t } = useI18n({ useScope: 'local' });

const indexHighLighted = ref(0);

const optionsFiltered = computed(() => {
  if (!modelSearch.value.length) {
    return props.options;
  }

  const modelSearchLowerCased = modelSearch.value.toLowerCase();

  return props.options.filter((option) => optionToText(option).toLowerCase().includes(modelSearchLowerCased));
});

const optionToText = (option: Option) => props.optionToText?.(option) ?? _getOptionLikeText(option);
const optionToModelValue = (option: Option) => props.optionToModelValue?.(option) ?? (option as ModelValueSingle);
const selectedToText = (maybeOptionOrOptions: Option | Array<Option> | Nil) => {
  if (props.selectedToText) {
    return props.selectedToText?.(modelOptionSelected.value);
  }

  if (isNil(maybeOptionOrOptions)) {
    return '';
  }

  if (props.multiple) {
    return (maybeOptionOrOptions as Array<Option>).map(optionToText).join(', ');
  }

  return optionToText(maybeOptionOrOptions as Option);
};

const textSelected = computed(() =>
  selectedToText(props.multiple ? props.options.filter(isOptionSelected) : props.options.find(isOptionSelected)),
);

const isOptionSelected = (option: Option) => {
  if (props.isOptionSelected) {
    return props.isOptionSelected(option);
  }

  const optionValue = optionToModelValue(option);

  return props.multiple
    ? (model.value as ModelValueArrayed).some((modelValueSingle) => isEqual(optionValue, modelValueSingle))
    : isEqual(optionValue, model.value);
};

const model = defineModel<ModelValue>();
const modelSearch = defineModel<string>('search', { default: '' });

const modelOptionSelected = ref<Option | Array<Option> | null>();

const tippy = useTemplateRef<TippyComponent>('tippy');

const onShow = () => {
  indexHighLighted.value = 0;
};

const onHidden = () => {
  modelSearch.value = selectedToText(modelOptionSelected.value);
};

const isShown = computed(() => Boolean(tippy.value?.state.isShown));

const onMouseEnter = (index: number) => {
  indexHighLighted.value = index;
};

const show = () => tippy.value?.show();
const hide = () => tippy.value?.hide();

const onClickOutside = hide;

const textInputBase = useTemplateRef('textInputBase');

const { width } = useElementSize(textInputBase as MaybeComputedElementRef, undefined, { box: 'border-box' });

const onClickOption = (option: Option) => {
  if (option && typeof option === 'object' && '_onClick' in option && typeof option._onClick === 'function') {
    option._onClick();

    return nextTick(hide);
  }

  if (!content.value) {
    return;
  }

  if (!props.multiple) {
    model.value = optionToModelValue(option) as ModelValue;
    emit('option:select', option);

    return nextTick(() => {
      hide();
      textInputBase.value?.blur();
    });
  }

  const optionValue = optionToModelValue(option);

  const maybeIndex = (model.value as ModelValueArrayed).findIndex((modelValueSingle) =>
    isEqual(optionValue, modelValueSingle),
  );

  if (maybeIndex === -1) {
    (model.value as ModelValueArrayed).push(optionValue);
    emit('option:add', option);
  } else {
    (model.value as ModelValueArrayed).splice(maybeIndex, 1);
    emit('option:remove', option);
  }

  textInputBase.value?.focus();

  const { scrollTop } = content.value;

  nextTick(() => {
    if (!content.value) {
      return;
    }

    content.value.scrollTop = scrollTop;
  });
};

const onKeydownUp = () => {
  if (indexHighLighted.value < 1) {
    return;
  }

  indexHighLighted.value--;
};

const onKeydownDown = () => {
  if (indexHighLighted.value > optionsFiltered.value.length - 2) {
    return;
  }

  indexHighLighted.value++;
};

const onKeydownEnter = () => {
  const maybeOption = optionsFiltered.value[indexHighLighted.value];

  if (!maybeOption) {
    return;
  }

  onClickOption(maybeOption);
};

const onKeydownTab = hide;

const onFocus = () => {
  if (props.readonly) {
    return;
  }

  modelSearch.value = '';

  show();
};

const onUpdateTextInputValue: InstanceType<typeof TextInputBase>['onUpdate:modelValue'] = (value) => {
  modelSearch.value = value ?? '';
};

watch(
  [model, () => props.options],
  () => {
    modelOptionSelected.value = props.multiple
      ? props.options.filter(isOptionSelected)
      : props.options.find(isOptionSelected);

    if (props.multiple && isShown.value) {
      modelSearch.value = '';

      return;
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

watchEffect(() => {
  htmloptions.value?.[indexHighLighted.value]?.scrollIntoView({ block: 'nearest' });
});
</script>

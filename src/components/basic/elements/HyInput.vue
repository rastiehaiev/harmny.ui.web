<template>
  <input
      :disabled="disable"
      :type="inputType"
      :placeholder="inputPlaceholder"
      :style="{ '--hy-font-size': fontSize, '--hy-font-weight': fontWeight, '--hy-border-color': (errorCode ? 'var(--color-red-3)' : 'var(--color-gray-1)'), '--hy-border-color-focus': (errorCode ? 'var(--color-red-3)' : 'var(--color-link)') }"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('validate', modelValue)"
  />
  <h5 v-if="errorCode">{{ resolveMessage() }}</h5>
</template>

<script>
import messageResolver from "@/utils/message-resolver";

export default {
  emits: ['update:modelValue', 'validate'],
  props: {
    disable: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
    },
    inputType: {
      type: String,
    },
    inputPlaceholder: {
      type: String,
      default: '',
    },
    fontSize: {
      type: String,
      default: '',
    },
    fontWeight: {
      type: String,
      default: '',
    },
    errorCode: {
      type: String,
    },
  },
  data() {
    return {
      inputValue: '',
    };
  },
  methods: {
    resolveMessage() {
      if (!this.errorCode) {
        return undefined;
      }
      return messageResolver.resolveByCode(this.errorCode);
    },
  },
};
</script>

<style scoped>
input {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  appearance: none;
  background: none;
  border-radius: 0;
  outline: none;

  width: 100%;
  padding: 0.6rem;
  font-family: Inter, Helvetica, monospace;
  font-size: var(--hy-font-weight, 1rem);
  font-weight: var(--hy-font-size, 300);
  border: 1px solid var(--hy-border-color);
}

input:focus {
  border: 1px solid var(--hy-border-color-focus);
}

h5 {
  color: var(--color-red-3);
  font-size: 0.8rem;
  font-weight: 350;
}
</style>

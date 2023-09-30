<template>
  <input
    type="submit"
    :value="value"
    :style="{
      '--hy-font-size': fontSize,
      '--hy-font-weight': fontWeight,
      '--hy-bg-color': backgroundColor,
      '--hy-bg-color-focus': backgroundColorFocus,
      '--hy-bg-color-active': backgroundColorActive,
    }"
  />
</template>

<script>
import buttonThemes from '@/themes/button-themes.js'

export default {
  props: {
    value: {
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
    theme: {
      type: String,
      default: 'orange1',
    },
  },
  data() {
    let themeConfig = buttonThemes[this.theme]
    if (!themeConfig) {
      themeConfig = buttonThemes.orange1
    }
    return {
      backgroundColor: themeConfig.backgroundColor,
      backgroundColorFocus: themeConfig.backgroundColorFocus,
      backgroundColorActive: themeConfig.backgroundColorActive,
    }
  },
}
</script>

<style scoped>
input {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  appearance: none;
  outline: none;

  width: 100%;
  padding: 0.6rem;
  font-family: Inter, Helvetica, monospace;
  font-size: var(--hy-font-weight, 1rem);
  font-weight: var(--hy-font-size, 300);
  border-radius: 4px;

  align-items: center;
  background: var(--hy-bg-color) none;
  border: 1px solid transparent;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  transition: all 250ms;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  margin: 0;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
}

input:hover,
input:focus {
  background-color: var(--hy-bg-color-focus);
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
}

input:active {
  background-color: var(--hy-bg-color-active);
  box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
}
</style>

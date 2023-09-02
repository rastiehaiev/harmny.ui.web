<template>
    <div class="hy-menu__container">
        <div @click.prevent="toggleMenu" ref="actuator" class="hy-menu__actuator-area">
            <slot name="actuator"></slot>
        </div>
        <Teleport to="#teleport-area" v-if="menuDisplay">
            <OnClickOutside @trigger="closeMenu" :options="{ignore: [this.$refs.actuator]}">
                <div class="hy-menu__menu-area"
                     ref="menuArea"
                     @click="closeMenu"
                     :style="{'top': toPx(menuCoordTop), 'right': toPx(menuCoordRight), 'bottom': toPx(menuCoordBottom), 'left': toPx(menuCoordLeft)}">
                    <slot name="menu-area"></slot>
                </div>
            </OnClickOutside>
        </Teleport>
    </div>
</template>

<script>
import {OnClickOutside} from '@vueuse/components';

export default {
    name: 'hy-menu',
    components: {OnClickOutside},
    props: {
        stickTo: {
            type: String,
            default: 'right-top',
        },
        iconSize: {
            type: String,
            default: 'icon-size-a',
        },
    },
    data() {
        return {
            actuatorCoordX: undefined,
            actuatorCoordY: undefined,
            menuCoordTop: undefined,
            menuCoordRight: undefined,
            menuCoordBottom: undefined,
            menuCoordLeft: undefined,
            menuDisplay: false,
            menuOpacity: 0,
        }
    },
    methods: {
        closeMenu() {
            this.menuDisplay = false;
            this.menuOpacity = 0;
        },
        toggleMenu() {
            this.menuOpacity = 0;
            this.menuDisplay = !this.menuDisplay;
            if (this.menuDisplay) {
                this.$nextTick(() => {
                    const actuatorCoordinates = this.$refs.actuator.getBoundingClientRect();
                    if (actuatorCoordinates.x !== this.actuatorCoordX || actuatorCoordinates.y !== this.actuatorCoordY) {
                        this.actuatorCoordX = actuatorCoordinates.x;
                        this.actuatorCoordY = actuatorCoordinates.y;

                        const menuAreaCoordinates = this.$refs.menuArea.getBoundingClientRect();
                        const {top, right, bottom, left} = this.calculateMenuCoordinates(actuatorCoordinates, menuAreaCoordinates);
                        this.menuCoordTop = top;
                        this.menuCoordRight = right;
                        this.menuCoordBottom = bottom;
                        this.menuCoordLeft = left;
                    }
                });
                this.menuOpacity = 100;
            }
        },
        calculateMenuCoordinates(actuatorRect, menuAreaRect) {
            let top = undefined;
            let right = undefined;
            let bottom = undefined;
            let left = undefined;

            const viewportHeight = window.innerHeight;
            if (this.stickTo.startsWith("right")) {
                left = actuatorRect.x + actuatorRect.width;
            } else if (this.stickTo.startsWith("left")) {
                left = actuatorRect.left - menuAreaRect.width;
            }
            if (this.stickTo.endsWith('top')) {
                if (actuatorRect.bottom / viewportHeight > 0.8) {
                    // will stick to bottom instead of top
                    bottom = viewportHeight - actuatorRect.bottom;
                } else {
                    top = actuatorRect.y;
                }
            } else if (this.stickTo.endsWith('bottom')) {
                if (actuatorRect.top / viewportHeight < 0.1) {
                    // will stick to top instead of bottom
                    top = actuatorRect.y;
                } else {
                    bottom = viewportHeight - actuatorRect.bottom;
                }
            }
            return {top, right, bottom, left};
        },
        toPx(value) {
            return value ? `${value}px` : undefined;
        },
    },
}
</script>

<style scoped>
.hy-menu__actuator-area {
    display: flex;
    cursor: pointer;
}

.hy-menu__menu-area {
    position: absolute;
    display: flex;
    z-index: 100;
    padding: 0.5rem 0;
    background-color: white;
    box-shadow: rgba(12, 12, 13, 0.1) 0 0.3rem 0.8rem 0.2rem;
}
</style>

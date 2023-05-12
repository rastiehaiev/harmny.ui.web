<template>
    <div class="hy-tooltip-target" ref="tooltipTarget">
        <slot name="target"></slot>
    </div>
    <Teleport to="#teleport-area" v-if="!!messageCode">
        <div class="hy-tooltip-container"
             ref="tooltipContainer"
             :style="{'top': toPx(tooltipCoordinates.top), 'right': toPx(tooltipCoordinates.right), 'bottom': toPx(tooltipCoordinates.bottom), 'left': toPx(tooltipCoordinates.left), 'opacity': tooltipStyles.opacity, '--text-color': tooltipStyles.textColor, '--border-color': tooltipStyles.borderColor,}">
            {{ resolveMessage() }}
        </div>
    </Teleport>
</template>

<script>
import messageResolver from "@/utils/message-resolver";

export default {
    name: 'hy-tooltip',
    props: {
        messageCode: {
            type: String,
        },
        isError: {
            type: Boolean,
            default: false,
        },
        stickTo: {
            type: String,
            default: 'top-right',
        },
    },
    data() {
        return {
            tooltipStyles: {
                textColor: 'var(--color-red-2)',
                borderColor: 'var(--color-red-1)',
                opacity: undefined,
            },
            tooltipCoordinates: {
                top: undefined,
                right: undefined,
                bottom: undefined,
                left: undefined,
            },
        };
    },
    methods: {
        toPx(value) {
            if (!value) {
                return undefined;
            }
            return `${value}px`;
        },
        resolveMessage() {
            if (!this.messageCode) {
                return undefined;
            }
            return messageResolver.resolveByCode(this.messageCode);
        },
        refreshTooltipStyles() {
            if (!this.isError) {
                this.tooltipStyles.textColor = 'var(--color-gray-3)';
                this.tooltipStyles.borderColor = 'var(--color-gray-0)';
            }
        },
        refreshTooltipCoordinates() {
            const tooltipTargetRef = this.$refs.tooltipTarget;
            if (!tooltipTargetRef) {
                console.log('Tooltip target is undefined.');
                return undefined;
            }
            const tooltipTargetCoordinates = tooltipTargetRef.getBoundingClientRect();
            if (!tooltipTargetCoordinates) {
                console.log('Tooltip target coordinates is undefined.');
                return undefined;
            }

            const coordinates = this.calculateTooltipCoordinates(tooltipTargetRef, tooltipTargetCoordinates, this.stickTo);
            if (coordinates) {
                const {top, right, bottom, left} = coordinates;
                this.tooltipCoordinates.top = top;
                this.tooltipCoordinates.right = right;
                this.tooltipCoordinates.bottom = bottom;
                this.tooltipCoordinates.left = left;
                this.tooltipStyles.opacity = 1;
            }
        },
        calculateTooltipCoordinates(tooltipTargetRef, tooltipTargetCoordinates, stickTo) {
            const viewportHeight = window.innerHeight;
            if (stickTo === 'top-right') {
                if (tooltipTargetCoordinates.bottom / viewportHeight > 0.8) {
                    return this.calculateTooltipCoordinates(tooltipTargetRef, tooltipTargetCoordinates, 'bottom-right');
                }
                return {left: tooltipTargetCoordinates.right + 10, top: tooltipTargetCoordinates.top};
            } else if (stickTo === 'bottom-right') {
                if (tooltipTargetCoordinates.top / viewportHeight < 0.1) {
                    return this.calculateTooltipCoordinates(tooltipTargetRef, tooltipTargetCoordinates, 'top-right');
                }
                return {
                    left: tooltipTargetCoordinates.right + 10,
                    bottom: viewportHeight - tooltipTargetCoordinates.bottom
                };
            }
            console.log(`Unsupported 'stickTo' value: ${stickTo}.`);
            return undefined;
        },
    },
    watch: {
        messageCode(newValue, oldValue) {
            if (!oldValue && !!newValue) {
                this.$nextTick(() => {
                    this.refreshTooltipStyles();
                    this.refreshTooltipCoordinates();
                })
            }
        },
    },
}
</script>

<style scoped>
.hy-tooltip-container {
    position: absolute;
    opacity: 0;
    display: flex;
    max-width: 15rem;
    z-index: 50;
    font-size: 0.9rem;
    padding: 0.5rem 0.8rem;
    background-color: white;
    color: var(--text-color);
    border: 1px solid var(--border-color);
}
</style>

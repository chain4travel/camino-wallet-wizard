<!-- <template>
    <div class="v-checkbox">
        <div class="v-checkbox__input">
            <input type="checkbox" v-model="checked" id="checkbox" />
            <div
                class="v-checkbox__background"
                :class="{ 'v-checkbox__background--checked': checked }"
            >
                <svg viewBox="0 0 24 24" class="v-checkbox__check">
                    <path d="M1.73,12.91 8.1,19.28 22.79,4.59" v-if="checked"></path>
                </svg>
            </div>
        </div>
        <label for="checkbox" class="v-checkbox__label">{{ label }}</label>
    </div>
</template>

<script>
export default {
    data() {
        return {
            checked: false,
            label: 'Check me',
        }
    },
}
</script>

<style scoped>
.v-checkbox {
    display: inline-flex;
    align-items: center;
}

.v-checkbox__input {
    position: relative;
    width: 24px;
    height: 24px;
}

.v-checkbox__input input {
    display: none;
}

.v-checkbox__background {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid #3f51b5;
    border-radius: 2px;
    transition: background-color 0.3s ease;
}

.v-checkbox__background--checked {
    background-color: #3f51b5;
}

.v-checkbox__check {
    position: absolute;
    fill: none;
    stroke: white;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 70;
    stroke-dashoffset: 70;
    transition: stroke-dashoffset 0.3s ease;
}

.v-checkbox__background--checked .v-checkbox__check {
    stroke-dashoffset: 0;
}

.v-checkbox__label {
    margin-left: 32px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.87);
}
</style> -->

<!-- <template>
    <v-simple-checkbox
        :label="explain"
        :value="value"
        @input="$emit('input', $event.target.value)"
        @change="change"
        class="checkbox"
    />
</template>
<script>
export default {
    props: {
        value: Boolean,
        explain: {
            type: String,
            default: 'Back up your mnemonic keyphrase!',
        },
    },
    model: {
        prop: 'value',
        event: 'change',
    },
    methods: {
        change() {
            this.$emit('change', this.value)
        },
    },
}
</script>

<style lang="scss">
.checkbox {
    .v-label {
        color: var(--primary-color);
    }

    .v-input--selection-controls__input {
        > * {
            color: var(--primary-color) !important;
        }
    }

    .v-input--selection-controls__ripple {
        color: var(--secondary-color) !important;
    }
}
</style> -->

<template>
    <div>
        <v-checkbox :label="explain" v-model="localValue" @change="change" class="checkbox" />
    </div>
</template>
<script>
export default {
    props: {
        value: Boolean,
        explain: {
            type: String,
            default: 'Back up your mnemonic keyphrase!',
        },
    },
    data() {
        return {
            localValue: this.value,
        }
    },
    model: {
        prop: 'value',
        event: 'change',
    },
    methods: {
        change() {
            this.$emit('change', this.localValue)
        },
    },
}
</script>

<style lang="scss" scoped>
@use "../../styles/main";

.checkbox {
    .v-label {
        color: var(--primary-color);
    }

    .v-input--selection-controls__input {
        > * {
            color: var(--primary-color) !important;
        }
    }

    .v-input--selection-controls__ripple {
        color: var(--secondary-color) !important;
    }
}
</style>

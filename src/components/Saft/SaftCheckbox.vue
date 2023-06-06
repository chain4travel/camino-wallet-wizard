<template>
    <v-checkbox
        :label="explain"
        v-model="localValue"
        @change="change"
        class="checkbox"
    ></v-checkbox>
</template>
<script>
export default {
    props: {
        value: Boolean,
        explain: {
            type: String,
            default:
                'I agree that Chain4Travel AG may use my info only for creation of SAFT aggrement',
        },
        required: {
            type: Boolean,
            default: false,
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

<style lang="scss">
@use '../../styles/main';

.checkbox {
    .v-input__slot {
        background-color: transparent !important;
    }
    .v-messages {
        display: none;
    }
    .v-label {
        font-size: 12px;
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

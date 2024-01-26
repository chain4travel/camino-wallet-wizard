<template>
    <div class="checkbox">
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

<style scoped lang="scss">
@use '../../styles/abstracts/mixins';
@include mixins.mobile-device {
    .v-input--selection-controls {
        margin-top: 0px !important;
    }
}
</style>

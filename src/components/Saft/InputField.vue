<template>
    <div class="input_box">
        <label>
            {{ label }} :
            <sup v-if="required">&#42;</sup>
        </label>
        <input
            class="single_line_input hover_border"
            type="text"
            v-model="value"
            :placeholder="placeholder"
        />
        <div class="secondary_text">
            <small class="error_message" v-if="error_value">{{ error_message }}</small>
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    props: {
        label: {
            type: String,
            default: 'Name',
        },
        error_value: {
            type: Boolean,
            default: false,
        },
        error_message: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '',
        },
        required: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            value: '',
        }
    },
    watch: {
        value: function (val: string | boolean) {
            //@ts-ignore
            this.$emit('change', { value: val, type: this.label.toLowerCase() })
        },
    },
}
</script>
<style scoped lang="scss">
label {
    color: var(--primary-color);
    font-size: 15px;
    margin-bottom: 4px !important;
    sup {
        color: var(--error);
    }
}
input,
select {
    background-color: var(--bg-light) !important;
    border-radius: 8px !important;
    margin-top: 4px;
}

.input_box {
    text-align: left;
    align-items: center;
    .secondary_text {
        display: flex;
        flex-direction: column;
        margin-top: 4px;
        .small_text {
            color: var(--secondary-color);
        }
    }
    .error_message {
        color: var(--error);
    }
}
</style>

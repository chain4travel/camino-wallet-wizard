<template>
    <p>
        By using this application you agree to the
        <router-link to="/legal">Terms of Use</router-link>
        .
    </p>
</template>
<script lang="ts">
export default {}
</script>
<style scoped lang="scss">
p {
    color: var(--primary-color-light);
    font-size: 13px;
}
a {
    color: var(--primary-color) !important;
}
</style>

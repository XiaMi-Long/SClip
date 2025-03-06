<template>
    <label class="v-switch">
        <input type="checkbox" :checked="modelValue" @change="handleChange">
        <span class="slider"></span>
    </label>
</template>

<script lang="ts" setup>
defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

/**
 * 处理开关状态变化
 */
const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.checked)
    emit('change', target.checked)
}
</script>

<style lang="scss" scoped>
.v-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
    cursor: pointer;
}

.v-switch input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(var(--rgb-text-color, 0, 0, 0), 0.1);
    transition: 0.3s;
    border-radius: 13px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

input:checked + .slider {
    background-color: var(--accent-color, #4285f4);
}

input:focus + .slider {
    box-shadow: 0 0 1px var(--accent-color, #4285f4);
}

input:checked + .slider:before {
    transform: translateX(24px);
}
</style>
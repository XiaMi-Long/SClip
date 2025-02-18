<template>
  <div class="error-wrapper">
    <div class="error-icon">❌</div>
    <p>组件加载失败</p>
    <button @click="$emit('retry')">重试</button>
  </div>
</template>

<style scoped>
.error-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #dc3545;
}

button {
  margin-top: 10px;
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>

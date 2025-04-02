const firstShowTransitionMotion = {
  initial: {
    opacity: 0,
    y: 70
  },
  visibleOnce: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1e3,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
};
const formatDateTime = (timestamp) => {
  return new Date(timestamp).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};
export {
  formatDateTime as a,
  firstShowTransitionMotion as f
};

import { d as defineComponent, c as computed, b as createElementBlock, i as normalizeClass, l as createCommentVNode, e as createBaseVNode, t as toDisplayString, o as openBlock, _ as _export_sfc } from "./index-DFclwqs1.js";
const _hoisted_1 = {
  key: 0,
  class: "v-alert-icon"
};
const _hoisted_2 = { class: "icon" };
const _hoisted_3 = { class: "v-alert-content" };
const _hoisted_4 = {
  key: 0,
  class: "v-alert-title"
};
const _hoisted_5 = { class: "v-alert-message" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VAlert",
  props: {
    type: { default: "info" },
    title: { default: "" },
    message: {},
    closable: { type: Boolean, default: false },
    showIcon: { type: Boolean, default: true }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const typeIcon = computed(() => {
      switch (props.type) {
        case "success":
          return "✓";
        case "warning":
          return "⚠️";
        case "error":
          return "✕";
        case "info":
        default:
          return "ℹ";
      }
    });
    const typeClass = computed(() => {
      return `v-alert--${props.type}`;
    });
    const handleClose = () => {
      emit("close");
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["v-alert", typeClass.value])
      }, [
        _ctx.showIcon ? (openBlock(), createElementBlock("div", _hoisted_1, [
          createBaseVNode("span", _hoisted_2, toDisplayString(typeIcon.value), 1)
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_3, [
          _ctx.title ? (openBlock(), createElementBlock("div", _hoisted_4, toDisplayString(_ctx.title), 1)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_5, toDisplayString(_ctx.message), 1)
        ]),
        _ctx.closable ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: "v-alert-close",
          onClick: handleClose
        }, _cache[0] || (_cache[0] = [
          createBaseVNode("span", { class: "close-icon" }, "×", -1)
        ]))) : createCommentVNode("", true)
      ], 2);
    };
  }
});
const VAlert = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6619b72d"]]);
export {
  VAlert as V
};

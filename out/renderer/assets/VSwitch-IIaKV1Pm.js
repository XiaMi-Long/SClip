import { d as defineComponent, b as createElementBlock, e as createBaseVNode, o as openBlock, _ as _export_sfc } from "./index-DFclwqs1.js";
const _hoisted_1 = { class: "v-switch" };
const _hoisted_2 = ["checked"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VSwitch",
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleChange = (event) => {
      const target = event.target;
      emit("update:modelValue", target.checked);
      emit("change", target.checked);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("label", _hoisted_1, [
        createBaseVNode("input", {
          type: "checkbox",
          checked: __props.modelValue,
          onChange: handleChange
        }, null, 40, _hoisted_2),
        _cache[0] || (_cache[0] = createBaseVNode("span", { class: "slider" }, null, -1))
      ]);
    };
  }
});
const VSwitch = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-18e1c4b7"]]);
export {
  VSwitch as V
};

import { d as defineComponent, u as useI18nStore, r as ref, a as useConfigStore, c as computed, b as createElementBlock, e as createBaseVNode, t as toDisplayString, f as unref, F as Fragment, g as renderList, h as createVNode, w as withCtx, T as TransitionGroup, n as normalizeStyle, o as openBlock, i as normalizeClass, j as createStaticVNode, k as withDirectives, l as createCommentVNode, m as resolveDirective, _ as _export_sfc } from "./index-DFclwqs1.js";
const _hoisted_1 = { class: "theme-settings" };
const _hoisted_2 = { class: "settings-header" };
const _hoisted_3 = { class: "subtitle" };
const _hoisted_4 = { class: "theme-section" };
const _hoisted_5 = { class: "theme-options" };
const _hoisted_6 = ["onClick"];
const _hoisted_7 = { class: "theme-info" };
const _hoisted_8 = {
  key: 0,
  class: "check-icon-wrapper"
};
const _hoisted_9 = { class: "theme-name" };
const _hoisted_10 = { class: "accent-color-section" };
const _hoisted_11 = { class: "section-title" };
const _hoisted_12 = { class: "subtitle" };
const _hoisted_13 = { class: "color-options-container" };
const _hoisted_14 = ["onClick"];
const _hoisted_15 = { class: "custom-color-section" };
const _hoisted_16 = { class: "section-title" };
const _hoisted_17 = { class: "color-picker-container" };
const _hoisted_18 = ["value"];
const _hoisted_19 = { class: "color-value" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "theme",
  setup(__props) {
    const i18nStore = useI18nStore();
    const themes = [
      {
        id: "light",
        name: i18nStore.t("setting.theme.light"),
        description: i18nStore.t("setting.theme.lightDesc")
      },
      {
        id: "dark",
        name: i18nStore.t("setting.theme.dark"),
        description: i18nStore.t("setting.theme.darkDesc")
      },
      {
        id: "system",
        name: i18nStore.t("setting.theme.system"),
        description: i18nStore.t("setting.theme.systemDesc")
      }
    ];
    const solidColors = [
      { id: "blue", type: "solid", value: "#4285f4" },
      // 默认蓝色
      { id: "red", type: "solid", value: "#ea4335" },
      // 红色
      { id: "green", type: "solid", value: "#34a853" },
      // 绿色
      { id: "purple", type: "solid", value: "#8e44ad" },
      // 紫色
      { id: "orange", type: "solid", value: "#ff9800" },
      // 橙色
      { id: "teal", type: "solid", value: "#009688" },
      // 蓝绿色
      { id: "pink", type: "solid", value: "#e91e63" },
      // 粉色
      { id: "indigo", type: "solid", value: "#3f51b5" },
      // 靛蓝色
      // 添加新的单色
      { id: "color1", type: "solid", value: "#c5e3f6" },
      { id: "color2", type: "solid", value: "#fc5c9c" },
      { id: "color3", type: "solid", value: "#fccde2" },
      { id: "color4", type: "solid", value: "#fcefee" },
      { id: "color5", type: "solid", value: "#581b98" },
      { id: "color6", type: "solid", value: "#9c1de7" },
      { id: "color7", type: "solid", value: "#f3558e" },
      { id: "color8", type: "solid", value: "#faee1c" },
      { id: "color9", type: "solid", value: "#482ff7" },
      { id: "color10", type: "solid", value: "#2d6cdf" },
      { id: "color11", type: "solid", value: "#46c3db" },
      { id: "color12", type: "solid", value: "#f3f169" },
      { id: "color13", type: "solid", value: "#a7ff83" },
      { id: "color14", type: "solid", value: "#17b978" },
      { id: "color15", type: "solid", value: "#086972" },
      { id: "color16", type: "solid", value: "#085f63" }
    ];
    const checkIconMotion = {
      initial: { opacity: 0, scale: 0.6 },
      enter: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 500,
          ease: [0.215, 0.61, 0.355, 1]
        }
      }
    };
    const selectedTheme = ref(useConfigStore().getSetting.applicationTheme);
    const selectedApplicationPrimaryColor = ref(useConfigStore().getSetting.applicationPrimaryColor);
    const allColorOptions = computed(() => {
      const allColors = [...solidColors];
      const selectedColorIndex = allColors.findIndex((color) => {
        if (color.type === "solid") {
          return color.value === selectedApplicationPrimaryColor.value;
        }
        return false;
      });
      if (selectedColorIndex !== -1) {
        const selectedColor = allColors[selectedColorIndex];
        return [
          selectedColor,
          ...allColors.slice(0, selectedColorIndex),
          ...allColors.slice(selectedColorIndex + 1)
        ];
      }
      return allColors;
    });
    const selectTheme = async (themeId) => {
      console.log("selectTheme", themeId);
      selectedTheme.value = themeId;
      useConfigStore().setApplicationTheme(themeId);
    };
    const selectColor = (color) => {
      if (color.type === "solid") {
        selectedApplicationPrimaryColor.value = color.value;
        useConfigStore().setApplicationPrimaryColor(color.value);
      }
    };
    const isColorSelected = (color) => {
      if (color.type === "solid") {
        return color.value === selectedApplicationPrimaryColor.value;
      } else if (color.type === "gradient" && color.gradient) {
        return color.gradient.from === selectedApplicationPrimaryColor.value;
      }
      return false;
    };
    const handleColorInput = (e) => {
      const target = e.target;
      if (target && target.value) {
        selectColor({ type: "solid", value: target.value });
      }
    };
    return (_ctx, _cache) => {
      const _directive_motion = resolveDirective("motion");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("h2", null, toDisplayString(unref(i18nStore).t("setting.theme.title")), 1),
          createBaseVNode("p", _hoisted_3, toDisplayString(unref(i18nStore).t("setting.theme.subtitle")), 1)
        ]),
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", _hoisted_5, [
            (openBlock(), createElementBlock(Fragment, null, renderList(themes, (theme2) => {
              return createBaseVNode("div", {
                key: theme2.id,
                class: normalizeClass(["theme-card", { active: selectedTheme.value === theme2.id }]),
                onClick: ($event) => selectTheme(theme2.id)
              }, [
                createBaseVNode("div", {
                  class: normalizeClass(["theme-preview", theme2.id])
                }, _cache[0] || (_cache[0] = [
                  createStaticVNode('<div class="window-dots" data-v-e6032ba4><span data-v-e6032ba4></span><span data-v-e6032ba4></span><span data-v-e6032ba4></span></div><div class="window-content" data-v-e6032ba4><div class="content-block" data-v-e6032ba4></div><div class="content-layout" data-v-e6032ba4><div class="content-sidebar" data-v-e6032ba4></div><div class="content-main" data-v-e6032ba4><div class="content-item" data-v-e6032ba4></div><div class="content-item" data-v-e6032ba4></div></div></div></div>', 2)
                ]), 2),
                createBaseVNode("div", _hoisted_7, [
                  selectedTheme.value === theme2.id ? withDirectives((openBlock(), createElementBlock("div", _hoisted_8, _cache[1] || (_cache[1] = [
                    createBaseVNode("div", { class: "check-icon" }, "✓", -1)
                  ]))), [
                    [_directive_motion, checkIconMotion]
                  ]) : createCommentVNode("", true),
                  createBaseVNode("div", {
                    class: normalizeClass(["theme-text", { active: selectedTheme.value === theme2.id }])
                  }, [
                    createBaseVNode("div", _hoisted_9, toDisplayString(theme2.name), 1)
                  ], 2)
                ])
              ], 10, _hoisted_6);
            }), 64))
          ])
        ]),
        _cache[2] || (_cache[2] = createBaseVNode("div", { class: "divider" }, null, -1)),
        createBaseVNode("div", _hoisted_10, [
          createBaseVNode("div", _hoisted_11, [
            createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.theme.accentColor")), 1),
            createBaseVNode("p", _hoisted_12, toDisplayString(unref(i18nStore).t("setting.theme.accentColorDesc")), 1)
          ]),
          createBaseVNode("div", _hoisted_13, [
            createVNode(TransitionGroup, {
              name: "color-move",
              tag: "div",
              class: "color-options-wrapper"
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(allColorOptions.value, (color) => {
                  return openBlock(), createElementBlock("div", {
                    key: color.id,
                    class: normalizeClass(["color-card", { active: isColorSelected(color) }]),
                    onClick: ($event) => selectColor(color)
                  }, [
                    createBaseVNode("div", {
                      class: "color-preview",
                      style: normalizeStyle({ background: color.value })
                    }, null, 4)
                  ], 10, _hoisted_14);
                }), 128))
              ]),
              _: 1
            })
          ]),
          createBaseVNode("div", _hoisted_15, [
            createBaseVNode("div", _hoisted_16, [
              createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.theme.customAccentColor")), 1)
            ]),
            createBaseVNode("div", _hoisted_17, [
              createBaseVNode("input", {
                type: "color",
                class: "color-input",
                value: selectedApplicationPrimaryColor.value,
                onInput: handleColorInput
              }, null, 40, _hoisted_18),
              createBaseVNode("div", {
                class: "color-preview-large",
                style: normalizeStyle({ background: selectedApplicationPrimaryColor.value })
              }, null, 4),
              createBaseVNode("div", _hoisted_19, toDisplayString(selectedApplicationPrimaryColor.value), 1)
            ])
          ])
        ])
      ]);
    };
  }
});
const theme = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e6032ba4"]]);
export {
  theme as default
};

import { V as VSwitch } from "./VSwitch-IIaKV1Pm.js";
import { d as defineComponent, a as useConfigStore, u as useI18nStore, c as computed, r as ref, k as withDirectives, m as resolveDirective, f as unref, b as createElementBlock, e as createBaseVNode, C as createBlock, l as createCommentVNode, t as toDisplayString, o as openBlock, M as Message, _ as _export_sfc } from "./index-DFclwqs1.js";
import { f as firstShowTransitionMotion } from "./common.fun-D5HpNzqn.js";
import { V as VAlert } from "./VAlert-0zT-QagG.js";
const _hoisted_1 = { class: "fun-settings" };
const _hoisted_2 = { class: "settings-header" };
const _hoisted_3 = { class: "subtitle" };
const _hoisted_4 = { class: "mac-statusbar-section" };
const _hoisted_5 = { class: "section-title" };
const _hoisted_6 = { class: "subtitle" };
const _hoisted_7 = { class: "statusbar-preview" };
const _hoisted_8 = { class: "statusbar-preview__container" };
const _hoisted_9 = { class: "statusbar-preview__content" };
const _hoisted_10 = { class: "statusbar-preview__windows" };
const _hoisted_11 = { class: "statusbar-title" };
const _hoisted_12 = { class: "statusbar-preview__mac" };
const _hoisted_13 = { class: "statusbar-title" };
const _hoisted_14 = { class: "statusbar-toggle" };
const _hoisted_15 = { class: "statusbar-toggle__info" };
const _hoisted_16 = { class: "statusbar-toggle__title" };
const _hoisted_17 = { class: "statusbar-toggle__description" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "fun",
  setup(__props) {
    const configStore = useConfigStore();
    const i18nStore = useI18nStore();
    const isWindows = computed(() => !configStore.setting.system?.isMac);
    const forceMacStatusBar = ref(configStore.setting.forceMacStatusBar || false);
    const toggleMacStatusBar = (value) => {
      forceMacStatusBar.value = value;
      saveMacStatusBarSetting(value);
    };
    const saveMacStatusBarSetting = (value) => {
      configStore.setForceMacStatusBar(value);
      Message.success({
        title: i18nStore.t("common.save"),
        message: i18nStore.t("setting.fun.saveSuccess"),
        duration: 2e3
      });
    };
    const enableFirstShowTransition = firstShowTransitionMotion;
    return (_ctx, _cache) => {
      const _directive_motion = resolveDirective("motion");
      return withDirectives((openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("h2", null, toDisplayString(unref(i18nStore).t("setting.fun.title")), 1),
          createBaseVNode("p", _hoisted_3, toDisplayString(unref(i18nStore).t("setting.fun.subtitle")), 1)
        ]),
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.fun.macStatusBar")), 1),
            createBaseVNode("p", _hoisted_6, toDisplayString(unref(i18nStore).t("setting.fun.macStatusBarDesc")), 1)
          ]),
          createBaseVNode("div", _hoisted_7, [
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("div", _hoisted_9, [
                createBaseVNode("div", _hoisted_10, [
                  createBaseVNode("div", _hoisted_11, toDisplayString(unref(i18nStore).t("setting.fun.windowsStyle")), 1),
                  _cache[1] || (_cache[1] = createBaseVNode("div", { class: "windows-controls" }, [
                    createBaseVNode("div", { class: "control minimize" }, "—"),
                    createBaseVNode("div", { class: "control maximize" }, "□"),
                    createBaseVNode("div", { class: "control close" }, "×")
                  ], -1))
                ]),
                createBaseVNode("div", _hoisted_12, [
                  createBaseVNode("div", _hoisted_13, toDisplayString(unref(i18nStore).t("setting.fun.macStyle")), 1),
                  _cache[2] || (_cache[2] = createBaseVNode("div", { class: "mac-controls" }, [
                    createBaseVNode("div", { class: "control close" }),
                    createBaseVNode("div", { class: "control minimize" }),
                    createBaseVNode("div", { class: "control maximize" })
                  ], -1))
                ])
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_14, [
            createBaseVNode("div", _hoisted_15, [
              createBaseVNode("div", _hoisted_16, toDisplayString(unref(i18nStore).t("setting.fun.enableMacStatusBar")), 1),
              createBaseVNode("div", _hoisted_17, toDisplayString(unref(i18nStore).t("setting.fun.restartRequired")), 1)
            ]),
            isWindows.value ? (openBlock(), createBlock(unref(VSwitch), {
              key: 0,
              modelValue: forceMacStatusBar.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => forceMacStatusBar.value = $event),
              onChange: toggleMacStatusBar
            }, null, 8, ["modelValue"])) : createCommentVNode("", true)
          ])
        ]),
        !isWindows.value ? (openBlock(), createBlock(unref(VAlert), {
          key: 0,
          "show-icon": true,
          type: "warning",
          title: unref(i18nStore).t("setting.fun.noteTitle"),
          message: unref(i18nStore).t("setting.fun.macSystemNote"),
          class: "clipboard-alert"
        }, null, 8, ["title", "message"])) : createCommentVNode("", true)
      ])), [
        [_directive_motion, unref(enableFirstShowTransition)]
      ]);
    };
  }
});
const fun = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e03d2d04"]]);
export {
  fun as default
};

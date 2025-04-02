import { d as defineComponent, u as useI18nStore, c as computed, b as createElementBlock, e as createBaseVNode, t as toDisplayString, f as unref, F as Fragment, g as renderList, o as openBlock, i as normalizeClass, n as normalizeStyle, k as withDirectives, l as createCommentVNode, x as isDarkMode, a as useConfigStore, M as Message, y as useCssVars, m as resolveDirective, _ as _export_sfc, h as createVNode, r as ref, z as watch, A as vModelText, B as createTextVNode, s as onMounted } from "./index-DFclwqs1.js";
import { V as VSwitch } from "./VSwitch-IIaKV1Pm.js";
import { f as firstShowTransitionMotion } from "./common.fun-D5HpNzqn.js";
import { V as VAlert } from "./VAlert-0zT-QagG.js";
const SettingPreviewDark = "" + new URL("setting-preview-dark-DfCkP1MK.jpg", import.meta.url).href;
const _hoisted_1$7 = { class: "image-display-section" };
const _hoisted_2$7 = { class: "section-title" };
const _hoisted_3$7 = { class: "subtitle" };
const _hoisted_4$7 = { class: "display-mode-options" };
const _hoisted_5$7 = ["onClick"];
const _hoisted_6$6 = { class: "display-preview" };
const _hoisted_7$6 = ["src", "alt"];
const _hoisted_8$5 = { class: "mode-info" };
const _hoisted_9$5 = {
  key: 0,
  class: "check-icon-wrapper"
};
const _hoisted_10$5 = { class: "mode-name" };
const _hoisted_11$4 = { class: "mode-description" };
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "ImageDisplaySection",
  props: {
    displayMode: {}
  },
  emits: ["update:displayMode"],
  setup(__props, { emit: __emit }) {
    useCssVars((_ctx) => ({
      "0a5edbc0": getDisplayModeFit("auto")
    }));
    const i18nStore = useI18nStore();
    const props = __props;
    const emit = __emit;
    const displayModeImage = computed(() => {
      return SettingPreviewDark;
    });
    const displayModes = [
      {
        id: "auto",
        name: i18nStore.t("setting.sclip.image.autoSelect"),
        description: i18nStore.t("setting.sclip.image.autoSelectDesc")
      },
      {
        id: "contain",
        name: i18nStore.t("setting.sclip.image.fullDisplay"),
        description: i18nStore.t("setting.sclip.image.fullDisplayDesc")
      },
      {
        id: "cover",
        name: i18nStore.t("setting.sclip.image.cropFill"),
        description: i18nStore.t("setting.sclip.image.cropFillDesc")
      }
    ];
    const selectedDisplayMode = computed({
      get: () => props.displayMode,
      set: (value) => emit("update:displayMode", value)
    });
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
    const getDisplayModeFit = (modeId) => {
      if (modeId !== "auto") {
        return modeId;
      }
      return isDarkMode.value ? "cover" : "contain";
    };
    const selectDisplayMode = (modeId) => {
      selectedDisplayMode.value = modeId;
      useConfigStore().setImageSettings({
        displayMode: modeId
      });
      Message.success({
        title: i18nStore.t("common.save"),
        message: i18nStore.t("setting.sclip.image.saveSuccess"),
        duration: 2e3
      });
    };
    return (_ctx, _cache) => {
      const _directive_motion = resolveDirective("motion");
      return openBlock(), createElementBlock("div", _hoisted_1$7, [
        createBaseVNode("div", _hoisted_2$7, [
          createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.sclip.image.displayMode")), 1),
          createBaseVNode("p", _hoisted_3$7, toDisplayString(unref(i18nStore).t("setting.sclip.image.displayModeDesc")), 1)
        ]),
        createBaseVNode("div", _hoisted_4$7, [
          (openBlock(), createElementBlock(Fragment, null, renderList(displayModes, (mode) => {
            return createBaseVNode("div", {
              key: mode.id,
              class: normalizeClass(["display-mode-card", { active: selectedDisplayMode.value === mode.id }]),
              onClick: ($event) => selectDisplayMode(mode.id)
            }, [
              createBaseVNode("div", _hoisted_6$6, [
                createBaseVNode("img", {
                  class: normalizeClass(["preview-image", "preview-image-" + mode.id]),
                  src: displayModeImage.value,
                  alt: `${mode.name} ${unref(i18nStore).t("setting.sclip.image.preview")}`,
                  style: normalizeStyle({ objectFit: getDisplayModeFit(mode.id) })
                }, null, 14, _hoisted_7$6)
              ]),
              createBaseVNode("div", _hoisted_8$5, [
                selectedDisplayMode.value === mode.id ? withDirectives((openBlock(), createElementBlock("div", _hoisted_9$5, _cache[0] || (_cache[0] = [
                  createBaseVNode("div", { class: "check-icon" }, "✓", -1)
                ]))), [
                  [_directive_motion, checkIconMotion]
                ]) : createCommentVNode("", true),
                createBaseVNode("div", {
                  class: normalizeClass(["mode-text", { active: selectedDisplayMode.value === mode.id }])
                }, [
                  createBaseVNode("div", _hoisted_10$5, toDisplayString(mode.name), 1),
                  createBaseVNode("div", _hoisted_11$4, toDisplayString(mode.description), 1)
                ], 2)
              ])
            ], 10, _hoisted_5$7);
          }), 64))
        ])
      ]);
    };
  }
});
const ImageDisplaySection = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-f7aa61b2"]]);
const _hoisted_1$6 = { class: "animation-section" };
const _hoisted_2$6 = { class: "section-title" };
const _hoisted_3$6 = { class: "subtitle" };
const _hoisted_4$6 = { class: "animation-preview" };
const _hoisted_5$6 = { class: "preview-container" };
const _hoisted_6$5 = ["src", "alt"];
const _hoisted_7$5 = { class: "toggle-option" };
const _hoisted_8$4 = { class: "option-info" };
const _hoisted_9$4 = { class: "option-title" };
const _hoisted_10$4 = { class: "option-description" };
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "AnimationSection",
  props: {
    enableAnimation: { type: Boolean }
  },
  emits: ["update:enableAnimation"],
  setup(__props, { emit: __emit }) {
    const i18nStore = useI18nStore();
    const props = __props;
    const emit = __emit;
    const enableImageAnimation = computed({
      get: () => props.enableAnimation,
      set: (value) => emit("update:enableAnimation", value)
    });
    const getRandomPosition = () => Math.random() * 30 - 25;
    const imgMotion = {
      initial: {
        scale: 1.1,
        x: 0,
        y: 0
      },
      visible: {
        scale: 1.1,
        x: getRandomPosition(),
        y: getRandomPosition(),
        transition: {
          duration: 6e3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }
    };
    const enableFirstShowTransition = firstShowTransitionMotion;
    const toggleImageAnimation = (value) => {
      enableImageAnimation.value = value;
      useConfigStore().setImageSettings({
        enableAnimation: value
      });
      Message.success({
        title: i18nStore.t("common.save"),
        message: i18nStore.t("setting.sclip.animation.saveSuccess"),
        duration: 2e3
      });
    };
    return (_ctx, _cache) => {
      const _directive_motion = resolveDirective("motion");
      return withDirectives((openBlock(), createElementBlock("div", _hoisted_1$6, [
        createBaseVNode("div", _hoisted_2$6, [
          createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.sclip.animation.title")), 1),
          createBaseVNode("p", _hoisted_3$6, toDisplayString(unref(i18nStore).t("setting.sclip.animation.subtitle")), 1)
        ]),
        createBaseVNode("div", _hoisted_4$6, [
          createBaseVNode("div", _hoisted_5$6, [
            withDirectives(createBaseVNode("img", {
              src: unref(SettingPreviewDark),
              alt: unref(i18nStore).t("setting.sclip.animation.preview"),
              class: "preview-image-animation"
            }, null, 8, _hoisted_6$5), [
              [_directive_motion, imgMotion]
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_7$5, [
          createBaseVNode("div", _hoisted_8$4, [
            createBaseVNode("div", _hoisted_9$4, toDisplayString(unref(i18nStore).t("setting.sclip.animation.enableAnimation")), 1),
            createBaseVNode("div", _hoisted_10$4, toDisplayString(unref(i18nStore).t("setting.sclip.animation.enableAnimationDesc")), 1)
          ]),
          createVNode(unref(VSwitch), {
            modelValue: enableImageAnimation.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => enableImageAnimation.value = $event),
            onChange: toggleImageAnimation
          }, null, 8, ["modelValue"])
        ])
      ])), [
        [_directive_motion, unref(enableFirstShowTransition)]
      ]);
    };
  }
});
const AnimationSection = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-bd371492"]]);
const _hoisted_1$5 = { class: "wakeup-section" };
const _hoisted_2$5 = { class: "section-title" };
const _hoisted_3$5 = { class: "subtitle" };
const _hoisted_4$5 = { class: "wakeup" };
const _hoisted_5$5 = { class: "wakeup__preview" };
const _hoisted_6$4 = { class: "wakeup__preview__container" };
const _hoisted_7$4 = { class: "wakeup__preview__container__cards" };
const _hoisted_8$3 = { class: "wakeup__preview__container__cards__list" };
const _hoisted_9$3 = { class: "wakeup__preview__container__cards__list__item" };
const _hoisted_10$3 = { class: "wakeup__preview__container__cards__list__item" };
const _hoisted_11$3 = { class: "wakeup__preview__container__cards__list__item" };
const _hoisted_12$3 = { class: "wakeup__preview__container__cards__list__item" };
const _hoisted_13$3 = { class: "wakeup__preview__container__cards__list__item" };
const _hoisted_14$3 = { class: "wakeup__preview__container__cards__list__item" };
const _hoisted_15$3 = { class: "wakeup__toggle" };
const _hoisted_16$3 = { class: "wakeup__toggle__info" };
const _hoisted_17$3 = { class: "wakeup__toggle__title" };
const _hoisted_18$2 = { class: "wakeup__toggle__description" };
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "WakeupSection",
  props: {
    jumpToFirstPage: { type: Boolean }
  },
  emits: ["update:jumpToFirstPage"],
  setup(__props, { emit: __emit }) {
    const i18nStore = useI18nStore();
    const props = __props;
    const emit = __emit;
    const jumpToFirstPageValue = computed({
      get: () => props.jumpToFirstPage,
      set: (value) => emit("update:jumpToFirstPage", value)
    });
    const cardScrollMotion = {
      initial: {
        x: 0,
        opacity: 1
      },
      visible: {
        // 调整位移和透明度的关键帧序列
        x: [0, -250, -250, -250, -250, 0, 0],
        opacity: [1, 1, 0, 0, 1, 1, 1],
        transition: {
          // 整体时长调整为8秒
          duration: 8e3,
          repeat: Infinity,
          repeatType: "loop",
          // 调整时间点：
          // 0%: 初始状态
          // 15%: 完成位移(-250)
          // 25%: 开始淡出(opacity: 0)
          // 50%: 保持透明状态2秒
          // 55%: 快速显示出来
          // 65%: 快速位移回原位(只用10%的时间)
          // 100%: 保持初始状态直至结束(35%的时间，约3秒)
          times: [0, 0.15, 0.25, 0.5, 0.55, 0.65, 1],
          // 为不同阶段设置不同的缓动函数
          // 注意：缓动函数数组长度必须是值数组长度减1
          ease: ["easeOut", "linear", "linear", "easeOut", "easeOut", "linear"]
        }
      }
    };
    const enableFirstShowTransition = firstShowTransitionMotion;
    const toggleJumpToFirstPage = (value) => {
      jumpToFirstPageValue.value = value;
      useConfigStore().setJumpToFirstPage(value);
      Message.success({
        title: i18nStore.t("common.save"),
        message: i18nStore.t("setting.sclip.wakeup.saveSuccess"),
        duration: 2e3
      });
    };
    return (_ctx, _cache) => {
      const _directive_motion = resolveDirective("motion");
      return withDirectives((openBlock(), createElementBlock("div", _hoisted_1$5, [
        createBaseVNode("div", _hoisted_2$5, [
          createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.sclip.wakeup.title")), 1),
          createBaseVNode("p", _hoisted_3$5, toDisplayString(unref(i18nStore).t("setting.sclip.wakeup.subtitle")), 1)
        ]),
        createBaseVNode("div", _hoisted_4$5, [
          createBaseVNode("div", _hoisted_5$5, [
            createBaseVNode("div", _hoisted_6$4, [
              createBaseVNode("div", _hoisted_7$4, [
                withDirectives((openBlock(), createElementBlock("div", _hoisted_8$3, [
                  createBaseVNode("div", _hoisted_9$3, toDisplayString(unref(i18nStore).t("setting.sclip.wakeup.example1")), 1),
                  createBaseVNode("div", _hoisted_10$3, toDisplayString(unref(i18nStore).t("setting.sclip.wakeup.example2")), 1),
                  createBaseVNode("div", _hoisted_11$3, toDisplayString(unref(i18nStore).t("setting.sclip.wakeup.example3")), 1),
                  createBaseVNode("div", _hoisted_12$3, toDisplayString(unref(i18nStore).t("setting.sclip.wakeup.example4")), 1),
                  createBaseVNode("div", _hoisted_13$3, toDisplayString(unref(i18nStore).t("setting.sclip.wakeup.example5")), 1),
                  createBaseVNode("div", _hoisted_14$3, toDisplayString(unref(i18nStore).t("setting.sclip.wakeup.example6")), 1)
                ])), [
                  [_directive_motion, cardScrollMotion]
                ])
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_15$3, [
            createBaseVNode("div", _hoisted_16$3, [
              createBaseVNode("div", _hoisted_17$3, toDisplayString(unref(i18nStore).t("setting.sclip.wakeup.jumpToFirstPage")), 1),
              createBaseVNode("div", _hoisted_18$2, toDisplayString(unref(i18nStore).t("setting.sclip.wakeup.jumpToFirstPageDesc")), 1)
            ]),
            createVNode(unref(VSwitch), {
              modelValue: jumpToFirstPageValue.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => jumpToFirstPageValue.value = $event),
              onChange: toggleJumpToFirstPage
            }, null, 8, ["modelValue"])
          ])
        ])
      ])), [
        [_directive_motion, unref(enableFirstShowTransition)]
      ]);
    };
  }
});
const WakeupSection = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-debd0c08"]]);
const _hoisted_1$4 = { class: "history-limit-section" };
const _hoisted_2$4 = { class: "section-title" };
const _hoisted_3$4 = { class: "subtitle" };
const _hoisted_4$4 = { class: "history-limit" };
const _hoisted_5$4 = { class: "history-limit__preview" };
const _hoisted_6$3 = { class: "history-limit__preview__container" };
const _hoisted_7$3 = { class: "history-limit__preview__content" };
const _hoisted_8$2 = { class: "history-limit__preview__number" };
const _hoisted_9$2 = { class: "history-limit__preview__text" };
const _hoisted_10$2 = { class: "history-limit__toggle" };
const _hoisted_11$2 = { class: "history-limit__toggle__info" };
const _hoisted_12$2 = { class: "history-limit__toggle__title" };
const _hoisted_13$2 = { class: "history-limit__toggle__description" };
const _hoisted_14$2 = { class: "history-limit__toggle__presets" };
const _hoisted_15$2 = ["onClick"];
const _hoisted_16$2 = { class: "custom-input-container" };
const _hoisted_17$2 = ["placeholder"];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "HistoryLimitSection",
  props: {
    historyLimit: {}
  },
  emits: ["update:historyLimit"],
  setup(__props, { emit: __emit }) {
    const i18nStore = useI18nStore();
    const props = __props;
    const emit = __emit;
    const historyLimitValue = computed({
      get: () => props.historyLimit,
      set: (value) => emit("update:historyLimit", value)
    });
    const presetOptions = [20, 30, 50, 70, 100];
    const customValue = ref("");
    const animatedNumber = ref(historyLimitValue.value);
    const animatedMemory = ref(calculateMemoryUsage(historyLimitValue.value));
    const enableFirstShowTransition = firstShowTransitionMotion;
    function calculateMemoryUsage(limit) {
      return Math.max(limit * 0.1, 5.1);
    }
    function animateNumber(startValue, endValue, updateFn, duration = 500) {
      const startTime = Date.now();
      const difference = endValue - startValue;
      function update() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        if (elapsed >= duration) {
          updateFn(endValue);
          return;
        }
        const progress = 1 - Math.pow(1 - elapsed / duration, 2);
        const currentValue = startValue + difference * progress;
        updateFn(currentValue);
        requestAnimationFrame(update);
      }
      update();
    }
    watch(historyLimitValue, (newValue, oldValue) => {
      animateNumber(oldValue, newValue, (value) => {
        animatedNumber.value = Math.round(value);
      });
      const oldMemory = calculateMemoryUsage(oldValue);
      const newMemory = calculateMemoryUsage(newValue);
      animateNumber(oldMemory, newMemory, (value) => {
        animatedMemory.value = value;
      });
    });
    const selectPreset = (value) => {
      historyLimitValue.value = value;
      customValue.value = "";
      saveHistoryLimit(value);
    };
    const applyCustomValue = () => {
      if (!customValue.value) return;
      const value = parseInt(customValue.value);
      if (isNaN(value) || value <= 0) {
        Message.error({
          title: i18nStore.t("common.inputError"),
          message: i18nStore.t("setting.sclip.history.validPositiveNumber"),
          duration: 2e3
        });
        return;
      }
      if (value < 10) {
        Message.warning({
          title: i18nStore.t("common.inputError"),
          message: i18nStore.t("setting.sclip.history.minValue"),
          duration: 2e3
        });
        return;
      }
      historyLimitValue.value = value;
      saveHistoryLimit(value);
    };
    const saveHistoryLimit = (value) => {
      useConfigStore().setHistoryLimit(value);
      Message.success({
        title: i18nStore.t("common.save"),
        message: i18nStore.t("setting.sclip.history.saveSuccess"),
        duration: 2e3
      });
    };
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        applyCustomValue();
      }
    };
    function formatToOneDecimal(value) {
      return value.toFixed(1);
    }
    return (_ctx, _cache) => {
      const _directive_motion = resolveDirective("motion");
      return withDirectives((openBlock(), createElementBlock("div", _hoisted_1$4, [
        createBaseVNode("div", _hoisted_2$4, [
          createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.sclip.history.title")), 1),
          createBaseVNode("p", _hoisted_3$4, toDisplayString(unref(i18nStore).t("setting.sclip.history.subtitle")), 1)
        ]),
        createBaseVNode("div", _hoisted_4$4, [
          createBaseVNode("div", _hoisted_5$4, [
            createBaseVNode("div", _hoisted_6$3, [
              createBaseVNode("div", _hoisted_7$3, [
                createBaseVNode("div", _hoisted_8$2, toDisplayString(animatedNumber.value), 1),
                createBaseVNode("div", _hoisted_9$2, toDisplayString(unref(i18nStore).t("setting.sclip.history.memoryUsage").replace("{memory}", formatToOneDecimal(animatedMemory.value))), 1)
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_10$2, [
            createBaseVNode("div", _hoisted_11$2, [
              createBaseVNode("div", _hoisted_12$2, toDisplayString(unref(i18nStore).t("setting.sclip.history.recordCount")), 1),
              createBaseVNode("div", _hoisted_13$2, toDisplayString(unref(i18nStore).t("setting.sclip.history.recordCountDesc")), 1),
              createBaseVNode("div", _hoisted_14$2, [
                (openBlock(), createElementBlock(Fragment, null, renderList(presetOptions, (option) => {
                  return createBaseVNode("div", {
                    key: option,
                    class: normalizeClass(["preset-button", { active: historyLimitValue.value === option }]),
                    onClick: ($event) => selectPreset(option)
                  }, toDisplayString(option), 11, _hoisted_15$2);
                }), 64)),
                createBaseVNode("div", _hoisted_16$2, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => customValue.value = $event),
                    type: "number",
                    min: "1",
                    placeholder: unref(i18nStore).t("setting.sclip.history.custom"),
                    class: "custom-input",
                    onKeydown: handleKeyDown
                  }, null, 40, _hoisted_17$2), [
                    [vModelText, customValue.value]
                  ]),
                  createBaseVNode("button", {
                    class: "apply-button",
                    onClick: applyCustomValue
                  }, toDisplayString(unref(i18nStore).t("common.apply")), 1)
                ])
              ])
            ])
          ])
        ])
      ])), [
        [_directive_motion, unref(enableFirstShowTransition)]
      ]);
    };
  }
});
const HistoryLimitSection = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-93349b87"]]);
const _hoisted_1$3 = { class: "fixed-window-section" };
const _hoisted_2$3 = { class: "section-title" };
const _hoisted_3$3 = { class: "subtitle" };
const _hoisted_4$3 = { class: "fixed-window__toggle" };
const _hoisted_5$3 = { class: "fixed-window__toggle__info" };
const _hoisted_6$2 = { class: "fixed-window__toggle__title" };
const _hoisted_7$2 = { class: "fixed-window__toggle__description" };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "FixedWindowSection",
  props: {
    isFixedWindow: { type: Boolean }
  },
  emits: ["update:isFixedWindow"],
  setup(__props, { emit: __emit }) {
    const i18nStore = useI18nStore();
    const props = __props;
    const emit = __emit;
    const isFixedWindowValue = computed({
      get: () => props.isFixedWindow,
      set: (value) => emit("update:isFixedWindow", value)
    });
    const enableFirstShowTransition = firstShowTransitionMotion;
    const toggleFixedWindow = (value) => {
      isFixedWindowValue.value = value;
      useConfigStore().setIsFixedWindow(value);
      Message.success({
        title: i18nStore.t("common.save"),
        message: i18nStore.t("setting.sclip.fixedWindow.saveSuccess"),
        duration: 2e3
      });
    };
    return (_ctx, _cache) => {
      const _directive_motion = resolveDirective("motion");
      return withDirectives((openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.sclip.fixedWindow.title")), 1),
          createBaseVNode("p", _hoisted_3$3, toDisplayString(unref(i18nStore).t("setting.sclip.fixedWindow.subtitle")), 1)
        ]),
        createBaseVNode("div", _hoisted_4$3, [
          createBaseVNode("div", _hoisted_5$3, [
            createBaseVNode("div", _hoisted_6$2, toDisplayString(unref(i18nStore).t("setting.sclip.fixedWindow.toggleTitle")), 1),
            createBaseVNode("div", _hoisted_7$2, toDisplayString(unref(i18nStore).t("setting.sclip.fixedWindow.toggleDesc")), 1)
          ]),
          createVNode(unref(VSwitch), {
            modelValue: isFixedWindowValue.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isFixedWindowValue.value = $event),
            onChange: toggleFixedWindow
          }, null, 8, ["modelValue"])
        ])
      ])), [
        [_directive_motion, unref(enableFirstShowTransition)]
      ]);
    };
  }
});
const FixedWindowSection = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-b3e2c320"]]);
const _hoisted_1$2 = { class: "indicator-section" };
const _hoisted_2$2 = { class: "section-title" };
const _hoisted_3$2 = { class: "subtitle" };
const _hoisted_4$2 = { class: "demo-area" };
const _hoisted_5$2 = { class: "demo-content" };
const _hoisted_6$1 = { class: "clipboard-item" };
const _hoisted_7$1 = { class: "item-content" };
const _hoisted_8$1 = {
  key: 0,
  class: "type-indicator"
};
const _hoisted_9$1 = {
  key: 1,
  class: "long-content-tip"
};
const _hoisted_10$1 = { class: "demo-description" };
const _hoisted_11$1 = { class: "settings-container" };
const _hoisted_12$1 = { class: "setting-toggle" };
const _hoisted_13$1 = { class: "setting-info" };
const _hoisted_14$1 = { class: "setting-title" };
const _hoisted_15$1 = { class: "setting-description" };
const _hoisted_16$1 = { class: "setting-toggle" };
const _hoisted_17$1 = { class: "setting-info" };
const _hoisted_18$1 = { class: "setting-title" };
const _hoisted_19$1 = { class: "setting-description" };
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "IndicatorSection",
  props: {
    showTypeIndicator: { type: Boolean },
    showLongContentTip: { type: Boolean }
  },
  emits: ["update:showTypeIndicator", "update:showLongContentTip"],
  setup(__props, { emit: __emit }) {
    const i18nStore = useI18nStore();
    const props = __props;
    const emit = __emit;
    const showTypeIndicatorValue = computed({
      get: () => props.showTypeIndicator,
      set: (value) => emit("update:showTypeIndicator", value)
    });
    const showLongContentTipValue = computed({
      get: () => props.showLongContentTip,
      set: (value) => emit("update:showLongContentTip", value)
    });
    watch(
      [showTypeIndicatorValue, showLongContentTipValue],
      () => {
        saveSettings();
      },
      { deep: true }
    );
    const enableFirstShowTransition = firstShowTransitionMotion;
    const showTypeMotion = {
      initial: {
        opacity: 0,
        y: 60
      },
      enter: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.215, 0.61, 0.355, 1]
        }
      },
      leave: {
        opacity: 0,
        y: 60,
        transition: {
          duration: 0.8,
          ease: "easeOut"
        }
      }
    };
    const saveSettings = () => {
      useConfigStore().setShowTypeIndicator({
        showTypeIndicator: showTypeIndicatorValue.value,
        showLongContentTip: showLongContentTipValue.value
      });
      Message.success({
        title: i18nStore.t("common.save"),
        message: i18nStore.t("setting.sclip.indicator.saveSuccess"),
        duration: 2e3
      });
    };
    return (_ctx, _cache) => {
      const _directive_motion = resolveDirective("motion");
      return withDirectives((openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("div", _hoisted_2$2, [
          createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.sclip.indicator.title")), 1),
          createBaseVNode("p", _hoisted_3$2, toDisplayString(unref(i18nStore).t("setting.sclip.indicator.subtitle")), 1)
        ]),
        createBaseVNode("div", _hoisted_4$2, [
          createBaseVNode("div", _hoisted_5$2, [
            createBaseVNode("div", _hoisted_6$1, [
              createBaseVNode("div", _hoisted_7$1, toDisplayString(unref(i18nStore).t("setting.sclip.indicator.sampleText")), 1),
              showTypeIndicatorValue.value ? withDirectives((openBlock(), createElementBlock("div", _hoisted_8$1, _cache[2] || (_cache[2] = [
                createTextVNode(" Doc ")
              ]))), [
                [_directive_motion, showTypeMotion]
              ]) : createCommentVNode("", true),
              showLongContentTipValue.value ? withDirectives((openBlock(), createElementBlock("div", _hoisted_9$1, _cache[3] || (_cache[3] = [
                createTextVNode(" Max ")
              ]))), [
                [_directive_motion, showTypeMotion]
              ]) : createCommentVNode("", true)
            ])
          ]),
          createBaseVNode("p", _hoisted_10$1, toDisplayString(unref(i18nStore).t("setting.sclip.indicator.previewDesc")), 1)
        ]),
        createBaseVNode("div", _hoisted_11$1, [
          createBaseVNode("div", _hoisted_12$1, [
            createBaseVNode("div", _hoisted_13$1, [
              createBaseVNode("div", _hoisted_14$1, toDisplayString(unref(i18nStore).t("setting.sclip.indicator.typeIndicator")), 1),
              createBaseVNode("div", _hoisted_15$1, toDisplayString(unref(i18nStore).t("setting.sclip.indicator.typeIndicatorDesc")), 1)
            ]),
            createVNode(unref(VSwitch), {
              modelValue: showTypeIndicatorValue.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => showTypeIndicatorValue.value = $event)
            }, null, 8, ["modelValue"])
          ]),
          createBaseVNode("div", _hoisted_16$1, [
            createBaseVNode("div", _hoisted_17$1, [
              createBaseVNode("div", _hoisted_18$1, toDisplayString(unref(i18nStore).t("setting.sclip.indicator.longContentTip")), 1),
              createBaseVNode("div", _hoisted_19$1, toDisplayString(unref(i18nStore).t("setting.sclip.indicator.longContentTipDesc")), 1)
            ]),
            createVNode(unref(VSwitch), {
              modelValue: showLongContentTipValue.value,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => showLongContentTipValue.value = $event)
            }, null, 8, ["modelValue"])
          ]),
          createVNode(unref(VAlert), {
            type: "info",
            title: unref(i18nStore).t("setting.sclip.indicator.tipTitle"),
            message: unref(i18nStore).t("setting.sclip.indicator.tipMessage")
          }, null, 8, ["title", "message"])
        ])
      ])), [
        [_directive_motion, unref(enableFirstShowTransition)]
      ]);
    };
  }
});
const IndicatorSection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-ec2a6881"]]);
const _hoisted_1$1 = { class: "text-style-section" };
const _hoisted_2$1 = { class: "section-title" };
const _hoisted_3$1 = { class: "subtitle" };
const _hoisted_4$1 = { class: "demo-area" };
const _hoisted_5$1 = { class: "demo-content" };
const _hoisted_6 = { class: "comparison-container" };
const _hoisted_7 = { class: "clipboard-item" };
const _hoisted_8 = { class: "item-header" };
const _hoisted_9 = { class: "item-content plain-text" };
const _hoisted_10 = { class: "clipboard-item" };
const _hoisted_11 = { class: "item-header" };
const _hoisted_12 = { class: "item-content html-text" };
const _hoisted_13 = { class: "demo-description" };
const _hoisted_14 = { class: "settings-container" };
const _hoisted_15 = { class: "setting-info setting-item" };
const _hoisted_16 = { class: "setting-title-area" };
const _hoisted_17 = { class: "setting-title" };
const _hoisted_18 = { class: "setting-description" };
const _hoisted_19 = { class: "setting-item zoom-section" };
const _hoisted_20 = { class: "setting-title" };
const _hoisted_21 = { class: "zoom-buttons" };
const _hoisted_22 = ["onClick"];
const _hoisted_23 = { class: "setting-item zoom-section" };
const _hoisted_24 = { class: "setting-title" };
const _hoisted_25 = { class: "zoom-buttons" };
const _hoisted_26 = ["onClick"];
const _hoisted_27 = { class: "setting-item length-section" };
const _hoisted_28 = { class: "setting-title" };
const _hoisted_29 = { class: "setting-description" };
const _hoisted_30 = { class: "text-limit-presets" };
const _hoisted_31 = ["onClick"];
const _hoisted_32 = { class: "custom-input-container" };
const _hoisted_33 = ["placeholder"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "TextStyleSection",
  props: {
    enableTextStyle: { type: Boolean },
    textStyleZoom: {},
    rtfTextZoom: {},
    longTextLimit: {}
  },
  emits: ["update:enableTextStyle", "update:textStyleZoom", "update:rtfTextZoom", "update:longTextLimit"],
  setup(__props, { emit: __emit }) {
    const i18nStore = useI18nStore();
    const props = __props;
    const emit = __emit;
    const enableTextStyleValue = computed({
      get: () => props.enableTextStyle,
      set: (value) => emit("update:enableTextStyle", value)
    });
    const textStyleZoomValue = computed({
      get: () => props.textStyleZoom,
      set: (value) => emit("update:textStyleZoom", value)
    });
    const rtfTextZoomValue = computed({
      get: () => props.rtfTextZoom,
      set: (value) => emit("update:rtfTextZoom", value)
    });
    const longTextLimitValue = computed({
      get: () => props.longTextLimit || 400,
      set: (value) => emit("update:longTextLimit", value)
    });
    const customValue = ref("");
    const initCustomValue = () => {
      const currentValue = props.longTextLimit || 400;
      if (!textLimitPresets.includes(currentValue)) {
        customValue.value = currentValue.toString();
      }
    };
    const zoomPresets = [0.3, 0.5, 0.7, 0.9, 1, 1.2, 1.4, 1.5];
    const textLimitPresets = [200, 300, 400, 500, 600];
    watch(
      [enableTextStyleValue, textStyleZoomValue, rtfTextZoomValue, longTextLimitValue],
      () => {
        saveSettings();
        if (textStyleZoomValue.value) {
          initShadowDOM();
        }
      },
      { deep: true }
    );
    const enableFirstShowTransition = firstShowTransitionMotion;
    const htmlContentRef = ref(null);
    const plainTextExample = {
      content: `  public static destroyWindow(key: string): boolean {
    const window = this.browserWindows.get(key)
    if (window) {
      window.destroy()
      this.browserWindows.delete(key)
      return true
    }
    return false
  }`
    };
    const htmlTextExample = {
      content: `<meta charset='utf-8'><div style="color: #333333;background-color: #ffffff;font-family: 'CodeNewRoman Nerd Font',Monaco,monospace, Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12.887999999999998px;line-height: 23px;white-space: pre;"><div><span style="color: #333333;">  </span><span style="color: #1313ec;">public</span><span style="color: #333333;"> </span><span style="color: #1313ec;">static</span><span style="color: #333333;"> </span><span style="color: #735c2c;">destroyWindow</span><span style="color: #333333;">(</span><span style="color: #0a1776;">key</span><span style="color: #000000;">:</span><span style="color: #333333;"> </span><span style="color: #2f7a90;">string</span><span style="color: #333333;">)</span><span style="color: #000000;">:</span><span style="color: #333333;"> </span><span style="color: #2f7a90;">boolean</span><span style="color: #333333;"> {</span></div><div><span style="color: #333333;">    </span><span style="color: #1313ec;">const</span><span style="color: #333333;"> </span><span style="color: #0a1776;">window</span><span style="color: #333333;"> </span><span style="color: #000000;">=</span><span style="color: #333333;"> </span><span style="color: #1313ec;">this</span><span style="color: #333333;">.</span><span style="color: #0a1776;">browserWindows</span><span style="color: #333333;">.</span><span style="color: #735c2c;">get</span><span style="color: #333333;">(</span><span style="color: #0a1776;">key</span><span style="color: #333333;">)</span></div><div><span style="color: #333333;">    </span><span style="color: #a510cb;">if</span><span style="color: #333333;"> (</span><span style="color: #0a1776;">window</span><span style="color: #333333;">) {</span></div><div><span style="color: #333333;">      </span><span style="color: #0a1776;">window</span><span style="color: #333333;">.</span><span style="color: #735c2c;">destroy</span><span style="color: #333333;">()</span></div><div><span style="color: #333333;">      </span><span style="color: #1313ec;">this</span><span style="color: #333333;">.</span><span style="color: #0a1776;">browserWindows</span><span style="color: #333333;">.</span><span style="color: #735c2c;">delete</span><span style="color: #333333;">(</span><span style="color: #0a1776;">key</span><span style="color: #333333;">)</span></div><div><span style="color: #333333;">      </span><span style="color: #a510cb;">return</span><span style="color: #333333;"> </span><span style="color: #1313ec;">true</span></div><div><span style="color: #333333;">    }</span></div><div><span style="color: #333333;">    </span><span style="color: #a510cb;">return</span><span style="color: #333333;"> </span><span style="color: #1313ec;">false</span></div><div><span style="color: #333333;">  }</span></div></div>`
    };
    const saveSettings = () => {
      useConfigStore().setEnableTextStyle({
        enableTextStyle: enableTextStyleValue.value,
        textStyleZoom: textStyleZoomValue.value,
        rtfTextZoom: rtfTextZoomValue.value,
        longTextLimit: longTextLimitValue.value
      });
      Message.success({
        title: i18nStore.t("common.save"),
        message: i18nStore.t("setting.sclip.textStyle.saveSuccess"),
        duration: 2e3
      });
    };
    const initShadowDOM = () => {
      if (htmlContentRef.value) {
        let shadow;
        if (htmlContentRef.value.shadowRoot) {
          shadow = htmlContentRef.value.shadowRoot;
          while (shadow.firstChild) {
            shadow.removeChild(shadow.firstChild);
          }
        } else {
          while (htmlContentRef.value.firstChild) {
            htmlContentRef.value.removeChild(htmlContentRef.value.firstChild);
          }
          shadow = htmlContentRef.value.attachShadow({ mode: "open" });
        }
        const style = document.createElement("style");
        style.textContent = `
      :host {
        display: block;
        height: 100%;
        overflow: auto;
      }

      /* 自定义滚动条样式 */
      :host::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      :host::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
      }

      :host::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        transition: background 0.2s ease;
      }

      :host::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
      }

      .html-content {
        font-size: 12px;
        line-height: 1.5;
        word-wrap: break-word;
        zoom: ${textStyleZoomValue.value};
      }
    `;
        const content = document.createElement("div");
        content.className = "html-content";
        content.innerHTML = htmlTextExample.content;
        shadow.appendChild(style);
        shadow.appendChild(content);
      }
    };
    const selectTextLimitPreset = (value) => {
      longTextLimitValue.value = value;
      customValue.value = "";
    };
    const applyCustomTextLimit = () => {
      if (!customValue.value) return;
      const value = parseInt(customValue.value);
      if (isNaN(value) || value <= 0) {
        Message.error({
          title: i18nStore.t("common.inputError"),
          message: i18nStore.t("setting.sclip.textStyle.validPositiveNumber"),
          duration: 2e3
        });
        return;
      }
      if (value < 100) {
        Message.warning({
          title: i18nStore.t("common.inputError"),
          message: i18nStore.t("setting.sclip.textStyle.minValue"),
          duration: 2e3
        });
        return;
      }
      longTextLimitValue.value = value;
    };
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        applyCustomTextLimit();
      }
    };
    onMounted(() => {
      initShadowDOM();
      initCustomValue();
    });
    return (_ctx, _cache) => {
      const _directive_motion = resolveDirective("motion");
      return withDirectives((openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.sclip.textStyle.title")), 1),
          createBaseVNode("p", _hoisted_3$1, toDisplayString(unref(i18nStore).t("setting.sclip.textStyle.subtitle")), 1)
        ]),
        createBaseVNode("div", _hoisted_4$1, [
          createBaseVNode("div", _hoisted_5$1, [
            createBaseVNode("div", _hoisted_6, [
              createBaseVNode("div", _hoisted_7, [
                createBaseVNode("div", _hoisted_8, toDisplayString(unref(i18nStore).t("setting.sclip.textStyle.plainTextTitle")), 1),
                createBaseVNode("div", _hoisted_9, toDisplayString(plainTextExample.content), 1)
              ]),
              createBaseVNode("div", _hoisted_10, [
                createBaseVNode("div", _hoisted_11, toDisplayString(unref(i18nStore).t("setting.sclip.textStyle.richTextTitle")), 1),
                createBaseVNode("div", _hoisted_12, [
                  createBaseVNode("div", {
                    ref_key: "htmlContentRef",
                    ref: htmlContentRef
                  }, null, 512)
                ])
              ])
            ])
          ]),
          createBaseVNode("p", _hoisted_13, toDisplayString(unref(i18nStore).t("setting.sclip.textStyle.compareDesc")), 1)
        ]),
        createBaseVNode("div", _hoisted_14, [
          createBaseVNode("div", _hoisted_15, [
            createBaseVNode("div", _hoisted_16, [
              createBaseVNode("div", _hoisted_17, toDisplayString(unref(i18nStore).t("setting.sclip.textStyle.enableTitle")), 1),
              createBaseVNode("div", _hoisted_18, toDisplayString(unref(i18nStore).t("setting.sclip.textStyle.enableDesc")), 1)
            ]),
            createVNode(unref(VSwitch), {
              modelValue: enableTextStyleValue.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => enableTextStyleValue.value = $event)
            }, null, 8, ["modelValue"])
          ]),
          createBaseVNode("div", _hoisted_19, [
            createBaseVNode("div", _hoisted_20, toDisplayString(unref(i18nStore).t("setting.sclip.textStyle.zoomTitle")), 1),
            createBaseVNode("div", _hoisted_21, [
              (openBlock(), createElementBlock(Fragment, null, renderList(zoomPresets, (zoom) => {
                return createBaseVNode("button", {
                  key: zoom,
                  class: normalizeClass(["zoom-button", { active: textStyleZoomValue.value === zoom }]),
                  onClick: ($event) => textStyleZoomValue.value = zoom
                }, toDisplayString(zoom === 1 ? "100%" : zoom * 100 + "%"), 11, _hoisted_22);
              }), 64))
            ])
          ]),
          createBaseVNode("div", _hoisted_23, [
            createBaseVNode("div", _hoisted_24, toDisplayString(unref(i18nStore).t("setting.sclip.textStyle.rtfZoomTitle")), 1),
            createBaseVNode("div", _hoisted_25, [
              (openBlock(), createElementBlock(Fragment, null, renderList(zoomPresets, (zoom) => {
                return createBaseVNode("button", {
                  key: zoom,
                  class: normalizeClass(["zoom-button", { active: rtfTextZoomValue.value === zoom }]),
                  onClick: ($event) => rtfTextZoomValue.value = zoom
                }, toDisplayString(zoom === 1 ? "100%" : zoom * 100 + "%"), 11, _hoisted_26);
              }), 64))
            ])
          ]),
          createBaseVNode("div", _hoisted_27, [
            createBaseVNode("div", _hoisted_28, toDisplayString(unref(i18nStore).t("setting.sclip.textStyle.longTextLimitTitle")), 1),
            createBaseVNode("div", _hoisted_29, toDisplayString(unref(i18nStore).t("setting.sclip.textStyle.longTextLimitDesc")), 1),
            createBaseVNode("div", _hoisted_30, [
              (openBlock(), createElementBlock(Fragment, null, renderList(textLimitPresets, (limit) => {
                return createBaseVNode("button", {
                  key: limit,
                  class: normalizeClass(["text-limit-button", { active: longTextLimitValue.value === limit }]),
                  onClick: ($event) => selectTextLimitPreset(limit)
                }, toDisplayString(limit), 11, _hoisted_31);
              }), 64)),
              createBaseVNode("div", _hoisted_32, [
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => customValue.value = $event),
                  type: "number",
                  min: "100",
                  placeholder: unref(i18nStore).t("setting.sclip.textStyle.custom"),
                  class: "custom-input",
                  onKeydown: handleKeyDown
                }, null, 40, _hoisted_33), [
                  [vModelText, customValue.value]
                ]),
                createBaseVNode("button", {
                  class: "apply-button",
                  onClick: applyCustomTextLimit
                }, toDisplayString(unref(i18nStore).t("common.apply")), 1)
              ])
            ])
          ])
        ]),
        createVNode(unref(VAlert), {
          type: "warning",
          title: unref(i18nStore).t("setting.sclip.textStyle.rtfNoteTitle"),
          message: unref(i18nStore).t("setting.sclip.textStyle.rtfNoteMessage")
        }, null, 8, ["title", "message"]),
        createVNode(unref(VAlert), {
          type: "info",
          title: unref(i18nStore).t("setting.sclip.textStyle.noteTitle"),
          message: unref(i18nStore).t("setting.sclip.textStyle.noteMessage")
        }, null, 8, ["title", "message"])
      ])), [
        [_directive_motion, unref(enableFirstShowTransition)]
      ]);
    };
  }
});
const TextStyleSection = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d111dc1b"]]);
const _hoisted_1 = { class: "sclip-settings" };
const _hoisted_2 = { class: "settings-header" };
const _hoisted_3 = { class: "subtitle" };
const _hoisted_4 = { class: "settings-header" };
const _hoisted_5 = { class: "subtitle" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "sclip",
  setup(__props) {
    const i18nStore = useI18nStore();
    const setting = useConfigStore().getSetting;
    const selectedDisplayMode = ref(setting.imageSettings.displayMode);
    const enableImageAnimation = ref(setting.imageSettings.enableAnimation);
    const jumpToFirstPage = ref(setting.appBehavior.jumpToFirstPage);
    const historyLimit = ref(setting.appBehavior.historyLimit || 50);
    const isFixedWindow = ref(setting.appBehavior.isFixedWindow);
    const showTypeIndicator = ref(setting.appBehavior.showTypeIndicator);
    const showLongContentTip = ref(setting.appBehavior.showLongContentTip);
    const enableTextStyle = ref(setting.clipboard.enableTextStyle);
    const textStyleZoom = ref(setting.clipboard.textStyleZoom || 1);
    const rtfTextZoom = ref(setting.clipboard.rtfTextZoom || 1);
    const longTextLimit = ref(setting.clipboard.longTextLimit || 400);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("h2", null, toDisplayString(unref(i18nStore).t("setting.sclip.contentDisplay")), 1),
          createBaseVNode("p", _hoisted_3, toDisplayString(unref(i18nStore).t("setting.sclip.customizeContentDisplay")), 1)
        ]),
        createVNode(ImageDisplaySection, {
          "display-mode": selectedDisplayMode.value,
          "onUpdate:displayMode": _cache[0] || (_cache[0] = ($event) => selectedDisplayMode.value = $event)
        }, null, 8, ["display-mode"]),
        _cache[11] || (_cache[11] = createBaseVNode("div", { class: "divider" }, null, -1)),
        createVNode(AnimationSection, {
          "enable-animation": enableImageAnimation.value,
          "onUpdate:enableAnimation": _cache[1] || (_cache[1] = ($event) => enableImageAnimation.value = $event)
        }, null, 8, ["enable-animation"]),
        _cache[12] || (_cache[12] = createBaseVNode("div", { class: "divider" }, null, -1)),
        createVNode(TextStyleSection, {
          "enable-text-style": enableTextStyle.value,
          "onUpdate:enableTextStyle": _cache[2] || (_cache[2] = ($event) => enableTextStyle.value = $event),
          "text-style-zoom": textStyleZoom.value,
          "onUpdate:textStyleZoom": _cache[3] || (_cache[3] = ($event) => textStyleZoom.value = $event),
          "rtf-text-zoom": rtfTextZoom.value,
          "onUpdate:rtfTextZoom": _cache[4] || (_cache[4] = ($event) => rtfTextZoom.value = $event),
          "long-text-limit": longTextLimit.value,
          "onUpdate:longTextLimit": _cache[5] || (_cache[5] = ($event) => longTextLimit.value = $event)
        }, null, 8, ["enable-text-style", "text-style-zoom", "rtf-text-zoom", "long-text-limit"]),
        _cache[13] || (_cache[13] = createBaseVNode("div", { class: "divider" }, null, -1)),
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("h2", null, toDisplayString(unref(i18nStore).t("setting.sclip.behaviorSettings")), 1),
          createBaseVNode("p", _hoisted_5, toDisplayString(unref(i18nStore).t("setting.sclip.customizeBehavior")), 1)
        ]),
        createVNode(WakeupSection, {
          "jump-to-first-page": jumpToFirstPage.value,
          "onUpdate:jumpToFirstPage": _cache[6] || (_cache[6] = ($event) => jumpToFirstPage.value = $event)
        }, null, 8, ["jump-to-first-page"]),
        _cache[14] || (_cache[14] = createBaseVNode("div", { class: "divider" }, null, -1)),
        createVNode(HistoryLimitSection, {
          "history-limit": historyLimit.value,
          "onUpdate:historyLimit": _cache[7] || (_cache[7] = ($event) => historyLimit.value = $event)
        }, null, 8, ["history-limit"]),
        _cache[15] || (_cache[15] = createBaseVNode("div", { class: "divider" }, null, -1)),
        createVNode(FixedWindowSection, {
          "is-fixed-window": isFixedWindow.value,
          "onUpdate:isFixedWindow": _cache[8] || (_cache[8] = ($event) => isFixedWindow.value = $event)
        }, null, 8, ["is-fixed-window"]),
        _cache[16] || (_cache[16] = createBaseVNode("div", { class: "divider" }, null, -1)),
        createVNode(IndicatorSection, {
          "show-type-indicator": showTypeIndicator.value,
          "onUpdate:showTypeIndicator": _cache[9] || (_cache[9] = ($event) => showTypeIndicator.value = $event),
          "show-long-content-tip": showLongContentTip.value,
          "onUpdate:showLongContentTip": _cache[10] || (_cache[10] = ($event) => showLongContentTip.value = $event)
        }, null, 8, ["show-type-indicator", "show-long-content-tip"])
      ]);
    };
  }
});
const sclip = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c44a09ae"]]);
export {
  sclip as default
};

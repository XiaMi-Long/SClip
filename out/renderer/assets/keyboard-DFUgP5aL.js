import { V as VAlert } from "./VAlert-0zT-QagG.js";
import { d as defineComponent, c as computed, a as useConfigStore, u as useI18nStore, r as ref, p as onBeforeUnmount, b as createElementBlock, e as createBaseVNode, k as withDirectives, t as toDisplayString, f as unref, F as Fragment, g as renderList, m as resolveDirective, l as createCommentVNode, h as createVNode, M as Message, o as openBlock, i as normalizeClass, _ as _export_sfc } from "./index-DFclwqs1.js";
import { f as firstShowTransitionMotion } from "./common.fun-D5HpNzqn.js";
const _hoisted_1 = { class: "keyboard-settings" };
const _hoisted_2 = { class: "settings-header" };
const _hoisted_3 = { class: "subtitle" };
const _hoisted_4 = { class: "shortcuts-section" };
const _hoisted_5 = { class: "section-description" };
const _hoisted_6 = { class: "shortcuts-container" };
const _hoisted_7 = { class: "shortcut-animation" };
const _hoisted_8 = {
  key: 0,
  class: "animation-item move-up"
};
const _hoisted_9 = {
  key: 1,
  class: "animation-item move-down"
};
const _hoisted_10 = {
  key: 2,
  class: "animation-item move-right"
};
const _hoisted_11 = {
  key: 3,
  class: "animation-item move-left"
};
const _hoisted_12 = {
  key: 4,
  class: "animation-item pin-item"
};
const _hoisted_13 = {
  key: 5,
  class: "animation-item delete-item"
};
const _hoisted_14 = { class: "shortcut-info" };
const _hoisted_15 = { class: "shortcut-name" };
const _hoisted_16 = { class: "shortcut-description" };
const _hoisted_17 = { class: "shortcut-keys-container" };
const _hoisted_18 = { class: "key-badge" };
const _hoisted_19 = { class: "shortcuts-section" };
const _hoisted_20 = { class: "section-description" };
const _hoisted_21 = { class: "shortcuts-container" };
const _hoisted_22 = { class: "shortcut-info" };
const _hoisted_23 = { class: "shortcut-name" };
const _hoisted_24 = { class: "shortcut-description" };
const _hoisted_25 = {
  key: 0,
  class: "shortcut-edit-controls"
};
const _hoisted_26 = { class: "edit-instructions" };
const _hoisted_27 = { class: "key-recording-area" };
const _hoisted_28 = {
  key: 0,
  class: "key-combination"
};
const _hoisted_29 = { class: "key-badge" };
const _hoisted_30 = {
  key: 1,
  class: "recording-prompt"
};
const _hoisted_31 = { class: "edit-actions" };
const _hoisted_32 = ["onClick"];
const _hoisted_33 = {
  key: 0,
  class: "key-badge"
};
const _hoisted_34 = {
  key: 1,
  class: "no-shortcut"
};
const _hoisted_35 = { class: "edit-hint" };
const _hoisted_36 = {
  key: 0,
  class: "shortcut-alerts"
};
const _hoisted_37 = { class: "action-buttons" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "keyboard",
  setup(__props) {
    const enableFirstShowTransition = firstShowTransitionMotion;
    const isMac = computed(() => {
      return useConfigStore().getSetting.system.isMac;
    });
    const shortcut = computed(() => {
      return useConfigStore().getSetting.shortcut;
    });
    const i18nStore = useI18nStore();
    const fixedShortcuts = [
      {
        id: "moveUp",
        name: i18nStore.t("setting.keyboard.moveUp"),
        keys: "W/↑",
        description: i18nStore.t("setting.keyboard.moveUpDesc"),
        editable: false
      },
      {
        id: "moveDown",
        name: i18nStore.t("setting.keyboard.moveDown"),
        keys: "S/↓",
        description: i18nStore.t("setting.keyboard.moveDownDesc"),
        editable: false
      },
      {
        id: "nextPage",
        name: i18nStore.t("setting.keyboard.nextPage"),
        keys: "D/→",
        description: i18nStore.t("setting.keyboard.nextPageDesc"),
        editable: false
      },
      {
        id: "prevPage",
        name: i18nStore.t("setting.keyboard.prevPage"),
        keys: "A/←",
        description: i18nStore.t("setting.keyboard.prevPageDesc"),
        editable: false
      },
      {
        id: "pin",
        name: i18nStore.t("setting.keyboard.pin"),
        keys: "E",
        description: i18nStore.t("setting.keyboard.pinDesc"),
        editable: false
      },
      {
        id: "delete",
        name: i18nStore.t("setting.keyboard.delete"),
        keys: "Q",
        description: i18nStore.t("setting.keyboard.deleteDesc"),
        editable: false
      }
    ];
    const editableShortcuts = ref([
      {
        id: "toggleApp",
        name: i18nStore.t("setting.keyboard.toggleApp"),
        keys: isMac.value ? shortcut.value.appVisibleShortcut.mac : shortcut.value.appVisibleShortcut.windows,
        description: i18nStore.t("setting.keyboard.toggleAppDesc"),
        editable: true
      }
    ]);
    const editingShortcutId = ref("");
    const recordingKeys = ref([]);
    const animationTimers = ref([]);
    onBeforeUnmount(() => {
      animationTimers.value.forEach((timer) => clearTimeout(timer));
    });
    const startEditing = (id) => {
      editingShortcutId.value = id;
      recordingKeys.value = [];
      const currentShortcut = editableShortcuts.value.find((s) => s.id === id);
      if (currentShortcut && currentShortcut.keys) {
        recordingKeys.value = currentShortcut.keys.split("+");
      }
      window.addEventListener("keydown", recordKeyPress);
    };
    const recordKeyPress = (event) => {
      event.preventDefault();
      console.log(event.key);
      const key = getKeyName(event);
      if (!key) return;
      if (key === "Escape") {
        stopEditing();
        return;
      }
      if (isModifierKey(key)) {
        if (!recordingKeys.value.includes(key)) {
          recordingKeys.value.push(key);
        }
      } else {
        if (!recordingKeys.value.includes(key)) {
          recordingKeys.value = [...recordingKeys.value.filter(isModifierKey), key];
        }
      }
    };
    const stopEditing = () => {
      window.removeEventListener("keydown", recordKeyPress);
      if (recordingKeys.value.length > 0 && editingShortcutId.value) {
        editableShortcuts.value[0].keys = recordingKeys.value.join("+");
      }
      editingShortcutId.value = "";
    };
    const applyShortcutSettings = () => {
      const keys = editableShortcuts.value[0].keys;
      useConfigStore().setShortcut(keys);
      Message.success({
        title: i18nStore.t("common.save"),
        message: i18nStore.t("setting.keyboard.saveSuccess"),
        duration: 2e3
      });
    };
    const resetToDefault = () => {
      editableShortcuts.value[0].keys = isMac.value ? shortcut.value.appVisibleShortcut.macDefaultShortcuts : shortcut.value.appVisibleShortcut.windowsDefaultShortcuts;
      useConfigStore().setShortcut(editableShortcuts.value[0].keys);
      Message.info({
        message: i18nStore.t("setting.keyboard.resetSuccess"),
        duration: 2e3
      });
    };
    const getKeyName = (event) => {
      if (event.key === " ") return "Space";
      if (event.key === "Control") return "Ctrl";
      if (event.key === "Meta") return isMac.value ? "Cmd" : "Win";
      if (event.key === "OS" || event.key === "Win") return "Win";
      if (event.key === "ArrowUp") return "↑";
      if (event.key === "ArrowDown") return "↓";
      if (event.key === "ArrowLeft") return "←";
      if (event.key === "ArrowRight") return "→";
      if (event.key.length === 1) return event.key.toUpperCase();
      return event.key;
    };
    const isModifierKey = (key) => {
      return ["Ctrl", "Alt", "Shift", "Cmd", "Win"].includes(key);
    };
    const clearShortcut = () => {
      if (editingShortcutId.value) {
        recordingKeys.value = [];
      }
    };
    return (_ctx, _cache) => {
      const _directive_motion = resolveDirective("motion");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("h2", null, toDisplayString(unref(i18nStore).t("setting.keyboard.title")), 1),
          createBaseVNode("p", _hoisted_3, toDisplayString(unref(i18nStore).t("setting.keyboard.subtitle")), 1)
        ]),
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.keyboard.defaultShortcuts")), 1),
          createBaseVNode("p", _hoisted_5, toDisplayString(unref(i18nStore).t("setting.keyboard.defaultShortcutsDesc")), 1),
          createBaseVNode("div", _hoisted_6, [
            (openBlock(), createElementBlock(Fragment, null, renderList(fixedShortcuts, (shortcut2) => {
              return createBaseVNode("div", {
                key: shortcut2.id,
                class: "shortcut-item"
              }, [
                createBaseVNode("div", _hoisted_7, [
                  createBaseVNode("div", {
                    class: normalizeClass(`animation-${shortcut2.id}`)
                  }, [
                    shortcut2.id === "moveUp" ? (openBlock(), createElementBlock("div", _hoisted_8)) : shortcut2.id === "moveDown" ? (openBlock(), createElementBlock("div", _hoisted_9)) : shortcut2.id === "nextPage" ? (openBlock(), createElementBlock("div", _hoisted_10)) : shortcut2.id === "prevPage" ? (openBlock(), createElementBlock("div", _hoisted_11)) : shortcut2.id === "pin" ? (openBlock(), createElementBlock("div", _hoisted_12, _cache[0] || (_cache[0] = [
                      createBaseVNode("div", { class: "pin-icon" }, null, -1)
                    ]))) : shortcut2.id === "delete" ? (openBlock(), createElementBlock("div", _hoisted_13, "X")) : createCommentVNode("", true)
                  ], 2)
                ]),
                createBaseVNode("div", _hoisted_14, [
                  createBaseVNode("div", _hoisted_15, toDisplayString(unref(i18nStore).t(`setting.keyboard.${shortcut2.id}`)), 1),
                  createBaseVNode("div", _hoisted_16, toDisplayString(unref(i18nStore).t(`setting.keyboard.${shortcut2.id}Desc`)), 1)
                ]),
                createBaseVNode("div", _hoisted_17, [
                  createBaseVNode("div", _hoisted_18, toDisplayString(shortcut2.keys), 1)
                ])
              ]);
            }), 64))
          ])
        ]),
        _cache[1] || (_cache[1] = createBaseVNode("div", { class: "divider" }, null, -1)),
        withDirectives((openBlock(), createElementBlock("div", _hoisted_19, [
          createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.keyboard.customShortcuts")), 1),
          createBaseVNode("p", _hoisted_20, toDisplayString(unref(i18nStore).t("setting.keyboard.customShortcutsDesc")), 1),
          createBaseVNode("div", _hoisted_21, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(editableShortcuts.value, (shortcut2) => {
              return openBlock(), createElementBlock("div", {
                key: shortcut2.id,
                class: "shortcut-item custom-shortcut-item"
              }, [
                createBaseVNode("div", _hoisted_22, [
                  createBaseVNode("div", _hoisted_23, toDisplayString(unref(i18nStore).t(`setting.keyboard.${shortcut2.id}`)), 1),
                  createBaseVNode("div", _hoisted_24, toDisplayString(unref(i18nStore).t(`setting.keyboard.${shortcut2.id}Desc`)), 1)
                ]),
                editingShortcutId.value === shortcut2.id ? (openBlock(), createElementBlock("div", _hoisted_25, [
                  createBaseVNode("div", _hoisted_26, toDisplayString(unref(i18nStore).t("setting.keyboard.editInstructions")), 1),
                  createBaseVNode("div", _hoisted_27, [
                    recordingKeys.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_28, [
                      createBaseVNode("div", _hoisted_29, toDisplayString(recordingKeys.value.join("+")), 1)
                    ])) : (openBlock(), createElementBlock("div", _hoisted_30, toDisplayString(unref(i18nStore).t("setting.keyboard.waitingForInput")), 1))
                  ]),
                  createBaseVNode("div", _hoisted_31, [
                    createBaseVNode("button", {
                      class: "action-button cancel-button",
                      onClick: stopEditing
                    }, toDisplayString(unref(i18nStore).t("common.cancel")), 1),
                    createBaseVNode("button", {
                      class: "action-button clear-button",
                      onClick: clearShortcut
                    }, toDisplayString(unref(i18nStore).t("setting.keyboard.clear")), 1),
                    createBaseVNode("button", {
                      class: "action-button save-button",
                      onClick: stopEditing
                    }, toDisplayString(unref(i18nStore).t("common.save")), 1)
                  ])
                ])) : (openBlock(), createElementBlock("div", {
                  key: 1,
                  class: "shortcut-keys editable",
                  onClick: ($event) => startEditing(shortcut2.id)
                }, [
                  shortcut2.keys ? (openBlock(), createElementBlock("div", _hoisted_33, toDisplayString(shortcut2.keys), 1)) : (openBlock(), createElementBlock("div", _hoisted_34, toDisplayString(unref(i18nStore).t("setting.keyboard.notSet")), 1)),
                  createBaseVNode("div", _hoisted_35, toDisplayString(unref(i18nStore).t("setting.keyboard.clickToEdit")), 1)
                ], 8, _hoisted_32))
              ]);
            }), 128)),
            !isMac.value ? (openBlock(), createElementBlock("div", _hoisted_36, [
              createVNode(unref(VAlert), {
                "show-icon": true,
                type: "warning",
                title: unref(i18nStore).t("setting.keyboard.noteTitle"),
                message: unref(i18nStore).t("setting.keyboard.noteMessage"),
                class: "clipboard-alert"
              }, null, 8, ["title", "message"])
            ])) : createCommentVNode("", true)
          ])
        ])), [
          [_directive_motion, unref(enableFirstShowTransition)]
        ]),
        createBaseVNode("div", _hoisted_37, [
          createBaseVNode("button", {
            class: "reset-button",
            onClick: resetToDefault
          }, toDisplayString(unref(i18nStore).t("setting.keyboard.resetToDefault")), 1),
          createBaseVNode("button", {
            class: "apply-button",
            onClick: applyShortcutSettings
          }, toDisplayString(unref(i18nStore).t("common.apply")), 1)
        ])
      ]);
    };
  }
});
const keyboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-18e5d525"]]);
export {
  keyboard as default
};

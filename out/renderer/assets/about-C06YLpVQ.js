import { d as defineComponent, u as useI18nStore, c as computed, a as useConfigStore, r as ref, b as createElementBlock, e as createBaseVNode, t as toDisplayString, f as unref, F as Fragment, g as renderList, o as openBlock, i as normalizeClass, _ as _export_sfc } from "./index-DFclwqs1.js";
const Avatar1 = "" + new URL("avatar1-5fPNC0kA.jpeg", import.meta.url).href;
const Avatar2 = "" + new URL("avatar2-qX9okxtI.jpeg", import.meta.url).href;
const Eye = "" + new URL("eye-CxeVqDC_.png", import.meta.url).href;
const _hoisted_1 = { class: "about-container" };
const _hoisted_2 = { class: "section" };
const _hoisted_3 = { class: "section-title" };
const _hoisted_4 = { class: "version-info" };
const _hoisted_5 = { class: "version-label" };
const _hoisted_6 = { class: "version-number" };
const _hoisted_7 = ["disabled"];
const _hoisted_8 = { key: 0 };
const _hoisted_9 = {
  key: 1,
  class: "loading"
};
const _hoisted_10 = { class: "section" };
const _hoisted_11 = { class: "section-title" };
const _hoisted_12 = { class: "contributors-container" };
const _hoisted_13 = ["onMouseenter", "onMouseleave"];
const _hoisted_14 = ["src", "alt"];
const _hoisted_15 = { class: "contributor-name" };
const _hoisted_16 = { class: "section" };
const _hoisted_17 = { class: "section-title" };
const _hoisted_18 = { class: "update-logs-container" };
const _hoisted_19 = { class: "version-header" };
const _hoisted_20 = { class: "update-items" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "about",
  setup(__props) {
    const i18nStore = useI18nStore();
    const getCurrentVersion = () => {
      return useConfigStore().getSetting.system.version;
    };
    const getUpdateLogs = computed(() => {
      const configStore = useConfigStore();
      const updateLog = configStore?.getSetting?.system?.updateLog || [];
      if (!Array.isArray(updateLog)) {
        console.warn("系统更新日志不是数组格式", updateLog);
        return [];
      }
      const logItems = [...updateLog];
      const reversedLogs = logItems.reverse();
      return reversedLogs.map((log) => {
        if (typeof log !== "string") {
          console.warn("日志项不是字符串格式", log);
          return { version: i18nStore.t("setting.about.unknownVersion"), items: [] };
        }
        const parts = log.split("#").filter((item) => item.trim() !== "");
        const version = parts[0] || i18nStore.t("setting.about.unknownVersion");
        const items = parts.slice(1).map((item) => item.trim());
        return {
          version,
          items
        };
      });
    });
    const contributors = ref([
      {
        name: "Aclles",
        avatar: Avatar2,
        url: "https://github.com/Aclles"
      },
      {
        name: "XiaMi-Long",
        avatar: Avatar1,
        url: "https://github.com/XiaMi-Long"
      }
    ]);
    const avatarRotations = ref({});
    const rotationTimers = ref({});
    const handleMouseEnter = (name) => {
      rotationTimers.value[name] = window.setTimeout(() => {
        avatarRotations.value[name] = true;
        setTimeout(() => {
          if (avatarRotations.value[name] && name !== "万花筒写轮眼") {
            contributors.value.push({
              name: "万花筒写轮眼",
              avatar: Eye,
              url: ""
            });
          }
        }, 1e4);
      }, 1e3);
    };
    const handleMouseLeave = (name) => {
      if (rotationTimers.value[name]) {
        clearTimeout(rotationTimers.value[name]);
        delete rotationTimers.value[name];
      }
      avatarRotations.value[name] = false;
    };
    const isCheckingUpdate = ref(false);
    const checkUpdate = () => {
      isCheckingUpdate.value = true;
      setTimeout(() => {
        isCheckingUpdate.value = false;
      }, 1500);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("h2", _hoisted_3, toDisplayString(unref(i18nStore).t("setting.about.title")), 1),
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("div", _hoisted_5, toDisplayString(unref(i18nStore).t("setting.about.version")), 1),
            createBaseVNode("div", _hoisted_6, toDisplayString(getCurrentVersion()), 1),
            createBaseVNode("button", {
              disabled: isCheckingUpdate.value,
              class: "update-btn",
              onClick: checkUpdate
            }, [
              !isCheckingUpdate.value ? (openBlock(), createElementBlock("span", _hoisted_8, toDisplayString(unref(i18nStore).t("setting.about.checkUpdate")), 1)) : (openBlock(), createElementBlock("span", _hoisted_9, toDisplayString(unref(i18nStore).t("setting.about.checking")), 1))
            ], 8, _hoisted_7)
          ])
        ]),
        createBaseVNode("div", _hoisted_10, [
          createBaseVNode("h2", _hoisted_11, toDisplayString(unref(i18nStore).t("setting.about.contributors")), 1),
          createBaseVNode("div", _hoisted_12, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(contributors.value, (contributor) => {
              return openBlock(), createElementBlock("div", {
                key: contributor.name,
                class: "contributor"
              }, [
                createBaseVNode("div", {
                  class: normalizeClass(["avatar-container", { "rotate-avatar": avatarRotations.value[contributor.name] }]),
                  onMouseenter: ($event) => handleMouseEnter(contributor.name),
                  onMouseleave: ($event) => handleMouseLeave(contributor.name)
                }, [
                  createBaseVNode("img", {
                    src: contributor.avatar,
                    alt: contributor.name,
                    class: "avatar"
                  }, null, 8, _hoisted_14)
                ], 42, _hoisted_13),
                createBaseVNode("div", _hoisted_15, toDisplayString(contributor.name), 1)
              ]);
            }), 128))
          ])
        ]),
        createBaseVNode("div", _hoisted_16, [
          createBaseVNode("h2", _hoisted_17, toDisplayString(unref(i18nStore).t("setting.about.updateLogs")), 1),
          createBaseVNode("div", _hoisted_18, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(getUpdateLogs.value, (log, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: "update-log"
              }, [
                createBaseVNode("div", _hoisted_19, toDisplayString(log.version), 1),
                createBaseVNode("ul", _hoisted_20, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(log.items, (item, itemIndex) => {
                    return openBlock(), createElementBlock("li", {
                      key: itemIndex,
                      class: "update-item"
                    }, toDisplayString(item), 1);
                  }), 128))
                ])
              ]);
            }), 128))
          ])
        ])
      ]);
    };
  }
});
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b0a32121"]]);
export {
  about as default
};

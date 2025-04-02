import { d as defineComponent, u as useI18nStore, r as ref, q as reactive, s as onMounted, b as createElementBlock, e as createBaseVNode, t as toDisplayString, f as unref, F as Fragment, g as renderList, v as invokeMain, o as openBlock, i as normalizeClass, l as createCommentVNode, _ as _export_sfc } from "./index-DFclwqs1.js";
import { a as formatDateTime } from "./common.fun-D5HpNzqn.js";
const _hoisted_1 = { class: "log-viewer" };
const _hoisted_2 = { class: "log-viewer-header" };
const _hoisted_3 = { class: "log-viewer-subtitle" };
const _hoisted_4 = { class: "log-container" };
const _hoisted_5 = {
  key: 0,
  class: "log-loading"
};
const _hoisted_6 = {
  key: 1,
  class: "log-empty"
};
const _hoisted_7 = {
  key: 2,
  class: "log-list"
};
const _hoisted_8 = { class: "log-item-header" };
const _hoisted_9 = { class: "log-level" };
const _hoisted_10 = { class: "log-module" };
const _hoisted_11 = { class: "log-time" };
const _hoisted_12 = { class: "log-message" };
const _hoisted_13 = {
  key: 0,
  class: "log-data"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "log",
  setup(__props) {
    const i18nStore = useI18nStore();
    const logs = ref([]);
    const loading = ref(false);
    const pagination = reactive({
      currentPage: 1,
      pageSize: 50
      // 增加每页显示数量
    });
    const fetchLogs = async () => {
      loading.value = true;
      try {
        const queryParams = {
          level: "warn,error",
          // 只获取warn和error级别的日志
          limit: pagination.pageSize,
          offset: (pagination.currentPage - 1) * pagination.pageSize
        };
        const result = await invokeMain.getLogs(queryParams);
        logs.value = result.data;
      } catch (error) {
        console.error("获取日志失败", error);
      } finally {
        loading.value = false;
      }
    };
    onMounted(() => {
      fetchLogs();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("h2", null, toDisplayString(unref(i18nStore).t("setting.log.title")), 1),
          createBaseVNode("div", _hoisted_3, toDisplayString(unref(i18nStore).t("setting.log.subtitle")), 1)
        ]),
        createBaseVNode("div", _hoisted_4, [
          loading.value && logs.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_5, [
            _cache[0] || (_cache[0] = createBaseVNode("div", { class: "loading-indicator" }, null, -1)),
            createBaseVNode("span", null, toDisplayString(unref(i18nStore).t("setting.log.loading")), 1)
          ])) : logs.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_6, [
            _cache[1] || (_cache[1] = createBaseVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              width: "48",
              height: "48",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "1",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [
              createBaseVNode("path", { d: "M21 6h-4a2 2 0 0 1-2-2V0" }),
              createBaseVNode("path", { d: "M15 2H3a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4" }),
              createBaseVNode("line", {
                x1: "9",
                y1: "14",
                x2: "15",
                y2: "14"
              })
            ], -1)),
            createBaseVNode("p", null, toDisplayString(unref(i18nStore).t("setting.log.noLogs")), 1),
            createBaseVNode("span", null, toDisplayString(unref(i18nStore).t("setting.log.systemNormal")), 1)
          ])) : (openBlock(), createElementBlock("div", _hoisted_7, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(logs.value, (log2) => {
              return openBlock(), createElementBlock("div", {
                key: log2.id,
                class: normalizeClass(["log-item", log2.level])
              }, [
                createBaseVNode("div", _hoisted_8, [
                  createBaseVNode("span", _hoisted_9, toDisplayString(log2.level === "warn" ? unref(i18nStore).t("setting.log.warning") : unref(i18nStore).t("setting.log.error")), 1),
                  createBaseVNode("span", _hoisted_10, toDisplayString(log2.module), 1),
                  createBaseVNode("span", _hoisted_11, toDisplayString(unref(formatDateTime)(log2.created_at)), 1)
                ]),
                createBaseVNode("div", _hoisted_12, toDisplayString(log2.message), 1),
                log2.data ? (openBlock(), createElementBlock("div", _hoisted_13, [
                  createBaseVNode("pre", null, toDisplayString(log2.data), 1)
                ])) : createCommentVNode("", true)
              ], 2);
            }), 128))
          ]))
        ])
      ]);
    };
  }
});
const log = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3ba680ec"]]);
export {
  log as default
};

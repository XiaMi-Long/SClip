import { d as defineComponent, u as useI18nStore, a as useConfigStore, r as ref, c as computed, b as createElementBlock, e as createBaseVNode, t as toDisplayString, f as unref, F as Fragment, g as renderList, o as openBlock, i as normalizeClass, l as createCommentVNode, _ as _export_sfc } from "./index-DFclwqs1.js";
const _hoisted_1 = { class: "language-settings" };
const _hoisted_2 = { class: "settings-header" };
const _hoisted_3 = { class: "subtitle" };
const _hoisted_4 = { class: "quote-preview" };
const _hoisted_5 = { class: "quote-content" };
const _hoisted_6 = { class: "quote-author" };
const _hoisted_7 = { class: "language-section" };
const _hoisted_8 = { class: "language-options" };
const _hoisted_9 = ["onClick"];
const _hoisted_10 = { class: "language-flag" };
const _hoisted_11 = { class: "language-info" };
const _hoisted_12 = { class: "language-name" };
const _hoisted_13 = { class: "language-code" };
const _hoisted_14 = {
  key: 0,
  class: "check-icon"
};
const _hoisted_15 = { class: "apply-section" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "language",
  setup(__props) {
    const i18nStore = useI18nStore();
    const configStore = useConfigStore();
    const languages = [
      {
        id: "cn",
        name: "简体中文",
        code: "zh-CN",
        flagEmoji: "🇨🇳"
      },
      {
        id: "en",
        name: "English",
        code: "en-US",
        flagEmoji: "🇬🇧"
      }
    ];
    const selectedLanguage = ref(configStore.setting.appLanguage === "zh-CN" ? "cn" : "en");
    const currentQuote = computed(() => {
      return i18nStore.t("quote.content");
    });
    const currentAuthor = computed(() => {
      return i18nStore.t("quote.author");
    });
    const selectLanguage = (langId) => {
      selectedLanguage.value = langId;
    };
    const applyLanguageSetting = () => {
      const langCode = selectedLanguage.value === "cn" ? "zh-CN" : "en-US";
      configStore.setAppLanguage(langCode);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("h2", null, toDisplayString(unref(i18nStore).t("setting.language.title")), 1),
          createBaseVNode("p", _hoisted_3, toDisplayString(unref(i18nStore).t("setting.language.subtitle")), 1)
        ]),
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", _hoisted_5, [
            createBaseVNode("p", null, '"' + toDisplayString(currentQuote.value) + '"', 1),
            createBaseVNode("div", _hoisted_6, "— " + toDisplayString(currentAuthor.value), 1)
          ])
        ]),
        createBaseVNode("div", _hoisted_7, [
          createBaseVNode("h3", null, toDisplayString(unref(i18nStore).t("setting.language.selectLanguage")), 1),
          createBaseVNode("div", _hoisted_8, [
            (openBlock(), createElementBlock(Fragment, null, renderList(languages, (language2) => {
              return createBaseVNode("div", {
                key: language2.id,
                class: normalizeClass(["language-card", { active: selectedLanguage.value === language2.id }]),
                onClick: ($event) => selectLanguage(language2.id)
              }, [
                createBaseVNode("div", _hoisted_10, toDisplayString(language2.flagEmoji), 1),
                createBaseVNode("div", _hoisted_11, [
                  createBaseVNode("div", _hoisted_12, toDisplayString(language2.name), 1),
                  createBaseVNode("div", _hoisted_13, toDisplayString(language2.code), 1)
                ]),
                selectedLanguage.value === language2.id ? (openBlock(), createElementBlock("div", _hoisted_14, "✓")) : createCommentVNode("", true)
              ], 10, _hoisted_9);
            }), 64))
          ])
        ]),
        createBaseVNode("div", _hoisted_15, [
          createBaseVNode("button", {
            class: "apply-button",
            onClick: applyLanguageSetting
          }, toDisplayString(unref(i18nStore).t("setting.language.applyButton")), 1)
        ])
      ]);
    };
  }
});
const language = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a3762664"]]);
export {
  language as default
};

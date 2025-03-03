import { useStorage } from "@vueuse/core";
import type { PropType, SlotsType, VNode } from "vue";
import { defineComponent, h, onMounted, ref, shallowRef, watch } from "vue";

import type { TabProps } from "./Tabs.js";

import "../styles/code-tabs.scss";

const codeTabStore = useStorage<Record<string, string>>(
  "VUEPRESS_CODE_TAB_STORE",
  {},
);

export default defineComponent({
  name: "CodeTabs",

  props: {
    /**
     * Active tab index
     *
     * 激活的标签页序号
     */
    active: {
      type: Number,
      default: 0,
    },

    /**
     * Code tab data
     *
     * 代码标签页数据
     */
    data: {
      type: Array as PropType<TabProps[]>,
      required: true,
    },

    /**
     * Code tab id
     *
     * 代码标签页 id
     */
    id: {
      type: String,
      required: true,
    },

    /**
     * tab id
     *
     * 标签页 id
     */
    tabId: {
      type: String,
      default: "",
    },
  },

  slots: Object as SlotsType<{
    [slot: `title${number}`]: (props: {
      value: string;
      isActive: boolean;
    }) => VNode[];
    [slot: `tab${number}`]: (props: {
      value: string;
      isActive: boolean;
    }) => VNode[];
  }>,

  setup(props, { slots }) {
    // index of current active item
    // eslint-disable-next-line vue/no-setup-props-destructure
    const activeIndex = ref(props.active);

    // refs of the tab buttons
    const tabRefs = shallowRef<HTMLUListElement[]>([]);

    // update store
    const updateStore = (): void => {
      if (props.tabId)
        codeTabStore.value[props.tabId] = props.data[activeIndex.value].id;
    };

    // activate next tab
    const activateNext = (index = activeIndex.value): void => {
      activeIndex.value = index < tabRefs.value.length - 1 ? index + 1 : 0;
      tabRefs.value[activeIndex.value].focus();
    };

    // activate previous tab
    const activatePrev = (index = activeIndex.value): void => {
      activeIndex.value = index > 0 ? index - 1 : tabRefs.value.length - 1;
      tabRefs.value[activeIndex.value].focus();
    };

    // handle keyboard event
    const keyboardHandler = (event: KeyboardEvent, index: number): void => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        activeIndex.value = index;
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        activateNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        activatePrev();
      }

      if (props.tabId)
        codeTabStore.value[props.tabId] = props.data[activeIndex.value].id;
    };

    const getInitialIndex = (): number => {
      if (props.tabId) {
        const valueIndex = props.data.findIndex(
          ({ id }) => codeTabStore.value[props.tabId] === id,
        );

        if (valueIndex !== -1) return valueIndex;
      }

      return props.active;
    };

    onMounted(() => {
      activeIndex.value = getInitialIndex();

      watch(
        () => codeTabStore.value[props.tabId],
        (newValue, oldValue) => {
          if (props.tabId && newValue !== oldValue) {
            const index = props.data.findIndex(({ id }) => id === newValue);

            if (index !== -1) activeIndex.value = index;
          }
        },
      );
    });

    return (): VNode | null =>
      props.data.length
        ? h("div", { class: "vp-code-tabs" }, [
            h(
              "div",
              { class: "vp-code-tabs-nav", role: "tablist" },
              props.data.map(({ id }, index) => {
                const isActive = index === activeIndex.value;

                return h(
                  "button",
                  {
                    type: "button",
                    ref: (element) => {
                      if (element)
                        tabRefs.value[index] = <HTMLUListElement>element;
                    },
                    class: ["vp-code-tab-nav", { active: isActive }],
                    role: "tab",
                    "aria-controls": `codetab-${props.id}-${index}`,
                    "aria-selected": isActive,
                    onClick: () => {
                      activeIndex.value = index;
                      updateStore();
                    },
                    onKeydown: (event: KeyboardEvent) =>
                      keyboardHandler(event, index),
                  },
                  slots[`title${index}`]({ value: id, isActive }),
                );
              }),
            ),
            props.data.map(({ id }, index) => {
              const isActive = index === activeIndex.value;

              return h(
                "div",
                {
                  class: ["vp-code-tab", { active: isActive }],
                  id: `codetab-${props.id}-${index}`,
                  role: "tabpanel",
                  "aria-expanded": isActive,
                },
                slots[`tab${index}`]({ value: id, isActive }),
              );
            }),
          ])
        : null;
  },
});

import type { PropType, VNode } from "vue";
import { computed, defineComponent, h, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import DropTransition from "@theme-hope/components/transitions/DropTransition";
import ArticleItem from "@theme-hope/modules/blog/components/ArticleItem";
import Pagination from "@theme-hope/modules/blog/components/Pagination";
import { EmptyIcon } from "@theme-hope/modules/blog/components/icons/index";
import { useBlogOptions } from "@theme-hope/modules/blog/composables/index";

import type { ArticleInfo } from "../../../../shared/index.js";

import "../styles/article-list.scss";

declare const SUPPORT_PAGEVIEW: boolean;

export default defineComponent({
  name: "ArticleList",

  props: {
    /**
     * Articles
     *
     * 文章项目
     */
    items: {
      type: Array as PropType<{ path: string; info: ArticleInfo }[]>,
      default: () => [],
    },
  },

  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const blogOptions = useBlogOptions();

    const currentPage = ref(1);

    const articlePerPage = computed(
      () => blogOptions.value.articlePerPage || 10,
    );

    const currentArticles = computed(() =>
      props.items.slice(
        (currentPage.value - 1) * articlePerPage.value,
        currentPage.value * articlePerPage.value,
      ),
    );

    const updatePage = async (page: number): Promise<void> => {
      currentPage.value = page;

      const query = { ...route.query };

      if (query["page"] === page.toString() || (page === 1 && !query["page"]))
        return;
      if (page === 1) delete query["page"];
      else query["page"] = page.toString();

      await router.push({ path: route.path, query });

      if (SUPPORT_PAGEVIEW) {
        const { updatePageview } = await import(
          /* webpackChunkName: "pageview" */ "vuepress-plugin-comment2/pageview"
        );

        updatePageview();
      }
    };

    onMounted(() => {
      const { page } = route.query;

      void updatePage(page ? Number(page) : 1);

      watch(currentPage, () => {
        // list top border distance
        const distance =
          document.querySelector("#article-list")!.getBoundingClientRect().top +
          window.scrollY;

        setTimeout(() => {
          window.scrollTo(0, distance);

          if (SUPPORT_PAGEVIEW)
            void import(
              /* webpackChunkName: "pageview" */ "vuepress-plugin-comment2/pageview"
            ).then(({ updatePageview }) => updatePageview());
        }, 100);
      });
    });

    return (): VNode =>
      h(
        "div",
        { id: "article-list", class: "vp-article-list" },
        currentArticles.value.length
          ? [
              ...currentArticles.value.map(({ info, path }, index) =>
                h(DropTransition, { appear: true, delay: index * 0.04 }, () =>
                  h(ArticleItem, { key: path, info, path }),
                ),
              ),
              h(Pagination, {
                current: currentPage.value,
                perPage: articlePerPage.value,
                total: props.items.length,
                onUpdateCurrentPage: updatePage,
              }),
            ]
          : h(EmptyIcon),
      );
  },
});

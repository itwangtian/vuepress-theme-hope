---
title: Presentation
icon: person-chalkboard
---

Add presentation in your VuePress site via [Reveal.js](https://revealjs.com/).

## Config

::: code-tabs#language

@tab TS

```ts {8}
// .vuepress/config.ts
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";

export default {
  plugins: [
    mdEnhancePlugin({
      // Enable presentation
      revealJs: true,
    }),
  ],
};
```

@tab JS

```js {8}
// .vuepress/config.js
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";

export default {
  plugins: [
    mdEnhancePlugin({
      // Enable presentation
      revealJs: true,
    }),
  ],
};
```

:::

## Plugins and themes

`revealJs` also receives an object as options, allowing you to control imported built-in plugins and themes.

You can enable the following plugins with `revealJs.plugins` with an array of plugin names:

- `highlight`
- `math`
- `search`
- `notes`
- `zoom`

::: note

`markdown` plugin is enabled anyway to support markdown grammar.

:::

You can also enable the following themes with `revealJs.themes` with an array of theme names:

- `auto` (Default)
- `black`
- `white`
- `league`
- `beige`
- `sky`
- `night`
- `serif`
- `simple`
- `solarized`
- `blood`
- `moon`

By default, only auto theme is enabled.

## Syntax

- Use `---` to split slides
- Use `--` to split the slides second time (vertical display)

```md
@slidestart

<!-- slide1 -->

---

<!-- slide2 -->

---

<!-- slide3 -->

@slideend
```

By default, we use `auto` theme to render the presentation, but you can also use other themes with `@slidestart theme-you-want`.

For the appearance of each theme, see [Themes demo](themes.md).

## Demo

Please see [Slides Demo](demo.md)

## Customize Reveal.js

You can also import and call `defineRevealConfig` in client config file to customize reveal.js:

```ts
// .vuepress/client.ts
import { defineClientConfig } from "@vuepress/client";
import { defineRevealConfig } from "vuepress-plugin-md-enhance/client";

defineRevealConfig({
  // reveal.js options here
});

export default defineClientConfig({
  // ...
});
```

::: note

Reveal.js also provides [more plugins](https://github.com/hakimel/reveal.js/wiki/Plugins,-Tools-and-Hardware), you can add them via `plugin` option in `defineRevealConfig`. Built-in plugins you request at node side will be added automatically.

:::

You can also set `revealJs` to pass options to reveal.js per page in frontmatter.

For reveal.js options, see [reveal.js config](https://revealjs.com/config/). For reveal.js usage, see [reveal.js documentation](https://revealjs.com/)

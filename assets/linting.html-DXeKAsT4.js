import{_ as i,c as a,a as n,o as t}from"./app-CGcSqUwp.js";const l={};function s(r,e){return t(),a("div",null,e[0]||(e[0]=[n(`<h1 id="linting-formatting" tabindex="-1"><a class="header-anchor" href="#linting-formatting"><span>Linting &amp; formatting</span></a></h1><ul><li><a href="#languages">Languages</a></li><li><a href="#scripts">Scripts</a><ul><li><a href="#terminal">Terminal</a></li><li><a href="#pre-commit">Pre-commit</a></li><li><a href="#editor">Editor</a></li></ul></li><li><a href="#configuration">Configuration</a></li><li><a href="#faq">FAQ</a></li></ul><p>This project uses Typescript Eslint, and Prettier to catch errors and avoid bike-shedding by enforcing a common code style.</p><h2 id="languages" tabindex="-1"><a class="header-anchor" href="#languages"><span>Languages</span></a></h2><ul><li><strong>JavaScript</strong> is linted by Typescript Eslint and formatted by Prettier</li><li><strong>JSON</strong> is formatted by Prettier</li></ul><h2 id="scripts" tabindex="-1"><a class="header-anchor" href="#scripts"><span>Scripts</span></a></h2><p>There are a few different contexts in which the linters run.</p><h3 id="terminal" tabindex="-1"><a class="header-anchor" href="#terminal"><span>Terminal</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token comment"># Lint all files without auto-fixing</span></span>
<span class="line"><span class="token function">yarn</span> lint</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token comment"># Lint all files, fixing many violations automatically</span></span>
<span class="line"><span class="token function">yarn</span> lint:fix</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>See <code>package.json</code> to update.</p><h3 id="pre-commit" tabindex="-1"><a class="header-anchor" href="#pre-commit"><span>Pre-commit</span></a></h3><p>Staged files are automatically linted and tested before each commit. See <code>lint-staged.config.js</code> to update.</p><h3 id="editor" tabindex="-1"><a class="header-anchor" href="#editor"><span>Editor</span></a></h3><p>In supported editors, all files will be linted and show under the linter errors section.</p><h2 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration"><span>Configuration</span></a></h2><p>This boilerplate ships with opinionated defaults, but you can edit each tools configuration in the following config files:</p><ul><li><a href="https://eslint.org/docs/user-guide/configuring" target="_blank" rel="noopener noreferrer">ESLint</a><ul><li><code>.eslintrc.js</code></li><li><code>.eslintignore</code></li></ul></li></ul><h2 id="faq" tabindex="-1"><a class="header-anchor" href="#faq"><span>FAQ</span></a></h2><p><strong>So many configuration files! Why not move more of this to <code>package.json</code>?</strong></p><ul><li>Moving all possible configs to <code>package.json</code> can make it <em>really</em> packed, so that quickly navigating to a specific config becomes difficult.</li><li>When split out into their own file, many tools provide the option of exporting a config from JS. I do this wherever possible, because dynamic configurations are simply more powerful, able to respond to environment variables and much more.</li></ul>`,21)]))}const c=i(l,[["render",s],["__file","linting.html.vue"]]),d=JSON.parse('{"path":"/docs/linting.html","title":"Linting & formatting","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Languages","slug":"languages","link":"#languages","children":[]},{"level":2,"title":"Scripts","slug":"scripts","link":"#scripts","children":[{"level":3,"title":"Terminal","slug":"terminal","link":"#terminal","children":[]},{"level":3,"title":"Pre-commit","slug":"pre-commit","link":"#pre-commit","children":[]},{"level":3,"title":"Editor","slug":"editor","link":"#editor","children":[]}]},{"level":2,"title":"Configuration","slug":"configuration","link":"#configuration","children":[]},{"level":2,"title":"FAQ","slug":"faq","link":"#faq","children":[]}],"git":{"updatedTime":1735949246000,"contributors":[{"name":"bahaa-alden","username":"bahaa-alden","email":"samerabood195@gmail.com","commits":1,"url":"https://github.com/bahaa-alden"}]},"filePathRelative":"docs/linting.md"}');export{c as comp,d as data};
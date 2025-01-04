import{_ as a,c as n,a as s,o as i}from"./app-CGcSqUwp.js";const t={};function r(l,e){return i(),n("div",null,e[0]||(e[0]=[s(`<h1 id="code-generation" tabindex="-1"><a class="header-anchor" href="#code-generation"><span>Code Generation</span></a></h1><ul><li><a href="#code-generation">Code Generation</a><ul><li><a href="#installation">Installation</a></li><li><a href="#usage">Usage</a></li><li><a href="#generators-and-their-commands">Generators and Their Commands</a><ul><li><a href="#resource-generator">Resource Generator</a></li></ul></li><li><a href="#stay-in-touch">Stay in touch</a></li><li><a href="#license">License</a></li></ul></li></ul><h2 id="installation" tabindex="-1"><a class="header-anchor" href="#installation"><span>Installation</span></a></h2><p>Make sure you have the <a href="https://github.com/NarHakobyan/awesome-nest-schematics" target="_blank" rel="noopener noreferrer">Awesome Nest Schematics</a> installed in your project.</p><p>If you don&#39;t have it installed, you can install it by running the following command:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">yarn</span> <span class="token function">add</span> <span class="token parameter variable">-D</span> awesome-nest-schematics</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="usage" tabindex="-1"><a class="header-anchor" href="#usage"><span>Usage</span></a></h2><p>To generate code using the schematics, run the following command:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ nest g <span class="token parameter variable">-c</span> awesome-nestjs-schematics <span class="token operator">&lt;</span>schematic<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>OR</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate <span class="token operator">&lt;</span>schematic<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>For example, to generate a new controller:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate controller</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="generators-and-their-commands" tabindex="-1"><a class="header-anchor" href="#generators-and-their-commands"><span>Generators and Their Commands</span></a></h2><h4 id="resource-generator" tabindex="-1"><a class="header-anchor" href="#resource-generator"><span>Resource Generator</span></a></h4><p>Generate a new Nest resource, including a controller, service, and module.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate resource</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li><p><strong>DTO</strong>: Generate a new Data Transfer Object.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate dto</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>Controller</strong>: Generate a new Nest controller.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate controller</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>Decorator</strong>: Generate a new Nest decorator.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate decorator</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>Filter</strong>: Generate a new Nest filter.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate filter</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>Guard</strong>: Generate a new Nest guard.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate guard</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>Interceptor</strong>: Generate a new Nest interceptor.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate interceptor</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>Interface</strong>: Generate a new Nest interface.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate interface</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>Middleware</strong>: Generate a new Nest middleware.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate middleware</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>Module</strong>: Generate a new Nest module.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate module</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>Pipe</strong>: Generate a new Nest pipe.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate pipe</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>Provider</strong>: Generate a new Nest provider.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate provider</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>Service</strong>: Generate a new Nest service.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">yarn</span> generate <span class="token function">service</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ul><h2 id="stay-in-touch" tabindex="-1"><a class="header-anchor" href="#stay-in-touch"><span>Stay in touch</span></a></h2><ul><li>Website - <a href="https://nestjs.com/" target="_blank" rel="noopener noreferrer">https://nestjs.com</a></li><li>Twitter - <a href="https://twitter.com/NarHQ" target="_blank" rel="noopener noreferrer">@nestframework</a></li></ul><h2 id="license" tabindex="-1"><a class="header-anchor" href="#license"><span>License</span></a></h2><p>Nest is <a href="LICENSE">MIT licensed</a>.</p>`,22)]))}const o=a(t,[["render",r],["__file","code-generation.html.vue"]]),c=JSON.parse('{"path":"/docs/code-generation.html","title":"Code Generation","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Installation","slug":"installation","link":"#installation","children":[]},{"level":2,"title":"Usage","slug":"usage","link":"#usage","children":[]},{"level":2,"title":"Generators and Their Commands","slug":"generators-and-their-commands","link":"#generators-and-their-commands","children":[]},{"level":2,"title":"Stay in touch","slug":"stay-in-touch","link":"#stay-in-touch","children":[]},{"level":2,"title":"License","slug":"license","link":"#license","children":[]}],"git":{"updatedTime":1735949246000,"contributors":[{"name":"bahaa-alden","username":"bahaa-alden","email":"samerabood195@gmail.com","commits":1,"url":"https://github.com/bahaa-alden"}]},"filePathRelative":"docs/code-generation.md"}');export{o as comp,c as data};
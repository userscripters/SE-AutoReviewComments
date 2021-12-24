import { readFile, writeFile } from "fs/promises";
import { JSDOM } from "jsdom";
import { capitalize } from "lodash";
import mit from "markdown-it";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { defaultTranslators } from "node-html-markdown/dist/config";

(async () => {
    const path = "./README.md";

    const { homepage, name } = await import("../package.json");

    const md = await readFile(path, { encoding: "utf8" });

    const mdit = new mit({
        breaks: true,
        xhtmlOut: true,
        html: true
    });

    const html = mdit.render(md);

    const { window: { document, HTMLAnchorElement } } = new JSDOM(html);

    const hmp = new URL(homepage);
    const base = hmp.href.replace(hmp.hash, "");

    const replaceMap = new Map([
        ["stackapps", "http://stackapps.com/q/2116"],
        ["name", name.split("-").map(capitalize).join(" ")],
        ["pulls", `${base}/pulls`],
        ["contributors", `${base}/graphs/contributors`],
    ]);

    replaceMap.forEach((replacement, id) => {
        const elem = document.getElementById(id);

        if (elem instanceof HTMLAnchorElement) {
            return elem.href = replacement;
        }

        return elem!.textContent = replacement;
    });

    const updated = NodeHtmlMarkdown.translate(document.body.innerHTML, {
        useLinkReferenceDefinitions: true
    }, {
        "table": {
            postprocess: ({ content }) => {
                return `\r${content.replace(/[\n\r]{2}(!?)/g, "\r")}\r`;
            }
        },
        "tr": () => ({
            postprocess: ({ node, content }) => {
                if (!node.querySelector(":is(tr > th)")) {
                    return content.trim();
                }

                const cells = [...node.childNodes].filter((n) => n.nodeType === 1);

                const pfx = cells.map(({ textContent }) => "-".repeat(textContent?.length || 1)).join(" | ");

                return `${content.trim()}\r| ${pfx} |`;
            },
        }),
        "td,th": ({ node }) => {
            const { nextElementSibling } = node;
            const postfix = nextElementSibling ? "" : " |";
            return {
                postfix, prefix: "| ",
                surroundingNewlines: false,
            };
        },
        "div": (ctx) => {
            const { node } = ctx;

            if (node.id === "metadata") {
                return {
                    recurse: false,
                    content: node.outerHTML
                };
            }

            const { div } = defaultTranslators;
            return typeof div === "object" ? div : div(ctx);
        }
    });

    await writeFile(path, updated);
})();
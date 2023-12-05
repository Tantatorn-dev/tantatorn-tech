import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";
import wordcut from "wordcut";

export function remarkReadingTime() {
	return function (tree, { data }) {
		const textOnPage = toString(tree);

		wordcut.init();
		const processedText = wordcut.cut(textOnPage).split("|").join(" ");

		const readingTime = getReadingTime(processedText);
		data.astro.frontmatter.minutesRead = readingTime.text;
	};
}

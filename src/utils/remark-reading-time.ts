import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";
import wordcut from "wordcut";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReadingTimeFn = (tree: unknown, options: { data: any }) => void;

export function remarkReadingTime(): ReadingTimeFn {
	return function (tree, { data }) {
		const textOnPage = toString(tree);

		wordcut.init();
		const processedText = wordcut.cut(textOnPage).split("|").join(" ");

		const readingTime = getReadingTime(processedText);
		data.astro.frontmatter.minutesRead = readingTime.text;
	};
}

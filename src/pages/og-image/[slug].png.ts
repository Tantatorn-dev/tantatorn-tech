import type {APIContext, GetStaticPaths} from "astro";
import {getEntryBySlug} from "astro:content";
import satori, {type SatoriOptions} from "satori";
import {html} from "satori-html";
import {Resvg} from "@resvg/resvg-js";
import {siteConfig} from "@/site-config";
import {getAllPosts, getFormattedDate} from "@/utils";

import Kanit from "@/assets/Kanit-Regular.ttf";
import KanitBold from "@/assets/Kanit-Bold.ttf";
import type {ReactNode} from "react";

const ogOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	// debug: true,
	fonts: [
		{
			name: "Kanit",
			data: Buffer.from(Kanit),
			weight: 400,
			style: "normal",
		},
		{
			name: "Kanit",
			data: Buffer.from(KanitBold),
			weight: 700,
			style: "normal",
		},
	],
};

const markup = (title: string, pubDate: string) =>
	html`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
		<div tw="flex flex-col flex-1 w-full p-10 justify-center">
			<p tw="text-2xl mb-6">${pubDate}</p>
			<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
		</div>
		<div tw="flex items-center justify-between w-full p-10 border-t border-[#2bbc89] text-xl">
			<div tw="flex items-center">
				<img
					src="https://tantatorn.xyz/192x192.png"
					alt="Tantatorn's logo"
					width="60"
					height="60"
				/>
				<p tw="ml-3 font-semibold">${siteConfig.title}</p>
			</div>
			<p>by ${siteConfig.author}</p>
		</div>
	</div>`;

export async function GET({ params: { slug } }: APIContext) {
	const post = (await getEntryBySlug("post" as never, slug!)) as unknown as {
    data: {
      title?: string;
      publishDate?: string | Date;
      updatedDate?: string | Date;
      ogImage?: string;
    };
  }
	const title = post?.data.title ?? siteConfig.title;
	const postDate = getFormattedDate(
		post?.data.updatedDate ?? post?.data.publishDate ?? Date.now(),
		{
			weekday: "long",
			month: "long",
		},
	);
	const svg = await satori(markup(title, postDate) as unknown as ReactNode, ogOptions);
	const png = new Resvg(svg).render().asPng();
	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getAllPosts();
	return posts.filter(({ data }) => !data.ogImage).map(({ slug }) => ({ params: { slug } }));
};

import { useRef, useEffect } from "react";
import Typed from "typed.js";

const helloWorlds = [
	'console.log("Hello World")',
	'fmt.Println("Hello World")',
	'print("Hello World")',
	'System.out.println("Hello World")',
];

export default function HelloWorld() {
	const el = useRef(null);

	useEffect(() => {
		const typed = new Typed(el.current, {
			strings: helloWorlds,
			typeSpeed: 50,
			backSpeed: 50,
			loop: true,
		});

		return () => {
			typed.destroy();
		};
	}, []);

	return (
		<h1 className="mb-6 text-accent md:text-xl">
			<span ref={el} />
		</h1>
	);
}

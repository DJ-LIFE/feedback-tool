const Input = ({
	type = "text",
	...props
}: {
	type?: string;
	[key: string]: any;
}) => {
	return (
		<input
			type={type}
			className="border bg-white border-gray-300 p-2 w-full rounded-lg text-neutral-800 placeholder:text-gray-400 placeholder:text-sm"
			{...props}
		/>
	);
};

export default Input;

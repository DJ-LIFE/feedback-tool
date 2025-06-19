const Button = ({
	children,
	type = "button",
	...props
}: {
	type?: "submit" | "reset" | "button";
	children: React.ReactNode;
}) => {
	return (
		<button
			className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full w-full cursor-pointer hover:bg-blue-600"
			type={type}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;

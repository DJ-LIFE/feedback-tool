const Card = ({ children }: { children: React.ReactNode }) => {
	return <div className="bg-white border border-neutral-300 p-3 rounded-2xl shadow-md w-96 pb-10">{children}</div>;
};

export default Card;

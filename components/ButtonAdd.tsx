export default function ButtonAdd(props: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button {...props} className="bg-gray-100 rounded-md py-2 px-6 text-sm font-semibold shadow-sm hover:bg-gray-300">
      Add Column
    </button>
  );
}
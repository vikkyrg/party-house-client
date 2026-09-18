export function PlaceholderPage({ title }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mx-auto max-w-lg rounded-2xl bg-gray-50 border border-gray-100 p-10 shadow-sm">
        <h1 className="text-3xl font-black text-[#181533] mb-4">{title}</h1>
        <p className="text-gray-600">This page is currently under construction. Check back soon for updates!</p>
      </div>
    </div>
  );
}

export default function WorkplanLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Arbeitsplan wird geladen...</p>
      </div>
    </div>
  );
}

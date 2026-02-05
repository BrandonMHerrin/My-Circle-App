export function FormField({ id, label, children, error }: any) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
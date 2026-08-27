export default function PageContainer({
  children,
  narrow = false
}) {
  return (
    <div
      className={
        narrow
          ? "page-container page-container-narrow"
          : "page-container"
      }
    >
      {children}
    </div>
  );
}
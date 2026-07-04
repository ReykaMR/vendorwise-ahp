export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-muted/30">{children}</div>;
}

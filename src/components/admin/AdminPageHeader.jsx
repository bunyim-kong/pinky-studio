export default function AdminPageHeader({ title, action }) {
  return (
    <header className="admin-topbar">
      <div><span className="admin-kicker">Catalog management</span><h1>{title}</h1></div>
      {action}
    </header>
  );
}

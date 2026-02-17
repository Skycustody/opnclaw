import LogsClient from "./LogsClient";

export default function LogsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="oc-page-title">Logs</h1>
        <p className="oc-page-sub">
          View gateway logs in real-time.
        </p>
      </div>
      <LogsClient />
    </>
  );
}

import { Suspense } from "react";
import { getI18n } from "@/i18n/server";
import { Login } from "@/components/manage/Login";
import { Manager } from "@/components/manage/Manager";
import { ToastProvider } from "@/components/manage/Toasts";
import { readCatalog } from "@/lib/catalogStore";
import { hasSession } from "@/lib/session";
import "./page.css";

export async function generateMetadata() {
  const { t } = await getI18n();
  return { title: t.manage.title, robots: { index: false, follow: false } };
}

export default function ManagePage() {
  return (
    <div className="manage">
      <Suspense fallback={null}>
        <ManageEntry />
      </Suspense>
    </div>
  );
}

async function ManageEntry() {
  const signedIn = await hasSession();
  return <ToastProvider>{signedIn ? <Manager initial={await readCatalog()} /> : <Login />}</ToastProvider>;
}

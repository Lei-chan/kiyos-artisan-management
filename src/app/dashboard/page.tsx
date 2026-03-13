import Link from "next/link";
import { logout } from "../lib/dal";

export default function Dashboard() {
  const linkClassName =
    "w-[8rem] aspect-square rounded shadow-md shadow-black/20 bg-linear-to-l from-orange-400 to-yellow-300 hover:from-orange-300 hover:to-yellow-200  flex flex-col justify-center px-3";
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center py-3 gap-3">
      <h1 className="text-2xl text-amber-600">管理者ダッシュボード</h1>
      <div className="w-[90%] grid grid-cols-2 place-items-center gap-y-3 text-lg text-center text-black/80">
        <Link href="/register-history" className={linkClassName}>
          Historyを追加・編集
        </Link>
        <Link href="/register-news" className={linkClassName}>
          お知らせを追加・編集
        </Link>
        <Link href="/add" className={linkClassName}>
          管理者の追加
        </Link>
      </div>
      <button
        type="button"
        className="absolute bottom-3 right-3 bg-green-400 rounded text-white px-1 shadow shadow-black/20 transition-all  duration-150 hover:-translate-y-0.5 hover:bg-yellow-400"
        onClick={logout}
      >
        ログアウト
      </button>
    </div>
  );
}

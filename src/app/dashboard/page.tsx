import Link from "next/link";
import { logout } from "../lib/dal";

export default function Dashboard() {
  const linkClassName =
    "w-[90%] lg:w-[85%] aspect-square rounded shadow-md shadow-black/20 bg-linear-to-l from-orange-400 to-yellow-300 hover:from-orange-300 hover:to-yellow-200  flex flex-col justify-center px-3";
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center py-3 gap-3 md:gap-6 lg:gap-5 2xl:gap-7">
      <h1 className="text-2xl text-amber-600">管理者ダッシュボード</h1>
      <div className="w-[18rem] sm:w-[20rem] lg:w-[32rem] xl:w-[37rem] 2xl:w-[40rem] grid grid-cols-2 lg:grid-cols-3 place-items-center gap-y-3 text-lg text-center text-black/80">
        <Link href="/register-history" className={linkClassName}>
          Historyを
          <br />
          追加・編集
        </Link>
        <Link href="/register-news" className={linkClassName}>
          お知らせを
          <br />
          追加・編集
        </Link>
        <Link href="/add" className={linkClassName}>
          管理者の
          <br />
          追加
        </Link>
      </div>
      <button
        type="button"
        className="absolute bottom-3 right-3 md:bottom-4 md:right-4 lg:bottom-5 lg:right-5 xl:bottom-6 xl:right-6 2xl:bottom-7 2xl:right-7 bg-green-400 rounded text-white px-1 shadow shadow-black/20 transition-all  duration-150 hover:-translate-y-0.5 hover:bg-yellow-400"
        onClick={logout}
      >
        ログアウト
      </button>
    </div>
  );
}

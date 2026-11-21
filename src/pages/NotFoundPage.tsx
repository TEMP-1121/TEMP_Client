import { Link } from 'react-router'

// 셸은 4xx를 막지 않으므로 웹이 직접 보여 준다
export default function NotFoundPage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <h2 className="text-lg font-bold">페이지를 찾을 수 없어요</h2>
      <Link to="/" className="rounded-2xl bg-neutral-900 px-6 py-3 font-semibold text-white">
        처음으로
      </Link>
    </section>
  )
}

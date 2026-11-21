// 선택된 카드는 철학자 색을 반투명하게 깐다. Tailwind는 완성된 클래스 문자열만 스캔해서 키로 조합하지 않고 다 적는다
export const SELECTED_CARD_BG: Record<string, string> = {
  epictetus: 'bg-philosopher-epictetus/50',
  nietzsche: 'bg-philosopher-nietzsche/50',
  marx: 'bg-philosopher-marx/45',
  camus: 'bg-philosopher-camus/45',
  zhuangzi: 'bg-philosopher-zhuangzi/45',
  epicurus: 'bg-philosopher-epicurus/50',
  aristotle: 'bg-philosopher-aristotle/45',
  arendt: 'bg-philosopher-arendt/50',
  weil: 'bg-philosopher-weil/50',
}

export const TAG_COLOR: Record<string, string> = {
  epictetus: 'border-philosopher-epictetus-tag text-philosopher-epictetus-tag',
  nietzsche: 'border-philosopher-nietzsche-tag text-philosopher-nietzsche-tag',
  marx: 'border-philosopher-marx-tag text-philosopher-marx-tag',
  camus: 'border-philosopher-camus-tag text-philosopher-camus-tag',
  zhuangzi: 'border-philosopher-zhuangzi-tag text-philosopher-zhuangzi-tag',
  epicurus: 'border-philosopher-epicurus-tag text-philosopher-epicurus-tag',
  aristotle: 'border-philosopher-aristotle-tag text-philosopher-aristotle-tag',
  arendt: 'border-philosopher-arendt-tag text-philosopher-arendt-tag',
  weil: 'border-philosopher-weil-tag text-philosopher-weil-tag',
}

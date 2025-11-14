/**
 * パフォーマンス計測ユーティリティ
 * 憲法PR-001準拠: CRUD操作100ms以内
 */

/**
 * 関数の実行時間を計測する
 * 
 * @param fn - 計測対象の関数
 * @param label - ログ出力用のラベル
 * @param threshold - 閾値（ミリ秒）、超過時に警告
 * @returns 関数の実行結果と実行時間
 */
export async function measurePerformance<T>(
  fn: () => T,
  label: string = 'Operation',
  threshold: number = 100
): Promise<{ result: T; duration: number; exceeded: boolean }> {
  const startTime = performance.now()
  const result = await fn()
  const endTime = performance.now()
  const duration = endTime - startTime
  const exceeded = duration > threshold

  if (exceeded) {
    console.warn(
      `⚠️ Performance threshold exceeded: ${label} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
    )
  } else {
    console.log(`✅ Performance OK: ${label} took ${duration.toFixed(2)}ms`)
  }

  return { result, duration, exceeded }
}

/**
 * 同期関数の実行時間を計測する
 * 
 * @param fn - 計測対象の関数
 * @param label - ログ出力用のラベル
 * @param threshold - 閾値（ミリ秒）、超過時に警告
 * @returns 関数の実行結果と実行時間
 */
export function measurePerformanceSync<T>(
  fn: () => T,
  label: string = 'Operation',
  threshold: number = 100
): { result: T; duration: number; exceeded: boolean } {
  const startTime = performance.now()
  const result = fn()
  const endTime = performance.now()
  const duration = endTime - startTime
  const exceeded = duration > threshold

  if (exceeded) {
    console.warn(
      `⚠️ Performance threshold exceeded: ${label} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
    )
  } else {
    console.log(`✅ Performance OK: ${label} took ${duration.toFixed(2)}ms`)
  }

  return { result, duration, exceeded }
}

/**
 * メモリ使用量を取得する（利用可能な場合）
 * 憲法PR-003準拠: メモリ50MB以下
 * 
 * @returns メモリ使用量（バイト）、取得できない場合はnull
 */
export function getMemoryUsage(): number | null {
  if ('memory' in performance && performance.memory) {
    // @ts-ignore - performance.memory is not standard
    return performance.memory.usedJSHeapSize
  }
  return null
}

/**
 * メモリ使用量が閾値を超えているかチェック
 * 憲法PR-003準拠: メモリ50MB以下
 * 
 * @param thresholdMB - 閾値（MB）
 * @returns 超過している場合true
 */
export function checkMemoryThreshold(thresholdMB: number = 50): boolean {
  const memoryBytes = getMemoryUsage()
  if (memoryBytes === null) {
    // メモリ情報が取得できない場合は警告なし
    return false
  }

  const memoryMB = memoryBytes / (1024 * 1024)
  const exceeded = memoryMB > thresholdMB

  if (exceeded) {
    console.warn(
      `⚠️ Memory threshold exceeded: ${memoryMB.toFixed(2)}MB (threshold: ${thresholdMB}MB)`
    )
  }

  return exceeded
}

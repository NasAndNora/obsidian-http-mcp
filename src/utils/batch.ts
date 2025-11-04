// Batch processing utility to limit concurrent operations and prevent API throttling

/**
 * Process items in batches with limited concurrency
 *
 * @param items - Array of items to process
 * @param processor - Async function to process each item
 * @param batchSize - Maximum concurrent operations (default: 20)
 * @returns Array of successfully processed results
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 20
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(processor));

    // Collect only fulfilled results, skip rejected
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    }
  }

  return results;
}

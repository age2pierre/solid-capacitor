import { createAsync } from '@solidjs/router'

import { cachedReadLockFile } from './DemoDataLoadind.data'

export default function DemoDataLoading() {
  const data = createAsync(async () => {
    const fileStr = await cachedReadLockFile()
    return fileStr
  })
  return (
    <>
      <pre>{data() ?? 'Loading...'}</pre>
    </>
  )
}

import { forwardRef } from 'react'

/* A single magazine leaf. react-pageflip assigns the ref and reads
   data-density ("hard" = stiff cover, "soft" = bendy paper). */
const Page = forwardRef(function Page({ className = '', density = 'soft', children }, ref) {
  return (
    <div className={`page ${className}`} ref={ref} data-density={density}>
      <div className="page-inner">{children}</div>
    </div>
  )
})

export default Page

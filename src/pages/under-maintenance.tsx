import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/custom/button"
import MiscellaneousLayout from "@/layouts/miscellaneous"
import { Fence } from "@/cores/lucide"
// import imageUnderMaintenance from "@/assets/illustration/girl-doing-yoga-new.png"

export default function UnderMaintenancePage() {
  return (
    <MiscellaneousLayout
      name={503}
      icon={Fence}
      color="text-professional-warning"
      title="Under Maintenance!"
      description={[
        "The site is not available at the moment.",
        "We'll be back online shortly."
      ]}
    />
  )
}
function UnderMaintenancePageX() {
  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-2 p-6 text-center min-block-[calc(100vh-2rem*2)]">
          <h1 className="mx-2 mb-2 text-8xl leading-none font-medium">503</h1>
          <h4 className="mx-2 mb-2 text-2xl font-medium tracking-tight">Under Maintenance! 🚧</h4>
          <p className="mb-6 mx-2">Sorry for the inconvenience but we're performing some maintenance at the moment</p>
          <Button nativeButton={false} render={<Link href="/" />}>
            Back to home
          </Button>
          <div className="mt-6">
            {/* <Image src={imageUnderMaintenance} alt="page-misc" width={512} height={512} loading="eager" className="h-auto w-auto max-w-full visible"/> */}
          </div>
        </div>
      </div>
    </>
  )
}

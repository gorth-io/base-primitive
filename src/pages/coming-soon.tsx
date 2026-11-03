import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/custom/button"
import MiscellaneousLayout from "@/layouts/miscellaneous"
import { Rocket } from "@/cores/lucide"
// import imageComingSoon from "@/assets/illustration/boy-with-rocket-light.png"

export default function ComingSoonPage() {
  return (
    <MiscellaneousLayout
      name={401}
      icon={Rocket}
      color="text-professional-warning"
      title="Coming Soon"
      description={[
        "We are launching soon",
        "Go Home!"
      ]}
    />
  )
}

function ComingSoonPageX() {
  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-2 p-6 text-center min-block-[calc(100vh-2rem*2)]">
          {/* <h1 className="mx-2 mb-2 text-8xl leading-none font-medium">401</h1> */}
          <h4 className="mx-2 mb-2 text-2xl font-medium tracking-tight">We are launching soon 🚀</h4>
          <p className="mb-6 mx-2">You don't have permission to access this page. Go Home!</p>
          <Button nativeButton={false} render={<Link href="/" />}>
            Back to home
          </Button>
          <div className="mt-6">
            {/* <Image src={imageComingSoon} alt="page-misc-error-light" width={512} height={512} loading="eager" className="h-auto w-auto max-w-full visible"/> */}
          </div>
        </div>
      </div>
    </>
  )
}

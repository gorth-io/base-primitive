import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/custom/button"
import MiscellaneousLayout from "@/layouts/miscellaneous"
import { CircleAlert } from "@/cores/lucide"
// import imageNotFound from "@/assets/illustration/page-misc-error-new.png"

export default function NotFoundPage() {
  return (
    <MiscellaneousLayout
      name={404}
      icon={CircleAlert}
      color="text-professional-warning"
      title="Page Not Found"
      description={[
        "It seems like the page you're looking for",
        "does not exist or might have been removed."
      ]}
    />
  )
}

function NotFoundPageX() {
  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-2 p-6 text-center min-block-[calc(100vh-2rem*2)]">
          <h1 className="mx-2 mb-2 text-8xl leading-none font-medium">404</h1>
          <h4 className="mx-2 mb-2 text-2xl font-medium tracking-tight">Page Not Found️ ⚠️</h4>
          <p className="mb-6 mx-2">We could not find the page you are looking for</p>
          <Button nativeButton={false} render={<Link href="/" />}>
            Back to home
          </Button>
          <div className="mt-6">
            {/* <Image src={imageNotFound} alt="page-misc" width={512} height={512} loading="eager" className="h-auto w-auto max-w-full visible"/> */}
          </div>
        </div>
      </div>
    </>
  )
}

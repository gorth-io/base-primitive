import Image from "next/image"
import { StarsBackground } from "./ground"
import { cn } from "cn"

const Miscellaneous35 = ({
  size,
  href,
  className,
}: {
  size: number,
  href: string
  className?: string
}) => {
  return (
    <StarsBackground className={cn("flex h-full w-full max-w-lg items-center justify-center rounded-xl bg-black", className)}>
      <Image
        unoptimized
        width={size}
        height={size}
        src={href}
        alt="Miscellaneous"
        className={cn("z-1 object-contain transition-transform duration-500 hover:-translate-y-1.5 hover:scale-110", size / 4)}
      />
    </StarsBackground>
  )
}

export default Miscellaneous35

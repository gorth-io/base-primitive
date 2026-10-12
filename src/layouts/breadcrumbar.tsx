// "use client"

// import React, { ReactNode, Fragment, useEffect } from "react"
// import Link from "next/link"
// import { usePathname, useRouter } from "next/navigation"
// import {
// 	Breadcrumb,
// 	BreadcrumbItem,
// 	BreadcrumbLink,
// 	BreadcrumbList,
// 	BreadcrumbPage,
// 	BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { appGlobal } from "@/lib/constants"
// import { createBreadcrumbs } from "@/utils/linkers"

// export function Breadcrumbar() {
// 	const pathname = usePathname()
// 	const breadcrumbs = createBreadcrumbs(pathname, appGlobal.name)

// 	return (
// 		<Breadcrumb>
// 			<BreadcrumbList>
// 				{breadcrumbs.map((item, index) => (
// 					<Fragment key={item.href}>
// 						<BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
// 							{item.isLast ? (
// 								<BreadcrumbPage>{item.label}</BreadcrumbPage>
// 							) : (
// 								<BreadcrumbLink asChild>
// 									<Link href={item.href}>
// 										{item.label}
// 									</Link>
// 								</BreadcrumbLink>
// 							)}
// 						</BreadcrumbItem>
// 						{!item.isLast && (
// 							<BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
// 						)}
// 					</Fragment>
// 				))}
// 			</BreadcrumbList>
// 		</Breadcrumb>
// 	)
// }
// "use client"

// import { Button } from "@gorth/primitive/custom/button"
// import {
//   useCreatePostMutation,
//   useDeletePostMutation,
//   useGetPostByIdQuery,
//   usePatchPostMutation,
//   useUpdatePostMutation,
// } from "@/services/demo"

// export default function Page() {
//   const {
//     data: itemData,
//     isLoading: isFetchingItem,
//     isFetching,
//     isError,
//     error,
//     refetch,
//   } = useGetPostByIdQuery("post-1")

//   const [createPost, createState] = useCreatePostMutation()
//   const [updatePost, updateState] = useUpdatePostMutation()
//   const [patchPost, patchState] = usePatchPostMutation()
//   const [deletePost, deleteState] = useDeletePostMutation()

//   async function handleCreate() {
//     await createPost({
//       title: "Created from RTK-style Mutation",
//       body: "POST /posts",
//     }).unwrap()
//   }

//   async function handleUpdate() {
//     await updatePost({
//       id: "post-1",
//       data: {
//         title: "Updated from RTK-style Mutation",
//         body: "PUT /posts/post-1",
//       },
//     }).unwrap()
//   }

//   async function handlePatch() {
//     await patchPost({
//       id: "post-1",
//       data: {
//         title: "Patched post",
//       },
//     }).unwrap()
//   }

//   async function handleDelete() {
//     await deletePost("post-1").unwrap()
//   }

//   const mutationError =
//     createState.error ??
//     updateState.error ??
//     patchState.error ??
//     deleteState.error
//   const mutationData =
//     createState.data ?? updateState.data ?? patchState.data ?? deleteState.data
//   const isMutating =
//     createState.isLoading ||
//     updateState.isLoading ||
//     patchState.isLoading ||
//     deleteState.isLoading

//   return (
//     <main className="container mx-auto flex min-h-svh flex-col gap-6 p-6">
//       <header className="space-y-1">
//         <h1 className="text-2xl font-semibold">RTK-style caller demo</h1>
//         <p className="text-muted-foreground text-sm">
//           Service definitions generate TanStack Query hooks and unwrap-able
//           mutation triggers.
//         </p>
//       </header>

//       <section className="flex flex-wrap gap-2">
//         <Button
//           type="button"
//           onClick={() => void refetch()}
//           disabled={isFetching}
//         >
//           Refetch
//         </Button>
//         <Button
//           type="button"
//           variant="outline"
//           disabled={createState.isLoading}
//           onClick={() => void handleCreate()}
//         >
//           Create
//         </Button>
//         <Button
//           type="button"
//           variant="outline"
//           disabled={updateState.isLoading}
//           onClick={() => void handleUpdate()}
//         >
//           Update
//         </Button>
//         <Button
//           type="button"
//           variant="outline"
//           disabled={patchState.isLoading}
//           onClick={() => void handlePatch()}
//         >
//           Patch
//         </Button>
//         <Button
//           type="button"
//           variant="destructive"
//           disabled={deleteState.isLoading}
//           onClick={() => void handleDelete()}
//         >
//           Delete
//         </Button>
//       </section>

//       <section className="rounded-lg border p-4">
//         <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
//           <div>
//             <dt className="text-muted-foreground">isLoading</dt>
//             <dd>{String(isFetchingItem)}</dd>
//           </div>
//           <div>
//             <dt className="text-muted-foreground">isFetching</dt>
//             <dd>{String(isFetching)}</dd>
//           </div>
//           <div>
//             <dt className="text-muted-foreground">isError</dt>
//             <dd>{String(isError)}</dd>
//           </div>
//           <div>
//             <dt className="text-muted-foreground">Mutation isLoading</dt>
//             <dd>{String(isMutating)}</dd>
//           </div>
//         </dl>
//       </section>

//       <section className="rounded-lg border p-4">
//         {isFetchingItem ? (
//           <p>Loading post...</p>
//         ) : error ? (
//           <p className="text-destructive">{error.message}</p>
//         ) : (
//           <pre className="overflow-auto text-xs">
//             {JSON.stringify(itemData, null, 2)}
//           </pre>
//         )}
//       </section>

//       <section className="rounded-lg border p-4">
//         <h2 className="mb-2 font-medium">Latest mutation result</h2>
//         {mutationError ? (
//           <p className="text-destructive">{mutationError.message}</p>
//         ) : (
//           <pre className="overflow-auto text-xs">
//             {JSON.stringify(mutationData ?? null, null, 2)}
//           </pre>
//         )}
//       </section>
//     </main>
//   )
// }

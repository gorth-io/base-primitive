// "use client"

// /* eslint-disable react-hooks/rules-of-hooks -- These functions build service definitions; they do not execute React hooks. */

// import { z } from "zod"
// import {
//   createMutationService,
//   createQueryService,
//   useMutation,
//   useQuery,
// } from "@/utils/caller"

// export interface Post {
//   id: string
//   title: string
//   body: string
//   createdAt: string
// }

// export interface PostInput {
//   title: string
//   body: string
// }

// export interface UpdatePostInput {
//   id: string
//   data: PostInput
// }

// export interface PatchPostInput {
//   id: string
//   data: Partial<PostInput>
// }

// export const postQueryKey = ["posts"] as const

// const postSchema = z.object({
//   id: z.string(),
//   title: z.string(),
//   body: z.string(),
//   createdAt: z.string(),
// })

// const getPostByIdService = useQuery({
//   queryKey: (id: string) => ["posts", id] as const,
//   query: (id: string) => ({
//     baseURL: null,
//     url: `/posts/${encodeURIComponent(id)}`,
//     method: "GET",
//     cache: "no-store",
//     credentials: "include",
//     responseHandler: "json",
//     schema: postSchema,
//     timeout: 10_000,
//     validateStatus: (status) => status >= 200 && status < 300,
//   }),
//   queryOptions: {
//     retry: false,
//     staleTime: 30_000,
//   },
// })

// const createPostService = useMutation({
//   query: (data: PostInput) => ({
//     baseURL: null,
//     url: "/posts",
//     method: "POST",
//     body: data,
//     schema: postSchema,
//     toast: {
//       success: "Post created",
//     },
//     timeout: 10_000,
//   }),
//   invalidates: [postQueryKey],
// })

// const updatePostService = useMutation({
//   query: ({ id, data }: UpdatePostInput) => ({
//     baseURL: null,
//     url: `/posts/${encodeURIComponent(id)}`,
//     method: "PUT",
//     body: data,
//     schema: postSchema,
//   }),
//   invalidates: (_data, { id }) => [postQueryKey, ["posts", id] as const],
// })

// const patchPostService = useMutation({
//   query: ({ id, data }: PatchPostInput) => ({
//     baseURL: null,
//     url: `/posts/${encodeURIComponent(id)}`,
//     method: "PATCH",
//     body: data,
//     schema: postSchema,
//   }),
//   invalidates: (_data, { id }) => [postQueryKey, ["posts", id] as const],
// })

// const deletePostService = useMutation({
//   query: (id: string) => ({
//     baseURL: null,
//     url: `/posts/${encodeURIComponent(id)}`,
//     method: "DELETE",
//     schema: postSchema,
//   }),
//   invalidates: [postQueryKey],
// })

// export const useGetPostByIdQuery = createQueryService(getPostByIdService)
// export const useCreatePostMutation = createMutationService(createPostService)
// export const useUpdatePostMutation = createMutationService(updatePostService)
// export const usePatchPostMutation = createMutationService(patchPostService)
// export const useDeletePostMutation = createMutationService(deletePostService)

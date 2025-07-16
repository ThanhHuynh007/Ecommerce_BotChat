import { useMutation } from "@tanstack/react-query"

// export const useMutationHooks = (fnCallback) => {
//     const mutation = useMutation({
//     mutationFn: data => fnCallback
//   })
//   return mutation
// }

export const useMutationHooks = (fnCallback) => {
  const mutation = useMutation({
    mutationFn: (data) => fnCallback(data)  // ✅ fix
  })
  return mutation
}

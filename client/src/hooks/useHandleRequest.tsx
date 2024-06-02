import { useState } from "react"

interface HandleRequestProps<T> {
  request: () => Promise<T>
  onSuccessMessage?: string
  onErrorMessage?: string
}

export const useHandleRequest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequest = async <T,>({
    request,
    onSuccessMessage,
    onErrorMessage,
  }: HandleRequestProps<T>) => {
    setLoading(true)
    setError(null)

    try {
      const message = await request()
      alert(onSuccessMessage ?? "Request fulfilled")
      console.log("fulfilled", message)
      return message
    } catch (error) {
      setError("Request failed")
      alert(onErrorMessage ?? "Request rejected")
      console.error("rejected", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { handleRequest, loading, error }
}

export default useHandleRequest

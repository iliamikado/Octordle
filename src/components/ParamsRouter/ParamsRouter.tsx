import { useRouter, useSearchParams } from "next/navigation";

export function useParamsRouter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const myRouter = {
        push: (url: string) => {
            router.push(`${url}?${searchParams.toString()}`)
        },
        changeParams: (params: string) => {
            router.push(`?${params}`)
        }
    }

    return myRouter;
}
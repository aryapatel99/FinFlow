import { LoaderCircle } from "lucide-react";

function LoadingState({
    message = "Loading...",
}) {
    return (
        <div className="flex min-h-[280px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-500">
                <LoaderCircle
                    size={30}
                    className="animate-spin text-slate-900"
                />

                <p className="text-sm font-medium">
                    {message}
                </p>
            </div>
        </div>
    );
}

export default LoadingState;
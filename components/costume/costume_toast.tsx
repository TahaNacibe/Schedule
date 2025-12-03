import { toast } from "sonner"

interface CostumeToast {
    content: string | null | undefined,
    type: "ERROR" | "INFO" | "ALERT"
}


export default function costumeToast({ content, type }
    : CostumeToast) {
    const cleanedContent = content == null || content == undefined ? "Unknown error accrued" : content
    switch (type) {
        case "ERROR":
            toast.error(cleanedContent)
            break;
        case "INFO":
            toast.info(content)
            break;
        case "ALERT":
            toast.warning(content)
            break;
    
        default:
            break;
    }
}
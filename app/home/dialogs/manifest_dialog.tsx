"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import LoadingPinWheel from "@/components/costume/spinner_wheel"


interface ManifestDialogProps {
  trigger?: React.ReactNode
  ext?: ExtensionInstance | null
  mode: "view" | "edit" | "create"
  loading? : boolean
  onSave?: (data: Partial<ExtensionInstance>) => void
  onClose?: () => void
  title?: string
  description?: string
}

export function ManifestDialog({
  trigger,
  ext,
  mode,
  onSave,
  onClose,
  loading,
  title = mode === "create" ? "Create Extension" : mode === "edit" ? "Edit Extension" : "View Extension",
  description = mode === "create" ? "Fill in the basic details for the new extension." : mode === "edit" ? "Update the basic extension details." : "View the basic extension details.",
}: ManifestDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: ext?.name || "",
    version: ext?.version || "",
    description: ext?.description || "",
    url: ext?.url || "",
    id: ext?.id ||""
  })

  const isViewMode = mode === "view"
  const isEditableMode = mode === "edit" || mode === "create"

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.(formData)
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  React.useEffect(() => {
    if (ext && open) {
      setFormData({
        name: ext.name,
        version: ext.version,
        description: ext.description,
        url: ext.url,
        id: ext.id
      })
    } else if (!ext && open && mode === "create") {
      setFormData({
        name: "",
        version: "",
        description: "",
        url: "",
        id:""
      })
    }
  }, [ext, open, mode])

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) onClose?.(); }}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isViewMode}
              placeholder="Extension name"
            />
          </div>
          <div>
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={formData.version}
              onChange={(e) => handleInputChange("version", e.target.value)}
              disabled={isViewMode}
              placeholder="1.0.0"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isViewMode}
              placeholder="Brief description of the extension"
            />
          </div>
          <div>
            <Label htmlFor="url">Extension Zip URL</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              disabled={isViewMode}
              placeholder="https://example.com/extension.zip"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {isEditableMode && (
              <Button
                disabled={loading != null && loading}
                type="submit">
                {mode === "create" ? "Create" : "Save"}
                {loading && <LoadingPinWheel size="w-4 h-4" />}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
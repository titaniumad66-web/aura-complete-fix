import { useEffect, useState } from "react";
import { getValidAuthToken } from "@/lib/queryClient";
import { Download } from "lucide-react";

type TemplateItem = {
  id: string;
  title: string;
  imageUrl: string;
};

export default function AdminDashboard() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      if (!res.ok) {
        setError("Failed to load templates.");
        return;
      }
      const data = await res.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load templates.");
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || isSubmitting) return;
    const token = getValidAuthToken();
    if (!token) {
      setError("You must be logged in as admin.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", title.trim());
    formData.append("title", title.trim());
    formData.append("image", file);

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        setError("Upload failed. Please try again.");
        return;
      }

      setTitle("");
      setFile(null);
      await fetchTemplates();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    const token = getValidAuthToken();
    if (!token) {
      setError("You must be logged in as admin.");
      return;
    }

    try {
      const res = await fetch(`/api/templates/${templateId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setError("Delete failed. Please try again.");
        return;
      }

      setTemplates((prev) => prev.filter((item) => item.id !== templateId));
    } catch {
      setError("Delete failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-serif font-medium">👑 Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome King. System is under your control.
          </p>
        </div>

        <div className="rounded-3xl border border-white/50 bg-white/70 p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-serif font-medium mb-4">
            Admin Template Manager
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Template Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-11 rounded-xl border border-border bg-white/70 px-4 text-sm shadow-sm"
                placeholder="Romantic teaser"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setFile(event.target.files ? event.target.files[0] : null)
                }
                className="h-11 rounded-xl border border-border bg-white/70 px-4 text-sm shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !file}
              className="h-11 px-6 rounded-xl bg-black text-white text-sm font-medium shadow-lg hover:scale-105 transition-transform disabled:opacity-60"
            >
              {isSubmitting ? "Uploading..." : "Upload Template"}
            </button>
          </form>
          {error && (
            <div className="mt-4 text-sm text-red-600">{error}</div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-serif font-medium">Existing Templates</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative rounded-2xl overflow-hidden aspect-[9/16] shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img
                src={template.imageUrl}
                alt={template.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center justify-end text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <a
                  href={template.imageUrl}
                  download
                  className="flex flex-col items-center text-white"
                >
                  <Download className="w-8 h-8 text-white mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                  <span className="text-sm font-medium">Download</span>
                </a>
                <p className="text-white font-medium text-lg">
                  {template.title || "Template"}
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(template.id)}
                  className="mt-3 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-gray-900 shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

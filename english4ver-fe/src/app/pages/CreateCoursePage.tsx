import { useState } from "react";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const COLOR_OPTIONS = [
  { label: "Xanh dương", value: "bg-blue-500" },
  { label: "Xanh lá", value: "bg-green-500" },
  { label: "Tím", value: "bg-purple-500" },
  { label: "Đỏ", value: "bg-red-500" },
  { label: "Cam", value: "bg-orange-500" },
  { label: "Hồng", value: "bg-pink-500" },
  { label: "Indigo", value: "bg-indigo-500" },
  { label: "Vàng", value: "bg-yellow-500" },
];

export function CreateCoursePage() {
  const navigate = useNavigate();
  const { addCourse } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-blue-500");
  const [imageUrl, setImageUrl] = useState("");
  const [titleError, setTitleError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      setTitleError("Vui lòng nhập tên khóa học");
      return;
    }

    setIsSubmitting(true);
    try {
      const newCourse = {
        id: "",
        title: title.trim(),
        description: description.trim(),
        color: selectedColor,
        coverImage: imageUrl.trim() || undefined,
        units: [],
      };
      await addCourse(newCourse as any);
      navigate("/");
    } catch (err) {
      setTitleError("Không thể tạo khóa học. Vui lòng thử lại.");
      console.error("Error creating course:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/">
              <ArrowLeft />
              Quay lại
            </Link>
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-background rounded-xl border p-8">
          <h1 className="text-3xl font-bold mb-2">Tạo khóa học mới</h1>
          <p className="text-muted-foreground mb-8">
            Điền thông tin để tạo khóa học của bạn
          </p>

          <div className="space-y-6">
            {/* Tên khóa học */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Tên khóa học <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ví dụ: Tiếng Anh giao tiếp cơ bản"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTitleError("");
                }}
                className={titleError ? "border-destructive" : ""}
              />
              {titleError && (
                <p className="text-sm text-destructive">{titleError}</p>
              )}
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (tùy chọn)</Label>
              <Textarea
                id="description"
                placeholder="Mô tả ngắn về khóa học này..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* URL ảnh bìa */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                URL ảnh bìa (tùy chọn)
              </Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Nếu không có ảnh, màu bìa sẽ được sử dụng
              </p>
            </div>

            {/* Preview ảnh */}
            {imageUrl && (
              <div className="space-y-2">
                <Label>Xem trước ảnh bìa</Label>
                <div className="rounded-lg overflow-hidden border">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Chọn màu */}
            {!imageUrl && (
              <div className="space-y-2">
                <Label>Màu bìa</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setSelectedColor(c.value)}
                      title={c.label}
                      className={`w-10 h-10 rounded-full ${c.value} transition-transform hover:scale-110 ${
                        selectedColor === c.value
                          ? "ring-2 ring-offset-2 ring-foreground scale-110"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Preview màu */}
            {!imageUrl && (
              <div className="space-y-2">
                <Label>Xem trước bìa</Label>
                <div
                  className={`${selectedColor} rounded-lg p-8 text-white min-h-[140px] flex flex-col justify-end`}
                >
                  <h2 className="text-2xl font-bold">
                    {title || "Tên khóa học"}
                  </h2>
                  {description && (
                    <p className="text-white/80 mt-1">{description}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <Button variant="outline" asChild disabled={isSubmitting}>
              <Link to="/">Hủy</Link>
            </Button>
            <Button onClick={handleCreate} disabled={!title.trim() || isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo khóa học"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

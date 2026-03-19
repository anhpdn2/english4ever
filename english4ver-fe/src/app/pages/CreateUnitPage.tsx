import { useState } from "react";
import {
  Plus,
  Lock,
  ArrowLeftRight,
  Keyboard,
  Trash2,
  Equal,
  Image,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

interface Term {
  id: number;
  term: string;
  definition: string;
}

export function CreateUnitPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getCourse, addUnit } = useApp();
  const course = getCourse(courseId!);

  const [unitTitle, setUnitTitle] = useState("");
  const [unitDescription, setUnitDescription] = useState("");
  const [terms, setTerms] = useState<Term[]>([
    { id: 1, term: "", definition: "" },
    { id: 2, term: "", definition: "" },
  ]);
  const [hintEnabled, setHintEnabled] = useState(true);
  const [errors, setErrors] = useState<{ title?: string; terms?: string }>({});

  const addTerm = () => {
    setTerms([...terms, { id: Date.now(), term: "", definition: "" }]);
  };

  const removeTerm = (id: number) => {
    if (terms.length > 2) setTerms(terms.filter((t) => t.id !== id));
  };

  const updateTerm = (id: number, field: "term" | "definition", value: string) => {
    setTerms(terms.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleCreate = () => {
    const newErrors: typeof errors = {};
    if (!unitTitle.trim()) newErrors.title = "Vui lòng nhập tiêu đề unit";
    const filled = terms.filter((t) => t.term.trim() && t.definition.trim());
    if (filled.length === 0) newErrors.terms = "Vui lòng nhập ít nhất 1 thẻ từ vựng";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    addUnit(courseId!, {
      id: `unit-${Date.now()}`,
      title: unitTitle.trim(),
      description: unitDescription.trim(),
      vocabularies: filled.map((t) => ({
        id: `vocab-${t.id}`,
        english: t.term.trim(),
        vietnamese: t.definition.trim(),
        imageUrl: "",
      })),
    });
    navigate(`/course/${courseId}`);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#0a0b1e] text-white font-sans">
        {/* Header */}
        <header className="bg-[#2d3655] sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="text-gray-300 hover:text-white hover:bg-white/10">
              <Link to={`/course/${courseId}`}>
                <ArrowLeft size={22} />
              </Link>
            </Button>
            <div>
              <h1 className="font-bold text-xl leading-tight">Tạo unit mới</h1>
              {course && (
                <p className="text-gray-400 text-sm">
                  Thuộc:{" "}
                  <span className="text-indigo-300">{course.title}</span>
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Tạo unit
          </Button>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          {/* Unit info */}
          <div className="space-y-3 mb-8">
            <div
              className={`bg-[#2d3655] rounded-lg p-3 ${
                errors.title ? "ring-2 ring-destructive" : ""
              }`}
            >
              <Label className="text-xs text-gray-300 font-semibold mb-1 block tracking-wider uppercase">
                Tiêu đề unit <span className="text-red-400">*</span>
              </Label>
              <input
                className="bg-transparent text-white font-bold text-lg outline-none w-full placeholder-gray-400"
                value={unitTitle}
                onChange={(e) => {
                  setUnitTitle(e.target.value);
                  if (e.target.value.trim())
                    setErrors((p) => ({ ...p, title: undefined }));
                }}
                placeholder="Ví dụ: Chương 1 – Chào hỏi"
                autoFocus
              />
            </div>
            {errors.title && (
              <p className="text-red-400 text-sm ml-1">{errors.title}</p>
            )}

            <div className="bg-[#2d3655] rounded-lg p-3">
              <Label className="text-xs text-gray-300 font-semibold mb-1 block tracking-wider uppercase">
                Mô tả
              </Label>
              <input
                className="bg-transparent text-white text-base outline-none w-full placeholder-gray-400"
                value={unitDescription}
                onChange={(e) => setUnitDescription(e.target.value)}
                placeholder="Thêm mô tả cho unit..."
              />
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#2d3655] hover:bg-[#3d476b] text-white border-none rounded-full"
              >
                <Plus size={16} /> Nhập
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#2d3655] hover:bg-[#3d476b] text-white border-none rounded-full"
              >
                <Plus size={16} /> Thêm sơ đồ
                <Badge className="bg-yellow-500 text-black text-[10px] px-1 py-0 ml-1 h-auto">
                  <Lock size={8} />
                </Badge>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-white font-semibold text-sm">Gợi ý</Label>
                <Switch
                  checked={hintEnabled}
                  onCheckedChange={setHintEnabled}
                  className="data-[state=checked]:bg-indigo-500"
                />
              </div>

              <Separator orientation="vertical" className="h-6 bg-white/20" />

              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      <ArrowLeftRight size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Đảo từ / định nghĩa</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      <Keyboard size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Nhập bàn phím</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setTerms([
                          { id: 1, term: "", definition: "" },
                          { id: 2, term: "", definition: "" },
                        ])
                      }
                      className="text-gray-300 hover:text-red-400 hover:bg-white/10 rounded-full"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Xóa tất cả</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Error for terms */}
          {errors.terms && (
            <div className="mb-4 bg-red-900/30 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 text-sm">
              {errors.terms}
            </div>
          )}

          {/* Term cards */}
          <div className="space-y-4">
            {terms.map((term, index) => (
              <div key={term.id} className="bg-[#2d3655] rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-[#3d476b] pb-3">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white hover:bg-white/10 cursor-grab rounded-full"
                        >
                          <Equal size={20} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Kéo để sắp xếp</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTerm(term.id)}
                          className="text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-full"
                        >
                          <Trash2 size={20} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Xóa thẻ</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Term */}
                  <div className="flex-1 flex flex-col">
                    <div className="bg-[#0a0b1e] rounded-lg p-3 h-14 flex items-center">
                      <input
                        className="bg-transparent text-white font-semibold outline-none w-full placeholder-gray-500"
                        value={term.term}
                        onChange={(e) => updateTerm(term.id, "term", e.target.value)}
                        placeholder="Nhập thuật ngữ"
                      />
                    </div>
                    <Label className="text-[10px] text-gray-400 mt-2 font-bold tracking-widest uppercase">
                      Thuật ngữ
                    </Label>
                  </div>

                  {/* Definition */}
                  <div className="flex-1 flex flex-col">
                    <div className="bg-[#0a0b1e] rounded-lg p-3 h-14 flex items-center">
                      <input
                        className="bg-transparent text-white font-semibold outline-none w-full placeholder-gray-500"
                        value={term.definition}
                        onChange={(e) =>
                          updateTerm(term.id, "definition", e.target.value)
                        }
                        placeholder="Nhập định nghĩa"
                      />
                    </div>
                    <Label className="text-[10px] text-gray-400 mt-2 font-bold tracking-widest uppercase">
                      Định nghĩa
                    </Label>
                  </div>

                  {/* Image placeholder */}
                  <div className="w-full md:w-28 h-20 md:h-auto border-2 border-dashed border-gray-500 rounded-lg flex flex-col justify-center items-center text-gray-400 cursor-pointer hover:bg-white/5 hover:border-gray-300 transition-all group p-2">
                    <Image
                      size={20}
                      className="mb-1.5 group-hover:scale-110 transition-transform"
                    />
                    <span className="text-xs font-semibold">Hình ảnh</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add term button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={addTerm}
              variant="secondary"
              size="lg"
              className="bg-[#2d3655] hover:bg-[#3d476b] text-white border-none w-full md:w-auto text-base h-14 px-12 rounded-xl border-b-4 border-[#1a2035]"
            >
              <Plus size={20} />
              THÊM THẺ
            </Button>
          </div>

          {/* Bottom save */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-11"
            >
              Lưu unit
            </Button>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

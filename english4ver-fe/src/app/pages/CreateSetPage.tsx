import { useState } from "react";
import { Plus, Lock, ArrowLeftRight, Keyboard, Trash2, Equal, Image, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { createCourse } from "../services/courseApi";

export function CreateSetPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [terms, setTerms] = useState([
    { id: 1, term: "adverse", definition: "bất lợi, có hại" },
    { id: 2, term: "alternate", definition: "xen kẽ, luân phiên" },
  ]);

  const addTerm = () => {
    setTerms([...terms, { id: Date.now(), term: "", definition: "" }]);
  };

  const removeTerm = (id: number) => {
    if (terms.length > 2) {
      setTerms(terms.filter(t => t.id !== id));
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề khóa học");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createCourse({ name: title.trim(), description: description.trim() });
      navigate("/");
    } catch {
      setError("Tạo khóa học thất bại, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-white font-sans">
      <header className="bg-[#2d3655] sticky top-0 z-10 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-bold text-xl">Tạo học phần mới</h1>
        </div>
        <div>
          <button
            onClick={handleCreate}
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            {submitting ? "Đang tạo..." : "Tạo"}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
        <div className="space-y-4 mb-8">
          <div className="bg-[#2d3655] rounded-lg p-3">
            <label className="text-xs text-gray-300 font-semibold mb-1 block">Tiêu đề</label>
            <input
              className="bg-transparent text-white font-bold text-lg outline-none w-full placeholder-gray-400"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề, ví dụ: Sinh học - Chương 22"
            />
          </div>

          <div className="bg-[#2d3655] rounded-lg p-4">
            <input
              className="bg-transparent text-white text-base outline-none w-full placeholder-gray-400"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Thêm mô tả..."
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#2d3655] hover:bg-[#3d476b] text-white px-4 py-2 rounded-full font-semibold text-sm transition-colors">
              <Plus size={16} /> <span>Nhập</span>
            </button>
            <button className="flex items-center gap-2 bg-[#2d3655] hover:bg-[#3d476b] text-white px-4 py-2 rounded-full font-semibold text-sm transition-colors">
              <Plus size={16} /> <span>Thêm sơ đồ</span>
              <span className="bg-yellow-500 rounded-full p-[2px] ml-1"><Lock size={10} className="text-black" /></span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-white font-semibold text-sm">
              <span>Gợi ý</span>
              <div className="w-10 h-6 bg-indigo-500 rounded-full flex items-center p-1 cursor-pointer transition-colors">
                <div className="w-4 h-4 bg-white rounded-full translate-x-4 transition-transform"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="bg-[#2d3655] hover:bg-[#3d476b] text-white p-2 rounded-full transition-colors">
                <ArrowLeftRight size={18} />
              </button>
              <button className="bg-[#2d3655] hover:bg-[#3d476b] text-white p-2 rounded-full transition-colors">
                <Keyboard size={18} />
              </button>
              <button className="bg-[#2d3655] hover:bg-[#3d476b] text-white p-2 rounded-full transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {terms.map((term, index) => (
            <div key={term.id} className="bg-[#2d3655] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-[#3d476b] pb-3">
                <div className="text-white font-bold text-lg">{index + 1}</div>
                <div className="flex items-center gap-4 text-gray-300">
                  <button className="hover:text-white transition-colors cursor-grab active:cursor-grabbing"><Equal size={20} /></button>
                  <button className="hover:text-white transition-colors" onClick={() => removeTerm(term.id)}><Trash2 size={20} /></button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col">
                  <div className="bg-[#0a0b1e] rounded-lg p-3 h-14 flex items-center">
                    <input 
                      className="bg-transparent text-white font-semibold outline-none w-full" 
                      defaultValue={term.term} 
                    />
                  </div>
                  <span className="text-[10px] text-gray-300 mt-2 font-bold tracking-widest uppercase">THUẬT NGỮ</span>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="bg-[#0a0b1e] rounded-lg p-3 h-14 flex items-center">
                    <input 
                      className="bg-transparent text-white font-semibold outline-none w-full" 
                      defaultValue={term.definition} 
                    />
                  </div>
                  <span className="text-[10px] text-gray-300 mt-2 font-bold tracking-widest uppercase">ĐỊNH NGHĨA</span>
                </div>
                
                <div className="w-full md:w-28 h-20 md:h-auto border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center text-white cursor-pointer hover:bg-[#3d476b] transition-all group p-2">
                  <Image size={20} className="mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Hình ảnh</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <button 
            onClick={addTerm}
            className="bg-[#2d3655] hover:bg-[#3d476b] text-white font-bold py-6 px-12 rounded-xl transition-colors border-b-4 border-[#1a2035] hover:border-[#2d3655] hover:translate-y-1 w-full md:w-auto text-lg flex items-center gap-2 justify-center"
          >
            <Plus size={24} /> THÊM THẺ
          </button>
        </div>
        
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  Folder, FileText, Image as ImageIcon, MoreVertical, 
  Search, Upload, FolderPlus, ArrowLeft, Home, Loader2, Trash2, Eye, X, Download, LayoutGrid, List, Edit, CloudUpload 
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function DocumentPage() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null); 
  const [history, setHistory] = useState([]);
  
  const [viewMode, setViewMode] = useState('grid'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // ✅ แก้ไข 1: เปลี่ยนชื่อตัวแปรให้สื่อความหมาย (เก็บค่าเป็น 'folder-1' หรือ 'file-1')
  const [activeMenu, setActiveMenu] = useState(null); 
  
  const [previewFile, setPreviewFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData(currentFolder?.id);
  }, [currentFolder]);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null); // ✅ แก้ไข
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchData = async (folderId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/documents?folderId=${folderId || ''}`);
      const data = await res.json();
      if (res.ok) {
        setFolders(data.folders);
        setFiles(data.files);
      }
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', currentFolder?.id || null);
    formData.append('userId', 34);

    Swal.fire({ title: 'กำลังอัปโหลด...', didOpen: () => Swal.showLoading() });

    try {
        const res = await fetch('/api/documents', { method: 'POST', body: formData });
        if (res.ok) {
            Swal.fire({ icon: 'success', title: 'อัปโหลดสำเร็จ', timer: 1000, showConfirmButton: false });
            fetchData(currentFolder?.id);
        } else throw new Error('Upload failed');
    } catch (err) { Swal.fire('Error', 'อัปโหลดไม่สำเร็จ', 'error'); } 
  };

  const handleFileChange = (e) => {
    handleUpload(e.target.files[0]);
    e.target.value = null;
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRename = async (id, currentName, type) => {
    setActiveMenu(null); // ✅ ปิดเมนู
    const { value: newName } = await Swal.fire({
        title: `เปลี่ยนชื่อ ${type === 'file' ? 'ไฟล์' : 'โฟลเดอร์'}`,
        input: 'text',
        inputValue: currentName,
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        confirmButtonColor: '#2563eb'
    });

    if (newName && newName !== currentName) {
        try {
            const res = await fetch('/api/documents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type, newName })
            });
            if (res.ok) {
                Swal.fire({ icon: 'success', title: 'เปลี่ยนชื่อสำเร็จ', timer: 1000, showConfirmButton: false });
                fetchData(currentFolder?.id);
            }
        } catch (err) { Swal.fire('Error', 'เปลี่ยนชื่อไม่สำเร็จ', 'error'); }
    }
  };

  const handleDelete = async (id, type) => {
    setActiveMenu(null); // ✅ ปิดเมนู
    const result = await Swal.fire({
        title: 'ยืนยันการลบ?',
        text: "ข้อมูลจะถูกลบถาวร ไม่สามารถกู้คืนได้",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'ลบเลย'
    });

    if (result.isConfirmed) {
        try {
            const res = await fetch(`/api/documents?id=${id}&type=${type}`, { method: 'DELETE' });
            if (res.ok) {
                Swal.fire('ลบสำเร็จ', '', 'success');
                fetchData(currentFolder?.id);
            }
        } catch (err) { Swal.fire('Error', 'ลบไม่สำเร็จ', 'error'); }
    }
  };

  const handleCreateFolder = async () => {
    const { value: folderName } = await Swal.fire({
      title: 'ตั้งชื่อโฟลเดอร์ใหม่',
      input: 'text',
      inputPlaceholder: 'ระบุชื่อโฟลเดอร์...',
      showCancelButton: true,
      confirmButtonText: 'สร้าง',
      confirmButtonColor: '#2563eb'
    });

    if (folderName) {
      try {
        const formData = new FormData();
        formData.append('name', folderName);
        formData.append('folderId', currentFolder?.id || null);
        formData.append('userId', 34);
        const res = await fetch('/api/documents', { method: 'POST', body: formData });
        if (res.ok) {
          fetchData(currentFolder?.id);
          Swal.fire({ icon: 'success', title: 'สร้างสำเร็จ', timer: 1000, showConfirmButton: false });
        }
      } catch (err) { Swal.fire('Error', 'สร้างโฟลเดอร์ไม่สำเร็จ', 'error'); }
    }
  };

  const handleEnterFolder = (folder) => { setHistory([...history, folder]); setCurrentFolder(folder); setSearchTerm(''); };
  const handleGoBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    newHistory.pop(); 
    setHistory(newHistory);
    setCurrentFolder(newHistory.length > 0 ? newHistory[newHistory.length - 1] : null);
  };
  const handleGoHome = () => { setHistory([]); setCurrentFolder(null); };

  const getFileIcon = (type) => {
    if (['pdf'].includes(type)) return <FileText className="text-red-500" size={40} />;
    if (['xlsx', 'xls', 'csv'].includes(type)) return <FileText className="text-green-500" size={40} />;
    if (['jpg', 'png', 'jpeg', 'gif', 'webp'].includes(type)) return <ImageIcon className="text-blue-500" size={40} />;
    return <FileText className="text-slate-400" size={40} />;
  };

  // ✅ Helper Function: สร้าง Key สำหรับเมนู (ป้องกัน ID ซ้ำ)
  const getMenuKey = (type, id) => `${type}-${id}`; // ผลลัพธ์จะเป็น "folder-1" หรือ "file-1"

  // ✅ Helper Function: จัดการการกดปุ่มเมนู
  const toggleMenu = (e, type, id) => {
      e.stopPropagation();
      const key = getMenuKey(type, id);
      setActiveMenu(activeMenu === key ? null : key);
  };

  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 w-[calc(100%-16rem)] flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-6 shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ระบบจัดเก็บเอกสาร</h1>
            <p className="text-slate-500 text-sm mt-1">Document Management System (DMS)</p>
          </div>
          <div className="flex gap-3">
             <button onClick={handleCreateFolder} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition shadow-sm active:scale-95">
                <FolderPlus size={18}/> สร้างโฟลเดอร์
             </button>
             <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
             <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition shadow-lg shadow-blue-200 active:scale-95">
                <Upload size={18}/> อัปโหลดไฟล์
             </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 mb-6 shrink-0">
            <div className="flex gap-1">
                <button onClick={handleGoBack} disabled={!currentFolder} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition"><ArrowLeft size={20}/></button>
                <button onClick={handleGoHome} className={`p-2 rounded-lg hover:bg-slate-100 transition ${!currentFolder ? 'text-blue-600 bg-blue-50' : ''}`}><Home size={20}/></button>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 overflow-hidden whitespace-nowrap">
                <span className="cursor-pointer hover:text-blue-600" onClick={handleGoHome}>หน้าหลัก</span>
                {history.map((folder, idx) => (
                    <div key={folder.id} className="flex items-center gap-2">
                        <span>/</span>
                        <span className={`cursor-pointer hover:text-blue-600 ${idx === history.length - 1 ? 'font-bold text-slate-800' : ''}`}>{folder.name}</span>
                    </div>
                ))}
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 ml-auto">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><List size={18} /></button>
            </div>

            <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-3 text-slate-400"/>
                <input type="text" placeholder="ค้นหาเอกสาร..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
        </div>

        {/* Drop Zone */}
        <div 
            className={`flex-1 bg-white rounded-3xl border ${isDragging ? 'border-4 border-dashed border-blue-400 bg-blue-50' : 'border-slate-200'} shadow-sm p-6 overflow-y-auto min-h-0 relative transition-all`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {isDragging && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm pointer-events-none">
                    <CloudUpload size={80} className="text-blue-500 mb-4 animate-bounce"/>
                    <h3 className="text-2xl font-bold text-slate-700">ปล่อยไฟล์เพื่ออัปโหลด</h3>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center h-full text-slate-400 gap-2"><Loader2 className="animate-spin"/> กำลังโหลดข้อมูล...</div>
            ) : (
                <>
                    {/* Folders Section */}
                    {filteredFolders.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Folders</h3>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {filteredFolders.map(folder => (
                                        <div key={folder.id} className="relative group">
                                            <div onClick={() => handleEnterFolder(folder)} className="p-4 bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-xl cursor-pointer transition-all flex flex-col items-center text-center gap-3">
                                                <Folder className="text-yellow-400 group-hover:text-yellow-500 fill-current" size={48} strokeWidth={1.5}/>
                                                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 truncate w-full">{folder.name}</span>
                                            </div>
                                            
                                            {/* ✅ Button & Menu: ใช้ toggleMenu แบบใหม่ */}
                                            <button 
                                                onClick={(e) => toggleMenu(e, 'folder', folder.id)} 
                                                className="absolute top-2 right-2 p-1 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-white/80 rounded-full"
                                            >
                                                <MoreVertical size={16}/>
                                            </button>
                                            
                                            {/* ✅ Condition: เช็ค activeMenu === 'folder-1' */}
                                            {activeMenu === getMenuKey('folder', folder.id) && (
                                                <div className="absolute top-8 right-2 bg-white rounded-lg shadow-xl border border-slate-100 z-30 w-32 py-1 animate-in fade-in zoom-in duration-100">
                                                    <button onClick={(e) => { e.stopPropagation(); handleRename(folder.id, folder.name, 'folder'); }} className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 w-full text-left"><Edit size={14}/> เปลี่ยนชื่อ</button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(folder.id, 'folder'); }} className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 w-full text-left"><Trash2 size={14}/> ลบโฟลเดอร์</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-4">
                                    <table className="w-full text-sm text-left">
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredFolders.map(folder => (
                                                <tr key={folder.id} className="hover:bg-slate-50 cursor-pointer group transition-colors">
                                                    <td className="p-3 pl-4" onClick={() => handleEnterFolder(folder)}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 flex items-center justify-center bg-yellow-50 rounded-lg text-yellow-500 shrink-0"><Folder size={18} fill="currentColor" /></div>
                                                            <span className="font-bold text-slate-700 group-hover:text-blue-600 truncate">{folder.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center relative w-16">
                                                        <button onClick={(e) => toggleMenu(e, 'folder', folder.id)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition"><MoreVertical size={16}/></button>
                                                        {activeMenu === getMenuKey('folder', folder.id) && (
                                                            <div className="absolute top-8 right-8 bg-white rounded-lg shadow-xl border border-slate-100 z-50 w-32 py-1 animate-in fade-in zoom-in duration-100 text-left">
                                                                <button onClick={(e) => { e.stopPropagation(); handleRename(folder.id, folder.name, 'folder'); }} className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 w-full"><Edit size={14}/> เปลี่ยนชื่อ</button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(folder.id, 'folder'); }} className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 w-full"><Trash2 size={14}/> ลบโฟลเดอร์</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Files Section */}
                    {filteredFiles.length > 0 ? (
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center justify-between">Files ({filteredFiles.length})</h3>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {filteredFiles.map(file => (
                                        <div key={file.id} className="relative group p-4 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-xl transition-all">
                                            <div onClick={() => setPreviewFile(file)} className="cursor-pointer block">
                                                <div className="flex flex-col items-center text-center gap-3">
                                                    <div className="transform group-hover:scale-110 transition-transform duration-300">{getFileIcon(file.file_type)}</div>
                                                    <div className="w-full">
                                                        <p className="text-sm font-medium text-slate-700 truncate w-full group-hover:text-blue-600">{file.name}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">{new Date(file.created_at).toLocaleDateString('th-TH')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* ✅ Button & Menu: ใช้ toggleMenu แบบใหม่ */}
                                            <button 
                                                onClick={(e) => toggleMenu(e, 'file', file.id)} 
                                                className="absolute top-2 right-2 p-1 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-slate-100 rounded"
                                            >
                                                <MoreVertical size={16}/>
                                            </button>
                                            
                                            {/* ✅ Condition: เช็ค activeMenu === 'file-1' */}
                                            {activeMenu === getMenuKey('file', file.id) && (
                                                <div className="absolute top-8 right-2 bg-white rounded-lg shadow-xl border border-slate-100 z-30 w-32 py-1 animate-in fade-in zoom-in duration-100">
                                                    <button onClick={(e) => { e.stopPropagation(); setPreviewFile(file); setActiveMenu(null); }} className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 w-full text-left"><Eye size={14}/> เปิดดู</button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleRename(file.id, file.name, 'file'); }} className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 w-full text-left"><Edit size={14}/> เปลี่ยนชื่อ</button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id, 'file'); }} className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 w-full text-left"><Trash2 size={14}/> ลบไฟล์</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                            <tr><th className="p-3 pl-4">ชื่อไฟล์</th><th className="p-3 w-32">วันที่</th><th className="p-3 w-24 text-right">ขนาด</th><th className="p-3 w-16 text-center"></th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredFiles.map(file => (
                                                <tr key={file.id} className="hover:bg-slate-50 group transition-colors">
                                                    <td className="p-3 pl-4">
                                                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPreviewFile(file)}>
                                                            <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-500 shrink-0">
                                                                {(() => { const Icon = getFileIcon(file.file_type).type; const props = getFileIcon(file.file_type).props; return <Icon {...props} size={18} />; })()}
                                                            </div>
                                                            <span className="font-medium text-slate-700 group-hover:text-blue-600 truncate max-w-[200px] md:max-w-md">{file.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-slate-500 text-xs">{new Date(file.created_at).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                                                    <td className="p-3 text-slate-500 text-xs text-right font-mono">{file.file_size ? (file.file_size / 1024).toFixed(0) + ' KB' : '-'}</td>
                                                    <td className="p-3 text-center relative">
                                                        <button onClick={(e) => toggleMenu(e, 'file', file.id)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition"><MoreVertical size={16}/></button>
                                                        
                                                        {activeMenu === getMenuKey('file', file.id) && (
                                                            <div className="absolute top-8 right-8 bg-white rounded-lg shadow-xl border border-slate-100 z-50 w-32 py-1 animate-in fade-in zoom-in duration-100 text-left">
                                                                <button onClick={(e) => { e.stopPropagation(); setPreviewFile(file); setActiveMenu(null); }} className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 w-full"><Eye size={14}/> เปิดดู</button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleRename(file.id, file.name, 'file'); }} className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 w-full"><Edit size={14}/> เปลี่ยนชื่อ</button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id, 'file'); }} className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 w-full"><Trash2 size={14}/> ลบไฟล์</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        filteredFolders.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl pointer-events-none">
                                <CloudUpload size={48} className="mb-2 opacity-50"/>
                                <p>ลากไฟล์มาวางที่นี่ หรือ กดปุ่มอัปโหลด</p>
                            </div>
                        )
                    )}
                </>
            )}
        </div>
      </main>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex justify-between items-center px-6 py-4 bg-black/40 text-white border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">{getFileIcon(previewFile.file_type)}</div>
                    <div>
                        <h3 className="font-bold text-sm md:text-base">{previewFile.name}</h3>
                        <p className="text-xs text-white/50">{new Date(previewFile.created_at).toLocaleDateString('th-TH')} • {(previewFile.file_size / 1024).toFixed(0)} KB</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <a href={previewFile.file_path} download className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white"><Download size={20}/></a>
                    <button onClick={() => setPreviewFile(null)} className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full transition text-white"><X size={20}/></button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden flex items-center justify-center p-4 relative" onClick={() => setPreviewFile(null)}>
                <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    {['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(previewFile.file_type) ? (
                        <img src={previewFile.file_path} className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" alt="preview"/>
                    ) : ['pdf'].includes(previewFile.file_type) ? (
                        <iframe src={previewFile.file_path} className="w-full h-full rounded-lg shadow-2xl bg-white" title="PDF Preview"/>
                    ) : (
                        <div className="text-center text-white">
                            <FileText size={64} className="mx-auto mb-4 opacity-50"/>
                            <p className="text-lg">ไม่สามารถแสดงตัวอย่างไฟล์นี้ได้</p>
                            <a href={previewFile.file_path} className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition" download>ดาวน์โหลดเพื่อเปิดดู</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
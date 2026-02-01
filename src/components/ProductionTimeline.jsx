'use client';
import { useState, useEffect } from 'react';
import { 
    Play, CheckSquare, Calendar, Plus, Loader2, 
    ArrowRight, Clock, CheckCircle, Pause, Edit, Trash2, RefreshCw, 
    ChevronDown, ChevronUp, History 
} from 'lucide-react';
import Swal from 'sweetalert2'; 

// --- Helper: แปลงวันที่ ---
const formatDateShort = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

// --- Sub-Component: การ์ดงาน ---
const TaskItem = ({ task, onUpdate, updatingId }) => {
    const isUpdating = updatingId === task.id;
    const [isExpanded, setIsExpanded] = useState(false);

    const handleAction = (action) => {
        if (action === 'delete') {
            Swal.fire({
                title: 'ลบแผนงาน?', text: "ข้อมูลและประวัติทั้งหมดจะหายไป", icon: 'warning',
                showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'ลบเลย', cancelButtonText: 'ยกเลิก'
            }).then((res) => { if (res.isConfirmed) onUpdate(task.id, 'delete'); });
            return;
        }
        if (action === 'edit') {
            Swal.fire({
                title: '✏️ แก้ไขกำหนดการ',
                html: `
                    <div class="text-left text-sm font-bold text-gray-600">วันเริ่มใหม่:</div>
                    <input type="date" id="swal-input1" class="swal2-input w-full mb-4" value="${task.planned_date ? task.planned_date.split('T')[0] : ''}">
                    <div class="text-left text-sm font-bold text-gray-600">วันจบใหม่:</div>
                    <input type="date" id="swal-input2" class="swal2-input w-full" value="${task.planned_end_date ? task.planned_end_date.split('T')[0] : ''}">
                `,
                showCancelButton: true, confirmButtonText: 'บันทึก', confirmButtonColor: '#f59e0b', cancelButtonText: 'ยกเลิก',
                preConfirm: () => ({ new_start: document.getElementById('swal-input1').value, new_end: document.getElementById('swal-input2').value })
            }).then((res) => { if (res.isConfirmed) onUpdate(task.id, 'edit', res.value); });
            return;
        }
        if (action === 'start') {
            Swal.fire({ title: 'เริ่มงาน?', icon: 'question', showCancelButton: true, confirmButtonText: 'ลุย!', cancelButtonText: 'ยกเลิก' }).then((res) => { if (res.isConfirmed) onUpdate(task.id, 'start'); });
            return;
        }
        if (action === 'finish') {
            Swal.fire({ title: 'จบงาน?', icon: 'success', showCancelButton: true, confirmButtonText: 'เรียบร้อย', cancelButtonText: 'ยกเลิก' }).then((res) => { if (res.isConfirmed) onUpdate(task.id, 'finish'); });
            return;
        }
        onUpdate(task.id, action);
    };

    return (
        <div className={`relative flex flex-col p-5 border rounded-2xl mb-4 transition-all duration-300 ${
            task.status === 'in_progress' ? 'bg-white border-blue-500 shadow-lg ring-1 ring-blue-500' : 
            task.status === 'paused' ? 'bg-amber-50 border-amber-400 border-dashed' :
            task.status === 'completed' ? 'bg-slate-50 border-slate-200 opacity-80' : 
            'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
        }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                <div className="flex items-start gap-4 mb-4 md:mb-0 w-full md:w-auto">
                    <div className={`p-3 rounded-2xl flex items-center justify-center w-14 h-14 shrink-0 shadow-sm ${
                        task.status === 'in_progress' ? 'bg-blue-600 text-white' : 
                        task.status === 'paused' ? 'bg-amber-500 text-white' :
                        task.status === 'completed' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                        {task.status === 'completed' ? <CheckCircle size={28}/> : task.status === 'paused' ? <Pause size={28}/> : task.status === 'in_progress' ? <Clock size={28} className="animate-pulse"/> : <Calendar size={28}/>}
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`text-lg font-bold ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{task.task_name}</h4>
                            {task.history && task.history.length > 0 && (
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 font-bold transition-all ${
                                        isExpanded ? 'bg-red-100 text-red-600 border-red-200' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                    }`}
                                >
                                    <History size={10}/> 
                                    {task.history.length} ครั้ง 
                                    {isExpanded ? <ChevronUp size={10}/> : <ChevronDown size={10}/>}
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                             <div className="flex items-center text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                                <span className="text-slate-400 mr-1 uppercase text-[10px]">PLAN:</span> 
                                {formatDateShort(task.planned_date)} <ArrowRight size={12} className="mx-1 text-slate-400"/> {task.planned_end_date ? formatDateShort(task.planned_end_date) : '?'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 pl-0 md:pl-6 w-full md:w-auto">
                    <div className="text-right text-sm space-y-1">
                        {task.start_time && <div className="text-blue-700 font-bold"><span className="text-[10px] text-slate-400 mr-1">START:</span>{formatDateTime(task.start_time)}</div>}
                        {task.end_time && <div className="text-green-700 font-bold"><span className="text-[10px] text-slate-400 mr-1">END:</span>{formatDateTime(task.end_time)}</div>}
                    </div>

                    <div className="min-w-[150px] flex justify-end gap-2">
                        {isUpdating ? <Loader2 className="animate-spin text-slate-400"/> : (
                            <>
                                {task.status === 'pending' && <button onClick={() => handleAction('start')} className="w-full bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 flex items-center gap-2 justify-center"><Play size={16}/> เริ่มงาน</button>}
                                {task.status === 'in_progress' && <><button onClick={() => handleAction('pause')} className="bg-amber-100 text-amber-700 px-4 rounded-xl hover:bg-amber-200 border-2 border-amber-200"><Pause size={20}/></button><button onClick={() => handleAction('finish')} className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 flex items-center gap-2 justify-center"><CheckSquare size={18}/> จบงาน</button></> }
                                {task.status === 'paused' && <div className="flex gap-2 w-full"><button onClick={() => handleAction('delete')} className="bg-red-50 text-red-500 p-2.5 rounded-xl border border-red-200 hover:bg-red-100"><Trash2 size={18}/></button><button onClick={() => handleAction('edit')} className="bg-amber-50 text-amber-600 p-2.5 rounded-xl border border-amber-200 hover:bg-amber-100"><Edit size={18}/></button><button onClick={() => handleAction('resume')} className="flex-1 bg-blue-600 text-white px-3 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 flex items-center gap-2 justify-center"><Play size={16}/> ทำต่อ</button></div>}
                                {task.status === 'completed' && (
                                    <div className="flex items-center gap-2 w-full justify-end">
                                        <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-200 cursor-default shadow-sm">
                                            <CheckCircle size={16}/> เสร็จสมบูรณ์
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isExpanded && task.history && task.history.length > 0 && (
                <div className="mt-2 bg-slate-50 rounded-xl p-4 border border-slate-200 animate-in slide-in-from-top-2">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <History size={14}/> ประวัติการเลื่อนแผน (Evidence Log)
                    </h5>
                    <div className="space-y-2">
                        {task.history.map((h, index) => (
                            <div key={h.id} className="flex flex-col md:flex-row md:items-center justify-between text-xs bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-1 md:mb-0">
                                    <span className="font-mono text-slate-400 w-6">#{task.history.length - index}</span>
                                    <div className="flex items-center gap-2 text-slate-500 line-through decoration-red-400">
                                        {formatDateShort(h.old_start)} <ArrowRight size={10}/> {h.old_end ? formatDateShort(h.old_end) : '?'}
                                    </div>
                                    <ArrowRight size={14} className="text-slate-300"/>
                                    <div className="flex items-center gap-2 font-bold text-indigo-600">
                                        {formatDateShort(h.new_start)} <ArrowRight size={10}/> {h.new_end ? formatDateShort(h.new_end) : '?'}
                                    </div>
                                </div>
                                <div className="text-slate-400 text-[10px] flex items-center gap-1">
                                    แก้ไขเมื่อ: {formatDateTime(h.changed_at)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---
export default function ProductionTimeline({ projectId, onRefresh }) { // ✅ 1. รับ onRefresh
    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [plannedDate, setPlannedDate] = useState('');
    const [plannedEndDate, setPlannedEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => { if(projectId) fetchTasks(); }, [projectId]);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`/api/production/tasks?projectId=${projectId}`);
            if(res.ok) setTasks(await res.json());
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskName.trim() || !plannedDate) return;
        setLoading(true);
        await fetch('/api/production/tasks', { method: 'POST', body: JSON.stringify({ project_id: projectId, task_name: newTaskName, planned_date: plannedDate, planned_end_date: plannedEndDate }) });
        setNewTaskName(''); setPlannedDate(''); setPlannedEndDate('');
        
        await fetchTasks();
        if (onRefresh) onRefresh(); // ✅ 2. เรียกใช้เมื่อเพิ่มงานเสร็จ
    };

    const handleUpdateStatus = async (id, action, extraData = {}) => {
        setUpdatingId(id);
        await fetch('/api/production/tasks', { method: 'PATCH', body: JSON.stringify({ id, action, ...extraData }) });
        
        await fetchTasks();
        setUpdatingId(null);
        if (onRefresh) onRefresh(); // ✅ 3. เรียกใช้เมื่ออัปเดตสถานะเสร็จ
    };

    const inputStyle = "bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition duration-200";

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-indigo-800 flex items-center gap-3"><div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 shadow-sm"><Calendar size={22}/></div> แผนงาน & กำหนดการ (Timeline)</h3>
                    <button onClick={fetchTasks} className="text-slate-400 hover:text-indigo-600 transition"><RefreshCw size={16}/></button>
                </div>
                <form onSubmit={handleAddTask} className="flex flex-col xl:flex-row gap-3 mb-6 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/80">
                    <input type="text" placeholder="ระบุงานที่ต้องทำ..." className={`${inputStyle} flex-1 min-w-[200px]`} value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} required />
                    <div className="flex gap-2"><div className="flex flex-col"><span className="text-[10px] text-slate-500 font-bold ml-1 mb-1 uppercase">เริ่ม (Start)</span><input type="date" className={`${inputStyle} w-full md:w-auto`} value={plannedDate} onChange={(e) => setPlannedDate(e.target.value)} required /></div><div className="flex flex-col"><span className="text-[10px] text-slate-500 font-bold ml-1 mb-1 uppercase">สิ้นสุด (End)</span><input type="date" className={`${inputStyle} w-full md:w-auto`} value={plannedEndDate} onChange={(e) => setPlannedEndDate(e.target.value)} /></div></div>
                    <div className="flex items-end"><button type="submit" className="h-[46px] bg-indigo-600 text-white px-6 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition flex items-center gap-2 justify-center whitespace-nowrap w-full xl:w-auto"><Plus size={18}/> เพิ่มแผน</button></div>
                </form>
                <div className="space-y-3">
                    {loading && tasks.length === 0 ? <div className="text-center py-8 text-slate-400"><Loader2 className="animate-spin inline mr-2"/> กำลังโหลด...</div> : tasks.length === 0 ? <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">ยังไม่มีแผนงานในระบบ</div> : tasks.map(task => <TaskItem key={task.id} task={task} onUpdate={handleUpdateStatus} updatingId={updatingId} />)}
                </div>
            </div>
        </div>
    );
}
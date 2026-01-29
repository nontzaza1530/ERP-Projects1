'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Star, BarChart2, Save, X, UserCheck } from 'lucide-react';
import Swal from 'sweetalert2';

export default function PerformancePage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState([]);
  const [criteria, setCriteria] = useState([]);
  
  // State สำหรับ Modal ประเมิน
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [scores, setScores] = useState({}); 
  const [feedback, setFeedback] = useState('');

  // โหลดข้อมูล
  useEffect(() => {
    fetchData();
    fetchCriteria();
  }, [month, year]);

  const fetchData = async () => {
    const res = await fetch(`/api/performance?month=${month}&year=${year}`);
    if(res.ok) setEmployees(await res.json());
  };

  const fetchCriteria = async () => {
    const res = await fetch(`/api/performance?month=${month}&year=${year}&type=criteria`);
    if(res.ok) {
        const data = await res.json();
        setCriteria(data);
    }
  };

  const openEvaluate = (emp) => {
    setSelectedEmp(emp);
    setScores({}); 
    setFeedback('');
    
    const initialScores = {};
    criteria.forEach(c => initialScores[c.id] = 0);
    setScores(initialScores);
    
    setIsModalOpen(true);
  };

  const calculateTotal = () => {
    let total = 0;
    criteria.forEach(c => {
        const score = scores[c.id] || 0;
        total += (score / c.max_score) * c.weight_percent;
    });
    return total.toFixed(2);
  };

  const handleSave = async () => {
    const payload = {
        emp_code: selectedEmp.emp_code,
        month,
        year,
        scores: Object.keys(scores).map(key => ({ criteria_id: parseInt(key), score: scores[key] })),
        feedback
    };

    const res = await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if(res.ok) {
        Swal.fire('สำเร็จ', 'บันทึกผลประเมินเรียบร้อย', 'success');
        setIsModalOpen(false);
        fetchData(); 
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans"> {/* ✅ พื้นหลังขาวเพื่อให้ตัดกับตัวหนังสือ */}
      <div className="hidden lg:block w-64 fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      <main className="flex-1 lg:ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
            {/* ✅ หัวข้อสีดำชัดเจน */}
            <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                <BarChart2 className="text-purple-700"/> การประเมินผลงาน (Performance)
            </h1>
            <div className="flex gap-2">
                {/* ✅ Dropdown ตัวหนังสือเข้ม */}
                <select value={month} onChange={(e)=>setMonth(e.target.value)} className="p-2 rounded border border-gray-300 text-black font-medium">
                    {Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{new Date(0,i).toLocaleDateString('th-TH',{month:'long'})}</option>)}
                </select>
                <select value={year} onChange={(e)=>setYear(e.target.value)} className="p-2 rounded border border-gray-300 text-black font-medium">
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </select>
            </div>
        </div>

        {/* ตารางรายชื่อ */}
        <div className="bg-white rounded-xl shadow border border-gray-300 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                        <th className="p-4 text-black font-bold">พนักงาน</th>
                        <th className="p-4 text-center text-black font-bold">คะแนนรวม</th>
                        <th className="p-4 text-center text-black font-bold">เกรด</th>
                        <th className="p-4 text-center text-black font-bold">สถานะ</th>
                        <th className="p-4 text-center text-black font-bold">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {employees.map((emp) => (
                        <tr key={emp.emp_code} className="hover:bg-gray-50">
                            <td className="p-4">
                                {/* ✅ ชื่อสีดำ ตำแหน่งสีเทาเข้ม */}
                                <div className="font-bold text-black text-lg">{emp.first_name} {emp.last_name}</div>
                                <div className="text-sm text-gray-700 font-medium">{emp.position}</div>
                            </td>
                            <td className="p-4 text-center font-bold text-xl text-purple-700">
                                {emp.total_score ? emp.total_score : '-'}
                            </td>
                            <td className="p-4 text-center">
                                {emp.grade ? (
                                    <span className={`px-4 py-1 rounded-full text-base font-bold border ${
                                        emp.grade === 'A' ? 'bg-green-100 text-green-800 border-green-200' :
                                        emp.grade === 'B' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                        'bg-orange-100 text-orange-800 border-orange-200'
                                    }`}>{emp.grade}</span>
                                ) : '-'}
                            </td>
                            <td className="p-4 text-center">
                                <span className={`text-sm px-3 py-1 rounded font-medium ${emp.status ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                                    {emp.status ? 'ประเมินแล้ว' : 'รอประเมิน'}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <button 
                                    onClick={() => openEvaluate(emp)}
                                    className="bg-purple-700 text-white px-5 py-2 rounded-lg hover:bg-purple-800 flex items-center gap-2 mx-auto text-sm font-bold shadow-md"
                                >
                                    <Star size={16}/> ประเมิน
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Modal Popup สำหรับประเมิน */}
        {isModalOpen && selectedEmp && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 backdrop-blur-sm">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-300">
                    <div className="p-6 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-black">แบบประเมินผลงาน</h2>
                            <p className="text-gray-700 font-medium text-sm">คุณ {selectedEmp.first_name} {selectedEmp.last_name} ({selectedEmp.position})</p>
                        </div>
                        <button onClick={()=>setIsModalOpen(false)} className="text-gray-500 hover:text-black"><X/></button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="space-y-6">
                            {criteria.map((c) => (
                                <div key={c.id} className="bg-white p-5 border border-gray-300 rounded-xl hover:border-purple-500 transition shadow-sm">
                                    <div className="flex justify-between mb-3">
                                        {/* ✅ หัวข้อคะแนนสีดำ */}
                                        <label className="font-bold text-black text-lg">{c.title}</label>
                                        <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded text-black">น้ำหนัก {c.weight_percent}%</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="range" 
                                            min="0" max={c.max_score} 
                                            value={scores[c.id] || 0}
                                            onChange={(e) => setScores({...scores, [c.id]: parseInt(e.target.value)})}
                                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-700"
                                        />
                                        <div className="w-20 text-center font-mono font-bold text-2xl border-2 border-purple-200 rounded p-1 text-purple-800 bg-purple-50">
                                            {scores[c.id] || 0}/{c.max_score}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <div>
                                <label className="block font-bold text-black mb-2 text-lg">ความเห็นเพิ่มเติม (Feedback)</label>
                                <textarea 
                                    className="w-full border-2 border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500 text-black font-medium placeholder:text-gray-400"
                                    rows="3"
                                    placeholder="จุดเด่น หรือสิ่งที่ต้องปรับปรุง..."
                                    value={feedback}
                                    onChange={(e)=>setFeedback(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-300 bg-gray-50 flex justify-between items-center">
                        <div className="text-lg font-bold text-gray-800">
                            คะแนนรวม: <span className="font-bold text-3xl text-purple-800 ml-2">{calculateTotal()}</span> <span className="text-sm text-gray-600">/ 100</span>
                        </div>
                        <button 
                            onClick={handleSave}
                            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
                        >
                            <Save size={20}/> บันทึกผลประเมิน
                        </button>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
// นำเข้า Library
import db from 'thai-address-database';

export default function ThaiAddressInput({ onAddressSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // ฟังก์ชันค้นหา
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 1) { // พิมพ์ 2 ตัวขึ้นไปค่อยหา
      
      // ค้นหาจากทั้ง 3 ส่วน แล้วเอามารวมกัน
      const resultDistrict = db.searchAddressByDistrict(value); // ค้นตำบล
      const resultAmphoe = db.searchAddressByAmphoe(value);   // ค้นอำเภอ
      const resultProvince = db.searchAddressByProvince(value); // ค้นจังหวัด
      const resultZipcode = db.searchAddressByZipcode(value);   // ค้นรหัสปณ.

      // รวมผลลัพธ์ทั้งหมด และตัดให้เหลือแค่ 20 อันดับแรก (กันเยอะเกิน)
      const mergedResults = [
        ...resultDistrict, 
        ...resultAmphoe, 
        ...resultProvince,
        ...resultZipcode
      ].slice(0, 20);

      // กรองตัวซ้ำออก (เผื่อค้นเจอซ้ำๆ)
      const uniqueResults = mergedResults.filter((v, i, a) => a.findIndex(t => (t.district === v.district && t.amphoe === v.amphoe && t.province === v.province && t.zipcode === v.zipcode)) === i);

      setSuggestions(uniqueResults);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  // ฟังก์ชันเมื่อเลือกรายการ
  const handleSelect = (item) => {
    setSearchTerm(item.district);
    setIsOpen(false);
    
    if (onAddressSelect) {
      onAddressSelect({
        district: item.district, // ตำบล
        amphoe: item.amphoe,     // อำเภอ
        province: item.province, // จังหวัด
        zipcode: String(item.zipcode)
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Input ช่องค้นหา */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="พิมพ์ตำบล / อำเภอ / จังหวัด หรือ รหัสไปรษณีย์..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-colors"
        />
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
      </div>

      {/* Dropdown ผลลัพธ์ */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => (
            <li
              key={`${item.district}-${item.amphoe}-${item.zipcode}-${index}`}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 text-sm">{item.district}</span>
                  <span className="text-xs text-slate-500">
                    {item.amphoe} <span className="text-slate-300">❯</span> {item.province}
                  </span>
                </div>
                <span className="text-blue-600 font-bold text-xs bg-blue-50 px-2 py-1 rounded border border-blue-100">
                  {item.zipcode}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* กรณีไม่เจอข้อมูล */}
      {isOpen && searchTerm.length > 1 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl p-4 text-center text-slate-400 text-sm">
          ไม่พบข้อมูลที่ค้นหา
        </div>
      )}
    </div>
  );
}
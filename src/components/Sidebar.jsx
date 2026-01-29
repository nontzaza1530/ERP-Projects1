'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  FileText, LogOut, ChevronDown, ChevronRight, 
  Circle, User, X, Hammer, ShoppingBag, Folder 
} from 'lucide-react'; 
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me'); 
        if (res.status === 401) {
            window.location.href = '/login'; 
            return;
        }
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.role) {
             setRole(data.user.role.toLowerCase()); 
             setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user role", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
      if (pathname.startsWith('/hr')) setExpandedMenu('HR Management');
      else if (pathname.startsWith('/accounting')) setExpandedMenu('บัญชี');
      else if (pathname.startsWith('/purchasing')) setExpandedMenu('ฝ่ายจัดซื้อ (Purchasing)');
  }, [pathname]);

  const handleLogout = async () => {
    Swal.fire({
        title: 'ออกจากระบบ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'ใช่, ออกจากระบบ',
        cancelButtonText: 'ยกเลิก'
      }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await fetch('/api/logout', { method: 'POST' }); 
                window.location.href = '/login';     
            } catch (error) {
                console.error("Logout failed", error);
            }
        }
      });
  };

  const toggleMenu = (name) => {
    setExpandedMenu(prev => prev === name ? null : name);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const getMenuItems = () => {
    return [
      { 
        name: 'Dashboard', 
        href: '/Dashboard', 
        icon: LayoutDashboard, 
        roles: ['super_admin', 'admin', 'employee'] 
      },
      { 
        name: 'HR Management', 
        href: '#', 
        icon: Users,
        roles: ['super_admin', 'admin', 'employee'], // Employee เห็นหัวข้อนี้
        subItems: [
          { 
            name: role === 'employee' ? 'ข้อมูลส่วนตัว' : 'รายชื่อพนักงาน', 
            href: role === 'employee' ? '/profile' : '/hr', 
            roles: ['super_admin', 'admin', 'employee'] 
          },
          { 
            name: 'ขอวันลา', 
            href: '/hr/leave', 
            roles: ['super_admin', 'admin', 'employee'] 
          },
          { 
            name: 'รายการคำขอลา', 
            href: '/hr/leave-history', 
            roles: ['super_admin', 'admin', 'employee'] 
          },
          // 👇 พวกนี้ Employee จะไม่เห็นเลย
          { 
            name: 'อนุมัติวันลา', 
            href: '/hr/approve-leave', 
            roles: ['super_admin', 'admin'] 
          },
          { 
            name: 'เงินเดือน (Payroll)', 
            href: '/hr/payroll', 
            roles: ['super_admin', 'admin'] 
          },
          { 
            name: 'ประเมินผล', 
            href: '/hr/performance',
            roles: ['super_admin', 'admin'] 
          }
        ]
      },
      { 
        name: 'ฝ่ายผลิต (Production)', 
        href: '/production', 
        icon: Hammer, 
        roles: ['super_admin', 'admin', 'employee'] 
      },
      { 
        name: 'ฝ่ายจัดซื้อ (Purchasing)', 
        href: '#',
        icon: ShoppingBag, 
        roles: ['super_admin', 'admin'], // ❌ Employee ไม่เห็นทั้งก้อน
        subItems: [
            { 
                name: 'ภาพรวม (Dashboard)', 
                href: '/purchasing/dashboard', 
                icon: LayoutDashboard, 
                roles: ['super_admin', 'admin'] 
            },
            { 
                name: 'สร้างใบสั่งซื้อ (PO)', 
                href: '/purchasing/create-po', 
                roles: ['super_admin', 'admin'] 
            },
            { 
                name: 'รายการใบสั่งซื้อ', 
                href: '/purchasing/po-list', 
                roles: ['super_admin', 'admin'] 
            },
            { 
                name: 'รับสินค้าเข้า (GRN)', 
                href: '/purchasing/goods-receipt', 
                roles: ['super_admin', 'admin'] 
            },
            { 
                name: 'ข้อมูลคู่ค้า', 
                href: '/purchasing/suppliers', 
                roles: ['super_admin', 'admin'] 
            }
        ]
      },
      { 
        name: 'คลังสินค้า', 
        href: '/inventory', 
        icon: Package,
        roles: ['super_admin', 'admin'] // ❌ Employee ไม่เห็น
      },
      { 
        name: 'การขาย (POS)', 
        href: '/sales', 
        icon: ShoppingCart,
        roles: ['super_admin', 'admin'] // ❌ Employee ไม่เห็น
      },
      { 
        name: 'บัญชี', 
        href: '#',
        icon: FileText, 
        roles: ['super_admin', 'admin', 'employee'], // ✅ Employee เห็นหัวข้อนี้ (เพราะมีเมนูย่อยให้เข้า)
        subItems: [
            { 
                name: 'ภาพรวมบัญชี', 
                href: '/accounting', 
                roles: ['super_admin', 'admin'] // ❌ ไม่เห็น
            },
            { 
                name: 'ต้นทุนโครงการ', 
                href: '/accounting/project-costs', 
                roles: ['super_admin', 'admin'] // ❌ ไม่เห็น
            },
            { 
                name: 'ขอเบิกเงิน (Reimbursement)', 
                href: '/accounting/reimbursement', 
                roles: ['super_admin', 'admin', 'employee'] // ✅ เห็นแค่อันนี้!
            },
            { 
                name: 'ตรวจสอบการเบิก (Approval)', 
                href: '/accounting/reimbursement/admin', 
                roles: ['super_admin', 'admin'] // ❌ ไม่เห็น
            }
        ]
      },
      { 
        name: 'จัดการเอกสาร (DMS)', 
        href: '/documents', 
        icon: Folder, 
        roles: ['super_admin', 'admin', 'employee'] 
      }
    ];
  };

  // 🔥 Logic กรองเมนู (Filter) แบบเฟี้ยวๆ
  const getVisibleMenu = () => {
    if (!role) return []; // ถ้ายังไม่รู้ Role ไม่โชว์อะไรเลย
    
    const allItems = getMenuItems();

    return allItems
      .map(item => {
        // 1. ถ้ามีเมนูย่อย ให้กรองเมนูย่อยก่อน
        if (item.subItems) {
            const filteredSub = item.subItems.filter(sub => sub.roles.includes(role));
            // คืนค่า item ใหม่ที่มีเฉพาะเมนูย่อยที่เข้าได้
            return { ...item, subItems: filteredSub };
        }
        return item;
      })
      .filter(item => {
        // 2. กรองเมนูหลักทิ้ง ถ้า Role ไม่ถึง
        const isParentAllowed = item.roles.includes(role);
        
        // ถ้าเมนูหลักไม่ผ่าน -> ตัดทิ้ง
        if (!isParentAllowed) return false;

        // พิเศษ: ถ้าเป็นเมนูแบบ Dropdown (มี subItems) แต่กรองแล้วไม่เหลือลูกเลย -> ตัดแม่ทิ้งด้วย (จะได้ไม่รก)
        if (item.subItems && item.subItems.length === 0) {
            return false;
        }

        return true;
      });
  };

  const visibleMenu = getVisibleMenu();

  if (!isMounted) return <aside className="w-64 bg-slate-900 h-screen fixed left-0 top-0 hidden lg:block"></aside>;
  if (!role) return null;

  return (
    <>
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={onClose}
        ></div>
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 h-screen 
        transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        flex flex-col border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 shrink-0 flex flex-col items-center relative">
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 p-1 text-slate-500 hover:text-white lg:hidden"
            >
                <X size={20} />
            </button>

          <h1 className="text-2xl font-bold text-white tracking-wider">ERP SYSTEM</h1>
          <div className="mt-4 flex items-center gap-3 w-full bg-slate-800/50 p-2 rounded-lg border border-slate-700">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm uppercase shrink-0">
                {user?.first_name?.charAt(0) || 'U'}
             </div>
             <div className="overflow-hidden min-w-0">
                 <p className="text-sm font-bold text-white truncate">{user?.first_name}</p>
                 <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wide block truncate">
                    {role.replace('_', ' ')}
                 </span>
             </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar flex flex-col">
          {visibleMenu.map((item) => {
            const isExpanded = expandedMenu === item.name;
            // ใช้ subItems ที่กรองมาแล้ว
            const subItemsToRender = item.subItems; 
            const isActive = item.href === pathname || subItemsToRender?.some(sub => sub.href === pathname);
            
            return (
              <div key={item.name} className="mb-1">
                {subItemsToRender ? (
                  // --- 📂 Dropdown Menu (สำหรับเมนูที่มีลูก) ---
                  <div>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group
                        ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                      `} 
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon size={20} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} shrink-0`} />
                        <span className="font-medium text-sm md:text-base truncate flex items-center gap-2">
                            {item.name}
                        </span>
                      </div>
                      {isExpanded ? <ChevronDown size={16} className="shrink-0" /> : <ChevronRight size={16} className="shrink-0" />}
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                      <div className="ml-4 pl-3 border-l border-slate-700 space-y-1 py-1">
                        {subItemsToRender.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            
                            return (
                              <Link 
                                key={sub.href} 
                                href={sub.href}
                                onClick={handleLinkClick} 
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1
                                  ${isSubActive ? 'text-blue-400 bg-blue-900/20 font-bold' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'}
                                `}
                              >
                                {sub.icon ? (
                                    <sub.icon size={16} className={isSubActive ? 'text-blue-400' : 'text-slate-600'} />
                                ) : sub.name === 'ข้อมูลส่วนตัว' ? (
                                    <User size={14} className={isSubActive ? 'text-blue-400' : 'opacity-50'}/> 
                                ) : (
                                    <Circle size={8} className={isSubActive ? 'fill-current' : 'opacity-50'} />
                                )}
                                
                                <span className="truncate">{sub.name}</span>
                              </Link>
                            );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  // --- 🔗 Single Link Menu (สำหรับเมนูเดี่ยว) ---
                  <Link 
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                        : 'hover:bg-slate-800 hover:text-white text-slate-400'
                    }`}
                  >
                    <div className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} shrink-0`}>
                      <item.icon size={20} />
                    </div>
                    <span className="font-medium text-sm md:text-base truncate flex items-center gap-2">
                        {item.name}
                    </span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer/Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
            <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 px-4 py-3 w-full hover:bg-red-500/10 rounded-xl text-red-400 hover:text-red-300 transition active:scale-[0.98]"
            >
                <LogOut size={20} />
                <span className="font-medium">ออกจากระบบ</span>
            </button>
        </div>
      </aside>
    </>
  );
}
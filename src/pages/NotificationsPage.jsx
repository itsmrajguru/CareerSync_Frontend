import { useState, useEffect } from "react";
import {
  Bell, Briefcase, Mail, Info, ChevronRight,
  CheckCircle2, Clock, Inbox, RefreshCw, Circle, Users, Check
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../services/notificationService";
import { useNavigate } from "react-router-dom";

/*global notification message and data */
const TYPE_CONFIG = {
  application_update: { label: "Application", icon: <Briefcase size={16} />, color: "#ef4444", pillCls: "bg-red-50 text-red-700 border-red-100" },
  new_application: { label: "Recruitment", icon: <Users size={16} />, color: "#10b981", pillCls: "bg-green-50 text-green-700 border-green-100" },
  message: { label: "Message", icon: <Mail size={16} />, color: "#3b82f6", pillCls: "bg-blue-50 text-blue-700 border-blue-100" },
  system: { label: "System", icon: <Info size={16} />, color: "#64748b", pillCls: "bg-slate-50 text-slate-700 border-slate-100" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {
      setError("Failed to sync notifications.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id) {
    try {
      const res = await markNotificationRead(id);
      if (res.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (e) { console.error(e); }
  }

  async function handleMarkAllRead() {
    try {
      const res = await markAllNotificationsRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (e) { console.error(e); }
  }

  const handleAction = (n) => {
    if (!n.isRead) handleMarkRead(n._id);
    if (n.link) navigate(n.link);
  };

  return (
    <PageLayout>
      <div className="pb-20 animate-fade-in max-w-3xl mx-auto">

        <section className="mb-12 pt-10 text-center">
          <div className="w-16 h-16 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Bell size={28} />
          </div>
          <p className="cs-section-label !text-center">Communication Center</p>
          <h1 className="cs-page-title !text-center">
            Notifications <span className="text-[#ef4444]">& alerts.</span>
          </h1>
          <p className="cs-subtext !text-center max-w-[500px] mx-auto">
            A clean stream of your application statuses and messages.
          </p>
        </section>

        {/* Hero section*/}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-100">
              <Inbox size={14} className="text-slate-400" />
              <span className="text-[13px] font-bold text-black">All</span>
              <span className="text-[11px] font-black text-slate-400 ml-1">{notifications.length}</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-100">
              <div className={`w-1.5 h-1.5 rounded-full ${unreadCount > 0 ? 'bg-red-500' : 'bg-slate-300'}`} />
              <span className="text-[13px] font-bold text-black">Unread</span>
              <span className="text-[11px] font-black text-slate-400 ml-1">{unreadCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 px-5 h-11 rounded-xl bg-neutral-900 text-white text-[12px] font-bold hover:bg-black transition-all shadow-lg shadow-neutral-100 cursor-pointer uppercase tracking-widest"
              >
                <Check size={14} /> Mark all Read
              </button>
            )}
            <button
              onClick={fetchData}
              className="w-11 h-11 rounded-xl border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-all flex items-center justify-center cursor-pointer"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/*Main functionlaity*/}
        <div className="space-y-4">
          {loading && !notifications.length ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-neutral-50 border border-neutral-100 rounded-3xl animate-pulse" />)
          ) : notifications.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-neutral-200 rounded-[40px] bg-neutral-50/50">
              <Inbox size={32} className="mx-auto text-neutral-200 mb-4" />
              <p className="font-bold text-slate-900">Your inbox is clear</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                return (
                  <div
                    key={n._id}
                    onClick={() => handleAction(n)}
                    className={`group flex items-start gap-4 p-6 rounded-[32px] border transition-all cursor-pointer ${!n.isRead
                      ? 'bg-white border-black shadow-xl shadow-neutral-100'
                      : 'bg-white border-neutral-100 hover:border-neutral-200'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${cfg.pillCls}`}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-[15px] font-bold truncate ${n.isRead ? 'text-slate-400' : 'text-black'}`}>{n.title}</h3>
                        <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className={`text-[13px] leading-relaxed mb-4 ${n.isRead ? 'text-slate-400' : 'text-slate-600'}`}>{n.message}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${cfg.pillCls}`}>{cfg.label}</span>
                        {n.link && (
                          <div className="text-[11px] font-black text-[#ef4444] uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            View details <ChevronRight size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                    {!n.isRead && <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
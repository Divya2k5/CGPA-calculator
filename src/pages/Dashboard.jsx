import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config.js";
import { logOut } from "../firebase/auth.js";
import { getAllSemesters } from "../firebase/firestore.js";
import { calculateCGPA } from "../utils/gpaCalculator.js";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import BottomNav from "../components/BottomNav.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cgpa, setCgpa] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const uid = auth?.currentUser?.uid;
    if (!uid) {
      navigate("/login");
      return;
    }

    getAllSemesters(uid)
      .then((data) => {
        setSemesters(data);
        setCgpa(calculateCGPA(data));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const bestGpa = semesters.length > 0 ? Math.max(...semesters.map((semester) => Number(semester.gpa) || 0)) : null;
  const totalCredits = semesters.reduce((sum, semester) => sum + (Number(semester.totalCredits) || 0), 0);
  const initials = (auth.currentUser?.email || "A").slice(0, 1).toUpperCase();
  const latestSemester = semesters.length > 0 ? semesters[semesters.length - 1] : null;
  const nextSemester = latestSemester ? Math.min(8, Number(latestSemester.semNum) + 1) : 1;
  const previousGpa = semesters.length > 1 ? Number(semesters[semesters.length - 2]?.gpa || 0) : 0;
  const diff = semesters.length > 1 ? (cgpa - previousGpa).toFixed(2) : null;
  const progress = Math.max(0, Math.min(364.4, (cgpa / 10) * 364.4));
  const honorsTarget = 8.5;
  const honorsGap = Math.max(0, honorsTarget - cgpa);

  if (loading) {
    return (
      <div className="bg-[#0b1326] min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-[#222a3d] rounded-2xl flex items-center justify-center border border-[#adc6ff]/20">
          <span className="material-symbols-outlined text-[#adc6ff] text-3xl">school</span>
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-[#adc6ff] border-t-transparent animate-spin" />
        <p className="text-[#8c909f] text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] pb-28">
      <div className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 h-16 lg:h-[60px] lg:max-w-none lg:mx-0">
          <span className="text-xl font-black tracking-tighter text-blue-200">AU CGPA Calculator</span>
          <div className="relative flex items-center gap-3">
            <button type="button" className="p-2 text-blue-200 hover:bg-white/10 rounded-full">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#adc6ff]/20 border-2 border-[#adc6ff]/20 flex items-center justify-center text-[#adc6ff] text-sm font-bold"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {initials}
            </button>
            {menuOpen ? (
              <div className="absolute top-16 right-0 bg-[#171f33] border border-[#424754] rounded-xl shadow-xl p-2 z-50">
                <button
                  type="button"
                  onClick={() => logOut().then(() => navigate("/login"))}
                  className="w-full text-left px-4 py-2 text-[#ffb4ab] text-sm hover:bg-white/5 rounded-lg"
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <main className="pt-20 px-6 lg:pt-20 lg:px-8 lg:pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)] gap-6">
            <div className="bg-[#222a3d] rounded-xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[320px] shadow-2xl border border-[#424754]/5">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#adc6ff]/10 rounded-full blur-[80px]" />
              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64d8d8]">Cumulative Grade Point Average</p>
                  <span className="bg-[#64d8d8]/10 text-[#64d8d8] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                    Semester {latestSemester ? latestSemester.semNum : nextSemester}
                  </span>
                </div>
                <div className="flex items-baseline gap-4 mt-4">
                  <h1 className={`text-8xl md:text-9xl font-black tracking-tighter ${cgpa >= 8.5 ? "text-white" : cgpa >= 6.5 ? "text-[#64d8d8]" : cgpa > 0 ? "text-[#ffb4ab]" : "text-[#8c909f]"}`}>{cgpa.toFixed(2)}</h1>
                  {semesters.length > 1 ? (
                    <div className="flex flex-col">
                      <span className="text-[#adc6ff] font-bold text-xl">{Number(diff) >= 0 ? "+" : ""}{diff}</span>
                      <span className="text-[#c2c6d6] text-[10px] uppercase">Since last semester</span>
                    </div>
                  ) : null}
                </div>
                <p className="text-xs text-[#c2c6d6] mt-4">
                  {latestSemester
                    ? `Latest saved result: Semester ${latestSemester.semNum}`
                    : "No semester saved yet. Start with Semester 1."}
                </p>
              </div>
              <div className="relative flex items-center gap-6 mt-8">
                <div className="flex-1 h-[2px] bg-[#424754]/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#adc6ff] to-[#64d8d8]" style={{ width: `${cgpa * 10}%` }} />
                </div>
                <span className="text-[10px] font-bold text-[#c2c6d6] whitespace-nowrap">TOP CGPA TRACKER</span>
              </div>
            </div>

            <div className="bg-[#171f33] rounded-xl p-8 flex flex-col items-center justify-center text-center glass-card border border-[#424754]/10 min-h-[320px]">
              <div className="h-32 w-32 relative">
                <svg className="-rotate-90 h-full w-full" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="#2d3449" strokeWidth="8" />
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="#64d8d8" strokeWidth="8" strokeDasharray="364.4" strokeDashoffset={364.4 - progress} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white">{Math.round((cgpa / 10) * 100)}%</div>
              </div>
              <h3 className="font-bold text-lg text-[#dae2fd] mt-6">Target Goal</h3>
              <p className="text-xs text-[#c2c6d6] px-4 mt-2">Maintain 8.5+ to qualify for Honors Degree program.</p>
            </div>

            <div className="bg-[#171f33] rounded-xl p-8 flex flex-col justify-between glass-card border border-[#424754]/10 min-h-[320px]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64d8d8]">Honours Target</p>
                <h3 className="font-bold text-lg text-[#dae2fd] mt-4">{cgpa >= honorsTarget ? "On track for honors" : "Closing in on honors"}</h3>
                <p className="text-xs text-[#c2c6d6] mt-3">{cgpa >= honorsTarget ? "You are currently meeting the 8.5+ honors benchmark." : `${honorsGap.toFixed(2)} CGPA needed to hit the honors threshold.`}</p>
              </div>
              <div className="flex items-end justify-between mt-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#c2c6d6]">Target</p>
                  <p className="text-2xl font-bold text-[#dae2fd]">8.50</p>
                </div>
                <span className="bg-[#adc6ff]/20 text-[#adc6ff] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Honors</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#131b2e] rounded-xl p-5 border border-[#424754]/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2c6d6]">Current Semester</span>
              <div className="flex justify-between items-end mt-2">
                <p className="text-2xl font-bold text-[#dae2fd]">Sem {nextSemester}</p>
                <span className="material-symbols-outlined text-[#adc6ff]">school</span>
              </div>
            </div>
            <div className="bg-[#131b2e] rounded-xl p-5 border border-[#424754]/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2c6d6]">Best GPA</span>
              <div className="flex justify-between items-end mt-2">
                <p className="text-2xl font-bold text-[#dae2fd]">{bestGpa !== null ? bestGpa.toFixed(2) : "--"}</p>
                <span className="material-symbols-outlined text-[#adc6ff]">analytics</span>
              </div>
            </div>
            <div className="bg-[#131b2e] rounded-xl p-5 border border-[#424754]/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2c6d6]">Total Credits</span>
              <div className="flex justify-between items-end mt-2">
                <p className="text-2xl font-bold text-[#dae2fd]">{totalCredits || "--"}</p>
                <span className="material-symbols-outlined text-[#adc6ff]">workspace_premium</span>
              </div>
            </div>
            <div className="bg-[#131b2e] rounded-xl p-5 border border-[#424754]/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2c6d6]">Semesters Done</span>
              <div className="flex justify-between items-end mt-2">
                <p className="text-2xl font-bold text-[#dae2fd]">{semesters.length}</p>
                <span className="material-symbols-outlined text-[#adc6ff]">event_available</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#171f33] rounded-xl overflow-hidden glass-card border border-[#424754]/10">
              <div className="p-6 flex justify-between items-center border-b border-[#424754]/10">
                <h3 className="font-bold text-[#dae2fd]">Semester Wise Performance</h3>
                <button type="button" onClick={() => navigate("/history")} className="text-[#adc6ff] text-[10px] font-bold uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-4 text-[10px] uppercase tracking-widest font-bold text-[#c2c6d6] pb-2">
                  <span className="col-span-2">Semester</span>
                  <span className="text-center">GPA</span>
                  <span className="text-right">Result</span>
                </div>
                {semesters.length === 0 ? (
                  <p className="text-center text-[#8c909f] py-8">No semester data yet</p>
                ) : (
                  semesters.map((semester, index) => (
                    <div key={semester.semNum} className={`grid grid-cols-4 items-center py-4 px-4 rounded-xl border border-white/5 ${index % 2 === 0 ? "bg-[#060e20]/40" : "bg-transparent"}`}>
                      <div className="col-span-2">
                        <p className="text-sm font-semibold">Semester {semester.semNum}</p>
                        <p className="text-[10px] text-[#c2c6d6]">{semester.subjects?.length || 0} subjects</p>
                      </div>
                      <p className="text-center text-white font-bold">{Number(semester.gpa).toFixed(2)}</p>
                      <div className="text-right">
                        <span className="bg-[#adc6ff]/20 text-[#adc6ff] text-[9px] font-bold px-2 py-0.5 rounded">PASSED</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-[#171f33] rounded-xl overflow-hidden glass-card border border-[#424754]/10 p-6">
              <h3 className="font-bold text-[#dae2fd] mb-4">Performance Trend</h3>
              {semesters.length > 1 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={semesters.map((s) => ({ name: `Sem ${s.semNum}`, gpa: Number(s.gpa) || 0 }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#424754" opacity={0.35} />
                    <XAxis dataKey="name" tick={{ fill: "#c2c6d6", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fill: "#c2c6d6", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#171f33",
                        border: "1px solid #424754",
                        borderRadius: "12px",
                        color: "#dae2fd"
                      }}
                      labelStyle={{ color: "#dae2fd" }}
                      cursor={{ stroke: "#adc6ff", strokeOpacity: 0.25 }}
                    />
                    <Line type="monotone" dataKey="gpa" stroke="#64d8d8" strokeWidth={3} dot={{ fill: "#adc6ff", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[320px] flex items-center justify-center text-center text-[#8c909f]">Add at least two semesters to view your trend line.</div>
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

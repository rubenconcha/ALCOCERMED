import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  ArrowLeft, 
  Sparkles, 
  Star, 
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Home,
  ChevronLeft
} from 'lucide-react';

// ==========================================
// MOCK DATA FOR THE ULTIMATE LEADERBOARD
// ==========================================
const MOCK_PODIUM = [
  {
    id: 1,
    nombre: "Alejandro Cabrera",
    avatar: "👨‍⚕️",
    puntaje: 18081,
    porcentaje: 70,
    racha: 12,
    badge: "👑 Rey del Sim"
  },
  {
    id: 2,
    nombre: "Sofía Méndez",
    avatar: "👩‍⚕️",
    puntaje: 13132,
    porcentaje: 60,
    racha: 8,
    badge: "⚡ Imparable"
  },
  {
    id: 3,
    nombre: "Bruno Espinoza",
    avatar: "🧠",
    puntaje: 9540,
    porcentaje: 45,
    racha: 5,
    badge: "🛡️ Defensor"
  }
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Alejandro Cabrera", avatar: "👨‍⚕️", points: 18081, accuracy: 70, isCurrentUser: false },
  { rank: 2, name: "Sofía Méndez", avatar: "👩‍⚕️", points: 13132, accuracy: 60, isCurrentUser: false },
  { rank: 3, name: "Bruno Espinoza", avatar: "🧠", points: 9540, accuracy: 45, isCurrentUser: false },
  { rank: 4, name: "Tu (Rubén Concha)", avatar: "🩺", points: 8420, accuracy: 58, isCurrentUser: true },
  { rank: 5, name: "Camila Rojas", avatar: "🧬", points: 7910, accuracy: 52, isCurrentUser: false },
  { rank: 6, name: "Diego Torres", avatar: "🎒", points: 7240, accuracy: 50, isCurrentUser: false },
  { rank: 7, name: "Lucía Villazón", avatar: "👩‍🎓", points: 6890, accuracy: 48, isCurrentUser: false },
  { rank: 8, name: "Mateo Siles", avatar: "👨‍🎓", points: 6120, accuracy: 44, isCurrentUser: false },
  { rank: 9, name: "Valeria Paz", avatar: "🪐", points: 5590, accuracy: 40, isCurrentUser: false },
  { rank: 10, name: "Nicolás Justiniano", avatar: "🍀", points: 4800, accuracy: 35, isCurrentUser: false }
];

export default function WinnerPodium() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('podio'); // 'podio' | 'ranking'

  // Confetti particles array for top visual effects
  const particles = Array.from({ length: 40 });

  return (
    <div className="relative min-height-screen w-full max-w-[480px] mx-auto bg-[#140824] overflow-x-hidden font-sans text-white pb-8 shadow-2xl border-x border-[#ffffff10] flex flex-col justify-between">
      
      {/* 3D RADIAL LIGHT RAYS & NEON BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#4c1d95_0%,transparent_60%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#9333EA]/20 rounded-full blur-[80px] pointer-events-none z-0" />
      
      {/* GLOWING CONFETTI PARTICLES */}
      <div className="absolute top-0 inset-x-0 h-[450px] overflow-hidden pointer-events-none z-10">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              backgroundColor: ['#FACC15', '#EC4899', '#3B82F6', '#10B981', '#F97316'][i % 5],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * -10}%`,
            }}
            animate={{
              y: ['0vh', '80vh'],
              x: ['0vw', `${(Math.random() - 0.5) * 50}px`],
              rotate: [0, Math.random() * 360],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2.5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* ==========================================
          1. HEADER SECTION
          ========================================== */}
      <header className="relative z-20 px-4 pt-6 flex items-center justify-between">
        {/* Back Button with Gaming Style Shadow */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-slate-900/60 backdrop-blur-md border border-[#ffffff15] rounded-xl flex items-center justify-center shadow-lg active:translate-y-[2px] transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-gray-300" />
        </motion.button>

        {/* Shiny Centered Title */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-6 h-6 text-[#FACC15] filter drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-bounce" />
            <span className="text-[1.3rem] font-[900] tracking-wider bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Podio de Ganadores
            </span>
          </div>
          <span className="text-[0.68rem] tracking-[0.2em] text-[#93C5FD] font-bold uppercase mt-0.5">
            AlcocerMed Arena
          </span>
        </div>

        {/* Audio Toggle with Gaming Feedback */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-10 h-10 bg-slate-900/60 backdrop-blur-md border border-[#ffffff15] rounded-xl flex items-center justify-center shadow-lg transition-all"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-[#FACC15]" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </motion.button>
      </header>

      {/* ==========================================
          2. PODIUM AREA (3D SCENE)
          ========================================== */}
      <main className="relative z-20 px-4 mt-6 flex-1 flex flex-col justify-start">
        
        {/* TAB CONTROLS (Podium vs. Ranking list) */}
        <div className="flex bg-[#1c0d35]/65 border border-[#ffffff08] rounded-2xl p-1 mb-8 shadow-inner relative z-30">
          <button 
            onClick={() => setActiveTab('podio')}
            className={`flex-1 py-3 text-xs font-[900] rounded-xl uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'podio' 
                ? 'bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white shadow-[0_4px_12px_rgba(109,40,217,0.5)] border border-[#ffffff15]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🏆 Podio
          </button>
          <button 
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 py-3 text-xs font-[900] rounded-xl uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'ranking' 
                ? 'bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white shadow-[0_4px_12px_rgba(109,40,217,0.5)] border border-[#ffffff15]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 Clasificación
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'podio' ? (
            <motion.div 
              key="podio-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-start"
            >
              {/* THE 3D PODIUM STAGE */}
              <div className="w-full flex items-end justify-center gap-3 mt-14 mb-8 min-h-[300px] relative">
                
                {/* Winner Light Rays Background Effect */}
                <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.22),transparent_65%)] pointer-events-none mix-blend-screen z-0 animate-pulse" />

                {/* ==========================================
                    2ND PLACE PEDESTAL (SILVER) - LEFT
                    ========================================== */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  className="flex-1 max-w-[110px] flex flex-col items-center z-10"
                >
                  {/* Avatar Section */}
                  <div className="relative mb-3 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-[#94A3B8] bg-slate-800 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(148,163,184,0.4)] relative z-10">
                      {MOCK_PODIUM[1].avatar}
                    </div>
                    {/* Position Ring */}
                    <div className="absolute inset-0 -m-1.5 rounded-full border-2 border-dashed border-[#94A3B8]/30 animate-spin-slow" />
                  </div>
                  
                  {/* Name Tag */}
                  <span className="text-[10px] font-black uppercase text-slate-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide text-center truncate max-w-full">
                    {MOCK_PODIUM[1].nombre}
                  </span>
                  
                  {/* Pedestal Block */}
                  <div className="w-full mt-2 relative">
                    {/* Silver Flat Top cap platform */}
                    <div className="absolute top-[-8px] left-[-2px] right-[-2px] h-[8px] bg-gradient-to-b from-[#E2E8F0] to-[#94A3B8] rounded-t-sm shadow-md z-20 border border-white/20" />
                    
                    {/* Pedestal Crimson Body */}
                    <div className="w-full h-[100px] bg-gradient-to-b from-[#7F1D1D] to-[#450A0A] border-x-2 border-b-2 border-[#94A3B8]/30 rounded-b-lg flex flex-col items-center justify-center p-2 shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(0,0,0,0.7)]">
                      <span className="text-[0.62rem] font-[900] text-slate-300 uppercase tracking-widest">{MOCK_PODIUM[1].puntaje}</span>
                      <span className="text-[0.55rem] font-bold text-slate-400 mt-0.5">{MOCK_PODIUM[1].porcentaje}% Acert.</span>
                      
                      {/* Giant Silver Rank Number in the middle */}
                      <span className="text-[3rem] font-[900] text-slate-300 font-sans tracking-tight select-none mt-1 drop-shadow-[0_2px_0_#475569,0_4px_0_#1e293b,0_6px_10px_rgba(0,0,0,0.9)]">
                        2
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* ==========================================
                    1ST PLACE PEDESTAL (GOLD) - CENTER
                    ========================================== */}
                <motion.div 
                  initial={{ opacity: 0, y: 70 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                  className="flex-1 max-w-[125px] flex flex-col items-center z-20 -translate-y-4"
                >
                  {/* Avatar Section with Crown */}
                  <div className="relative mb-3 flex flex-col items-center">
                    {/* Floating Gold Crown */}
                    <motion.div 
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="text-3xl filter drop-shadow-[0_2px_8px_rgba(250,204,21,0.8)] z-30 mb-[-10px] relative"
                    >
                      👑
                    </motion.div>
                    <div className="w-20 h-20 rounded-full border-4 border-[#FACC15] bg-slate-800 flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(250,204,21,0.6)] relative z-10">
                      {MOCK_PODIUM[0].avatar}
                    </div>
                    {/* Glow ring */}
                    <div className="absolute inset-0 -m-2 rounded-full border-2 border-dashed border-[#FACC15]/40 animate-spin-slow" />
                  </div>
                  
                  {/* Name Tag */}
                  <span className="text-xs font-black uppercase text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide text-center truncate max-w-full">
                    {MOCK_PODIUM[0].nombre}
                  </span>
                  
                  {/* Pedestal Block */}
                  <div className="w-full mt-2 relative">
                    {/* Gold Flat Top cap platform */}
                    <div className="absolute top-[-10px] left-[-3px] right-[-3px] h-[10px] bg-gradient-to-b from-[#FEF08A] to-[#FACC15] rounded-t-sm shadow-md z-20 border border-white/20" />
                    
                    {/* Pedestal Crimson Body */}
                    <div className="w-full h-[140px] bg-gradient-to-b from-[#7F1D1D] to-[#450A0A] border-x-2 border-b-2 border-[#FACC15]/30 rounded-b-lg flex flex-col items-center justify-center p-2 shadow-[0_15px_30px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(0,0,0,0.8)]">
                      <span className="text-[0.72rem] font-[900] text-yellow-400 uppercase tracking-widest">{MOCK_PODIUM[0].puntaje}</span>
                      <span className="text-[0.58rem] font-bold text-yellow-500/80 mt-0.5">{MOCK_PODIUM[0].porcentaje}% Acert.</span>
                      
                      {/* Giant Gold Rank Number in the middle */}
                      <span className="text-[4rem] font-[900] text-[#FACC15] font-sans tracking-tight select-none mt-1 drop-shadow-[0_2px_0_#ca8a04,0_4px_0_#854d0e,0_8px_14px_rgba(0,0,0,0.9)]">
                        1
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* ==========================================
                    3RD PLACE PEDESTAL (BRONZE) - RIGHT
                    ========================================== */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  className="flex-1 max-w-[105px] flex flex-col items-center z-10"
                >
                  {/* Avatar Section */}
                  <div className="relative mb-3 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full border-4 border-[#D97706] bg-slate-800 flex items-center justify-center text-2xl shadow-[0_0_12px_rgba(217,119,6,0.4)] relative z-10">
                      {MOCK_PODIUM[2].avatar}
                    </div>
                    {/* Position Ring */}
                    <div className="absolute inset-0 -m-1.5 rounded-full border-2 border-dashed border-[#D97706]/30 animate-spin-slow" />
                  </div>
                  
                  {/* Name Tag */}
                  <span className="text-[10px] font-black uppercase text-amber-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide text-center truncate max-w-full">
                    {MOCK_PODIUM[2].nombre}
                  </span>
                  
                  {/* Pedestal Block */}
                  <div className="w-full mt-2 relative">
                    {/* Bronze Flat Top cap platform */}
                    <div className="absolute top-[-8px] left-[-2px] right-[-2px] h-[8px] bg-gradient-to-b from-[#FDBA74] to-[#D97706] rounded-t-sm shadow-md z-20 border border-white/20" />
                    
                    {/* Pedestal Crimson Body */}
                    <div className="w-full h-[80px] bg-gradient-to-b from-[#7F1D1D] to-[#450A0A] border-x-2 border-b-2 border-[#D97706]/30 rounded-b-lg flex flex-col items-center justify-center p-2 shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_0_12px_rgba(0,0,0,0.7)]">
                      <span className="text-[0.58rem] font-[900] text-amber-400 uppercase tracking-widest">{MOCK_PODIUM[2].puntaje}</span>
                      <span className="text-[0.52rem] font-bold text-amber-600/80 mt-0.5">{MOCK_PODIUM[2].porcentaje}% Acert.</span>
                      
                      {/* Giant Bronze Rank Number in the middle */}
                      <span className="text-[2.6rem] font-[900] text-amber-500 font-sans tracking-tight select-none mt-1 drop-shadow-[0_1.5px_0_#9a3412,0_3px_0_#7c2d12,0_5px_8px_rgba(0,0,0,0.9)]">
                        3
                      </span>
                    </div>
                  </div>
                </motion.div>

              </div>

              {/* ==========================================
                  3. USER POSITION HUD CARD
                  ========================================== */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full bg-gradient-to-r from-[#1c0d35]/90 to-[#2c1354]/95 border-2 border-[#ffd70035] rounded-3xl p-5 shadow-[0_12px_32px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4 relative overflow-hidden backdrop-blur-md"
              >
                {/* Shiny diagonal sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ffd7000c] to-transparent -translate-x-full animate-sheen pointer-events-none" />

                {/* Left Side Info */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FEF08A] to-[#FACC15] rounded-2xl flex items-center justify-center shadow-lg relative">
                    <Trophy className="w-6 h-6 text-[#78350F] filter drop-shadow-md" />
                    {/* Ring glow */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/40" />
                  </div>
                  <div>
                    <span className="text-[0.62rem] font-black uppercase tracking-widest text-slate-400">Tu Rendimiento</span>
                    <h3 className="text-[1.15rem] font-black text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      Tu posición: <span className="text-[#FACC15]">2°</span> de 20
                    </h3>
                  </div>
                </div>

                {/* Right Side Stats pill */}
                <div className="bg-[#100720]/80 px-4 py-2 border border-[#ffd7001c] rounded-2xl flex flex-col items-end shadow-inner">
                  <span className="text-[0.72rem] font-black text-slate-300 tracking-wide">8,420 pts</span>
                  <span className="text-[0.58rem] font-bold text-green-400 mt-0.5">58% Precisión</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="ranking-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              {/* ==========================================
                  4. LEADERBOARD LIST
                  ========================================== */}
              <div className="w-full flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1 select-none scrollbar-thin">
                {MOCK_LEADERBOARD.map((item, index) => {
                  const isTop3 = item.rank <= 3;
                  const rankColors = 
                    item.rank === 1 ? 'from-[#FEF08A]/10 to-[#FACC15]/20 border-[#FACC15]' :
                    item.rank === 2 ? 'from-[#E2E8F0]/10 to-[#94A3B8]/20 border-[#94A3B8]' :
                    item.rank === 3 ? 'from-[#FDBA74]/10 to-[#D97706]/20 border-[#D97706]' :
                    'from-[#1c0d35]/60 to-[#2c1354]/60 border-white/5';
                    
                  const rankIconColor = 
                    item.rank === 1 ? 'text-[#FACC15]' :
                    item.rank === 2 ? 'text-[#94A3B8]' :
                    item.rank === 3 ? 'text-[#D97706]' :
                    'text-gray-400';

                  return (
                    <motion.div 
                      key={item.rank}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative flex items-center justify-between p-3.5 border rounded-2xl bg-gradient-to-r shadow-md transition-all ${rankColors} ${
                        item.isCurrentUser 
                          ? 'border-[#FEF08A] bg-gradient-to-r from-[#ffd70018] to-[#9333ea18] shadow-[0_0_20px_rgba(250,204,21,0.25)]' 
                          : ''
                      }`}
                    >
                      {/* Left: Position, Avatar, Name */}
                      <div className="flex items-center gap-3.5">
                        {/* Position Sphere */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-[900] text-sm relative border ${
                          item.rank === 1 ? 'border-[#FEF08A] bg-yellow-500/20' :
                          item.rank === 2 ? 'border-white/20 bg-slate-500/20' :
                          item.rank === 3 ? 'border-amber-500/20 bg-amber-700/20' :
                          'border-white/5 bg-slate-900/40'
                        }`}>
                          <span className={rankIconColor}>{item.rank}</span>
                          {/* Accent dot for user */}
                          {item.isCurrentUser && (
                            <div className="absolute top-[-2px] right-[-2px] w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-[#1c0d35] animate-ping" />
                          )}
                        </div>

                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-inner border ${
                          item.rank === 1 ? 'border-[#FACC15]/40 bg-yellow-500/10' :
                          item.rank === 2 ? 'border-[#94A3B8]/40 bg-slate-500/10' :
                          item.rank === 3 ? 'border-[#D97706]/40 bg-amber-500/10' :
                          'border-white/10 bg-slate-900/60'
                        }`}>
                          {item.avatar}
                        </div>

                        {/* Name & Badge */}
                        <div className="flex flex-col">
                          <span className={`text-xs font-[900] ${
                            item.isCurrentUser ? 'text-yellow-300' : 'text-white'
                          } tracking-wide`}>
                            {item.name} {item.isCurrentUser && " (Tú)"}
                          </span>
                          <span className="text-[0.58rem] font-bold text-slate-400 tracking-wider">
                            {item.points.toLocaleString()} pts
                          </span>
                        </div>
                      </div>

                      {/* Right: Accuracy & Trend */}
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-950/65 px-3 py-1.5 border border-white/5 rounded-xl text-right">
                          <span className="text-[0.68rem] font-extrabold text-green-400">{item.accuracy}%</span>
                          <span className="block text-[0.48rem] text-slate-400 font-bold uppercase tracking-widest">Prec.</span>
                        </div>
                        {item.rank <= 3 && (
                          <Award className={`w-4 h-4 ${rankIconColor}`} />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ==========================================
          5. GAMING BUTTONS FOOTER
          ========================================== */}
      <footer className="relative z-20 px-4 mt-8 flex flex-col gap-3">
        {/* Primary Action Button (Double Gradient with bold bottom shadow) */}
        <motion.button 
          whileTap={{ scale: 0.96 }}
          className="w-full relative group"
        >
          {/* Gaming Thick Shadow underneath */}
          <div className="absolute inset-0 bg-yellow-700 rounded-2xl translate-y-[4px] shadow-lg group-active:translate-y-0 transition-transform" />
          
          <div className="relative bg-gradient-to-b from-[#FEF08A] to-[#FACC15] text-[#78350F] py-4 rounded-2xl font-[900] text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 border border-white/30 group-active:translate-y-[2px] transition-transform">
            <Home className="w-4 h-4 stroke-[3]" />
            <span>Menú Principal</span>
          </div>
        </motion.button>

        {/* Secondary Action Button */}
        <motion.button 
          whileTap={{ scale: 0.96 }}
          className="w-full py-3.5 bg-slate-900/60 backdrop-blur-md border border-[#ffffff15] text-slate-300 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg active:translate-y-[2px] transition-all hover:text-white"
        >
          Ver Tabla Completa
        </motion.button>
      </footer>
    </div>
  );
}

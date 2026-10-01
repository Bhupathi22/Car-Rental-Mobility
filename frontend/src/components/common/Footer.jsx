import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, MapPin, Database, Server, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white uppercase block">
                  CAR RENTAL & MOBILITY
                </span>
                <span className="text-[10px] text-sky-400 font-medium tracking-widest">
                  MOVE FREELY • TRAVEL SMARTER
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium automotive mobility platform featuring live OpenFreeMap telemetry, instant cryptographic QR check-in, and rule-based fleet recommendations.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                <Database className="w-3.5 h-3.5 text-emerald-400" /> MongoDB Atlas
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                <Server className="w-3.5 h-3.5 text-sky-400" /> Express REST
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Explore Mobility</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/cars" className="hover:text-sky-400 transition-colors">Vehicle Fleet</Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-sky-400 transition-colors">Booking Verification</Link>
              </li>
              <li>
                <Link to="/tracking" className="hover:text-sky-400 transition-colors">Live GPS Telemetry</Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-sky-400 transition-colors">Smart Recommender</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sky-400 transition-colors">Architecture & Specs</Link>
              </li>
            </ul>
          </div>

          {/* Vehicle Types */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Fleet Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/cars?type=Electric" className="hover:text-sky-400 transition-colors">High-Voltage Electric</Link>
              </li>
              <li>
                <Link to="/cars?type=Luxury" className="hover:text-sky-400 transition-colors">Executive Luxury Sedans</Link>
              </li>
              <li>
                <Link to="/cars?type=SUV" className="hover:text-sky-400 transition-colors">All-Terrain Performance SUVs</Link>
              </li>
              <li>
                <Link to="/cars?type=Sports" className="hover:text-sky-400 transition-colors">Grand Tourers & Sports</Link>
              </li>
              <li>
                <Link to="/cars?type=Hatchback" className="hover:text-sky-400 transition-colors">Urban Efficient Cruisers</Link>
              </li>
            </ul>
          </div>

          {/* Academic Syllabus Compliance */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Academic Engineering</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <span className="font-mono text-sky-400 font-bold">CO1</span> Database Architecture & ER Design
              </p>
              <p className="flex items-center gap-2">
                <span className="font-mono text-sky-400 font-bold">CO2</span> NoSQL BSON & Aggregations
              </p>
              <p className="flex items-center gap-2">
                <span className="font-mono text-sky-400 font-bold">CO3</span> REST APIs & JWT Security
              </p>
              <p className="flex items-center gap-2">
                <span className="font-mono text-sky-400 font-bold">CO4</span> Event-Driven Node.js Architecture
              </p>
              <p className="flex items-center gap-2">
                <span className="font-mono text-sky-400 font-bold">CO5</span> Microservices Boundaries
              </p>
              <p className="flex items-center gap-2">
                <span className="font-mono text-sky-400 font-bold">CO6</span> Docker, CI/CD & Observability
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CAR RENTAL & MOBILITY. Academic Full-Stack Demonstration.</p>
          <div className="flex items-center gap-4">
            <a href="/api-docs" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors">
              Swagger OpenAPI
            </a>
            <span>•</span>
            <a href="https://openfreemap.org" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors">
              OpenFreeMap
            </a>
            <span>•</span>
            <span>MapLibre GL JS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

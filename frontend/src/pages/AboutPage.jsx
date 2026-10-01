import React from 'react';
import { BackButton } from '../components/common/BackButton';
import { Database, Server, Cpu, ShieldCheck, MapPin, QrCode, FileText, CheckCircle2 } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <BackButton to="/" label="Back to Home" />

      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
          Academic Engineering Specification
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
          CAR RENTAL &amp; MOBILITY Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Comprehensive full-stack enterprise web application demonstrating Course Outcomes (CO1–CO6) for database engineering, Node.js backend development, microservices service boundaries, and observability.
        </p>
      </div>

      {/* CO1 to CO6 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            co: 'CO1',
            title: 'Database Engineering',
            desc: 'Real MongoDB database architecture, Entity-Relationship schema design, compound indexing on car availability and booking dates, and aggregation pipelines.',
            points: ['Mongoose Schemas & Constraints', 'Compound Indexes', 'Cascade Updates via Pre/Post Hooks'],
            icon: Database,
            color: 'text-emerald-400',
          },
          {
            co: 'CO2',
            title: 'SQL vs NoSQL & BSON',
            desc: 'Utilizes MongoDB Atlas document storage with flexible BSON typing, embedded location sub-documents, and aggregation analytics for monthly revenue.',
            points: ['Nested Geo-coordinates', 'Dynamic Document Schemas', 'Aggregation Analytics'],
            icon: Cpu,
            color: 'text-cyan-400',
          },
          {
            co: 'CO3',
            title: 'Backend API Engineering',
            desc: 'Strict layered architecture: Routes → Controllers → Services → Models → MongoDB. Comprehensive input validation with express-validator and Swagger docs.',
            points: ['Centralized Error Middleware', 'Swagger OpenAPI 3.0 at /api-docs', 'Supertest Integration Suite'],
            icon: Server,
            color: 'text-sky-400',
          },
          {
            co: 'CO4',
            title: 'Node.js Backend Engineering',
            desc: 'Event-driven asynchronous Node.js architecture with Express, bcryptjs password hashing, JWT stateless session authentication, and rate limiting.',
            points: ['Argon/Bcrypt Salt Rounds', 'Helmet Security Headers', 'Express Rate Limiters'],
            icon: ShieldCheck,
            color: 'text-indigo-400',
          },
          {
            co: 'CO5',
            title: 'Microservices Boundaries',
            desc: 'Modular service boundaries partitioned into Auth Service, Car Service, Booking Service, Payment Service, Tracking Service, and Recommendation Service.',
            points: ['Decoupled Service Modules', 'Independent DTOs', 'Ready for Containerized Extraction'],
            icon: QrCode,
            color: 'text-amber-400',
          },
          {
            co: 'CO6',
            title: 'Deployment & Observability',
            desc: 'Production-ready multi-stage Dockerfile, docker-compose.yml with MongoDB service, GitHub Actions CI workflow, Morgan logging, and /api/health probe.',
            points: ['GET /api/health Probe', 'Docker & Compose Orchestration', 'Automated GitHub Actions CI'],
            icon: FileText,
            color: 'text-rose-400',
          },
        ].map((item, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 ${item.color}`}>
                {item.co}
              </span>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>

            <h3 className="text-base font-bold text-white">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>

            <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300">
              {item.points.map((pt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack Matrix */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider">Technology Stack Matrix</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Frontend UI</span>
            <strong className="text-white">React 18 + Vite</strong>
            <p className="text-[11px] text-slate-400">Tailwind CSS, Framer Motion, Lucide</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Mapping Engine</span>
            <strong className="text-white">OpenFreeMap + MapLibre</strong>
            <p className="text-[11px] text-slate-400">Liberty Vector Tiles (No Google Maps)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Backend REST API</span>
            <strong className="text-white">Node.js + Express</strong>
            <p className="text-[11px] text-slate-400">Layered Architecture, JWT, RBAC, Multer</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Database</span>
            <strong className="text-white">MongoDB Atlas + Mongoose</strong>
            <p className="text-[11px] text-slate-400">8 Collections, Indexes, Aggregations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

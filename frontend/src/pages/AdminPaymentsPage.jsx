import React, { useState, useEffect } from 'react';
import { paymentsApi } from '../services/api';
import { BackButton } from '../components/common/BackButton';
import { DollarSign, CreditCard, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await paymentsApi.getAll();
        setPayments(res.data.data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch payment records');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const totalAmount = payments.reduce((acc, p) => acc + (p.status === 'completed' ? p.amount : 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <BackButton to="/admin" label="Back to Dashboard" />

      {/* Header and KPI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            Financial Ledger
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Settled Transactions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Persisted transaction logs from the MongoDB `payments` collection.
          </p>
        </div>

        <div className="p-3.5 px-5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Settlement</span>
            <span className="text-2xl font-black text-white font-mono">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Booking Reference</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mx-auto mb-2" />
                    Querying transactions from MongoDB...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No payment transaction records found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-sky-400">
                      {p.transactionId}
                    </td>

                    <td className="py-4 px-6">
                      <strong className="text-white block">{p.userId?.name || 'Customer'}</strong>
                      <span className="text-[11px] text-slate-400">{p.userId?.email}</span>
                    </td>

                    <td className="py-4 px-6 font-mono text-slate-300">
                      {p.bookingId?.bookingCode || p.bookingId?._id || 'N/A'}
                    </td>

                    <td className="py-4 px-6 capitalize font-semibold text-slate-200">
                      {p.paymentMethod?.replace('_', ' ')}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-white text-sm">${p.amount.toFixed(2)}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> {p.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-mono text-slate-400 text-[11px]">
                      {new Date(p.paidAt || p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
